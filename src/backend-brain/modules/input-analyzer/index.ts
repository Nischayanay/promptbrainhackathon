// Input Analyzer Module Implementation

import { InputAnalyzer, AnalysisResult, Domain } from '../../types';
import { ValidationUtils } from '../../types/validation';
import { createError } from '../../types/errors';
import { NLPPipeline } from './nlp-pipeline';
import { DomainDetector } from './domain-detector';

export class InputAnalyzerImpl implements InputAnalyzer {
  private nlpPipeline: NLPPipeline;
  private domainDetector: DomainDetector;

  constructor() {
    this.nlpPipeline = new NLPPipeline();
    this.domainDetector = new DomainDetector();
  }

  async analyze(rawInput: string): Promise<AnalysisResult> {
    const startTime = Date.now();

    try {
      // Validate input
      ValidationUtils.validateInput(rawInput);
      const sanitizedInput = ValidationUtils.sanitizeInput(rawInput);

      // Tokenization
      const tokens = this.nlpPipeline.tokenize(sanitizedInput);

      // Entity extraction
      const entities = this.nlpPipeline.extractEntities(sanitizedInput);

      // Keyword extraction
      const keywords = this.nlpPipeline.extractKeywords(sanitizedInput);

      // Constraint detection
      const constraints = this.nlpPipeline.detectConstraints(sanitizedInput);

      // Context scoring
      const contextScore = this.nlpPipeline.calculateContextScore(sanitizedInput, entities, keywords);

      // Domain detection
      const domainResults = this.domainDetector.detectDomain(sanitizedInput, entities);
      const suggestedDomains = domainResults.map(result => result.domain);
      const confidence = domainResults[0]?.confidence || 0.5;

      const processingTime = Date.now() - startTime;

      // Ensure processing time is within limits (200ms requirement)
      if (processingTime > 200) {
        console.warn(`Input analysis took ${processingTime}ms, exceeding 200ms target`);
      }

      const result: AnalysisResult = {
        tokens,
        entities,
        keywords,
        constraints,
        contextScore,
        suggestedDomains,
        confidence
      };

      return result;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        throw createError.processingError(
          `Input analysis failed: ${error.message}`,
          true,
          { processingTime, originalError: error.message }
        );
      }
      
      throw createError.processingError(
        'Input analysis failed with unknown error',
        true,
        { processingTime }
      );
    }
  }

  // Additional utility methods
  async analyzeWithDomain(rawInput: string, expectedDomain: Domain): Promise<AnalysisResult & { domainMatch: boolean }> {
    const result = await this.analyze(rawInput);
    const domainMatch = result.suggestedDomains.includes(expectedDomain);
    
    return {
      ...result,
      domainMatch
    };
  }

  async quickAnalyze(rawInput: string): Promise<{ domain: Domain; confidence: number; keywords: string[] }> {
    const sanitizedInput = ValidationUtils.sanitizeInput(rawInput);
    const entities = this.nlpPipeline.extractEntities(sanitizedInput);
    const keywords = this.nlpPipeline.extractKeywords(sanitizedInput);
    const domainResults = this.domainDetector.detectDomain(sanitizedInput, entities);
    
    return {
      domain: domainResults[0]?.domain || 'general',
      confidence: domainResults[0]?.confidence || 0.5,
      keywords: keywords.slice(0, 5)
    };
  }
}

// Export the implementation
export { NLPPipeline } from './nlp-pipeline';
export { DomainDetector } from './domain-detector';