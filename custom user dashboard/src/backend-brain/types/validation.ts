// Backend Brain Validation Schemas and Utilities

import { Domain, ConstraintType, ViolationType, ViolationSeverity } from './index';
import { createError } from './errors';

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION_LIMITS = {
  INPUT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 10000,
    MAX_TOKENS: 2000,
  },
  OUTPUT: {
    MIN_QUALITY_SCORE: 0.7,
    MIN_ENHANCEMENT_RATIO: 2.0,
    MAX_PROCESSING_TIME: 1500, // 1.5 seconds
  },
  CONSTRAINTS: {
    MAX_VIOLATIONS: 5,
    SAFETY_THRESHOLD: 0.9,
  },
  CREDITS: {
    MIN_BALANCE: 1,
    COST_PER_ENHANCEMENT: 1,
  },
} as const;

export const SUPPORTED_DOMAINS: readonly Domain[] = [
  'marketing',
  'design', 
  'coding',
  'psychology',
  'business',
  'creative',
  'technical',
  'academic',
  'general',
] as const;

export const CONSTRAINT_TYPES: readonly ConstraintType[] = [
  'LENGTH',
  'FORMAT',
  'TONE',
  'STYLE',
  'CONTENT',
] as const;

export const VIOLATION_TYPES: readonly ViolationType[] = [
  'LENGTH',
  'FORMAT',
  'SAFETY',
  'QUALITY',
] as const;

export const VIOLATION_SEVERITIES: readonly ViolationSeverity[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
] as const;

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export interface ValidationSchema<T> {
  validate(value: T): ValidationResult<T>;
  sanitize?(value: T): T;
}

export interface ValidationResult<T> {
  isValid: boolean;
  value: T;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// ============================================================================
// INPUT VALIDATION SCHEMA
// ============================================================================

export class InputValidationSchema implements ValidationSchema<string> {
  validate(input: string): ValidationResult<string> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if input is empty
    if (!input || input.trim().length === 0) {
      errors.push({
        field: 'input',
        message: 'Input cannot be empty',
        code: 'EMPTY_INPUT',
        value: input,
      });
    }

    // Check input length
    if (input.length < VALIDATION_LIMITS.INPUT.MIN_LENGTH) {
      errors.push({
        field: 'input',
        message: `Input too short. Minimum ${VALIDATION_LIMITS.INPUT.MIN_LENGTH} characters`,
        code: 'INPUT_TOO_SHORT',
        value: input.length,
      });
    }

    if (input.length > VALIDATION_LIMITS.INPUT.MAX_LENGTH) {
      errors.push({
        field: 'input',
        message: `Input too long. Maximum ${VALIDATION_LIMITS.INPUT.MAX_LENGTH} characters`,
        code: 'INPUT_TOO_LONG',
        value: input.length,
      });
    }

    // Check for potentially harmful content
    if (this.containsHarmfulContent(input)) {
      errors.push({
        field: 'input',
        message: 'Input contains potentially harmful content',
        code: 'HARMFUL_CONTENT',
        value: input,
      });
    }

    // Check token count estimate
    const estimatedTokens = this.estimateTokenCount(input);
    if (estimatedTokens > VALIDATION_LIMITS.INPUT.MAX_TOKENS) {
      warnings.push({
        field: 'input',
        message: `Input may exceed token limit. Estimated ${estimatedTokens} tokens`,
        suggestion: 'Consider shortening the input for better performance',
      });
    }

    return {
      isValid: errors.length === 0,
      value: input.trim(),
      errors,
      warnings,
    };
  }

  sanitize(input: string): string {
    return input
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s\-.,!?;:()"']/g, '') // Remove special characters
      .substring(0, VALIDATION_LIMITS.INPUT.MAX_LENGTH);
  }

  private containsHarmfulContent(input: string): boolean {
    const harmfulPatterns = [
      /\b(hack|exploit|malware|virus)\b/i,
      /\b(illegal|criminal|fraud)\b/i,
      /\b(hate|violence|harm)\b/i,
      // Add more patterns as needed
    ];

    return harmfulPatterns.some(pattern => pattern.test(input));
  }

  private estimateTokenCount(input: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(input.length / 4);
  }
}

// ============================================================================
// DOMAIN VALIDATION SCHEMA
// ============================================================================

export class DomainValidationSchema implements ValidationSchema<Domain> {
  validate(domain: Domain): ValidationResult<Domain> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!SUPPORTED_DOMAINS.includes(domain)) {
      errors.push({
        field: 'domain',
        message: `Unsupported domain: ${domain}`,
        code: 'UNSUPPORTED_DOMAIN',
        value: domain,
      });
    }

    return {
      isValid: errors.length === 0,
      value: domain,
      errors,
      warnings,
    };
  }
}

// ============================================================================
// QUALITY VALIDATION SCHEMA
// ============================================================================

export class QualityValidationSchema implements ValidationSchema<number> {
  validate(score: number): ValidationResult<number> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (score < 0 || score > 1) {
      errors.push({
        field: 'qualityScore',
        message: 'Quality score must be between 0 and 1',
        code: 'INVALID_QUALITY_SCORE',
        value: score,
      });
    }

    if (score < VALIDATION_LIMITS.OUTPUT.MIN_QUALITY_SCORE) {
      warnings.push({
        field: 'qualityScore',
        message: `Quality score ${score} below recommended threshold ${VALIDATION_LIMITS.OUTPUT.MIN_QUALITY_SCORE}`,
        suggestion: 'Consider regenerating the prompt for better quality',
      });
    }

    return {
      isValid: errors.length === 0,
      value: score,
      errors,
      warnings,
    };
  }
}

// ============================================================================
// CREDIT VALIDATION SCHEMA
// ============================================================================

export class CreditValidationSchema implements ValidationSchema<number> {
  validate(credits: number): ValidationResult<number> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (credits < 0) {
      errors.push({
        field: 'credits',
        message: 'Credit balance cannot be negative',
        code: 'NEGATIVE_CREDITS',
        value: credits,
      });
    }

    if (credits < VALIDATION_LIMITS.CREDITS.MIN_BALANCE) {
      errors.push({
        field: 'credits',
        message: 'Insufficient credits for operation',
        code: 'INSUFFICIENT_CREDITS',
        value: credits,
      });
    }

    if (credits < 10) {
      warnings.push({
        field: 'credits',
        message: 'Low credit balance',
        suggestion: 'Consider purchasing more credits',
      });
    }

    return {
      isValid: errors.length === 0,
      value: credits,
      errors,
      warnings,
    };
  }
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export class ValidationUtils {
  private static inputSchema = new InputValidationSchema();
  private static domainSchema = new DomainValidationSchema();
  private static qualitySchema = new QualityValidationSchema();
  private static creditSchema = new CreditValidationSchema();

  static validateInput(input: string): void {
    const result = this.inputSchema.validate(input);
    if (!result.isValid) {
      const firstError = result.errors[0];
      throw createError.invalidInput(firstError.message, {
        field: firstError.field,
        code: firstError.code,
        value: firstError.value,
      });
    }
  }

  static validateDomain(domain: Domain): void {
    const result = this.domainSchema.validate(domain);
    if (!result.isValid) {
      const firstError = result.errors[0];
      throw createError.invalidInput(firstError.message, {
        field: firstError.field,
        code: firstError.code,
        value: firstError.value,
      });
    }
  }

  static validateQualityScore(score: number): void {
    const result = this.qualitySchema.validate(score);
    if (!result.isValid) {
      const firstError = result.errors[0];
      throw createError.qualityThresholdNotMet(score, VALIDATION_LIMITS.OUTPUT.MIN_QUALITY_SCORE);
    }
  }

  static validateCredits(credits: number, required: number = VALIDATION_LIMITS.CREDITS.COST_PER_ENHANCEMENT): void {
    const result = this.creditSchema.validate(credits);
    if (!result.isValid) {
      const firstError = result.errors[0];
      if (firstError.code === 'INSUFFICIENT_CREDITS') {
        throw createError.insufficientCredits(required, credits);
      }
      throw createError.invalidInput(firstError.message, {
        field: firstError.field,
        code: firstError.code,
        value: firstError.value,
      });
    }
  }

  static sanitizeInput(input: string): string {
    return this.inputSchema.sanitize(input);
  }

  static isValidDomain(domain: string): domain is Domain {
    return SUPPORTED_DOMAINS.includes(domain as Domain);
  }

  static isValidConstraintType(type: string): type is ConstraintType {
    return CONSTRAINT_TYPES.includes(type as ConstraintType);
  }

  static isValidViolationType(type: string): type is ViolationType {
    return VIOLATION_TYPES.includes(type as ViolationType);
  }

  static isValidViolationSeverity(severity: string): severity is ViolationSeverity {
    return VIOLATION_SEVERITIES.includes(severity as ViolationSeverity);
  }

  static calculateEnhancementRatio(originalLength: number, enhancedLength: number): number {
    if (originalLength === 0) return 0;
    return enhancedLength / originalLength;
  }

  static isEnhancementRatioValid(ratio: number): boolean {
    return ratio >= VALIDATION_LIMITS.OUTPUT.MIN_ENHANCEMENT_RATIO;
  }

  static isProcessingTimeValid(timeMs: number): boolean {
    return timeMs <= VALIDATION_LIMITS.OUTPUT.MAX_PROCESSING_TIME;
  }
}

// ============================================================================
// VALIDATION DECORATORS
// ============================================================================

export function validateInput(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (args.length > 0 && typeof args[0] === 'string') {
      ValidationUtils.validateInput(args[0]);
    }
    return method.apply(this, args);
  };
}

export function validateDomain(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (args.length > 0 && typeof args[0] === 'string') {
      ValidationUtils.validateDomain(args[0] as Domain);
    }
    return method.apply(this, args);
  };
}

export function validateCredits(requiredCredits: number = VALIDATION_LIMITS.CREDITS.COST_PER_ENHANCEMENT) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // Assume credits are passed as the last argument or available in context
      const credits = args[args.length - 1];
      if (typeof credits === 'number') {
        ValidationUtils.validateCredits(credits, requiredCredits);
      }
      return method.apply(this, args);
    };
  };
}