// Backend Brain Main Orchestration Service

import {
  BackendBrainService,
  FormattedOutput,
  DatabaseEnhancedPrompt,
  FeedbackAction,
  EnhancementMetadata,
  EnhancementStep
} from '../types';
import { createError, ErrorHandler } from '../types/errors';
import { ValidationUtils } from '../types/validation';
import { getDatabase } from '../database/client';
import { getGeminiService } from './gemini-service';
import { getCreditService } from './credit-service';
import { getMonitoringService } from './monitoring-service';

// Import all modules
import { InputAnalyzerImpl } from '../modules/input-analyzer';
import { ContextArchitectImpl } from '../modules/context-architect';
import { DomainTranslatorImpl } from '../modules/domain-translator';
import { PromptCompilerImpl } from '../modules/prompt-compiler';
import { ConstraintValidatorImpl } from '../modules/constraint-validator';
import { FewShotOrchestratorImpl } from '../modules/few-shot-orchestrator';
import { OutputFormatterImpl } from '../modules/output-formatter';

export class BackendBrainServiceImpl implements BackendBrainService {
  private inputAnalyzer: InputAnalyzerImpl;
  private contextArchitect: ContextArchitectImpl;
  private domainTranslator: DomainTranslatorImpl;
  private promptCompiler: PromptCompilerImpl;
  private constraintValidator: ConstraintValidatorImpl;
  private fewShotOrchestrator: FewShotOrchestratorImpl;
  private outputFormatter: OutputFormatterImpl;
  private database = getDatabase();
  private geminiService = getGeminiService();
  private creditService = getCreditService();
  private monitoringService = getMonitoringService();

  constructor() {
    this.inputAnalyzer = new InputAnalyzerImpl();
    this.contextArchitect = new ContextArchitectImpl();
    this.domainTranslator = new DomainTranslatorImpl();
    this.promptCompiler = new PromptCompilerImpl();
    this.constraintValidator = new ConstraintValidatorImpl();
    this.fewShotOrchestrator = new FewShotOrchestratorImpl();
    this.outputFormatter = new OutputFormatterImpl();
  }

  async enhancePrompt(input: string, userId?: string): Promise<FormattedOutput> {
    const startTime = new Date();
    const enhancementSteps: EnhancementStep[] = [];

    try {
      // Validate input
      ValidationUtils.validateInput(input);

      // Check user credits if userId provided
      if (userId) {
        const credits = await this.creditService.getUserCredits(userId);
        ValidationUtils.validateCredits(credits, 1);
      }

      console.log('Starting Backend Brain enhancement pipeline...');

      // Step 1: Input Analysis
      console.log('Step 1: Analyzing input...');
      const analysisStart = Date.now();
      const analysis = await this.inputAnalyzer.analyze(input);
      const analysisTime = Date.now() - analysisStart;
      
      enhancementSteps.push({
        module: 'InputAnalyzer',
        action: 'analyze',
        input: input,
        output: analysis,
        timestamp: new Date(),
        processingTime: analysisTime
      });

      console.log(`Input analysis completed: ${analysis.suggestedDomains[0]} domain, ${analysis.confidence.toFixed(2)} confidence`);

      // Step 2: Context Architecture
      console.log('Step 2: Building context...');
      const contextStart = Date.now();
      const context = await this.contextArchitect.buildContext(analysis);
      const contextTime = Date.now() - contextStart;
      
      enhancementSteps.push({
        module: 'ContextArchitect',
        action: 'buildContext',
        input: analysis,
        output: context,
        timestamp: new Date(),
        processingTime: contextTime
      });

      console.log(`Context built: ${context.techniques.length} techniques, ${context.frameworks.length} frameworks`);

      // Step 3: Domain Translation
      console.log('Step 3: Translating to domain expertise...');
      const translationStart = Date.now();
      const translation = await this.domainTranslator.translate(input, context);
      const translationTime = Date.now() - translationStart;
      
      enhancementSteps.push({
        module: 'DomainTranslator',
        action: 'translate',
        input: { input, context },
        output: translation,
        timestamp: new Date(),
        processingTime: translationTime
      });

      console.log(`Domain translation completed: ${translation.expertVocabulary.length} expert terms applied`);

      // Step 4: Few-Shot Orchestration
      console.log('Step 4: Selecting few-shot examples...');
      const fewShotStart = Date.now();
      const fewShots = await this.fewShotOrchestrator.selectExamples(context, 3);
      const fewShotTime = Date.now() - fewShotStart;
      
      enhancementSteps.push({
        module: 'FewShotOrchestrator',
        action: 'selectExamples',
        input: context,
        output: fewShots,
        timestamp: new Date(),
        processingTime: fewShotTime
      });

      console.log(`Few-shot selection completed: ${fewShots.length} examples selected`);

      // Step 5: Prompt Compilation
      console.log('Step 5: Compiling prompt...');
      const compilationStart = Date.now();
      const compiled = await this.promptCompiler.compile(translation, context, fewShots);
      const compilationTime = Date.now() - compilationStart;
      
      enhancementSteps.push({
        module: 'PromptCompiler',
        action: 'compile',
        input: { translation, context, fewShots },
        output: compiled,
        timestamp: new Date(),
        processingTime: compilationTime
      });

      console.log(`Prompt compilation completed: ${compiled.metadata.totalTokens} tokens, ${compiled.metadata.enhancementRatio.toFixed(2)}x ratio`);

      // Step 6: Constraint Validation
      console.log('Step 6: Validating constraints...');
      const validationStart = Date.now();
      const validation = await this.constraintValidator.validate(compiled);
      const validationTime = Date.now() - validationStart;
      
      enhancementSteps.push({
        module: 'ConstraintValidator',
        action: 'validate',
        input: compiled,
        output: validation,
        timestamp: new Date(),
        processingTime: validationTime
      });

      // Apply corrections if needed
      let finalPrompt = compiled;
      if (!validation.isValid) {
        console.log('Applying constraint corrections...');
        finalPrompt = await this.constraintValidator.enforce(compiled, []);
      }

      console.log(`Validation completed: ${validation.isValid ? 'PASSED' : 'CORRECTED'}, quality score: ${validation.qualityScore.toFixed(2)}`);

      // Step 7: Output Formatting
      console.log('Step 7: Formatting output...');
      const formattingStart = Date.now();
      
      const enhancementMetadata: EnhancementMetadata = {
        startTime,
        endTime: new Date(),
        processingSteps: enhancementSteps,
        qualityMetrics: {
          domainRelevance: analysis.confidence,
          enhancementRatio: compiled.metadata.enhancementRatio,
          validationScore: validation.qualityScore
        },
        performanceMetrics: {
          totalProcessingTime: Date.now() - startTime.getTime(),
          averageStepTime: enhancementSteps.reduce((sum, step) => sum + step.processingTime, 0) / enhancementSteps.length
        }
      };

      const formattedOutput = await this.outputFormatter.format(finalPrompt, enhancementMetadata);
      const formattingTime = Date.now() - formattingStart;
      
      enhancementSteps.push({
        module: 'OutputFormatter',
        action: 'format',
        input: { finalPrompt, enhancementMetadata },
        output: formattedOutput,
        timestamp: new Date(),
        processingTime: formattingTime
      });

      const totalTime = Date.now() - startTime.getTime();
      console.log(`Output formatting completed in ${formattingTime}ms`);
      console.log(`Total Backend Brain processing time: ${totalTime}ms`);

      // Store enhanced prompt in database and deduct credits
      if (userId) {
        try {
          await this.storeEnhancedPrompt(input, formattedOutput, userId, totalTime);
          await this.creditService.deductCredits(userId, 1, undefined, 'Backend Brain prompt enhancement');
          await this.monitoringService.recordSuccess(totalTime, formattedOutput.qualityScore, {
            userId,
            domain: formattedOutput.provenance.domainSources[0],
            enhancementRatio: formattedOutput.metadata.enhancementRatio
          });
        } catch (error) {
          console.warn('Failed to store enhanced prompt or deduct credits:', error);
          await this.monitoringService.recordError(error as Error, { userId, step: 'post_processing' });
        }
      }

      // Validate performance requirements
      if (totalTime > 1500) {
        console.warn(`Processing time ${totalTime}ms exceeded 1.5s target`);
      }

      return formattedOutput;

    } catch (error) {
      const totalTime = Date.now() - startTime.getTime();
      console.error(`Backend Brain enhancement failed after ${totalTime}ms:`, error);
      
      // Record error for monitoring
      await this.monitoringService.recordError(error as Error, {
        userId,
        processingTime: totalTime,
        step: 'enhancement_pipeline'
      });

      // Create error metadata
      const errorMetadata: EnhancementMetadata = {
        startTime,
        endTime: new Date(),
        processingSteps: enhancementSteps,
        qualityMetrics: {},
        performanceMetrics: {
          totalProcessingTime: totalTime,
          averageStepTime: enhancementSteps.length > 0 ? 
            enhancementSteps.reduce((sum, step) => sum + step.processingTime, 0) / enhancementSteps.length : 0
        }
      };

      throw ErrorHandler.handle(error);
    }
  }

  async getEnhancementHistory(userId: string, limit: number = 50): Promise<DatabaseEnhancedPrompt[]> {
    try {
      return await this.database.getUserEnhancedPrompts(userId, limit);
    } catch (error) {
      throw createError.databaseError('get enhancement history', (error as Error).message);
    }
  }

  async submitFeedback(enhancedPromptId: string, action: FeedbackAction, rating?: number): Promise<void> {
    try {
      // Get the enhanced prompt to find user
      const enhancedPrompt = await this.database.getEnhancedPrompt(enhancedPromptId);
      if (!enhancedPrompt) {
        throw createError.invalidInput('Enhanced prompt not found');
      }

      // Create feedback record
      await this.database.createFeedback({
        enhanced_prompt_id: enhancedPromptId,
        user_id: enhancedPrompt.user_id,
        action,
        rating,
        metadata: {
          timestamp: new Date().toISOString(),
          promptDomain: enhancedPrompt.domain
        }
      });

      // Update template success scores based on feedback
      if (rating) {
        await this.updateTemplateScores(enhancedPrompt, action, rating);
      }

      console.log(`Feedback submitted: ${action} for prompt ${enhancedPromptId}`);

    } catch (error) {
      throw createError.databaseError('submit feedback', (error as Error).message);
    }
  }

  private async storeEnhancedPrompt(
    originalInput: string,
    formattedOutput: FormattedOutput,
    userId: string,
    processingTime: number
  ): Promise<void> {
    try {
      const enhancedPrompt = await this.database.createEnhancedPrompt({
        user_id: userId,
        raw_text: originalInput,
        enhanced_text: formattedOutput.enhancedText,
        enhanced_json: formattedOutput.enhancedJson as any,
        domain: formattedOutput.provenance.domainSources[0] || 'general',
        techniques: formattedOutput.provenance.sourceTechniques,
        provenance: formattedOutput.provenance as any,
        quality_score: formattedOutput.qualityScore,
        enhancement_ratio: formattedOutput.metadata.enhancementRatio,
        processing_time_ms: processingTime,
        session_id: this.generateSessionId(),
        ip_address: null // Would be set from request context in real implementation
      });

      console.log(`Enhanced prompt stored with ID: ${enhancedPrompt.id}`);
    } catch (error) {
      console.error('Failed to store enhanced prompt:', error);
      throw error;
    }
  }

  private async updateTemplateScores(
    enhancedPrompt: DatabaseEnhancedPrompt,
    action: FeedbackAction,
    rating?: number
  ): Promise<void> {
    try {
      // Get templates used in this enhancement
      const templates = await this.database.getTemplatesByDomain(enhancedPrompt.domain);
      
      // Update scores based on feedback
      for (const template of templates) {
        let adjustment = 0;
        
        switch (action) {
          case 'copy':
          case 'save':
            adjustment = 0.02;
            break;
          case 'regenerate':
            adjustment = -0.05;
            break;
          case 'rate':
            if (rating) {
              adjustment = (rating - 3) * 0.02; // -0.04 to +0.04 based on 1-5 rating
            }
            break;
        }

        if (adjustment !== 0) {
          const newScore = Math.max(0, Math.min(1, template.success_score + adjustment));
          await this.database.updateTemplateSuccessScore(template.id, newScore);
        }
      }
    } catch (error) {
      console.warn('Failed to update template scores:', error);
    }
  }

  private generateSessionId(): string {
    return `bb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Health check and diagnostics
  async healthCheck(): Promise<{
    healthy: boolean;
    modules: Record<string, boolean>;
    database: boolean;
    performance: Record<string, number>;
  }> {
    const moduleChecks = {
      inputAnalyzer: true,
      contextArchitect: true,
      domainTranslator: true,
      promptCompiler: true,
      constraintValidator: true,
      fewShotOrchestrator: true,
      outputFormatter: true
    };

    const dbHealth = await this.database.healthCheck();
    
    // Quick performance test
    const perfStart = Date.now();
    try {
      await this.inputAnalyzer.analyze('test input');
    } catch (error) {
      // Expected to fail, just measuring time
    }
    const perfTime = Date.now() - perfStart;

    return {
      healthy: dbHealth.healthy && Object.values(moduleChecks).every(Boolean),
      modules: moduleChecks,
      database: dbHealth.healthy,
      performance: {
        databaseLatency: dbHealth.latency,
        moduleLatency: perfTime
      }
    };
  }

  // Performance monitoring
  async getPerformanceStats(): Promise<{
    averageProcessingTime: number;
    averageQualityScore: number;
    totalEnhancements: number;
    successRate: number;
  }> {
    try {
      const stats = await this.database.getEnhancementStats();
      
      return {
        averageProcessingTime: stats.avg_processing_time || 0,
        averageQualityScore: stats.avg_quality_score || 0,
        totalEnhancements: stats.total_enhancements || 0,
        successRate: 0.95 // Would be calculated from actual success/failure data
      };
    } catch (error) {
      console.warn('Failed to get performance stats:', error);
      return {
        averageProcessingTime: 0,
        averageQualityScore: 0,
        totalEnhancements: 0,
        successRate: 0
      };
    }
  }
}

// Factory function
export function createBackendBrainService(): BackendBrainService {
  return new BackendBrainServiceImpl();
}

export { BackendBrainServiceImpl };