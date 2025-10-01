// Gemini API Integration Service

import { CompiledPrompt, Domain } from '../types';
import { createError, ErrorHandler } from '../types/errors';

export interface GeminiConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
}

export interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
    role: 'user' | 'model';
  }>;
  generationConfig: {
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
    stopSequences?: string[];
  };
  safetySettings: Array<{
    category: string;
    threshold: string;
  }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    index: number;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  promptFeedback?: {
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
}

export interface GeminiExecutionResult {
  text: string;
  json?: any;
  metadata: {
    model: string;
    tokensUsed: number;
    processingTime: number;
    finishReason: string;
    safetyRatings: any[];
  };
}

export class GeminiService {
  private config: GeminiConfig;
  private domainConfigs: Record<Domain, Partial<GeminiRequest['generationConfig']>>;

  constructor(config?: Partial<GeminiConfig>) {
    this.config = {
      apiKey: config?.apiKey || process.env.GEMINI_API_KEY || '',
      model: config?.model || 'gemini-1.5-pro',
      baseUrl: config?.baseUrl || 'https://generativelanguage.googleapis.com/v1beta',
      timeout: config?.timeout || 30000,
      maxRetries: config?.maxRetries || 3
    };

    if (!this.config.apiKey) {
      throw createError.invalidInput('Gemini API key is required');
    }

    this.domainConfigs = {
      marketing: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048
      },
      design: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1536
      },
      coding: {
        temperature: 0.3,
        topP: 0.7,
        topK: 20,
        maxOutputTokens: 2048
      },
      psychology: {
        temperature: 0.6,
        topP: 0.8,
        topK: 30,
        maxOutputTokens: 1536
      },
      business: {
        temperature: 0.5,
        topP: 0.8,
        topK: 30,
        maxOutputTokens: 1536
      },
      creative: {
        temperature: 0.9,
        topP: 0.95,
        topK: 50,
        maxOutputTokens: 2048
      },
      technical: {
        temperature: 0.4,
        topP: 0.7,
        topK: 25,
        maxOutputTokens: 2048
      },
      academic: {
        temperature: 0.5,
        topP: 0.8,
        topK: 30,
        maxOutputTokens: 2048
      },
      general: {
        temperature: 0.7,
        topP: 0.8,
        topK: 35,
        maxOutputTokens: 1536
      }
    };
  }

  async executePrompt(prompt: CompiledPrompt, domain: Domain = 'general'): Promise<GeminiExecutionResult> {
    const startTime = Date.now();

    try {
      // Build Gemini request
      const request = this.buildGeminiRequest(prompt, domain);
      
      // Execute with retry logic
      const response = await ErrorHandler.withRetry(
        () => this.makeApiCall(request),
        this.config.maxRetries
      );

      // Process response
      const result = this.processResponse(response, startTime);
      
      console.log(`Gemini execution completed in ${result.metadata.processingTime}ms`);
      return result;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        throw createError.geminiApiError(500, `Gemini API execution failed: ${error.message}`);
      }
      
      throw createError.geminiApiError(500, 'Unknown Gemini API error');
    }
  }

  async executeWithStreaming(
    prompt: CompiledPrompt, 
    domain: Domain = 'general',
    onChunk?: (chunk: string) => void
  ): Promise<GeminiExecutionResult> {
    const startTime = Date.now();

    try {
      const request = this.buildGeminiRequest(prompt, domain);
      
      // Add streaming configuration
      const streamingUrl = `${this.config.baseUrl}/models/${this.config.model}:streamGenerateContent?key=${this.config.apiKey}`;
      
      const response = await fetch(streamingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw createError.geminiApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
      }

      let fullText = '';
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                  const text = data.candidates[0].content.parts[0].text;
                  fullText += text;
                  onChunk?.(text);
                }
              } catch (parseError) {
                console.warn('Failed to parse streaming chunk:', parseError);
              }
            }
          }
        }
      }

      const processingTime = Date.now() - startTime;

      return {
        text: fullText,
        metadata: {
          model: this.config.model,
          tokensUsed: this.estimateTokenCount(fullText),
          processingTime,
          finishReason: 'STOP',
          safetyRatings: []
        }
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        throw createError.geminiApiError(500, `Streaming execution failed: ${error.message}`);
      }
      
      throw createError.geminiApiError(500, 'Unknown streaming error');
    }
  }

  private buildGeminiRequest(prompt: CompiledPrompt, domain: Domain): GeminiRequest {
    const domainConfig = this.domainConfigs[domain] || this.domainConfigs.general;
    
    // Build contents array
    const contents: GeminiRequest['contents'] = [];

    // Add few-shot examples
    prompt.fewShotExamples.forEach(example => {
      contents.push({
        parts: [{ text: example.input }],
        role: 'user'
      });
      contents.push({
        parts: [{ text: example.output }],
        role: 'model'
      });
    });

    // Add system prompt as user message (Gemini doesn't have system role)
    if (prompt.systemPrompt) {
      contents.push({
        parts: [{ text: `Instructions: ${prompt.systemPrompt}\n\nUser Request: ${prompt.userPrompt}` }],
        role: 'user'
      });
    } else {
      contents.push({
        parts: [{ text: prompt.userPrompt }],
        role: 'user'
      });
    }

    return {
      contents,
      generationConfig: {
        temperature: domainConfig.temperature || 0.7,
        topP: domainConfig.topP || 0.8,
        topK: domainConfig.topK || 35,
        maxOutputTokens: domainConfig.maxOutputTokens || 1536,
        stopSequences: []
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };
  }

  private async makeApiCall(request: GeminiRequest): Promise<GeminiResponse> {
    const url = `${this.config.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw createError.geminiApiError(response.status, `HTTP ${response.status}: ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw createError.geminiApiError(500, 'No candidates returned from Gemini API');
      }

      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw createError.geminiApiError(408, 'Request timeout');
      }
      
      throw error;
    }
  }

  private processResponse(response: GeminiResponse, startTime: number): GeminiExecutionResult {
    const candidate = response.candidates[0];
    
    if (!candidate?.content?.parts?.[0]?.text) {
      throw createError.geminiApiError(500, 'Invalid response format from Gemini API');
    }

    const text = candidate.content.parts[0].text;
    const processingTime = Date.now() - startTime;

    // Try to extract JSON if present
    let json: any = undefined;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        json = JSON.parse(jsonMatch[1]);
      }
    } catch (error) {
      // JSON parsing failed, continue without it
    }

    return {
      text,
      json,
      metadata: {
        model: this.config.model,
        tokensUsed: this.estimateTokenCount(text),
        processingTime,
        finishReason: candidate.finishReason || 'STOP',
        safetyRatings: candidate.safetyRatings || []
      }
    };
  }

  private estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  // Cost governance
  async checkTokenUsage(userId: string): Promise<{ used: number; limit: number; remaining: number }> {
    // This would integrate with your usage tracking system
    // For now, return mock data
    return {
      used: 0,
      limit: 10000,
      remaining: 10000
    };
  }

  // Configuration methods
  updateDomainConfig(domain: Domain, config: Partial<GeminiRequest['generationConfig']>): void {
    this.domainConfigs[domain] = { ...this.domainConfigs[domain], ...config };
  }

  getDomainConfig(domain: Domain): Partial<GeminiRequest['generationConfig']> {
    return this.domainConfigs[domain] || this.domainConfigs.general;
  }

  // Health check
  async healthCheck(): Promise<{ healthy: boolean; latency: number; model: string }> {
    const startTime = Date.now();
    
    try {
      const testRequest: GeminiRequest = {
        contents: [{
          parts: [{ text: 'Hello' }],
          role: 'user'
        }],
        generationConfig: {
          temperature: 0.1,
          topP: 0.1,
          topK: 1,
          maxOutputTokens: 10
        },
        safetySettings: []
      };

      await this.makeApiCall(testRequest);
      const latency = Date.now() - startTime;

      return {
        healthy: true,
        latency,
        model: this.config.model
      };

    } catch (error) {
      return {
        healthy: false,
        latency: Date.now() - startTime,
        model: this.config.model
      };
    }
  }
}

// Singleton instance
let geminiServiceInstance: GeminiService | null = null;

export function getGeminiService(config?: Partial<GeminiConfig>): GeminiService {
  if (!geminiServiceInstance) {
    geminiServiceInstance = new GeminiService(config);
  }
  return geminiServiceInstance;
}

export function setGeminiService(service: GeminiService): void {
  geminiServiceInstance = service;
}