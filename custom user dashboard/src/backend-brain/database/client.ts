// Database Client and Repository Implementation

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  DatabaseUser,
  DatabaseEnhancedPrompt,
  DatabaseTemplate,
  DatabaseFeedback,
  DatabaseCreditTransaction,
  DatabaseEmbedding,
  FeedbackAction,
  TransactionType,
  ContentType,
} from '../types';
import { createError } from '../types/errors';

// ============================================================================
// DATABASE CLIENT
// ============================================================================

export class BackendBrainDatabase {
  private supabase: SupabaseClient;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // ============================================================================
  // ENHANCED PROMPTS REPOSITORY
  // ============================================================================

  async createEnhancedPrompt(data: Omit<DatabaseEnhancedPrompt, 'id' | 'created_at'>): Promise<DatabaseEnhancedPrompt> {
    const { data: result, error } = await this.supabase
      .from('enhanced_prompts')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw createError.databaseError('create enhanced prompt', error.message);
    }

    return result;
  }

  async getEnhancedPrompt(id: string): Promise<DatabaseEnhancedPrompt | null> {
    const { data, error } = await this.supabase
      .from('enhanced_prompts')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw createError.databaseError('get enhanced prompt', error.message);
    }

    return data;
  }

  async getUserEnhancedPrompts(
    userId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<DatabaseEnhancedPrompt[]> {
    const { data, error } = await this.supabase
      .from('enhanced_prompts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw createError.databaseError('get user enhanced prompts', error.message);
    }

    return data || [];
  }

  async getEnhancedPromptsByDomain(
    domain: string, 
    limit: number = 20
  ): Promise<DatabaseEnhancedPrompt[]> {
    const { data, error } = await this.supabase
      .from('enhanced_prompts')
      .select('*')
      .eq('domain', domain)
      .order('quality_score', { ascending: false })
      .limit(limit);

    if (error) {
      throw createError.databaseError('get enhanced prompts by domain', error.message);
    }

    return data || [];
  }

  // ============================================================================
  // TEMPLATES REPOSITORY
  // ============================================================================

  async createTemplate(data: Omit<DatabaseTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseTemplate> {
    const { data: result, error } = await this.supabase
      .from('templates')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw createError.databaseError('create template', error.message);
    }

    return result;
  }

  async getTemplate(id: string): Promise<DatabaseTemplate | null> {
    const { data, error } = await this.supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw createError.databaseError('get template', error.message);
    }

    return data;
  }

  async getTemplatesByDomain(domain: string): Promise<DatabaseTemplate[]> {
    const { data, error } = await this.supabase
      .from('templates')
      .select('*')
      .eq('domain', domain)
      .order('success_score', { ascending: false });

    if (error) {
      throw createError.databaseError('get templates by domain', error.message);
    }

    return data || [];
  }

  async updateTemplateUsage(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('templates')
      .update({
        usage_count: this.supabase.sql`usage_count + 1`,
        last_used: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw createError.databaseError('update template usage', error.message);
    }
  }

  async updateTemplateSuccessScore(id: string, newScore: number): Promise<void> {
    const { error } = await this.supabase
      .from('templates')
      .update({ success_score: newScore })
      .eq('id', id);

    if (error) {
      throw createError.databaseError('update template success score', error.message);
    }
  }

  // ============================================================================
  // VECTOR SEARCH
  // ============================================================================

  async searchSimilarTemplates(
    embedding: number[],
    domain?: string,
    threshold: number = 0.7,
    limit: number = 10
  ): Promise<Array<DatabaseTemplate & { similarity: number }>> {
    const { data, error } = await this.supabase.rpc('match_templates', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
      domain_filter: domain
    });

    if (error) {
      throw createError.databaseError('search similar templates', error.message);
    }

    return data || [];
  }

  async searchSimilarExamples(
    embedding: number[],
    domain?: string,
    threshold: number = 0.7,
    limit: number = 5
  ): Promise<Array<{ id: string; domain: string; content: any; success_score: number; similarity: number }>> {
    const { data, error } = await this.supabase.rpc('match_examples', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
      domain_filter: domain
    });

    if (error) {
      throw createError.databaseError('search similar examples', error.message);
    }

    return data || [];
  }

  // ============================================================================
  // EMBEDDINGS REPOSITORY
  // ============================================================================

  async createEmbedding(data: Omit<DatabaseEmbedding, 'id' | 'created_at'>): Promise<DatabaseEmbedding> {
    const { data: result, error } = await this.supabase
      .from('embeddings')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw createError.databaseError('create embedding', error.message);
    }

    return result;
  }

  async getEmbedding(contentId: string, contentType: ContentType): Promise<DatabaseEmbedding | null> {
    const { data, error } = await this.supabase
      .from('embeddings')
      .select('*')
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw createError.databaseError('get embedding', error.message);
    }

    return data;
  }

  // ============================================================================
  // FEEDBACK REPOSITORY
  // ============================================================================

  async createFeedback(data: Omit<DatabaseFeedback, 'id' | 'timestamp'>): Promise<DatabaseFeedback> {
    const { data: result, error } = await this.supabase
      .from('feedback')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw createError.databaseError('create feedback', error.message);
    }

    return result;
  }

  async getFeedbackByPrompt(enhancedPromptId: string): Promise<DatabaseFeedback[]> {
    const { data, error } = await this.supabase
      .from('feedback')
      .select('*')
      .eq('enhanced_prompt_id', enhancedPromptId)
      .order('timestamp', { ascending: false });

    if (error) {
      throw createError.databaseError('get feedback by prompt', error.message);
    }

    return data || [];
  }

  async getUserFeedback(userId: string, limit: number = 100): Promise<DatabaseFeedback[]> {
    const { data, error } = await this.supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      throw createError.databaseError('get user feedback', error.message);
    }

    return data || [];
  }

  // ============================================================================
  // CREDIT MANAGEMENT
  // ============================================================================

  async getUserCredits(userId: string): Promise<number> {
    const { data, error } = await this.supabase.rpc('get_user_credits', {
      user_uuid: userId
    });

    if (error) {
      throw createError.databaseError('get user credits', error.message);
    }

    return data || 0;
  }

  async deductCredits(
    userId: string, 
    amount: number, 
    referenceId?: string, 
    description?: string
  ): Promise<boolean> {
    const { data, error } = await this.supabase.rpc('deduct_credits', {
      user_uuid: userId,
      amount_to_deduct: amount,
      reference_uuid: referenceId,
      description_text: description
    });

    if (error) {
      throw createError.databaseError('deduct credits', error.message);
    }

    return data === true;
  }

  async createCreditTransaction(data: Omit<DatabaseCreditTransaction, 'id' | 'timestamp'>): Promise<DatabaseCreditTransaction> {
    const { data: result, error } = await this.supabase
      .from('credit_transactions')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw createError.databaseError('create credit transaction', error.message);
    }

    return result;
  }

  async getUserCreditTransactions(userId: string, limit: number = 50): Promise<DatabaseCreditTransaction[]> {
    const { data, error } = await this.supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      throw createError.databaseError('get user credit transactions', error.message);
    }

    return data || [];
  }

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  async getEnhancementStats(userId?: string, daysBack: number = 30): Promise<{
    total_enhancements: number;
    avg_quality_score: number;
    avg_enhancement_ratio: number;
    avg_processing_time: number;
    top_domain: string;
  }> {
    const { data, error } = await this.supabase.rpc('get_enhancement_stats', {
      user_uuid: userId,
      days_back: daysBack
    });

    if (error) {
      throw createError.databaseError('get enhancement stats', error.message);
    }

    return data?.[0] || {
      total_enhancements: 0,
      avg_quality_score: 0,
      avg_enhancement_ratio: 0,
      avg_processing_time: 0,
      top_domain: 'general'
    };
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  async healthCheck(): Promise<{ healthy: boolean; latency: number }> {
    const startTime = Date.now();
    
    try {
      const { error } = await this.supabase
        .from('templates')
        .select('id')
        .limit(1);

      const latency = Date.now() - startTime;

      return {
        healthy: !error,
        latency
      };
    } catch (error) {
      return {
        healthy: false,
        latency: Date.now() - startTime
      };
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let databaseInstance: BackendBrainDatabase | null = null;

export function getDatabase(): BackendBrainDatabase {
  if (!databaseInstance) {
    databaseInstance = new BackendBrainDatabase();
  }
  return databaseInstance;
}

export function setDatabase(database: BackendBrainDatabase): void {
  databaseInstance = database;
}