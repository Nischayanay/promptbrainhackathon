// Domain Translator Module Implementation

import { DomainTranslator, TranslationResult, ContextPackage, ToneAdjustment, StyleGuide } from '../../types';
import { createError } from '../../types/errors';
import { VocabularyEnhancer } from '../context-architect/vocabulary-enhancer';

export class DomainTranslatorImpl implements DomainTranslator {
  async translate(input: string, context: ContextPackage): Promise<TranslationResult> {
    const startTime = Date.now();

    try {
      const primaryDomain = context.domainKnowledge[0]?.domain || 'general';
      
      // Apply domain-specific enhancements
      const domainEnrichedPrompt = await this.enrichPromptWithDomain(input, context);
      
      // Generate role-specific instructions
      const roleInstructions = this.generateRoleInstructions(primaryDomain, context);
      
      // Apply tone adjustments
      const toneAdjustments = this.generateToneAdjustments(input, primaryDomain);
      
      // Create style guide
      const styleGuide = this.createStyleGuide(primaryDomain, context);
      
      // Extract expert vocabulary used
      const expertVocabulary = this.extractExpertVocabulary(domainEnrichedPrompt, primaryDomain);

      const processingTime = Date.now() - startTime;
      console.log(`Domain translation completed in ${processingTime}ms`);

      return {
        domainEnrichedPrompt,
        roleInstructions,
        toneAdjustments,
        styleGuide,
        expertVocabulary
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        throw createError.processingError(
          `Domain translation failed: ${error.message}`,
          true,
          { processingTime, originalError: error.message }
        );
      }
      
      throw createError.processingError(
        'Domain translation failed with unknown error',
        true,
        { processingTime }
      );
    }
  }

  private async enrichPromptWithDomain(input: string, context: ContextPackage): Promise<string> {
    const primaryDomain = context.domainKnowledge[0]?.domain || 'general';
    let enrichedPrompt = input;

    // Apply vocabulary enhancements
    enrichedPrompt = VocabularyEnhancer.enhanceText(enrichedPrompt, primaryDomain);

    // Add domain-specific context
    enrichedPrompt = this.addDomainContext(enrichedPrompt, context);

    // Apply framework structure if applicable
    enrichedPrompt = this.applyFrameworkStructure(enrichedPrompt, context);

    // Add expert-level details
    enrichedPrompt = this.addExpertDetails(enrichedPrompt, context);

    return enrichedPrompt;
  }

  private addDomainContext(prompt: string, context: ContextPackage): string {
    const domain = context.domainKnowledge[0];
    if (!domain) return prompt;

    let contextualPrompt = prompt;

    // Add domain principles
    if (domain.principles.length > 0) {
      const relevantPrinciples = domain.principles.slice(0, 3);
      contextualPrompt += `\n\nApply these ${domain.domain} principles: ${relevantPrinciples.join(', ')}.`;
    }

    // Add best practices
    if (domain.bestPractices.length > 0) {
      const relevantPractices = domain.bestPractices.slice(0, 2);
      contextualPrompt += `\n\nFollow these best practices: ${relevantPractices.join('; ')}.`;
    }

    // Add expert vocabulary context
    if (domain.expertVocabulary.length > 0) {
      const relevantTerms = domain.expertVocabulary.slice(0, 5);
      contextualPrompt += `\n\nUse professional terminology including: ${relevantTerms.join(', ')}.`;
    }

    return contextualPrompt;
  }

  private applyFrameworkStructure(prompt: string, context: ContextPackage): string {
    if (context.frameworks.length === 0) return prompt;

    const primaryFramework = context.frameworks[0];
    let structuredPrompt = prompt;

    // Add framework structure guidance
    structuredPrompt += `\n\nStructure your response using the ${primaryFramework.name} framework:`;
    primaryFramework.structure.forEach((step, index) => {
      structuredPrompt += `\n${index + 1}. ${step}`;
    });

    // Add framework context
    structuredPrompt += `\n\nFramework description: ${primaryFramework.description}`;

    return structuredPrompt;
  }

  private addExpertDetails(prompt: string, context: ContextPackage): string {
    let detailedPrompt = prompt;

    // Add technique-specific guidance
    if (context.techniques.length > 0) {
      const primaryTechnique = context.techniques[0];
      detailedPrompt += `\n\nApply the ${primaryTechnique.name} technique: ${primaryTechnique.description}`;
      
      if (primaryTechnique.applicability.length > 0) {
        detailedPrompt += `\nThis is particularly effective for: ${primaryTechnique.applicability.join(', ')}.`;
      }
    }

    // Add quality and depth requirements
    detailedPrompt += `\n\nProvide expert-level depth and insight. Include specific, actionable recommendations.`;
    detailedPrompt += ` Consider multiple perspectives and potential challenges.`;

    return detailedPrompt;
  }

  private generateRoleInstructions(domain: string, context: ContextPackage): string {
    const roleMap: Record<string, string> = {
      marketing: 'Act as a senior marketing strategist with expertise in digital marketing, customer psychology, and conversion optimization.',
      design: 'Act as a senior UX/UI designer with expertise in user-centered design, visual hierarchy, and accessibility.',
      coding: 'Act as a senior software engineer with expertise in clean code, system architecture, and best practices.',
      psychology: 'Act as a behavioral psychologist with expertise in cognitive science, persuasion, and human decision-making.',
      business: 'Act as a business strategy consultant with expertise in operations, growth, and competitive analysis.',
      creative: 'Act as a creative director with expertise in storytelling, content creation, and artistic vision.',
      technical: 'Act as a technical writer with expertise in documentation, user experience, and clear communication.',
      academic: 'Act as a research scholar with expertise in methodology, analysis, and scholarly communication.',
      general: 'Act as a knowledgeable expert who can provide clear, helpful, and actionable guidance.'
    };

    let instructions = roleMap[domain] || roleMap.general;

    // Add context-specific expertise
    if (context.techniques.length > 0) {
      const techniques = context.techniques.slice(0, 2).map(t => t.name).join(' and ');
      instructions += ` You are particularly skilled in ${techniques}.`;
    }

    if (context.frameworks.length > 0) {
      const frameworks = context.frameworks.slice(0, 2).map(f => f.name).join(' and ');
      instructions += ` You regularly use ${frameworks} in your work.`;
    }

    return instructions;
  }

  private generateToneAdjustments(input: string, domain: string): ToneAdjustment[] {
    const adjustments: ToneAdjustment[] = [];

    // Domain-specific tone mappings
    const toneMap: Record<string, { from: string; to: string; reasoning: string }[]> = {
      marketing: [
        {
          from: 'help me',
          to: 'optimize your marketing strategy',
          reasoning: 'More specific and action-oriented for marketing context'
        },
        {
          from: 'make it better',
          to: 'enhance conversion rates and engagement',
          reasoning: 'Focuses on measurable marketing outcomes'
        }
      ],
      design: [
        {
          from: 'make it look good',
          to: 'create visually appealing and user-friendly design',
          reasoning: 'Emphasizes both aesthetics and usability'
        },
        {
          from: 'fix the design',
          to: 'optimize the user experience and visual hierarchy',
          reasoning: 'Focuses on UX principles rather than just appearance'
        }
      ],
      coding: [
        {
          from: 'write code',
          to: 'implement a robust, maintainable solution',
          reasoning: 'Emphasizes code quality and long-term maintainability'
        },
        {
          from: 'fix the bug',
          to: 'debug and resolve the issue with proper error handling',
          reasoning: 'Includes best practices for error handling'
        }
      ],
      business: [
        {
          from: 'grow the business',
          to: 'develop scalable growth strategies',
          reasoning: 'More strategic and specific to business context'
        },
        {
          from: 'make money',
          to: 'optimize revenue streams and profitability',
          reasoning: 'Professional business terminology'
        }
      ]
    };

    const domainAdjustments = toneMap[domain] || [];
    
    domainAdjustments.forEach(adjustment => {
      if (input.toLowerCase().includes(adjustment.from.toLowerCase())) {
        adjustments.push({
          original: adjustment.from,
          enhanced: adjustment.to,
          reasoning: adjustment.reasoning
        });
      }
    });

    return adjustments;
  }

  private createStyleGuide(domain: string, context: ContextPackage): StyleGuide {
    const styleGuides: Record<string, StyleGuide> = {
      marketing: {
        tone: 'persuasive and engaging',
        voice: 'confident and customer-focused',
        perspective: 'customer-centric',
        formality: 'professional yet approachable',
        guidelines: [
          'Use action-oriented language',
          'Include specific benefits and outcomes',
          'Incorporate social proof when relevant',
          'End with clear call-to-action',
          'Use data and metrics to support claims'
        ]
      },
      design: {
        tone: 'clear and user-focused',
        voice: 'helpful and design-conscious',
        perspective: 'user-centered',
        formality: 'professional and accessible',
        guidelines: [
          'Prioritize user experience in all recommendations',
          'Consider accessibility and inclusivity',
          'Explain design decisions with rationale',
          'Use visual hierarchy principles',
          'Balance aesthetics with functionality'
        ]
      },
      coding: {
        tone: 'precise and technical',
        voice: 'knowledgeable and methodical',
        perspective: 'solution-oriented',
        formality: 'professional and detailed',
        guidelines: [
          'Follow clean code principles',
          'Include error handling considerations',
          'Explain complex concepts clearly',
          'Provide working code examples',
          'Consider performance and scalability'
        ]
      },
      psychology: {
        tone: 'insightful and evidence-based',
        voice: 'analytical and empathetic',
        perspective: 'human-centered',
        formality: 'professional and thoughtful',
        guidelines: [
          'Base recommendations on psychological principles',
          'Consider ethical implications',
          'Explain behavioral motivations',
          'Use research-backed insights',
          'Address individual differences'
        ]
      },
      business: {
        tone: 'strategic and results-focused',
        voice: 'authoritative and practical',
        perspective: 'stakeholder-aware',
        formality: 'professional and executive-level',
        guidelines: [
          'Focus on measurable outcomes',
          'Consider competitive implications',
          'Include risk assessment',
          'Provide actionable recommendations',
          'Align with business objectives'
        ]
      },
      general: {
        tone: 'helpful and clear',
        voice: 'knowledgeable and supportive',
        perspective: 'user-focused',
        formality: 'professional and approachable',
        guidelines: [
          'Use clear, simple language',
          'Provide practical examples',
          'Structure information logically',
          'Be comprehensive yet concise',
          'Anticipate follow-up questions'
        ]
      }
    };

    return styleGuides[domain] || styleGuides.general;
  }

  private extractExpertVocabulary(enrichedPrompt: string, domain: string): string[] {
    const vocabulary = VocabularyEnhancer.getDomainVocabulary(domain as any);
    const usedTerms: string[] = [];

    // Check for enhanced terms in the prompt
    Object.values(vocabulary.terms).forEach(term => {
      if (enrichedPrompt.toLowerCase().includes(term.toLowerCase())) {
        usedTerms.push(term);
      }
    });

    // Check for domain concepts
    vocabulary.concepts.forEach(concept => {
      const conceptWords = concept.toLowerCase().split(' ');
      if (conceptWords.some(word => enrichedPrompt.toLowerCase().includes(word))) {
        usedTerms.push(concept);
      }
    });

    return [...new Set(usedTerms)].slice(0, 10); // Remove duplicates and limit
  }

  // Utility methods
  async translateWithCustomRole(
    input: string, 
    context: ContextPackage, 
    customRole: string
  ): Promise<TranslationResult> {
    const result = await this.translate(input, context);
    result.roleInstructions = customRole;
    return result;
  }

  async translateWithToneOverride(
    input: string, 
    context: ContextPackage, 
    toneOverride: Partial<StyleGuide>
  ): Promise<TranslationResult> {
    const result = await this.translate(input, context);
    result.styleGuide = { ...result.styleGuide, ...toneOverride };
    return result;
  }
}

export { DomainTranslatorImpl };