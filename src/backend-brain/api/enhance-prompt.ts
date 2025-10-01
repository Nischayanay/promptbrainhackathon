// Backend Brain API Endpoint

import { createBackendBrainService } from '../services/backend-brain-service';
import { ErrorHandler } from '../types/errors';

export interface EnhancePromptRequest {
  prompt: string;
  userId?: string;
  options?: {
    maxTokens?: number;
    domain?: string;
    includeExamples?: boolean;
  };
}

export interface EnhancePromptResponse {
  success: boolean;
  data?: {
    enhancedText: string;
    enhancedJson: any;
    whySummary: string;
    qualityScore: number;
    metadata: {
      processingTime: number;
      enhancementRatio: number;
      domainConfidence: number;
      totalTokens: number;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export async function enhancePrompt(request: EnhancePromptRequest): Promise<EnhancePromptResponse> {
  try {
    const backendBrain = createBackendBrainService();
    
    console.log(`Enhancing prompt for user: ${request.userId || 'anonymous'}`);
    console.log(`Input: "${request.prompt.substring(0, 100)}${request.prompt.length > 100 ? '...' : ''}"`);
    
    const result = await backendBrain.enhancePrompt(request.prompt, request.userId);
    
    console.log(`Enhancement completed successfully`);
    console.log(`Quality score: ${result.qualityScore.toFixed(2)}`);
    console.log(`Enhancement ratio: ${result.metadata.enhancementRatio.toFixed(2)}x`);
    
    return {
      success: true,
      data: {
        enhancedText: result.enhancedText,
        enhancedJson: result.enhancedJson,
        whySummary: result.whySummary,
        qualityScore: result.qualityScore,
        metadata: {
          processingTime: result.metadata.processingTime,
          enhancementRatio: result.metadata.enhancementRatio,
          domainConfidence: result.metadata.domainConfidence,
          totalTokens: result.metadata.totalTokens
        }
      }
    };
    
  } catch (error) {
    console.error('Enhancement failed:', error);
    
    const errorResponse = ErrorHandler.handle(error);
    
    return {
      success: false,
      error: {
        code: errorResponse.error.code,
        message: errorResponse.error.message,
        details: errorResponse.error.metadata
      }
    };
  }
}

// Express.js route handler (if using Express)
export function createEnhancePromptHandler() {
  return async (req: any, res: any) => {
    try {
      const { prompt, userId, options } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Prompt is required and must be a string'
          }
        });
      }
      
      const request: EnhancePromptRequest = {
        prompt,
        userId: userId || req.user?.id,
        options
      };
      
      const response = await enhancePrompt(request);
      
      if (response.success) {
        res.json(response);
      } else {
        const statusCode = response.error?.code === 'INSUFFICIENT_CREDITS' ? 402 : 
                          response.error?.code === 'INVALID_INPUT' ? 400 : 500;
        res.status(statusCode).json(response);
      }
      
    } catch (error) {
      console.error('API handler error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        }
      });
    }
  };
}

// Supabase Edge Function handler
export function createSupabaseHandler() {
  return async (req: Request): Promise<Response> => {
    try {
      if (req.method !== 'POST') {
        return new Response(
          JSON.stringify({
            success: false,
            error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST method allowed' }
          }),
          { status: 405, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      const body = await req.json();
      const { prompt, userId, options } = body;
      
      if (!prompt || typeof prompt !== 'string') {
        return new Response(
          JSON.stringify({
            success: false,
            error: { code: 'INVALID_INPUT', message: 'Prompt is required and must be a string' }
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      const request: EnhancePromptRequest = { prompt, userId, options };
      const response = await enhancePrompt(request);
      
      const statusCode = response.success ? 200 : 
                        response.error?.code === 'INSUFFICIENT_CREDITS' ? 402 :
                        response.error?.code === 'INVALID_INPUT' ? 400 : 500;
      
      return new Response(
        JSON.stringify(response),
        { 
          status: statusCode, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          } 
        }
      );
      
    } catch (error) {
      console.error('Supabase handler error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}