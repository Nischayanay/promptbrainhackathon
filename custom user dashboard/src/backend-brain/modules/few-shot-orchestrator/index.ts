// Few-Shot Orchestrator Module Implementation

import { FewShotOrchestrator, ContextPackage, FewShotExample, RankedExample } from '../../types';
import { createError } from '../../types/errors';
import { getDatabase } from '../../database/client';

export class FewShotOrchestratorImpl implements FewShotOrchestrator {
  private database = getDatabase();
  private successScoreWeight = 0.4;
  private recencyWeight = 0.3;
  private similarityWeight = 0.3;

  async selectExamples(context: ContextPackage, maxExamples: number = 5): Promise<FewShotExample[]> {
    const startTime = Date.now();

    try {
      // Get examples from context first
      let examples = [...context.examples];

      // If we need more examples, get from database
      if (examples.length < maxExamples && context.domainKnowledge.length > 0) {
        const primaryDomain = context.domainKnowledge[0].domain;
        const dbExamples = await this.getExamplesFromDatabase(primaryDomain, maxExamples);
        examples.push(...dbExamples);
      }

      // Remove duplicates
      const uniqueExamples = this.removeDuplicateExamples(examples);

      // Apply multi-armed bandit selection
      const selectedExamples = this.applyBanditSelection(uniqueExamples, maxExamples);

      // Update usage statistics
      await this.updateUsageStats(selectedExamples);

      const processingTime = Date.now() - startTime;
      console.log(`Few-shot selection completed in ${processingTime}ms`);

      return selectedExamples;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        throw createError.processingError(
          `Few-shot selection failed: ${error.message}`,
          true,
          { processingTime, originalError: error.message }
        );
      }
      
      throw createError.processingError(
        'Few-shot selection failed with unknown error',
        true,
        { processingTime }
      );
    }
  }

  async rankExamples(examples: FewShotExample[], query: string): Promise<RankedExample[]> {
    const rankedExamples: RankedExample[] = [];

    for (const example of examples) {
      const relevanceScore = this.calculateRelevanceScore(example, query);
      const reasoning = this.generateRankingReasoning(example, query, relevanceScore);

      rankedExamples.push({
        ...example,
        relevanceScore,
        reasoning
      });
    }

    // Sort by relevance score
    rankedExamples.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return rankedExamples;
  }

  private async getExamplesFromDatabase(domain: string, maxCount: number): Promise<FewShotExample[]> {
    try {
      const templates = await this.database.getTemplatesByDomain(domain);
      const examples: FewShotExample[] = [];

      templates.forEach(template => {
        if (template.few_shots && Array.isArray(template.few_shots)) {
          template.few_shots.forEach((example: any, index: number) => {
            if (example.input && example.output) {
              examples.push({
                id: `${template.id}_${index}`,
                input: example.input,
                output: example.output,
                domain: template.domain as any,
                successScore: template.success_score,
                usageCount: template.usage_count,
                lastUsed: template.last_used ? new Date(template.last_used) : new Date(),
                embedding: [] // Would be populated from embeddings table in real implementation
              });
            }
          });
        }
      });

      return examples.slice(0, maxCount);
    } catch (error) {
      console.warn('Failed to get examples from database:', error);
      return [];
    }
  }

  private removeDuplicateExamples(examples: FewShotExample[]): FewShotExample[] {
    const seen = new Set<string>();
    return examples.filter(example => {
      const key = `${example.input.toLowerCase().trim()}_${example.output.toLowerCase().trim().substring(0, 100)}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private applyBanditSelection(examples: FewShotExample[], maxExamples: number): FewShotExample[] {
    if (examples.length <= maxExamples) {
      return examples;
    }

    // Calculate selection scores using multi-armed bandit approach
    const scoredExamples = examples.map(example => ({
      example,
      score: this.calculateBanditScore(example)
    }));

    // Sort by score and apply diversity filter
    scoredExamples.sort((a, b) => b.score - a.score);
    
    const selected: FewShotExample[] = [];
    const usedInputs = new Set<string>();

    for (const { example } of scoredExamples) {
      if (selected.length >= maxExamples) break;

      // Ensure diversity by avoiding similar inputs
      const inputKey = this.getInputKey(example.input);
      if (!usedInputs.has(inputKey)) {
        selected.push(example);
        usedInputs.add(inputKey);
      }
    }

    // If we still need more examples, add remaining ones
    if (selected.length < maxExamples) {
      for (const { example } of scoredExamples) {
        if (selected.length >= maxExamples) break;
        if (!selected.includes(example)) {
          selected.push(example);
        }
      }
    }

    return selected;
  }

  private calculateBanditScore(example: FewShotExample): number {
    // Multi-armed bandit score calculation
    const successScore = example.successScore * this.successScoreWeight;
    
    // Recency score (more recent = higher score)
    const daysSinceUsed = example.lastUsed ? 
      (Date.now() - example.lastUsed.getTime()) / (1000 * 60 * 60 * 24) : 30;
    const recencyScore = Math.max(0, 1 - daysSinceUsed / 30) * this.recencyWeight;
    
    // Usage-based exploration (UCB1-like approach)
    const totalUsage = Math.max(1, example.usageCount);
    const explorationBonus = Math.sqrt(Math.log(totalUsage + 1) / totalUsage) * 0.1;
    
    return successScore + recencyScore + explorationBonus;
  }

  private calculateRelevanceScore(example: FewShotExample, query: string): number {
    const queryLower = query.toLowerCase();
    const inputLower = example.input.toLowerCase();
    const outputLower = example.output.toLowerCase();

    let score = 0;

    // Keyword matching
    const queryWords = queryLower.split(/\s+/);
    const inputWords = inputLower.split(/\s+/);
    const outputWords = outputLower.split(/\s+/);

    // Input similarity
    const inputMatches = queryWords.filter(word => inputWords.includes(word)).length;
    score += (inputMatches / queryWords.length) * 0.6;

    // Output relevance
    const outputMatches = queryWords.filter(word => outputWords.includes(word)).length;
    score += (outputMatches / queryWords.length) * 0.2;

    // Length similarity bonus
    const lengthRatio = Math.min(query.length, example.input.length) / 
                       Math.max(query.length, example.input.length);
    score += lengthRatio * 0.1;

    // Success score bonus
    score += example.successScore * 0.1;

    return Math.min(1, score);
  }

  private generateRankingReasoning(example: FewShotExample, query: string, relevanceScore: number): string {
    const reasons: string[] = [];

    if (relevanceScore > 0.8) {
      reasons.push('High semantic similarity to query');
    } else if (relevanceScore > 0.6) {
      reasons.push('Good semantic match');
    } else {
      reasons.push('Moderate relevance');
    }

    if (example.successScore > 0.8) {
      reasons.push('High historical success rate');
    }

    if (example.usageCount > 50) {
      reasons.push('Frequently used example');
    }

    const daysSinceUsed = example.lastUsed ? 
      (Date.now() - example.lastUsed.getTime()) / (1000 * 60 * 60 * 24) : 30;
    
    if (daysSinceUsed < 7) {
      reasons.push('Recently used successfully');
    }

    return reasons.join('; ');
  }

  private getInputKey(input: string): string {
    // Create a key for diversity checking
    return input.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .slice(0, 5)
      .join('_');
  }

  private async updateUsageStats(examples: FewShotExample[]): Promise<void> {
    try {
      // In a real implementation, this would update the database
      // For now, we'll just log the usage
      console.log(`Updated usage stats for ${examples.length} examples`);
      
      // Update template usage counts in database
      const templateIds = new Set<string>();
      examples.forEach(example => {
        const templateId = example.id.split('_')[0];
        templateIds.add(templateId);
      });

      for (const templateId of templateIds) {
        try {
          await this.database.updateTemplateUsage(templateId);
        } catch (error) {
          console.warn(`Failed to update usage for template ${templateId}:`, error);
        }
      }
    } catch (error) {
      console.warn('Failed to update usage statistics:', error);
    }
  }

  // Learning and optimization methods
  async updateSuccessScore(exampleId: string, feedback: 'positive' | 'negative' | 'neutral'): Promise<void> {
    try {
      const templateId = exampleId.split('_')[0];
      const template = await this.database.getTemplate(templateId);
      
      if (template) {
        let adjustment = 0;
        switch (feedback) {
          case 'positive':
            adjustment = 0.05;
            break;
          case 'negative':
            adjustment = -0.05;
            break;
          case 'neutral':
            adjustment = 0;
            break;
        }

        const newScore = Math.max(0, Math.min(1, template.success_score + adjustment));
        await this.database.updateTemplateSuccessScore(templateId, newScore);
      }
    } catch (error) {
      console.warn(`Failed to update success score for example ${exampleId}:`, error);
    }
  }

  async getExamplePerformanceStats(): Promise<{
    totalExamples: number;
    avgSuccessScore: number;
    topPerformingDomain: string;
  }> {
    try {
      // This would be implemented with proper database queries
      return {
        totalExamples: 0,
        avgSuccessScore: 0.75,
        topPerformingDomain: 'marketing'
      };
    } catch (error) {
      console.warn('Failed to get performance stats:', error);
      return {
        totalExamples: 0,
        avgSuccessScore: 0.5,
        topPerformingDomain: 'general'
      };
    }
  }

  // Configuration methods
  setWeights(successWeight: number, recencyWeight: number, similarityWeight: number): void {
    const total = successWeight + recencyWeight + similarityWeight;
    this.successScoreWeight = successWeight / total;
    this.recencyWeight = recencyWeight / total;
    this.similarityWeight = similarityWeight / total;
  }

  getWeights(): { success: number; recency: number; similarity: number } {
    return {
      success: this.successScoreWeight,
      recency: this.recencyWeight,
      similarity: this.similarityWeight
    };
  }
}