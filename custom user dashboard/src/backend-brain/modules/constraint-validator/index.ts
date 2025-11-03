// Constraint Solver & Validator Module Implementation

import { ConstraintValidator, CompiledPrompt, ValidationResult, Violation, Constraint } from '../../types';
import { createError } from '../../types/errors';
import { VALIDATION_LIMITS } from '../../types/validation';

export class ConstraintValidatorImpl implements ConstraintValidator {
  private safetyPatterns: RegExp[] = [
    /\b(hack|exploit|malware|virus)\b/i,
    /\b(illegal|criminal|fraud)\b/i,
    /\b(hate|violence|harm)\b/i,
    /\b(discriminat|racist|sexist)\b/i,
    /\b(adult|explicit|nsfw)\b/i
  ];

  async validate(prompt: CompiledPrompt): Promise<ValidationResult> {
    const startTime = Date.now();

    try {
      const violations: Violation[] = [];
      let qualityScore = 1.0;
      let safetyScore = 1.0;
      const suggestions: string[] = [];

      // Validate length constraints
      const lengthViolations = this.validateLength(prompt);
      violations.push(...lengthViolations);

      // Validate format constraints
      const formatViolations = this.validateFormat(prompt);
      violations.push(...formatViolations);

      // Validate safety constraints
      const safetyViolations = this.validateSafety(prompt);
      violations.push(...safetyViolations);
      safetyScore = this.calculateSafetyScore(safetyViolations);

      // Validate quality constraints
      const qualityViolations = this.validateQuality(prompt);
      violations.push(...qualityViolations);
      qualityScore = this.calculateQualityScore(prompt, qualityViolations);

      // Generate suggestions
      suggestions.push(...this.generateSuggestions(violations, prompt));

      const isValid = violations.filter(v => v.severity === 'HIGH').length === 0;

      const processingTime = Date.now() - startTime;
      console.log(`Validation completed in ${processingTime}ms`);

      return {
        isValid,
        violations,
        qualityScore,
        safetyScore,
        suggestions
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        throw createError.processingError(
          `Validation failed: ${error.message}`,
          true,
          { processingTime, originalError: error.message }
        );
      }
      
      throw createError.processingError(
        'Validation failed with unknown error',
        true,
        { processingTime }
      );
    }
  }

  async enforce(prompt: CompiledPrompt, constraints: Constraint[]): Promise<CompiledPrompt> {
    const startTime = Date.now();

    try {
      let enforcedPrompt = { ...prompt };

      // Apply each constraint
      for (const constraint of constraints) {
        enforcedPrompt = await this.applyConstraint(enforcedPrompt, constraint);
      }

      // Validate the enforced prompt
      const validation = await this.validate(enforcedPrompt);
      
      // If still invalid, apply automatic corrections
      if (!validation.isValid) {
        enforcedPrompt = await this.applyAutomaticCorrections(enforcedPrompt, validation.violations);
      }

      const processingTime = Date.now() - startTime;
      console.log(`Constraint enforcement completed in ${processingTime}ms`);

      return enforcedPrompt;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        throw createError.processingError(
          `Constraint enforcement failed: ${error.message}`,
          true,
          { processingTime, originalError: error.message }
        );
      }
      
      throw createError.processingError(
        'Constraint enforcement failed with unknown error',
        true,
        { processingTime }
      );
    }
  }

  private validateLength(prompt: CompiledPrompt): Violation[] {
    const violations: Violation[] = [];

    // Check total token count
    if (prompt.metadata.totalTokens > VALIDATION_LIMITS.INPUT.MAX_TOKENS) {
      violations.push({
        type: 'LENGTH',
        severity: 'HIGH',
        message: `Total tokens (${prompt.metadata.totalTokens}) exceeds limit (${VALIDATION_LIMITS.INPUT.MAX_TOKENS})`,
        suggestion: 'Reduce prompt length or few-shot examples'
      });
    }

    // Check system prompt length
    if (prompt.systemPrompt.length > 5000) {
      violations.push({
        type: 'LENGTH',
        severity: 'MEDIUM',
        message: 'System prompt is very long and may impact performance',
        suggestion: 'Consider condensing system instructions'
      });
    }

    // Check user prompt length
    if (prompt.userPrompt.length > VALIDATION_LIMITS.INPUT.MAX_LENGTH) {
      violations.push({
        type: 'LENGTH',
        severity: 'HIGH',
        message: `User prompt exceeds maximum length (${VALIDATION_LIMITS.INPUT.MAX_LENGTH} characters)`,
        suggestion: 'Shorten the user prompt'
      });
    }

    return violations;
  }

  private validateFormat(prompt: CompiledPrompt): Violation[] {
    const violations: Violation[] = [];

    // Check for required format constraints
    const formatConstraints = prompt.constraints.filter(c => c.type === 'FORMAT');
    
    for (const constraint of formatConstraints) {
      if (constraint.enforced) {
        const isFormatValid = this.checkFormatCompliance(prompt, constraint.value as string);
        if (!isFormatValid) {
          violations.push({
            type: 'FORMAT',
            severity: 'MEDIUM',
            message: `Prompt does not comply with required format: ${constraint.value}`,
            suggestion: constraint.description || 'Adjust prompt format'
          });
        }
      }
    }

    // Check for proper structure
    if (!this.hasProperStructure(prompt)) {
      violations.push({
        type: 'FORMAT',
        severity: 'LOW',
        message: 'Prompt structure could be improved',
        suggestion: 'Add clear sections and organization'
      });
    }

    return violations;
  }

  private validateSafety(prompt: CompiledPrompt): Violation[] {
    const violations: Violation[] = [];
    const fullPrompt = `${prompt.systemPrompt} ${prompt.userPrompt}`;

    // Check for harmful content patterns
    for (const pattern of this.safetyPatterns) {
      if (pattern.test(fullPrompt)) {
        violations.push({
          type: 'SAFETY',
          severity: 'HIGH',
          message: 'Prompt contains potentially harmful content',
          suggestion: 'Remove or rephrase harmful content'
        });
        break; // Only report one safety violation to avoid spam
      }
    }

    // Check for excessive complexity that might confuse AI
    if (prompt.metadata.complexityScore > 0.9) {
      violations.push({
        type: 'SAFETY',
        severity: 'MEDIUM',
        message: 'Prompt complexity is very high and may lead to unpredictable results',
        suggestion: 'Simplify prompt structure and instructions'
      });
    }

    // Check for conflicting instructions
    if (this.hasConflictingInstructions(prompt)) {
      violations.push({
        type: 'SAFETY',
        severity: 'MEDIUM',
        message: 'Prompt contains conflicting instructions',
        suggestion: 'Resolve contradictory requirements'
      });
    }

    return violations;
  }

  private validateQuality(prompt: CompiledPrompt): Violation[] {
    const violations: Violation[] = [];

    // Check enhancement ratio
    if (prompt.metadata.enhancementRatio < VALIDATION_LIMITS.OUTPUT.MIN_ENHANCEMENT_RATIO) {
      violations.push({
        type: 'QUALITY',
        severity: 'MEDIUM',
        message: `Enhancement ratio (${prompt.metadata.enhancementRatio.toFixed(2)}) below minimum (${VALIDATION_LIMITS.OUTPUT.MIN_ENHANCEMENT_RATIO})`,
        suggestion: 'Add more domain-specific context and details'
      });
    }

    // Check domain confidence
    if (prompt.metadata.domainConfidence < 0.7) {
      violations.push({
        type: 'QUALITY',
        severity: 'LOW',
        message: 'Domain confidence is low',
        suggestion: 'Add more domain-specific terminology and context'
      });
    }

    // Check for vague language
    if (this.hasVagueLanguage(prompt)) {
      violations.push({
        type: 'QUALITY',
        severity: 'LOW',
        message: 'Prompt contains vague or unclear language',
        suggestion: 'Use more specific and precise language'
      });
    }

    // Check for missing actionable elements
    if (!this.hasActionableElements(prompt)) {
      violations.push({
        type: 'QUALITY',
        severity: 'MEDIUM',
        message: 'Prompt lacks actionable elements',
        suggestion: 'Add specific requests for actionable recommendations'
      });
    }

    return violations;
  }

  private calculateSafetyScore(violations: Violation[]): number {
    const safetyViolations = violations.filter(v => v.type === 'SAFETY');
    let score = 1.0;

    safetyViolations.forEach(violation => {
      switch (violation.severity) {
        case 'HIGH':
          score -= 0.5;
          break;
        case 'MEDIUM':
          score -= 0.2;
          break;
        case 'LOW':
          score -= 0.1;
          break;
      }
    });

    return Math.max(0, score);
  }

  private calculateQualityScore(prompt: CompiledPrompt, violations: Violation[]): number {
    let score = 0.8; // Base score

    // Add points for good metrics
    score += Math.min(prompt.metadata.enhancementRatio / 10, 0.1);
    score += Math.min(prompt.metadata.domainConfidence * 0.1, 0.1);

    // Subtract points for violations
    const qualityViolations = violations.filter(v => v.type === 'QUALITY');
    qualityViolations.forEach(violation => {
      switch (violation.severity) {
        case 'HIGH':
          score -= 0.3;
          break;
        case 'MEDIUM':
          score -= 0.15;
          break;
        case 'LOW':
          score -= 0.05;
          break;
      }
    });

    return Math.max(0, Math.min(1, score));
  }

  private generateSuggestions(violations: Violation[], prompt: CompiledPrompt): string[] {
    const suggestions: string[] = [];

    // Add violation-specific suggestions
    violations.forEach(violation => {
      if (violation.suggestion && !suggestions.includes(violation.suggestion)) {
        suggestions.push(violation.suggestion);
      }
    });

    // Add general improvement suggestions
    if (prompt.metadata.totalTokens > VALIDATION_LIMITS.INPUT.MAX_TOKENS * 0.8) {
      suggestions.push('Consider reducing prompt length for better performance');
    }

    if (prompt.fewShotExamples.length === 0) {
      suggestions.push('Adding few-shot examples could improve output quality');
    }

    if (prompt.metadata.complexityScore < 0.3) {
      suggestions.push('Consider adding more detailed instructions for better results');
    }

    return suggestions.slice(0, 5); // Limit to top 5 suggestions
  }

  private async applyConstraint(prompt: CompiledPrompt, constraint: Constraint): Promise<CompiledPrompt> {
    const updatedPrompt = { ...prompt };

    switch (constraint.type) {
      case 'LENGTH':
        if (typeof constraint.value === 'number') {
          updatedPrompt.userPrompt = this.truncateToLength(updatedPrompt.userPrompt, constraint.value);
        }
        break;

      case 'TONE':
        updatedPrompt.systemPrompt = this.adjustTone(updatedPrompt.systemPrompt, constraint.value as string);
        break;

      case 'FORMAT':
        updatedPrompt.systemPrompt = this.enforceFormat(updatedPrompt.systemPrompt, constraint.value as string);
        break;

      case 'CONTENT':
        updatedPrompt.userPrompt = this.filterContent(updatedPrompt.userPrompt, constraint.value as string);
        break;
    }

    return updatedPrompt;
  }

  private async applyAutomaticCorrections(prompt: CompiledPrompt, violations: Violation[]): Promise<CompiledPrompt> {
    let correctedPrompt = { ...prompt };

    for (const violation of violations) {
      switch (violation.type) {
        case 'LENGTH':
          if (violation.severity === 'HIGH') {
            correctedPrompt = this.correctLength(correctedPrompt);
          }
          break;

        case 'SAFETY':
          if (violation.severity === 'HIGH') {
            correctedPrompt = this.correctSafety(correctedPrompt);
          }
          break;

        case 'FORMAT':
          correctedPrompt = this.correctFormat(correctedPrompt);
          break;
      }
    }

    return correctedPrompt;
  }

  // Helper methods for validation checks
  private checkFormatCompliance(prompt: CompiledPrompt, format: string): boolean {
    const fullPrompt = `${prompt.systemPrompt} ${prompt.userPrompt}`;
    
    switch (format.toLowerCase()) {
      case 'list':
        return /(\d+\.|•|-|\*)\s/.test(fullPrompt);
      case 'paragraph':
        return fullPrompt.includes('\n\n') || fullPrompt.length > 200;
      case 'structured':
        return /\n(#{1,6}|\d+\.|\*\*|__)/m.test(fullPrompt);
      default:
        return true;
    }
  }

  private hasProperStructure(prompt: CompiledPrompt): boolean {
    const systemPrompt = prompt.systemPrompt;
    return systemPrompt.includes('Guidelines:') || 
           systemPrompt.includes('Requirements:') || 
           systemPrompt.includes('Instructions:');
  }

  private hasConflictingInstructions(prompt: CompiledPrompt): boolean {
    const fullPrompt = `${prompt.systemPrompt} ${prompt.userPrompt}`.toLowerCase();
    
    const conflicts = [
      ['formal', 'casual'],
      ['brief', 'detailed'],
      ['simple', 'complex'],
      ['technical', 'non-technical']
    ];

    return conflicts.some(([term1, term2]) => 
      fullPrompt.includes(term1) && fullPrompt.includes(term2)
    );
  }

  private hasVagueLanguage(prompt: CompiledPrompt): boolean {
    const vaguePhrases = ['somehow', 'maybe', 'perhaps', 'kind of', 'sort of', 'thing', 'stuff'];
    const fullPrompt = `${prompt.systemPrompt} ${prompt.userPrompt}`.toLowerCase();
    
    return vaguePhrases.some(phrase => fullPrompt.includes(phrase));
  }

  private hasActionableElements(prompt: CompiledPrompt): boolean {
    const actionWords = ['create', 'implement', 'develop', 'design', 'build', 'write', 'generate', 'provide', 'include'];
    const fullPrompt = `${prompt.systemPrompt} ${prompt.userPrompt}`.toLowerCase();
    
    return actionWords.some(word => fullPrompt.includes(word));
  }

  // Helper methods for corrections
  private truncateToLength(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  private adjustTone(text: string, tone: string): string {
    // Simple tone adjustment - in a real implementation, this would be more sophisticated
    if (tone === 'formal' && text.includes('you')) {
      return text.replace(/\byou\b/g, 'one');
    }
    return text;
  }

  private enforceFormat(text: string, format: string): string {
    if (format === 'structured' && !text.includes('\n\n')) {
      return text.replace(/\. /g, '.\n\n');
    }
    return text;
  }

  private filterContent(text: string, contentType: string): string {
    // Remove potentially harmful content
    let filtered = text;
    this.safetyPatterns.forEach(pattern => {
      filtered = filtered.replace(pattern, '[FILTERED]');
    });
    return filtered;
  }

  private correctLength(prompt: CompiledPrompt): CompiledPrompt {
    const corrected = { ...prompt };
    
    // Reduce few-shot examples first
    if (corrected.fewShotExamples.length > 2) {
      corrected.fewShotExamples = corrected.fewShotExamples.slice(0, 2);
    }
    
    // Truncate system prompt if still too long
    if (corrected.systemPrompt.length > 3000) {
      corrected.systemPrompt = corrected.systemPrompt.substring(0, 3000) + '...';
    }
    
    return corrected;
  }

  private correctSafety(prompt: CompiledPrompt): CompiledPrompt {
    const corrected = { ...prompt };
    
    // Filter harmful content
    corrected.systemPrompt = this.filterContent(corrected.systemPrompt, 'safety');
    corrected.userPrompt = this.filterContent(corrected.userPrompt, 'safety');
    
    return corrected;
  }

  private correctFormat(prompt: CompiledPrompt): CompiledPrompt {
    const corrected = { ...prompt };
    
    // Add basic structure if missing
    if (!this.hasProperStructure(corrected)) {
      corrected.systemPrompt = `Instructions:\n${corrected.systemPrompt}`;
    }
    
    return corrected;
  }
}