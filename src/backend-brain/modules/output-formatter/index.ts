// Output Formatter & Explainer Module Implementation

import { OutputFormatter, CompiledPrompt, EnhancementMetadata, FormattedOutput, ProvenanceData, OutputMetadata, StructuredPrompt, EnhancementStep } from '../../types';
import { createError } from '../../types/errors';

export class OutputFormatterImpl implements OutputFormatter {
  async format(prompt: CompiledPrompt, metadata: EnhancementMetadata): Promise<FormattedOutput> {
    const startTime = Date.now();

    try {
      // Generate enhanced text format
      const enhancedText = this.generateEnhancedText(prompt);
      
      // Generate structured JSON format
      const enhancedJson = this.generateStructuredPrompt(prompt, metadata);
      
      // Generate why summary
      const whySummary = this.generateWhySummary(prompt, metadata);
      
      // Generate provenance data
      const provenance = this.generateProvenanceData(prompt, metadata);
      
      // Calculate quality score
      const qualityScore = this.calculateOverallQualityScore(prompt, metadata);
      
      // Generate output metadata
      const outputMetadata = this.generateOutputMetadata(prompt, metadata, startTime);

      const processingTime = Date.now() - startTime;
      console.log(`Output formatting completed in ${processingTime}ms`);

      return {
        enhancedText,
        enhancedJson,
        whySummary,
        provenance,
        qualityScore,
        metadata: outputMetadata
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        throw createError.processingError(
          `Output formatting failed: ${error.message}`,
          true,
          { processingTime, originalError: error.message }
        );
      }
      
      throw createError.processingError(
        'Output formatting failed with unknown error',
        true,
        { processingTime }
      );
    }
  }

  private generateEnhancedText(prompt: CompiledPrompt): string {
    let enhancedText = '';

    // Add header
    enhancedText += '# Enhanced Prompt\n\n';

    // Add system instructions section
    enhancedText += '## System Instructions\n\n';
    enhancedText += prompt.systemPrompt;
    enhancedText += '\n\n';

    // Add user prompt section
    enhancedText += '## User Request\n\n';
    enhancedText += prompt.userPrompt;
    enhancedText += '\n\n';

    // Add few-shot examples if present
    if (prompt.fewShotExamples.length > 0) {
      enhancedText += '## Examples\n\n';
      prompt.fewShotExamples.forEach((example, index) => {
        enhancedText += `### Example ${index + 1}\n\n`;
        enhancedText += `**Input:** ${example.input}\n\n`;
        enhancedText += `**Output:** ${example.output}\n\n`;
      });
    }

    // Add constraints section
    if (prompt.constraints.length > 0) {
      enhancedText += '## Constraints\n\n';
      prompt.constraints.forEach((constraint, index) => {
        enhancedText += `${index + 1}. **${constraint.type}**: ${constraint.description}\n`;
      });
      enhancedText += '\n';
    }

    // Add metadata section
    enhancedText += '## Metadata\n\n';
    enhancedText += `- **Total Tokens**: ${prompt.metadata.totalTokens}\n`;
    enhancedText += `- **Complexity Score**: ${prompt.metadata.complexityScore.toFixed(2)}\n`;
    enhancedText += `- **Domain Confidence**: ${prompt.metadata.domainConfidence.toFixed(2)}\n`;
    enhancedText += `- **Enhancement Ratio**: ${prompt.metadata.enhancementRatio.toFixed(2)}x\n`;

    return enhancedText;
  }

  private generateStructuredPrompt(prompt: CompiledPrompt, metadata: EnhancementMetadata): StructuredPrompt {
    return {
      system: prompt.systemPrompt,
      user: prompt.userPrompt,
      examples: prompt.fewShotExamples,
      metadata: this.generateOutputMetadata(prompt, metadata, Date.now()),
      constraints: prompt.constraints
    };
  }

  private generateWhySummary(prompt: CompiledPrompt, metadata: EnhancementMetadata): string {
    const reasons: string[] = [];

    // Analyze enhancement steps
    const steps = metadata.processingSteps;
    
    // Domain enhancement reasoning
    const domainSteps = steps.filter(step => step.module === 'DomainTranslator');
    if (domainSteps.length > 0) {
      reasons.push(`Applied domain-specific enhancements to transform generic language into expert-level terminology and structure`);
    }

    // Context enhancement reasoning
    const contextSteps = steps.filter(step => step.module === 'ContextArchitect');
    if (contextSteps.length > 0) {
      reasons.push(`Incorporated relevant domain knowledge, frameworks, and best practices to provide comprehensive context`);
    }

    // Few-shot reasoning
    if (prompt.fewShotExamples.length > 0) {
      reasons.push(`Added ${prompt.fewShotExamples.length} high-quality examples to demonstrate expected output patterns and quality`);
    }

    // Constraint reasoning
    const enforcedConstraints = prompt.constraints.filter(c => c.enforced);
    if (enforcedConstraints.length > 0) {
      reasons.push(`Applied ${enforcedConstraints.length} constraints to ensure output meets quality and format requirements`);
    }

    // Enhancement ratio reasoning
    if (prompt.metadata.enhancementRatio > 3) {
      reasons.push(`Achieved ${prompt.metadata.enhancementRatio.toFixed(1)}x enhancement ratio by adding detailed instructions, context, and examples`);
    }

    // Quality improvements
    const qualityMetrics = metadata.qualityMetrics;
    if (qualityMetrics.domainRelevance && qualityMetrics.domainRelevance > 0.8) {
      reasons.push(`Enhanced domain relevance through specialized vocabulary and industry-specific guidance`);
    }

    // Performance optimization
    if (prompt.metadata.totalTokens < 1500) {
      reasons.push(`Optimized for performance while maintaining comprehensive guidance (${prompt.metadata.totalTokens} tokens)`);
    }

    // Fallback if no specific reasons
    if (reasons.length === 0) {
      reasons.push('Applied systematic prompt enhancement to improve clarity, specificity, and expected output quality');
    }

    let summary = 'This prompt was enhanced through the following improvements:\n\n';
    reasons.forEach((reason, index) => {
      summary += `${index + 1}. ${reason}\n`;
    });

    summary += `\nThe result is a comprehensive, expert-level prompt that provides clear guidance, relevant context, and quality examples to ensure optimal AI response generation.`;

    return summary;
  }

  private generateProvenanceData(prompt: CompiledPrompt, metadata: EnhancementMetadata): ProvenanceData {
    // Extract original input from processing steps
    const originalInput = this.extractOriginalInput(metadata.processingSteps);
    
    // Get enhancement steps
    const enhancementSteps = metadata.processingSteps.map(step => ({
      ...step,
      timestamp: step.timestamp || new Date()
    }));

    // Extract source techniques
    const sourceTechniques = this.extractSourceTechniques(enhancementSteps);
    
    // Extract domain sources
    const domainSources = this.extractDomainSources(enhancementSteps);
    
    // Calculate confidence scores
    const confidenceScores = this.calculateConfidenceScores(prompt, metadata);

    return {
      originalInput,
      enhancementSteps,
      sourceTechniques,
      domainSources,
      confidenceScores
    };
  }

  private generateOutputMetadata(prompt: CompiledPrompt, metadata: EnhancementMetadata, startTime: number): OutputMetadata {
    const processingTime = Date.now() - startTime;
    
    return {
      processingTime,
      totalTokens: prompt.metadata.totalTokens,
      enhancementRatio: prompt.metadata.enhancementRatio,
      qualityScore: this.calculateOverallQualityScore(prompt, metadata),
      domainConfidence: prompt.metadata.domainConfidence,
      timestamp: new Date()
    };
  }

  private calculateOverallQualityScore(prompt: CompiledPrompt, metadata: EnhancementMetadata): number {
    let score = 0.7; // Base score

    // Enhancement ratio contribution
    const enhancementBonus = Math.min((prompt.metadata.enhancementRatio - 1) / 10, 0.15);
    score += enhancementBonus;

    // Domain confidence contribution
    score += prompt.metadata.domainConfidence * 0.1;

    // Few-shot examples contribution
    if (prompt.fewShotExamples.length > 0) {
      const avgSuccessScore = prompt.fewShotExamples.reduce((sum, ex) => sum + ex.successScore, 0) / prompt.fewShotExamples.length;
      score += avgSuccessScore * 0.1;
    }

    // Constraint compliance contribution
    const enforcedConstraints = prompt.constraints.filter(c => c.enforced).length;
    score += Math.min(enforcedConstraints * 0.02, 0.1);

    // Processing efficiency bonus
    const totalProcessingTime = metadata.endTime.getTime() - metadata.startTime.getTime();
    if (totalProcessingTime < 1000) { // Under 1 second
      score += 0.05;
    }

    // Quality metrics from metadata
    if (metadata.qualityMetrics) {
      Object.values(metadata.qualityMetrics).forEach(metric => {
        if (typeof metric === 'number' && metric > 0.8) {
          score += 0.02;
        }
      });
    }

    return Math.min(1.0, Math.max(0.0, score));
  }

  private extractOriginalInput(steps: EnhancementStep[]): string {
    const inputStep = steps.find(step => step.module === 'InputAnalyzer');
    return inputStep?.input || 'Original input not available';
  }

  private extractSourceTechniques(steps: EnhancementStep[]): string[] {
    const techniques: string[] = [];
    
    steps.forEach(step => {
      if (step.module === 'ContextArchitect' && step.output?.techniques) {
        step.output.techniques.forEach((technique: any) => {
          if (technique.name && !techniques.includes(technique.name)) {
            techniques.push(technique.name);
          }
        });
      }
    });

    return techniques;
  }

  private extractDomainSources(steps: EnhancementStep[]): string[] {
    const domains: string[] = [];
    
    steps.forEach(step => {
      if (step.module === 'InputAnalyzer' && step.output?.suggestedDomains) {
        step.output.suggestedDomains.forEach((domain: string) => {
          if (!domains.includes(domain)) {
            domains.push(domain);
          }
        });
      }
    });

    return domains;
  }

  private calculateConfidenceScores(prompt: CompiledPrompt, metadata: EnhancementMetadata): Record<string, number> {
    const scores: Record<string, number> = {};

    // Domain confidence
    scores.domainClassification = prompt.metadata.domainConfidence;

    // Enhancement confidence
    scores.enhancementQuality = Math.min(prompt.metadata.enhancementRatio / 5, 1.0);

    // Structure confidence
    scores.structureQuality = prompt.constraints.length > 0 ? 0.9 : 0.7;

    // Example relevance confidence
    if (prompt.fewShotExamples.length > 0) {
      const avgRelevance = prompt.fewShotExamples.reduce((sum, ex) => sum + ex.successScore, 0) / prompt.fewShotExamples.length;
      scores.exampleRelevance = avgRelevance;
    } else {
      scores.exampleRelevance = 0.5;
    }

    // Overall confidence
    scores.overall = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

    return scores;
  }

  // Utility methods for different output formats
  async formatAsMarkdown(prompt: CompiledPrompt, metadata: EnhancementMetadata): Promise<string> {
    const formatted = await this.format(prompt, metadata);
    return formatted.enhancedText;
  }

  async formatAsJSON(prompt: CompiledPrompt, metadata: EnhancementMetadata): Promise<string> {
    const formatted = await this.format(prompt, metadata);
    return JSON.stringify(formatted.enhancedJson, null, 2);
  }

  async formatForAPI(prompt: CompiledPrompt, metadata: EnhancementMetadata): Promise<{
    system: string;
    user: string;
    examples?: Array<{ input: string; output: string }>;
    metadata: OutputMetadata;
  }> {
    const formatted = await this.format(prompt, metadata);
    
    return {
      system: formatted.enhancedJson.system,
      user: formatted.enhancedJson.user,
      examples: formatted.enhancedJson.examples.map(ex => ({
        input: ex.input,
        output: ex.output
      })),
      metadata: formatted.metadata
    };
  }

  async formatSummary(prompt: CompiledPrompt, metadata: EnhancementMetadata): Promise<{
    summary: string;
    metrics: Record<string, number>;
    improvements: string[];
  }> {
    const formatted = await this.format(prompt, metadata);
    
    const improvements = formatted.whySummary
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, ''));

    return {
      summary: `Enhanced prompt with ${prompt.metadata.enhancementRatio.toFixed(1)}x improvement ratio and ${formatted.qualityScore.toFixed(2)} quality score`,
      metrics: {
        enhancementRatio: prompt.metadata.enhancementRatio,
        qualityScore: formatted.qualityScore,
        domainConfidence: prompt.metadata.domainConfidence,
        totalTokens: prompt.metadata.totalTokens,
        processingTime: formatted.metadata.processingTime
      },
      improvements
    };
  }
}

export { OutputFormatterImpl };