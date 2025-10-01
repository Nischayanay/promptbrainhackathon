// Supabase Edge Function for Backend Brain Enhancement

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Import Backend Brain types and services
interface EnhancePromptRequest {
  prompt: string;
  userId?: string;
  options?: {
    maxTokens?: number;
    domain?: string;
    includeExamples?: boolean;
  };
}

interface EnhancePromptResponse {
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

// Simplified Backend Brain implementation for Edge Function
class EdgeBackendBrain {
  private supabase: any;
  private geminiApiKey: string;

  constructor() {
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    this.geminiApiKey = Deno.env.get('GEMINI_API_KEY') ?? '';
  }

  async enhancePrompt(request: EnhancePromptRequest): Promise<EnhancePromptResponse> {
    const startTime = Date.now();

    try {
      console.log(`Starting enhancement for prompt: "${request.prompt.substring(0, 50)}..."`);

      // Step 1: Validate input
      if (!request.prompt || request.prompt.trim().length === 0) {
        return {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Prompt cannot be empty'
          }
        };
      }

      // Step 2: Check user credits if userId provided
      if (request.userId) {
        const { data: credits, error: creditsError } = await this.supabase.rpc('get_user_credits', {
          user_uuid: request.userId
        });

        if (creditsError || credits < 1) {
          return {
            success: false,
            error: {
              code: 'INSUFFICIENT_CREDITS',
              message: 'Insufficient credits for enhancement',
              details: { required: 1, available: credits || 0 }
            }
          };
        }
      }

      // Step 3: Analyze input and detect domain
      const analysis = this.analyzeInput(request.prompt);
      console.log(`Analysis complete: domain=${analysis.domain}, confidence=${analysis.confidence}`);

      // Step 4: Build enhanced prompt
      const enhancedPrompt = this.buildEnhancedPrompt(request.prompt, analysis);
      console.log(`Enhanced prompt built: ${enhancedPrompt.length} characters`);

      // Step 5: Get few-shot examples from database
      const examples = await this.getFewShotExamples(analysis.domain);
      console.log(`Retrieved ${examples.length} examples`);

      // Step 6: Execute with Gemini API (optional)
      let geminiResult = null;
      if (this.geminiApiKey && request.options?.includeExamples !== false) {
        try {
          geminiResult = await this.executeWithGemini(enhancedPrompt, analysis.domain);
          console.log('Gemini execution completed');
        } catch (error) {
          console.warn('Gemini execution failed:', error);
        }
      }

      // Step 7: Format output
      const processingTime = Date.now() - startTime;
      const enhancementRatio = enhancedPrompt.length / request.prompt.length;
      
      const result: EnhancePromptResponse = {
        success: true,
        data: {
          enhancedText: this.formatEnhancedText(enhancedPrompt, examples, analysis),
          enhancedJson: {
            system: this.buildSystemPrompt(analysis),
            user: enhancedPrompt,
            examples: examples.slice(0, 3),
            metadata: {
              domain: analysis.domain,
              confidence: analysis.confidence,
              techniques: analysis.techniques
            }
          },
          whySummary: this.generateWhySummary(analysis, enhancementRatio, examples.length),
          qualityScore: this.calculateQualityScore(analysis, enhancementRatio),
          metadata: {
            processingTime,
            enhancementRatio,
            domainConfidence: analysis.confidence,
            totalTokens: Math.ceil(enhancedPrompt.length / 4)
          }
        }
      };

      // Step 8: Store result and deduct credits
      if (request.userId) {
        try {
          await this.storeEnhancement(request.userId, request.prompt, result.data!, processingTime);
          await this.deductCredits(request.userId, 1);
          console.log(`Credits deducted for user ${request.userId}`);
        } catch (error) {
          console.warn('Failed to store enhancement or deduct credits:', error);
        }
      }

      console.log(`Enhancement completed in ${processingTime}ms`);
      return result;

    } catch (error) {
      console.error('Enhancement failed:', error);
      return {
        success: false,
        error: {
          code: 'PROCESSING_ERROR',
          message: error.message || 'Enhancement processing failed',
          details: { processingTime: Date.now() - startTime }
        }
      };
    }
  }

  private analyzeInput(prompt: string): {
    domain: string;
    confidence: number;
    keywords: string[];
    techniques: string[];
  } {
    const promptLower = prompt.toLowerCase();
    
    // Simple domain detection
    const domainKeywords = {
      marketing: ['marketing', 'campaign', 'customer', 'sales', 'conversion', 'email', 'social media'],
      design: ['design', 'ui', 'ux', 'interface', 'visual', 'layout', 'color', 'typography'],
      coding: ['code', 'programming', 'function', 'api', 'database', 'javascript', 'python'],
      business: ['business', 'strategy', 'revenue', 'growth', 'market', 'competition'],
      creative: ['creative', 'story', 'writing', 'content', 'blog', 'article'],
      technical: ['technical', 'documentation', 'manual', 'guide', 'tutorial'],
      academic: ['research', 'study', 'analysis', 'paper', 'academic'],
      general: ['help', 'explain', 'describe', 'how to']
    };

    let bestDomain = 'general';
    let bestScore = 0;

    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      const score = keywords.reduce((count, keyword) => 
        count + (promptLower.includes(keyword) ? 1 : 0), 0
      );
      
      if (score > bestScore) {
        bestScore = score;
        bestDomain = domain;
      }
    }

    const confidence = Math.min(bestScore / 3, 1.0);
    const keywords = promptLower.split(/\s+/).filter(word => word.length > 3).slice(0, 10);
    
    return {
      domain: bestDomain,
      confidence: Math.max(confidence, 0.5),
      keywords,
      techniques: this.getTechniquesForDomain(bestDomain)
    };
  }

  private getTechniquesForDomain(domain: string): string[] {
    const techniques = {
      marketing: ['AIDA Framework', 'Customer Journey', 'Value Proposition'],
      design: ['Design Thinking', 'User-Centered Design', 'Visual Hierarchy'],
      coding: ['Clean Code', 'SOLID Principles', 'Test-Driven Development'],
      business: ['SWOT Analysis', 'Business Model Canvas', 'Strategic Planning'],
      creative: ['Storytelling', 'Creative Process', 'Ideation'],
      technical: ['Documentation Standards', 'Technical Writing', 'User Guides'],
      academic: ['Research Methodology', 'Academic Writing', 'Literature Review'],
      general: ['Problem Solving', 'Clear Communication', 'Structured Thinking']
    };

    return techniques[domain] || techniques.general;
  }

  private buildEnhancedPrompt(originalPrompt: string, analysis: any): string {
    let enhanced = originalPrompt;

    // Add domain-specific context
    enhanced += `\n\nDomain Context: Apply ${analysis.domain} expertise and best practices.`;
    
    // Add techniques
    if (analysis.techniques.length > 0) {
      enhanced += `\nTechniques to use: ${analysis.techniques.slice(0, 2).join(', ')}.`;
    }

    // Add quality requirements
    enhanced += `\nProvide expert-level, actionable recommendations with specific examples.`;
    enhanced += `\nStructure the response clearly and include relevant details.`;

    return enhanced;
  }

  private buildSystemPrompt(analysis: any): string {
    const roleMap = {
      marketing: 'Act as a senior marketing strategist with expertise in digital marketing and conversion optimization.',
      design: 'Act as a senior UX/UI designer with expertise in user-centered design and visual hierarchy.',
      coding: 'Act as a senior software engineer with expertise in clean code and system architecture.',
      business: 'Act as a business strategy consultant with expertise in operations and growth.',
      creative: 'Act as a creative director with expertise in storytelling and content creation.',
      technical: 'Act as a technical writer with expertise in documentation and clear communication.',
      academic: 'Act as a research scholar with expertise in methodology and scholarly communication.',
      general: 'Act as a knowledgeable expert who provides clear, helpful, and actionable guidance.'
    };

    let systemPrompt = roleMap[analysis.domain] || roleMap.general;
    systemPrompt += `\n\nUse professional terminology and provide comprehensive, expert-level responses.`;
    systemPrompt += `\nFocus on practical, actionable recommendations.`;

    return systemPrompt;
  }

  private async getFewShotExamples(domain: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .select('few_shots')
        .eq('domain', domain)
        .order('success_score', { ascending: false })
        .limit(3);

      if (error) {
        console.warn('Failed to get few-shot examples:', error);
        return [];
      }

      const examples = [];
      for (const template of data || []) {
        if (template.few_shots && Array.isArray(template.few_shots)) {
          examples.push(...template.few_shots);
        }
      }

      return examples.slice(0, 3);
    } catch (error) {
      console.warn('Error getting few-shot examples:', error);
      return [];
    }
  }

  private async executeWithGemini(prompt: string, domain: string): Promise<any> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.geminiApiKey}`;
    
    const request = {
      contents: [{
        parts: [{ text: prompt }],
        role: 'user'
      }],
      generationConfig: {
        temperature: domain === 'creative' ? 0.9 : domain === 'coding' ? 0.3 : 0.7,
        topP: 0.8,
        maxOutputTokens: 1536
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  private formatEnhancedText(prompt: string, examples: any[], analysis: any): string {
    let formatted = `# Enhanced Prompt\n\n`;
    formatted += `**Domain**: ${analysis.domain} (${(analysis.confidence * 100).toFixed(0)}% confidence)\n\n`;
    formatted += `## System Instructions\n\n${this.buildSystemPrompt(analysis)}\n\n`;
    formatted += `## Enhanced User Request\n\n${prompt}\n\n`;
    
    if (examples.length > 0) {
      formatted += `## Examples\n\n`;
      examples.slice(0, 2).forEach((example, index) => {
        if (example.input && example.output) {
          formatted += `### Example ${index + 1}\n`;
          formatted += `**Input**: ${example.input}\n`;
          formatted += `**Output**: ${example.output}\n\n`;
        }
      });
    }

    return formatted;
  }

  private generateWhySummary(analysis: any, enhancementRatio: number, exampleCount: number): string {
    const improvements = [
      `Applied ${analysis.domain} domain expertise to transform generic language into professional terminology`,
      `Enhanced with ${analysis.techniques.slice(0, 2).join(' and ')} methodologies`,
      `Achieved ${enhancementRatio.toFixed(1)}x enhancement ratio through detailed context and guidance`,
    ];

    if (exampleCount > 0) {
      improvements.push(`Included ${exampleCount} relevant examples to demonstrate expected quality`);
    }

    improvements.push(`Structured for optimal AI response generation with clear instructions and context`);

    let summary = 'This prompt was enhanced through the following improvements:\n\n';
    improvements.forEach((improvement, index) => {
      summary += `${index + 1}. ${improvement}\n`;
    });

    return summary;
  }

  private calculateQualityScore(analysis: any, enhancementRatio: number): number {
    let score = 0.7; // Base score
    score += analysis.confidence * 0.15; // Domain confidence
    score += Math.min((enhancementRatio - 1) / 5, 0.15); // Enhancement ratio
    return Math.min(1.0, score);
  }

  private async storeEnhancement(userId: string, originalPrompt: string, result: any, processingTime: number): Promise<void> {
    try {
      await this.supabase.from('enhanced_prompts').insert({
        user_id: userId,
        raw_text: originalPrompt,
        enhanced_text: result.enhancedText,
        enhanced_json: result.enhancedJson,
        domain: result.enhancedJson.metadata.domain,
        techniques: result.enhancedJson.metadata.techniques || [],
        provenance: {
          originalInput: originalPrompt,
          enhancementSteps: ['input_analysis', 'domain_translation', 'prompt_compilation'],
          sourceTechniques: result.enhancedJson.metadata.techniques || [],
          domainSources: [result.enhancedJson.metadata.domain],
          confidenceScores: { overall: result.qualityScore }
        },
        quality_score: result.qualityScore,
        enhancement_ratio: result.metadata.enhancementRatio,
        processing_time_ms: processingTime
      });
    } catch (error) {
      console.warn('Failed to store enhancement:', error);
    }
  }

  private async deductCredits(userId: string, amount: number): Promise<void> {
    try {
      await this.supabase.rpc('deduct_credits', {
        user_uuid: userId,
        amount_to_deduct: amount,
        description_text: 'Backend Brain prompt enhancement'
      });
    } catch (error) {
      console.warn('Failed to deduct credits:', error);
    }
  }
}

// Edge Function handler
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST method allowed' } }),
      { 
        status: 405, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }

  try {
    const body = await req.json();
    const { prompt, userId, options } = body;

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Prompt is required and must be a string' }
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    const backendBrain = new EdgeBackendBrain();
    const response = await backendBrain.enhancePrompt({ prompt, userId, options });

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
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
        } 
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
});