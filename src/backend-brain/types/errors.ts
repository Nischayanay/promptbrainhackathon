// Backend Brain Error Handling Types and Classes

import { BackendBrainError, ErrorCategory, ErrorSeverity, ApiResponse } from './index';

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  // Input Validation Errors
  INVALID_INPUT: 'INVALID_INPUT',
  EMPTY_INPUT: 'EMPTY_INPUT',
  INPUT_TOO_LONG: 'INPUT_TOO_LONG',
  UNSUPPORTED_CONTENT: 'UNSUPPORTED_CONTENT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Processing Errors
  DOMAIN_DETECTION_FAILED: 'DOMAIN_DETECTION_FAILED',
  CONTEXT_RETRIEVAL_FAILED: 'CONTEXT_RETRIEVAL_FAILED',
  TRANSLATION_FAILED: 'TRANSLATION_FAILED',
  COMPILATION_FAILED: 'COMPILATION_FAILED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  PROCESSING_TIMEOUT: 'PROCESSING_TIMEOUT',

  // External Service Errors
  GEMINI_API_ERROR: 'GEMINI_API_ERROR',
  EMBEDDING_SERVICE_ERROR: 'EMBEDDING_SERVICE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // Business Logic Errors
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  CONTENT_SAFETY_VIOLATION: 'CONTENT_SAFETY_VIOLATION',
  QUALITY_THRESHOLD_NOT_MET: 'QUALITY_THRESHOLD_NOT_MET',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class BackendBrainException extends Error implements BackendBrainError {
  public readonly code: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly retryable: boolean;
  public readonly metadata?: Record<string, any>;

  constructor(
    code: ErrorCode,
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity = 'MEDIUM',
    retryable: boolean = false,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'BackendBrainException';
    this.code = code;
    this.category = category;
    this.severity = severity;
    this.retryable = retryable;
    this.metadata = metadata;
  }

  toJSON(): BackendBrainError {
    return {
      code: this.code,
      message: this.message,
      category: this.category,
      severity: this.severity,
      retryable: this.retryable,
      metadata: this.metadata,
    };
  }
}

// ============================================================================
// SPECIFIC ERROR CLASSES
// ============================================================================

export class InputValidationError extends BackendBrainException {
  constructor(code: ErrorCode, message: string, metadata?: Record<string, any>) {
    super(code, message, 'INPUT', 'MEDIUM', false, metadata);
  }
}

export class ProcessingError extends BackendBrainException {
  constructor(code: ErrorCode, message: string, retryable: boolean = true, metadata?: Record<string, any>) {
    super(code, message, 'PROCESSING', 'HIGH', retryable, metadata);
  }
}

export class ExternalServiceError extends BackendBrainException {
  constructor(code: ErrorCode, message: string, metadata?: Record<string, any>) {
    super(code, message, 'EXTERNAL', 'HIGH', true, metadata);
  }
}

export class BusinessLogicError extends BackendBrainException {
  constructor(code: ErrorCode, message: string, metadata?: Record<string, any>) {
    super(code, message, 'BUSINESS', 'MEDIUM', false, metadata);
  }
}

// ============================================================================
// ERROR HANDLER CLASS
// ============================================================================

export class ErrorHandler {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff

  static handle(error: unknown): ApiResponse {
    const timestamp = new Date();
    const requestId = this.generateRequestId();

    // Handle BackendBrainException
    if (error instanceof BackendBrainException) {
      this.logError(error, requestId);
      return {
        success: false,
        error: error.toJSON(),
        timestamp,
        requestId,
      };
    }

    // Handle generic errors
    if (error instanceof Error) {
      const backendBrainError = new BackendBrainException(
        ERROR_CODES.PROCESSING_TIMEOUT,
        error.message,
        'PROCESSING',
        'HIGH',
        false,
        { originalError: error.name }
      );

      this.logError(backendBrainError, requestId);
      return {
        success: false,
        error: backendBrainError.toJSON(),
        timestamp,
        requestId,
      };
    }

    // Handle unknown errors
    const unknownError = new BackendBrainException(
      ERROR_CODES.PROCESSING_TIMEOUT,
      'An unknown error occurred',
      'PROCESSING',
      'CRITICAL',
      false,
      { originalError: String(error) }
    );

    this.logError(unknownError, requestId);
    return {
      success: false,
      error: unknownError.toJSON(),
      timestamp,
      requestId,
    };
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.MAX_RETRIES,
    delays: number[] = this.RETRY_DELAYS
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry non-retryable errors
        if (error instanceof BackendBrainException && !error.retryable) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Wait before retry
        const delay = delays[attempt] || delays[delays.length - 1];
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  static createInputValidationError(message: string, metadata?: Record<string, any>): InputValidationError {
    return new InputValidationError(ERROR_CODES.INVALID_INPUT, message, metadata);
  }

  static createProcessingError(message: string, retryable: boolean = true, metadata?: Record<string, any>): ProcessingError {
    return new ProcessingError(ERROR_CODES.PROCESSING_TIMEOUT, message, retryable, metadata);
  }

  static createExternalServiceError(message: string, metadata?: Record<string, any>): ExternalServiceError {
    return new ExternalServiceError(ERROR_CODES.SERVICE_UNAVAILABLE, message, metadata);
  }

  static createBusinessLogicError(message: string, metadata?: Record<string, any>): BusinessLogicError {
    return new BusinessLogicError(ERROR_CODES.INSUFFICIENT_CREDITS, message, metadata);
  }

  private static logError(error: BackendBrainException, requestId: string): void {
    const logLevel = this.getLogLevel(error.severity);
    const logData = {
      requestId,
      code: error.code,
      message: error.message,
      category: error.category,
      severity: error.severity,
      retryable: error.retryable,
      metadata: error.metadata,
      timestamp: new Date().toISOString(),
    };

    // In a real implementation, this would use a proper logging service
    console[logLevel]('Backend Brain Error:', logData);
  }

  private static getLogLevel(severity: ErrorSeverity): 'error' | 'warn' | 'info' {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warn';
      case 'LOW':
        return 'info';
      default:
        return 'error';
    }
  }

  private static generateRequestId(): string {
    return `bb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// ERROR FACTORY FUNCTIONS
// ============================================================================

export const createError = {
  invalidInput: (message: string, metadata?: Record<string, any>) =>
    new InputValidationError(ERROR_CODES.INVALID_INPUT, message, metadata),

  emptyInput: (metadata?: Record<string, any>) =>
    new InputValidationError(ERROR_CODES.EMPTY_INPUT, 'Input cannot be empty', metadata),

  inputTooLong: (maxLength: number, actualLength: number) =>
    new InputValidationError(
      ERROR_CODES.INPUT_TOO_LONG,
      `Input too long. Maximum ${maxLength} characters, got ${actualLength}`,
      { maxLength, actualLength }
    ),

  rateLimitExceeded: (limit: number, window: string) =>
    new InputValidationError(
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      `Rate limit exceeded. Maximum ${limit} requests per ${window}`,
      { limit, window }
    ),

  domainDetectionFailed: (input: string) =>
    new ProcessingError(
      ERROR_CODES.DOMAIN_DETECTION_FAILED,
      'Failed to detect domain from input',
      true,
      { input: input.substring(0, 100) }
    ),

  contextRetrievalFailed: (domain: string) =>
    new ProcessingError(
      ERROR_CODES.CONTEXT_RETRIEVAL_FAILED,
      `Failed to retrieve context for domain: ${domain}`,
      true,
      { domain }
    ),

  processingTimeout: (timeoutMs: number) =>
    new ProcessingError(
      ERROR_CODES.PROCESSING_TIMEOUT,
      `Processing timeout after ${timeoutMs}ms`,
      false,
      { timeoutMs }
    ),

  geminiApiError: (statusCode: number, message: string) =>
    new ExternalServiceError(
      ERROR_CODES.GEMINI_API_ERROR,
      `Gemini API error: ${message}`,
      { statusCode, service: 'gemini' }
    ),

  databaseError: (operation: string, error: string) =>
    new ExternalServiceError(
      ERROR_CODES.DATABASE_ERROR,
      `Database error during ${operation}: ${error}`,
      { operation, service: 'supabase' }
    ),

  insufficientCredits: (required: number, available: number) =>
    new BusinessLogicError(
      ERROR_CODES.INSUFFICIENT_CREDITS,
      `Insufficient credits. Required: ${required}, Available: ${available}`,
      { required, available }
    ),

  contentSafetyViolation: (violationType: string) =>
    new BusinessLogicError(
      ERROR_CODES.CONTENT_SAFETY_VIOLATION,
      `Content safety violation: ${violationType}`,
      { violationType }
    ),

  qualityThresholdNotMet: (score: number, threshold: number) =>
    new BusinessLogicError(
      ERROR_CODES.QUALITY_THRESHOLD_NOT_MET,
      `Quality score ${score} below threshold ${threshold}`,
      { score, threshold }
    ),
};