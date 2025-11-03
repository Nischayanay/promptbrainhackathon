// Context Architect Module Implementation

import { ContextArchitect, AnalysisResult, ContextPackage, HistoricalExample } from '../../types';
import { createError } from '../../types/errors';
import { getDatabase } from '../../database/client';
import { DomainKnowledgeBase } from './domain-knowledge';
import { TechniquesFrameworksDatabase } from './techniques-frameworks';
import { VocabularyEnhancer } from './vocabulary-enhancer';

export class ContextArchitectImpl implements ContextArchitect {
  private database = getDatabase();
  private cache = new Map<string, ContextPackage>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async buildContext(analysis: AnalysisResult): Promise<ContextPackage> {
    const startTime = Date.now();
    
    try {
      // Create cache key from analysis
      const cacheKey = this.createCacheKey(analysis);
      
      // Check cache first
      const cachedContext = this.getCachedContext(cacheKey);
      if (cachedContext) {
        return cachedContext;
      }

      // Get primary domain
      const primaryDomain = analysis.suggestedDomains[0] || 'general';
      
      // Build context package
      const contextPackage: ContextPackage = {
        domainKnowledge: await this.retrieveDomainKnowledge(analysis),
        techniques: await this.retrieveTechniques(analysis),
        frameworks: await this.retrieveFrameworks(analysis),
        vocabulary: this.retrieveVocabulary(primaryDomain),
        examples: await this.retrieveHistoricalExamples(analysis)
      };

      // Cache the result
      this.setCachedContext(cacheKey, contextPackage);

      const processingTime = Date.now() - startTime;
      console.log(`Context building completed in ${processingTime}ms`);

      return contextPackage;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        throw createError.contextRetrievalFailed(
          analysis.suggestedDomains[0] || 'unknown'
        );
      }
      
      throw createError.processingError(
        'Context building failed with unknown error',
        true,
        { processingTime }
      );
    }
  }

  private async retrieveDomainKnowledge(analysis: AnalysisResult) {
    const domainKnowledge = [];
    
    // Get knowledge for all suggested domains
    for (const domain of analysis.suggestedDomains.slice(0, 3)) { // Top 3 domains
      const knowledge = DomainKnowledgeBase.getDomainKnowledge(domain);
      domainKnowledge.push(knowledge);
    }

    // If no domains suggested, use general
    if (domainKnowledge.length === 0) {
      domainKnowledge.push(DomainKnowledgeBase.getDomainKnowledge('general'));
    }

    return domainKnowledge;
  }

  private async retrieveTechniques(analysis: AnalysisResult) {
    const allTechniques = [];
    
    // Get techniques for suggested domains
    for (const domain of analysis.suggestedDomains.slice(0, 2)) {
      const domainTechniques = TechniquesFrameworksDatabase.getTechniques(domain);
      allTechniques.push(...domainTechniques);
    }

    // Get relevant techniques based on keywords
    const relevantTechniques = TechniquesFrameworksDatabase.getRelevantTechniques(
      analysis.keywords,
      analysis.suggestedDomains[0]
    );
    
    allTechniques.push(...relevantTechniques);

    // Remove duplicates and limit results
    const uniqueTechniques = allTechniques.filter((technique, index, self) => 
      index === self.findIndex(t => t.id === technique.id)
    );

    return uniqueTechniques.slice(0, 5); // Top 5 techniques
  }

  private async retrieveFrameworks(analysis: AnalysisResult) {
    const allFrameworks = [];
    
    // Get frameworks for suggested domains
    for (const domain of analysis.suggestedDomains.slice(0, 2)) {
      const domainFrameworks = TechniquesFrameworksDatabase.getFrameworks(domain);
      allFrameworks.push(...domainFrameworks);
    }

    // Get relevant frameworks based on keywords
    const relevantFrameworks = TechniquesFrameworksDatabase.getRelevantFrameworks(
      analysis.keywords,
      analysis.suggestedDomains[0]
    );
    
    allFrameworks.push(...relevantFrameworks);

    // Remove duplicates and limit results
    const uniqueFrameworks = allFrameworks.filter((framework, index, self) => 
      index === self.findIndex(f => f.id === framework.id)
    );

    return uniqueFrameworks.slice(0, 3); // Top 3 frameworks
  }

  private retrieveVocabulary(domain: string) {
    return VocabularyEnhancer.getDomainVocabulary(domain as any);
  }

  private async retrieveHistoricalExamples(analysis: AnalysisResult): Promise<HistoricalExample[]> {
    try {
      // Get templates with few-shot examples from database
      const primaryDomain = analysis.suggestedDomains[0];
      const templates = await this.database.getTemplatesByDomain(primaryDomain);
      
      const examples: HistoricalExample[] = [];
      
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
                lastUsed: template.last_used ? new Date(template.last_used) : new Date()
              });
            }
          });
        }
      });

      // Sort by success score and usage
      examples.sort((a, b) => {
        const scoreA = a.successScore * 0.7 + (a.usageCount / 100) * 0.3;
        const scoreB = b.successScore * 0.7 + (b.usageCount / 100) * 0.3;
        return scoreB - scoreA;
      });

      return examples.slice(0, 5); // Top 5 examples

    } catch (error) {
      console.warn('Failed to retrieve historical examples:', error);
      return this.getFallbackExamples(analysis.suggestedDomains[0]);
    }
  }

  private getFallbackExamples(domain: string): HistoricalExample[] {
    // Fallback examples when database is unavailable
    const fallbackExamples: Record<string, HistoricalExample[]> = {
      marketing: [
        {
          id: 'marketing_fallback_1',
          input: 'Write an email about our new product',
          output: 'Subject: Introducing Our Game-Changing New Product\n\nDear [Name],\n\nAre you tired of [problem]? Our new [product] solves this by [solution].\n\nKey benefits:\n• [Benefit 1]\n• [Benefit 2]\n• [Benefit 3]\n\nLimited time offer: Get 20% off your first order.\n\n[Call to Action Button]\n\nBest regards,\n[Your Name]',
          domain: 'marketing',
          successScore: 0.85,
          usageCount: 150,
          lastUsed: new Date()
        }
      ],
      design: [
        {
          id: 'design_fallback_1',
          input: 'Design a landing page',
          output: 'Landing Page Design Structure:\n\n1. Hero Section:\n   - Compelling headline\n   - Subheadline with value prop\n   - Hero image/video\n   - Primary CTA button\n\n2. Benefits Section:\n   - 3 key benefits with icons\n   - Social proof elements\n\n3. Features Section:\n   - Feature descriptions\n   - Screenshots/demos\n\n4. Testimonials:\n   - Customer reviews\n   - Trust badges\n\n5. Final CTA:\n   - Strong call-to-action\n   - Contact information',
          domain: 'design',
          successScore: 0.80,
          usageCount: 120,
          lastUsed: new Date()
        }
      ]
    };

    return fallbackExamples[domain] || [];
  }

  // Cache management
  private createCacheKey(analysis: AnalysisResult): string {
    const keyData = {
      domains: analysis.suggestedDomains.slice(0, 2),
      keywords: analysis.keywords.slice(0, 5),
      confidence: Math.round(analysis.confidence * 10) / 10
    };
    return JSON.stringify(keyData);
  }

  private getCachedContext(key: string): ContextPackage | null {
    const cached = this.cache.get(key);
    if (cached) {
      // Check if cache is still valid (simple timestamp-based expiry)
      const cacheTime = (cached as any)._cacheTime;
      if (cacheTime && Date.now() - cacheTime < this.cacheTimeout) {
        return cached;
      } else {
        this.cache.delete(key);
      }
    }
    return null;
  }

  private setCachedContext(key: string, context: ContextPackage): void {
    // Add cache timestamp
    (context as any)._cacheTime = Date.now();
    this.cache.set(key, context);

    // Clean up old cache entries periodically
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  // Utility methods
  async getContextForDomain(domain: string, keywords: string[] = []): Promise<ContextPackage> {
    const mockAnalysis: AnalysisResult = {
      tokens: keywords,
      entities: [],
      keywords,
      constraints: [],
      contextScore: 0.8,
      suggestedDomains: [domain as any],
      confidence: 0.9
    };

    return this.buildContext(mockAnalysis);
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; timeout: number } {
    return {
      size: this.cache.size,
      timeout: this.cacheTimeout
    };
  }
}

// Export supporting classes
export { DomainKnowledgeBase } from './domain-knowledge';
export { TechniquesFrameworksDatabase } from './techniques-frameworks';
export { VocabularyEnhancer } from './vocabulary-enhancer';