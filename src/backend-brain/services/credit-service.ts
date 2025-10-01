// Credit Management Service

import { createError } from '../types/errors';
import { getDatabase } from '../database/client';

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'debit' | 'credit' | 'refund';
  description: string;
  referenceId?: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface CreditBalance {
  userId: string;
  balance: number;
  lastUpdated: Date;
  pendingTransactions: number;
}

export interface CreditUsage {
  userId: string;
  period: 'day' | 'week' | 'month';
  used: number;
  limit: number;
  remaining: number;
  resetDate: Date;
}

export class CreditService {
  private database = getDatabase();
  private readonly COST_PER_ENHANCEMENT = 1;
  private readonly DEFAULT_STARTING_BALANCE = 100;
  private readonly DAILY_FREE_CREDITS = 10;

  async getUserCredits(userId: string): Promise<number> {
    try {
      const balance = await this.database.getUserCredits(userId);
      return balance;
    } catch (error) {
      throw createError.databaseError('get user credits', (error as Error).message);
    }
  }

  async deductCredits(
    userId: string, 
    amount: number = this.COST_PER_ENHANCEMENT, 
    referenceId?: string, 
    description: string = 'Backend Brain enhancement'
  ): Promise<boolean> {
    try {
      // Check current balance
      const currentBalance = await this.getUserCredits(userId);
      
      if (currentBalance < amount) {
        throw createError.insufficientCredits(amount, currentBalance);
      }

      // Perform deduction
      const success = await this.database.deductCredits(userId, amount, referenceId, description);
      
      if (!success) {
        throw createError.insufficientCredits(amount, currentBalance);
      }

      console.log(`Deducted ${amount} credits from user ${userId}. Reference: ${referenceId}`);
      return true;

    } catch (error) {
      if (error instanceof Error && error.message.includes('INSUFFICIENT_CREDITS')) {
        throw error;
      }
      throw createError.databaseError('deduct credits', (error as Error).message);
    }
  }

  async addCredits(
    userId: string, 
    amount: number, 
    description: string = 'Credit purchase',
    referenceId?: string
  ): Promise<void> {
    try {
      await this.database.createCreditTransaction({
        user_id: userId,
        amount,
        transaction_type: 'credit',
        description,
        reference_id: referenceId,
        metadata: {
          source: 'credit_purchase',
          timestamp: new Date().toISOString()
        }
      });

      console.log(`Added ${amount} credits to user ${userId}`);
    } catch (error) {
      throw createError.databaseError('add credits', (error as Error).message);
    }
  }

  async refundCredits(
    userId: string, 
    amount: number, 
    originalTransactionId: string,
    reason: string = 'Refund'
  ): Promise<void> {
    try {
      await this.database.createCreditTransaction({
        user_id: userId,
        amount,
        transaction_type: 'refund',
        description: `Refund: ${reason}`,
        reference_id: originalTransactionId,
        metadata: {
          refund_reason: reason,
          original_transaction: originalTransactionId,
          timestamp: new Date().toISOString()
        }
      });

      console.log(`Refunded ${amount} credits to user ${userId} for transaction ${originalTransactionId}`);
    } catch (error) {
      throw createError.databaseError('refund credits', (error as Error).message);
    }
  }

  async getCreditBalance(userId: string): Promise<CreditBalance> {
    try {
      const balance = await this.getUserCredits(userId);
      
      return {
        userId,
        balance,
        lastUpdated: new Date(),
        pendingTransactions: 0 // Would be calculated from pending transactions
      };
    } catch (error) {
      throw createError.databaseError('get credit balance', (error as Error).message);
    }
  }

  async getCreditHistory(userId: string, limit: number = 50): Promise<CreditTransaction[]> {
    try {
      const transactions = await this.database.getUserCreditTransactions(userId, limit);
      
      return transactions.map(tx => ({
        id: tx.id,
        userId: tx.user_id,
        amount: tx.amount,
        type: tx.transaction_type as 'debit' | 'credit' | 'refund',
        description: tx.description || '',
        referenceId: tx.reference_id || undefined,
        timestamp: new Date(tx.timestamp),
        metadata: tx.metadata || {}
      }));
    } catch (error) {
      throw createError.databaseError('get credit history', (error as Error).message);
    }
  }

  async getCreditUsage(userId: string, period: 'day' | 'week' | 'month' = 'day'): Promise<CreditUsage> {
    try {
      const now = new Date();
      let startDate: Date;
      let resetDate: Date;
      let limit: number;

      switch (period) {
        case 'day':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          resetDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
          limit = this.DAILY_FREE_CREDITS;
          break;
        case 'week':
          const dayOfWeek = now.getDay();
          startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
          startDate.setHours(0, 0, 0, 0);
          resetDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          limit = this.DAILY_FREE_CREDITS * 7;
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          limit = this.DAILY_FREE_CREDITS * 30;
          break;
      }

      // Get usage for the period (this would need a more sophisticated query)
      const transactions = await this.getCreditHistory(userId, 1000);
      const periodTransactions = transactions.filter(tx => 
        tx.timestamp >= startDate && 
        tx.timestamp < resetDate && 
        tx.type === 'debit'
      );

      const used = periodTransactions.reduce((sum, tx) => sum + tx.amount, 0);

      return {
        userId,
        period,
        used,
        limit,
        remaining: Math.max(0, limit - used),
        resetDate
      };
    } catch (error) {
      throw createError.databaseError('get credit usage', (error as Error).message);
    }
  }

  async grantDailyFreeCredits(userId: string): Promise<boolean> {
    try {
      const usage = await this.getCreditUsage(userId, 'day');
      
      if (usage.remaining > 0) {
        await this.addCredits(
          userId, 
          this.DAILY_FREE_CREDITS, 
          'Daily free credits',
          `daily_${new Date().toISOString().split('T')[0]}`
        );
        return true;
      }
      
      return false; // Already granted today
    } catch (error) {
      console.warn(`Failed to grant daily credits to user ${userId}:`, error);
      return false;
    }
  }

  // Real-time synchronization
  async syncCreditsAcrossDevices(userId: string): Promise<void> {
    try {
      // This would use Supabase realtime to sync across devices
      // For now, we'll just ensure the database is up to date
      const balance = await this.getUserCredits(userId);
      console.log(`Synced credits for user ${userId}: ${balance}`);
    } catch (error) {
      console.warn(`Failed to sync credits for user ${userId}:`, error);
    }
  }

  // Retry logic for network failures
  async processTransactionWithRetry(
    operation: () => Promise<any>,
    maxRetries: number = 3
  ): Promise<any> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw createError.databaseError('transaction retry failed', lastError!.message);
  }

  // Audit and compliance
  async auditCreditTransactions(userId: string, startDate: Date, endDate: Date): Promise<{
    transactions: CreditTransaction[];
    summary: {
      totalDebits: number;
      totalCredits: number;
      totalRefunds: number;
      netChange: number;
    };
  }> {
    try {
      const allTransactions = await this.getCreditHistory(userId, 10000);
      const transactions = allTransactions.filter(tx => 
        tx.timestamp >= startDate && tx.timestamp <= endDate
      );

      const summary = transactions.reduce((acc, tx) => {
        switch (tx.type) {
          case 'debit':
            acc.totalDebits += tx.amount;
            acc.netChange -= tx.amount;
            break;
          case 'credit':
            acc.totalCredits += tx.amount;
            acc.netChange += tx.amount;
            break;
          case 'refund':
            acc.totalRefunds += tx.amount;
            acc.netChange += tx.amount;
            break;
        }
        return acc;
      }, {
        totalDebits: 0,
        totalCredits: 0,
        totalRefunds: 0,
        netChange: 0
      });

      return { transactions, summary };
    } catch (error) {
      throw createError.databaseError('audit credit transactions', (error as Error).message);
    }
  }

  // Cost calculation
  calculateEnhancementCost(
    promptLength: number, 
    domain: string, 
    includeExamples: boolean = true
  ): number {
    let cost = this.COST_PER_ENHANCEMENT;

    // Adjust cost based on prompt complexity
    if (promptLength > 1000) {
      cost += 1; // Extra cost for long prompts
    }

    // Adjust cost based on domain complexity
    const complexDomains = ['coding', 'technical', 'academic'];
    if (complexDomains.includes(domain)) {
      cost += 1;
    }

    // Adjust cost for examples
    if (includeExamples) {
      cost += 1;
    }

    return cost;
  }

  // Health check
  async healthCheck(): Promise<{ healthy: boolean; latency: number }> {
    const startTime = Date.now();
    
    try {
      // Test database connection with a simple query
      await this.database.healthCheck();
      const latency = Date.now() - startTime;
      
      return { healthy: true, latency };
    } catch (error) {
      return { healthy: false, latency: Date.now() - startTime };
    }
  }

  // Configuration
  getCostPerEnhancement(): number {
    return this.COST_PER_ENHANCEMENT;
  }

  getDefaultStartingBalance(): number {
    return this.DEFAULT_STARTING_BALANCE;
  }

  getDailyFreeCredits(): number {
    return this.DAILY_FREE_CREDITS;
  }
}

// Singleton instance
let creditServiceInstance: CreditService | null = null;

export function getCreditService(): CreditService {
  if (!creditServiceInstance) {
    creditServiceInstance = new CreditService();
  }
  return creditServiceInstance;
}

export function setCreditService(service: CreditService): void {
  creditServiceInstance = service;
}