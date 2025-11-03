// Backend Brain Main Entry Point

import { createBackendBrainService } from './services/backend-brain-service';

// Core Infrastructure
export * from './core';

// Module Implementations
export { InputAnalyzerImpl } from './modules/input-analyzer';
export { ContextArchitectImpl } from './modules/context-architect';
export { DomainTranslatorImpl } from './modules/domain-translator';
export { PromptCompilerImpl } from './modules/prompt-compiler';
export { ConstraintValidatorImpl } from './modules/constraint-validator';
export { FewShotOrchestratorImpl } from './modules/few-shot-orchestrator';
export { OutputFormatterImpl } from './modules/output-formatter';

// Main Service
export { BackendBrainServiceImpl, createBackendBrainService } from './services/backend-brain-service';

// Additional Services
export { GeminiService, getGeminiService } from './services/gemini-service';
export { CreditService, getCreditService } from './services/credit-service';
export { MonitoringService, getMonitoringService } from './services/monitoring-service';

// API and Components
export { enhancePrompt, createEnhancePromptHandler, createSupabaseHandler } from './api/enhance-prompt';

// Database
export { BackendBrainDatabase, getDatabase } from './database/client';

// Module Interfaces
export type {
  InputAnalyzer,
  ContextArchitect,
  DomainTranslator,
  PromptCompiler,
  ConstraintValidator,
  FewShotOrchestrator,
  OutputFormatter,
  BackendBrainService,
} from './types';

// API Types
export type { EnhancePromptRequest, EnhancePromptResponse } from './api/enhance-prompt';

// Version information
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

// Feature flags
export const FEATURES = {
  INPUT_ANALYZER: true,
  CONTEXT_ARCHITECT: true,
  DOMAIN_TRANSLATOR: true,
  PROMPT_COMPILER: true,
  CONSTRAINT_VALIDATOR: true,
  FEW_SHOT_ORCHESTRATOR: true,
  OUTPUT_FORMATTER: true,
  GEMINI_INTEGRATION: true,
  CREDIT_MANAGEMENT: true,
  LEARNING_SYSTEM: true,
  MONITORING: true,
} as const;

// Module status
export const MODULE_STATUS = {
  CORE_INFRASTRUCTURE: 'completed',
  INPUT_ANALYZER: 'completed',
  CONTEXT_ARCHITECT: 'completed',
  DOMAIN_TRANSLATOR: 'completed',
  PROMPT_COMPILER: 'completed',
  CONSTRAINT_VALIDATOR: 'completed',
  FEW_SHOT_ORCHESTRATOR: 'completed',
  OUTPUT_FORMATTER: 'completed',
  ORCHESTRATION: 'completed',
  API_ENDPOINTS: 'completed',
  DATABASE_SCHEMA: 'completed',
  GEMINI_INTEGRATION: 'completed',
  CREDIT_MANAGEMENT: 'completed',
  MONITORING: 'completed',
  SUPABASE_FUNCTIONS: 'completed',
} as const;

// Development utilities
export const DEV_UTILS = {
  getModuleStatus: () => MODULE_STATUS,
  getFeatures: () => FEATURES,
  getVersion: () => VERSION,
  getBuildDate: () => BUILD_DATE,
} as const;

// Quick start function
export async function quickStart(prompt: string, userId?: string) {
  const service = createBackendBrainService();
  return await service.enhancePrompt(prompt, userId);
}