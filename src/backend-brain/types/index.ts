// Backend Brain Core Types and Interfaces

// ============================================================================
// DOMAIN TYPES
// ============================================================================

export type Domain = 
  | 'marketing' 
  | 'design' 
  | 'coding' 
  | 'psychology' 
  | 'business' 
  | 'creative' 
  | 'technical' 
  | 'academic' 
  | 'general';

export type EntityType = 'PERSON' | 'ORG' | 'LOCATION' | 'CONCEPT' | 'ACTION';

export type ConstraintType = 'LENGTH' | 'FORMAT' | 'TONE' | 'STYLE' | 'CONTENT';

export type ViolationType = 'LENGTH' | 'FORMAT' | 'SAFETY' | 'QUALITY';

export type ViolationSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export type ErrorCategory = 'INPUT' | 'PROCESSING' | 'EXTERNAL' | 'BUSINESS';

export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FeedbackAction = 'copy' | 'save' | 'regenerate' | 'rate';

export type TransactionType = 'debit' | 'credit' | 'refund';

export type ContentType = 'template' | 'example' | 'domain_knowledge';

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface Entity {
  text: string;
  type: EntityType;
  confidence: number;
}

export interface Constraint {
  type: ConstraintType;
  value: string | number;
  description: string;
}

export interface AnalysisResult {
  tokens: string[];
  entities: Entity[];
  keywords: string[];
  constraints: Constraint[];
  contextScore: number;
  suggestedDomains: Domain[];
  confidence: number;
}

export interface DomainKnowledge {
  domain: Domain;
  principles: string[];
  bestPractices: string[];
  commonPatterns: string[];
  expertVocabulary: string[];
}

export interface Technique {
  id: string;
  name: string;
  description: string;
  domain: Domain;
  applicability: string[];
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  domain: Domain;
  structure: string[];
  examples: string[];
}

export interface DomainVocabulary {
  domain: Domain;
  terms: Record<string, string>; // original -> enhanced
  phrases: Record<string, string>;
  concepts: string[];
}

export interface HistoricalExample {
  id: string;
  input: string;
  output: string;
  domain: Domain;
  successScore: number;
  usageCount: number;
  lastUsed: Date;
}

export interface ContextPackage {
  domainKnowledge: DomainKnowledge[];
  techniques: Technique[];
  frameworks: Framework[];
  vocabulary: DomainVocabulary;
  examples: HistoricalExample[];
}

export interface ToneAdjustment {
  original: string;
  enhanced: string;
  reasoning: string;
}

export interface StyleGuide {
  tone: string;
  voice: string;
  perspective: string;
  formality: string;
  guidelines: string[];
}

export interface TranslationResult {
  domainEnrichedPrompt: string;
  roleInstructions: string;
  toneAdjustments: ToneAdjustment[];
  styleGuide: StyleGuide;
  expertVocabulary: string[];
}

export interface FewShotExample {
  id: string;
  input: string;
  output: string;
  domain: Domain;
  successScore: number;
  usageCount: number;
  lastUsed: Date;
  embedding: number[];
}

export interface RankedExample extends FewShotExample {
  relevanceScore: number;
  reasoning: string;
}

export interface PromptConstraint {
  type: ConstraintType;
  value: string | number;
  enforced: boolean;
  description: string;
}

export interface CompilationMetadata {
  totalTokens: number;
  complexityScore: number;
  domainConfidence: number;
  enhancementRatio: number;
}

export interface CompiledPrompt {
  systemPrompt: string;
  userPrompt: string;
  fewShotExamples: FewShotExample[];
  constraints: PromptConstraint[];
  metadata: CompilationMetadata;
}

export interface Violation {
  type: ViolationType;
  severity: ViolationSeverity;
  message: string;
  suggestion: string;
}

export interface ValidationResult {
  isValid: boolean;
  violations: Violation[];
  qualityScore: number;
  safetyScore: number;
  suggestions: string[];
}

export interface EnhancementStep {
  module: string;
  action: string;
  input: any;
  output: any;
  timestamp: Date;
  processingTime: number;
}

export interface ProvenanceData {
  originalInput: string;
  enhancementSteps: EnhancementStep[];
  sourceTechniques: string[];
  domainSources: string[];
  confidenceScores: Record<string, number>;
}

export interface OutputMetadata {
  processingTime: number;
  totalTokens: number;
  enhancementRatio: number;
  qualityScore: number;
  domainConfidence: number;
  timestamp: Date;
}

export interface StructuredPrompt {
  system: string;
  user: string;
  examples: FewShotExample[];
  metadata: OutputMetadata;
  constraints: PromptConstraint[];
}

export interface FormattedOutput {
  enhancedText: string;
  enhancedJson: StructuredPrompt;
  whySummary: string;
  provenance: ProvenanceData;
  qualityScore: number;
  metadata: OutputMetadata;
}

export interface EnhancementMetadata {
  startTime: Date;
  endTime: Date;
  processingSteps: EnhancementStep[];
  qualityMetrics: Record<string, number>;
  performanceMetrics: Record<string, number>;
}

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

export interface BackendBrainError {
  code: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  retryable: boolean;
  metadata?: Record<string, any>;
}

export interface ErrorResponse {
  success: false;
  error: BackendBrainError;
  timestamp: Date;
  requestId?: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: Date;
  requestId?: string;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// ============================================================================
// MODULE INTERFACES
// ============================================================================

export interface InputAnalyzer {
  analyze(rawInput: string): Promise<AnalysisResult>;
}

export interface ContextArchitect {
  buildContext(analysis: AnalysisResult): Promise<ContextPackage>;
}

export interface DomainTranslator {
  translate(input: string, context: ContextPackage): Promise<TranslationResult>;
}

export interface PromptCompiler {
  compile(
    translation: TranslationResult, 
    context: ContextPackage, 
    fewShots: FewShotExample[]
  ): Promise<CompiledPrompt>;
}

export interface ConstraintValidator {
  validate(prompt: CompiledPrompt): Promise<ValidationResult>;
  enforce(prompt: CompiledPrompt, constraints: Constraint[]): Promise<CompiledPrompt>;
}

export interface FewShotOrchestrator {
  selectExamples(context: ContextPackage, maxExamples: number): Promise<FewShotExample[]>;
  rankExamples(examples: FewShotExample[], query: string): Promise<RankedExample[]>;
}

export interface OutputFormatter {
  format(prompt: CompiledPrompt, metadata: EnhancementMetadata): Promise<FormattedOutput>;
}

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface DatabaseUser {
  id: string;
  email: string;
  credit_balance: number;
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface DatabasePrompt {
  id: string;
  user_id: string;
  raw_text: string;
  timestamp: Date;
  session_id?: string;
  ip_address?: string;
}

export interface DatabaseEnhancedPrompt {
  id: string;
  prompt_id: string;
  enhanced_text: string;
  enhanced_json: Record<string, any>;
  domain: string;
  techniques: string[];
  provenance: Record<string, any>;
  quality_score: number;
  enhancement_ratio: number;
  processing_time_ms: number;
  created_at: Date;
}

export interface DatabaseTemplate {
  id: string;
  domain: string;
  technique: string;
  framework?: string;
  content: Record<string, any>;
  few_shots: Record<string, any>[];
  success_score: number;
  usage_count: number;
  last_used?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseFeedback {
  id: string;
  enhanced_prompt_id: string;
  user_id: string;
  action: FeedbackAction;
  rating?: number;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface DatabaseCreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: TransactionType;
  reference_id?: string;
  description?: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface DatabaseEmbedding {
  id: string;
  content_id: string;
  content_type: ContentType;
  embedding: number[];
  metadata: Record<string, any>;
  created_at: Date;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface BackendBrainConfig {
  performance: {
    maxProcessingTime: number;
    maxTokens: number;
    cacheTimeout: number;
  };
  quality: {
    minQualityScore: number;
    minEnhancementRatio: number;
    maxRetries: number;
  };
  domains: {
    defaultDomain: Domain;
    supportedDomains: Domain[];
    confidenceThreshold: number;
  };
  fewShot: {
    maxExamples: number;
    similarityThreshold: number;
    diversityWeight: number;
  };
  validation: {
    enableSafetyFilter: boolean;
    maxViolations: number;
    autoCorrect: boolean;
  };
}