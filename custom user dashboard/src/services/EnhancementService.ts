import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'
import { CreditService } from './CreditService'

export interface EnhanceRequest {
  prompt: string
  userId: string
  mode?: 'ideate' | 'flow' | 'auto'
  options?: EnhanceOptions
}

export interface EnhanceOptions {
  maxTokens?: number
  domain?: string
  includeExamples?: boolean
  temperature?: number
}

export interface EnhancementResult {
  success: boolean
  enhancedText?: string
  enhancedJson?: any
  whySummary?: string
  qualityScore?: number
  metadata?: EnhancementMetadata
  error?: EnhancementError
}

export interface EnhancementMetadata {
  processingTime: number
  enhancementRatio: number
  domainConfidence: number
  totalTokens: number
  domain?: string
  techniques?: string[]
}

export interface EnhancementError {
  code: string
  message: string
  details?: any
}

export interface CreditValidation {
  hasCredits: boolean
  currentBalance: number
  required: number
  error?: string
}

export class EnhancementService {
  private supabase: SupabaseClient<Database>
  private creditService: CreditService

  constructor(supabase: SupabaseClient<Database>, creditService: CreditService) {
    this.supabase = supabase
    this.creditService = creditService
  }

  /**
   * Validate user has sufficient credits for enhancement
   */
  async validateCredits(userId: string, required: number = 1): Promise<CreditValidation> {
    try {
      // Check and refresh credits first (lazy refresh)
      await this.creditService.checkAndRefreshCredits(userId)
      
      // Get current balance
      const credits = await this.creditService.getUserCredits(userId)
      
      return {
        hasCredits: credits.balance >= required,
        currentBalance: credits.balance,
        required
      }
    } catch (error) {
      console.error('Credit validation failed:', error)
      return {
        hasCredits: false,
        currentBalance: 0,
        required,
        error: error instanceof Error ? error.message : 'Credit validation failed'
      }
    }
  }

  /**
   * Process prompt enhancement with full workflow
   */
  async processEnhancement(prompt: string, userId: string, options?: EnhanceOptions): Promise<EnhancementResult> {
    const startTime = Date.now()

    try {
      // Step 1: Validate input
      if (!prompt || prompt.trim().length === 0) {
        return {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Prompt cannot be empty'
          }
        }
      }

      if (prompt.length > 2000) {
        return {
          success: false,
          error: {
            code: 'PROMPT_TOO_LONG',
            message: 'Prompt exceeds maximum length of 2000 characters'
          }
        }
      }

      // Step 2: Validate credits
      const creditValidation = await this.validateCredits(userId, 1)
      if (!creditValidation.hasCredits) {
        return {
          success: false,
          error: {
            code: 'INSUFFICIENT_CREDITS',
            message: 'Insufficient credits for enhancement',
            details: {
              required: creditValidation.required,
              available: creditValidation.currentBalance
            }
          }
        }
      }

      // Step 3: Deduct credit before processing
      const deductResult = await this.creditService.deductCredits(userId, 1, 'prompt_enhancement')
      if (!deductResult.success) {
        return {
          success: false,
          error: {
            code: 'CREDIT_DEDUCTION_FAILED',
            message: deductResult.error || 'Failed to deduct credits'
          }
        }
      }

      // Step 4: Call enhancement function
      const enhancementResult = await this.callEnhancementFunction(prompt, userId, options)

      // Step 5: Handle result
      if (!enhancementResult.success) {
        // Refund credit on failure
        await this.creditService.addCredits(userId, 1, 'refund_failed_enhancement')
        return enhancementResult
      }

      // Step 6: Store successful enhancement
      await this.storeEnhancement(userId, prompt, enhancementResult, Date.now() - startTime)

      return enhancementResult

    } catch (error) {
      console.error('Enhancement processing failed:', error)
      
      // Attempt to refund credit on unexpected error
      try {
        await this.creditService.addCredits(userId, 1, 'refund_processing_error')
      } catch (refundError) {
        console.error('Failed to refund credit after error:', refundError)
      }

      return {
        success: false,
        error: {
          code: 'PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Enhancement processing failed',
          details: { processingTime: Date.now() - startTime }
        }
      }
    }
  }

  /**
   * Enhanced prompt with comprehensive workflow (main public method)
   */
  async enhancePrompt(request: EnhanceRequest): Promise<EnhancementResult> {
    return this.processEnhancement(request.prompt, request.userId, request.options)
  }

  /**
   * Call the backend-brain-enhance Edge Function
   */
  private async callEnhancementFunction(prompt: string, userId: string, options?: EnhanceOptions): Promise<EnhancementResult> {
    try {
      const { data, error } = await this.supabase.functions.invoke('backend-brain-enhance', {
        body: {
          prompt: prompt.trim(),
          userId,
          options: {
            mode: options?.mode || 'auto',
            includeExamples: options?.includeExamples !== false,
            maxTokens: options?.maxTokens || 1536,
            domain: options?.domain,
            temperature: options?.temperature
          }
        }
      })

      if (error) {
        console.error('Edge function error:', error)
        return {
          success: false,
          error: {
            code: 'FUNCTION_ERROR',
            message: error.message || 'Enhancement function failed'
          }
        }
      }

      if (!data) {
        return {
          success: false,
          error: {
            code: 'NO_RESPONSE',
            message: 'No response from enhancement service'
          }
        }
      }

      // Handle Edge Function response format
      if (!data.success) {
        return {
          success: false,
          error: {
            code: data.error?.code || 'ENHANCEMENT_FAILED',
            message: data.error?.message || 'Enhancement failed',
            details: data.error?.details
          }
        }
      }

      // Extract enhanced content
      const enhancedText = data.data?.enhancedText
      if (!enhancedText) {
        return {
          success: false,
          error: {
            code: 'INVALID_RESPONSE',
            message: 'Invalid response format from enhancement service'
          }
        }
      }

      return {
        success: true,
        enhancedText,
        enhancedJson: data.data?.enhancedJson,
        whySummary: data.data?.whySummary,
        qualityScore: data.data?.qualityScore || 0.85,
        metadata: {
          processingTime: data.data?.metadata?.processingTime || 0,
          enhancementRatio: data.data?.metadata?.enhancementRatio || 1,
          domainConfidence: data.data?.metadata?.domainConfidence || 0.8,
          totalTokens: data.data?.metadata?.totalTokens || 0,
          domain: data.data?.enhancedJson?.metadata?.domain,
          techniques: data.data?.enhancedJson?.metadata?.techniques
        }
      }

    } catch (error) {
      console.error('Enhancement function call failed:', error)
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error during enhancement'
        }
      }
    }
  }

  /**
   * Store successful enhancement in database
   */
  private async storeEnhancement(userId: string, originalPrompt: string, result: EnhancementResult, processingTime: number): Promise<void> {
    try {
      if (!result.enhancedText) return

      await this.supabase.from('enhanced_prompts').insert({
        user_id: userId,
        raw_text: originalPrompt,
        enhanced_text: result.enhancedText,
        enhanced_json: result.enhancedJson || {},
        domain: result.metadata?.domain || 'general',
        techniques: result.metadata?.techniques || [],
        provenance: {
          originalInput: originalPrompt,
          enhancementSteps: ['input_analysis', 'domain_translation', 'prompt_compilation'],
          sourceTechniques: result.metadata?.techniques || [],
          domainSources: [result.metadata?.domain || 'general'],
          confidenceScores: { overall: result.qualityScore || 0.85 }
        },
        quality_score: result.qualityScore || 0.85,
        enhancement_ratio: result.metadata?.enhancementRatio || 1,
        processing_time_ms: processingTime
      })

      console.log('Enhancement stored successfully')
    } catch (error) {
      console.error('Failed to store enhancement:', error)
      // Don't throw error as this is not critical for user experience
    }
  }

  /**
   * Get user's enhancement history
   */
  async getEnhancementHistory(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('enhanced_prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Failed to fetch enhancement history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching enhancement history:', error)
      return []
    }
  }

  /**
   * Get enhancement statistics for user
   */
  async getEnhancementStats(userId: string): Promise<{
    totalEnhancements: number
    averageQuality: number
    averageRatio: number
    favoritesDomains: string[]
  }> {
    try {
      const { data, error } = await this.supabase
        .from('enhanced_prompts')
        .select('quality_score, enhancement_ratio, domain')
        .eq('user_id', userId)

      if (error || !data) {
        return {
          totalEnhancements: 0,
          averageQuality: 0,
          averageRatio: 0,
          favoritesDomains: []
        }
      }

      const totalEnhancements = data.length
      const averageQuality = data.reduce((sum, item) => sum + (item.quality_score || 0), 0) / totalEnhancements
      const averageRatio = data.reduce((sum, item) => sum + (item.enhancement_ratio || 0), 0) / totalEnhancements

      // Count domain frequency
      const domainCounts = data.reduce((acc, item) => {
        const domain = item.domain || 'general'
        acc[domain] = (acc[domain] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const favoritesDomains = Object.entries(domainCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([domain]) => domain)

      return {
        totalEnhancements,
        averageQuality: Math.round(averageQuality * 100) / 100,
        averageRatio: Math.round(averageRatio * 100) / 100,
        favoritesDomains
      }
    } catch (error) {
      console.error('Error fetching enhancement stats:', error)
      return {
        totalEnhancements: 0,
        averageQuality: 0,
        averageRatio: 0,
        favoritesDomains: []
      }
    }
  }
}

// Export singleton factory
let enhancementServiceInstance: EnhancementService | null = null

export function getEnhancementService(supabase: SupabaseClient<Database>, creditService: CreditService): EnhancementService {
  if (!enhancementServiceInstance) {
    enhancementServiceInstance = new EnhancementService(supabase, creditService)
  }
  return enhancementServiceInstance
}