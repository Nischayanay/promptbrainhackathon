// Prompt Compiler Module Implementation

import { PromptCompiler, TranslationResult, ContextPackage, FewShotExample, CompiledPrompt, CompilationMetadata, PromptConstraint } from '../../types';
import { createError } from '../../types/errors';

export class PromptCompilerImpl implements PromptCompiler {
  async compile(
    translation: TranslationResult, 
    context: ContextPackage, 
    fewShots: FewShotExample[]
  ): Promise<CompiledPrompt> {
    const startTime = Date.now();

    try {
      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(translation, context);
      
      // Build user prompt
      const userPrompt = this.buildUserPrompt(translation);
      
      // Process few-shot examples
      const processedFewShots = this.processFewShotExamples(fewShots);
      
      // Extract and process constraints
      const constraints = this.extractConstraints(translation, context);
      
      // Generate compilation metadata
      const metadata = this.generateMetadata(systemPrompt, userPrompt, processedFewShots, translation);

      const processingTime = Date.now() - startTime;
      console.log(`Prompt compilation completed in ${processingTime}ms`);

      return {
        systemPrompt,
        userPrompt,
        fewShotExamples: processedFewShots,
        constraints,
        metadata
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        throw createError.processingError(
          `Prompt compilation failed: ${error.message}`,
          true,
          { processingTime, originalError: error.message }
        );
      }
      
      throw createError.processingError(
        'Prompt compilation failed with unknown error',
        true,
        { processingTime }
      );
    }
  }

  private buildSystemPrompt(translation: TranslationResult, context: ContextPackage): string {
    let systemPrompt = '';

    // Add role instructions
    systemPrompt += translation.roleInstructions;

    // Add style guide
    systemPrompt += `\n\nStyle Guidelines:`;
    systemPrompt += `\n- Tone: ${translation.styleGuide.tone}`;
    systemPrompt += `\n- Voice: ${translation.styleGuide.voice}`;
    systemPrompt += `\n- Perspective: ${translation.styleGuide.perspective}`;
    systemPrompt += `\n- Formality: ${translation.styleGuide.formality}`;

    // Add specific guidelines
    if (translation.styleGuide.guidelines.length > 0) {
      systemPrompt += `\n\nSpecific Guidelines:`;
      translation.styleGuide.guidelines.forEach((guideline, index) => {
        systemPrompt += `\n${index + 1}. ${guideline}`;
      });
    }

    // Add domain-specific context
    if (context.domainKnowledge.length > 0) {
      const primaryDomain = context.domainKnowledge[0];
      systemPrompt += `\n\nDomain Expertise (${primaryDomain.domain}):`;
      
      if (primaryDomain.principles.length > 0) {
        systemPrompt += `\nKey Principles: ${primaryDomain.principles.slice(0, 3).join(', ')}`;
      }
      
      if (primaryDomain.bestPractices.length > 0) {
        systemPrompt += `\nBest Practices: ${primaryDomain.bestPractices.slice(0, 3).join('; ')}`;
      }
    }

    // Add framework guidance
    if (context.frameworks.length > 0) {
      const framework = context.frameworks[0];
      systemPrompt += `\n\nFramework: ${framework.name}`;
      systemPrompt += `\nStructure: ${framework.structure.join(' → ')}`;
      systemPrompt += `\nDescription: ${framework.description}`;
    }

    // Add technique guidance
    if (context.techniques.length > 0) {
      const technique = context.techniques[0];
      systemPrompt += `\n\nTechnique: ${technique.name}`;
      systemPrompt += `\nApplication: ${technique.description}`;
    }

    // Add expert vocabulary context
    if (translation.expertVocabulary.length > 0) {
      systemPrompt += `\n\nExpert Vocabulary: Use professional terminology including: ${translation.expertVocabulary.slice(0, 5).join(', ')}`;
    }

    // Add quality requirements
    systemPrompt += `\n\nQuality Requirements:`;
    systemPrompt += `\n- Provide comprehensive, expert-level responses`;
    systemPrompt += `\n- Include specific, actionable recommendations`;
    systemPrompt += `\n- Consider multiple perspectives and potential challenges`;
    systemPrompt += `\n- Ensure accuracy and relevance to the domain`;
    systemPrompt += `\n- Structure information clearly and logically`;

    return systemPrompt.trim();
  }

  private buildUserPrompt(translation: TranslationResult): string {
    let userPrompt = translation.domainEnrichedPrompt;

    // Add tone adjustments context if any were made
    if (translation.toneAdjustments.length > 0) {
      userPrompt += `\n\nNote: Please ensure the response reflects these enhancements:`;
      translation.toneAdjustments.forEach(adjustment => {
        userPrompt += `\n- ${adjustment.reasoning}`;
      });
    }

    return userPrompt.trim();
  }

  private processFewShotExamples(fewShots: FewShotExample[]): FewShotExample[] {
    // Sort by relevance and success score
    const processed = [...fewShots].sort((a, b) => {
      const scoreA = a.successScore * 0.7 + (a.usageCount / 100) * 0.3;
      const scoreB = b.successScore * 0.7 + (b.usageCount / 100) * 0.3;
      return scoreB - scoreA;
    });

    // Limit to top 3 examples for optimal performance
    return processed.slice(0, 3);
  }

  private extractConstraints(translation: TranslationResult, context: ContextPackage): PromptConstraint[] {
    const constraints: PromptConstraint[] = [];

    // Extract constraints from style guide
    constraints.push({
      type: 'TONE',
      value: translation.styleGuide.tone,
      enforced: true,
      description: `Maintain ${translation.styleGuide.tone} tone throughout`
    });

    constraints.push({
      type: 'STYLE',
      value: translation.styleGuide.formality,
      enforced: true,
      description: `Use ${translation.styleGuide.formality} style`
    });

    // Add domain-specific constraints
    if (context.domainKnowledge.length > 0) {
      const domain = context.domainKnowledge[0];
      constraints.push({
        type: 'CONTENT',
        value: domain.domain,
        enforced: true,
        description: `Ensure content is appropriate for ${domain.domain} domain`
      });
    }

    // Add framework constraints
    if (context.frameworks.length > 0) {
      const framework = context.frameworks[0];
      constraints.push({
        type: 'FORMAT',
        value: framework.name,
        enforced: true,
        description: `Structure response using ${framework.name} framework`
      });
    }

    // Add quality constraints
    constraints.push({
      type: 'CONTENT',
      value: 'expert_level',
      enforced: true,
      description: 'Provide expert-level depth and insight'
    });

    constraints.push({
      type: 'CONTENT',
      value: 'actionable',
      enforced: true,
      description: 'Include specific, actionable recommendations'
    });

    return constraints;
  }

  private generateMetadata(
    systemPrompt: string, 
    userPrompt: string, 
    fewShots: FewShotExample[],
    translation: TranslationResult
  ): CompilationMetadata {
    // Calculate token counts (rough estimation)
    const systemTokens = this.estimateTokenCount(systemPrompt);
    const userTokens = this.estimateTokenCount(userPrompt);
    const fewShotTokens = fewShots.reduce((total, example) => 
      total + this.estimateTokenCount(example.input) + this.estimateTokenCount(example.output), 0
    );

    const totalTokens = systemTokens + userTokens + fewShotTokens;

    // Calculate complexity score
    const complexityScore = this.calculateComplexityScore(systemPrompt, userPrompt, fewShots);

    // Get domain confidence from translation
    const domainConfidence = this.calculateDomainConfidence(translation);

    // Calculate enhancement ratio
    const enhancementRatio = this.calculateEnhancementRatio(translation);

    return {
      totalTokens,
      complexityScore,
      domainConfidence,
      enhancementRatio
    };
  }

  private estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  private calculateComplexityScore(systemPrompt: string, userPrompt: string, fewShots: FewShotExample[]): number {
    let score = 0;

    // Base complexity from prompt length
    score += Math.min((systemPrompt.length + userPrompt.length) / 2000, 0.4);

    // Complexity from few-shot examples
    score += Math.min(fewShots.length * 0.1, 0.3);

    // Complexity from structure and formatting
    const structureIndicators = [
      'framework', 'structure', 'guidelines', 'principles', 'technique'
    ];
    const structureCount = structureIndicators.reduce((count, indicator) => 
      count + (systemPrompt.toLowerCase().includes(indicator) ? 1 : 0), 0
    );
    score += Math.min(structureCount * 0.05, 0.3);

    return Math.min(score, 1.0);
  }

  private calculateDomainConfidence(translation: TranslationResult): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on expert vocabulary usage
    if (translation.expertVocabulary.length > 0) {
      confidence += Math.min(translation.expertVocabulary.length * 0.05, 0.3);
    }

    // Increase confidence based on tone adjustments
    if (translation.toneAdjustments.length > 0) {
      confidence += Math.min(translation.toneAdjustments.length * 0.1, 0.2);
    }

    return Math.min(confidence, 1.0);
  }

  private calculateEnhancementRatio(translation: TranslationResult): number {
    // Compare enhanced prompt length to original (estimated)
    const enhancedLength = translation.domainEnrichedPrompt.length;
    
    // Estimate original length by removing enhancements
    let estimatedOriginalLength = enhancedLength;
    
    // Subtract estimated enhancement additions
    if (translation.expertVocabulary.length > 0) {
      estimatedOriginalLength *= 0.8; // Assume 20% vocabulary enhancement
    }
    
    if (translation.toneAdjustments.length > 0) {
      estimatedOriginalLength *= 0.9; // Assume 10% tone enhancement
    }

    const ratio = enhancedLength / Math.max(estimatedOriginalLength, 1);
    return Math.max(ratio, 1.0); // Minimum ratio of 1.0
  }

  // Utility methods
  async compileWithCustomConstraints(
    translation: TranslationResult,
    context: ContextPackage,
    fewShots: FewShotExample[],
    customConstraints: PromptConstraint[]
  ): Promise<CompiledPrompt> {
    const compiled = await this.compile(translation, context, fewShots);
    compiled.constraints.push(...customConstraints);
    return compiled;
  }

  async optimizeForTokenLimit(
    translation: TranslationResult,
    context: ContextPackage,
    fewShots: FewShotExample[],
    maxTokens: number
  ): Promise<CompiledPrompt> {
    let compiled = await this.compile(translation, context, fewShots);
    
    // If over token limit, optimize
    if (compiled.metadata.totalTokens > maxTokens) {
      // Reduce few-shot examples first
      const reducedFewShots = fewShots.slice(0, Math.max(1, Math.floor(fewShots.length / 2)));
      compiled = await this.compile(translation, context, reducedFewShots);
      
      // If still over limit, truncate system prompt
      if (compiled.metadata.totalTokens > maxTokens) {
        const targetSystemLength = Math.floor(compiled.systemPrompt.length * 0.8);
        compiled.systemPrompt = compiled.systemPrompt.substring(0, targetSystemLength) + '...';
        compiled.metadata = this.generateMetadata(compiled.systemPrompt, compiled.userPrompt, reducedFewShots, translation);
      }
    }
    
    return compiled;
  }
}

export { PromptCompilerImpl };