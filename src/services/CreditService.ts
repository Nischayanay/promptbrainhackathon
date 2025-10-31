import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

export interface CreditBalance {
  balance: number
  lastRefresh: Date
  nextRefresh: Date
}

export interface CreditRefreshResult {
  wasRefreshed: boolean
  newBalance: number
  previousBalance: number
  nextRefresh: Date
}

export interface CreditTransaction {
  success: boolean
  newBalance: number
  transactionId?: string
  error?: string
}

export type CreditUpdateCallback = (balance: number) => void
export type Unsubscribe = () => void

export class CreditService {
  private supabase: SupabaseClient<Database>
  private subscriptions: Map<string, Set<CreditUpdateCallback>> = new Map()
  private refreshIntervals: Map<string, NodeJS.Timeout> = new Map()

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase
  }

  /**
   * Get user's current credit balance
   */
  async getUserCredits(userId: string): Promise<CreditBalance> {
    try {
      const { data, error } = await this.supabase.rpc('get_user_balance', {
        p_user_id: userId
      })

      if (error) {
        console.error('Error fetching user credits:', error)
        throw new Error(`Failed to fetch credits: ${error.message}`)
      }

      const response = data as unknown as { success: boolean; balance: number; message?: string }
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch user credits')
      }

      const balance = response.balance || 0
      const now = new Date()
      const nextRefresh = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now

      return {
        balance,
        lastRefresh: now, // This will be updated when we implement proper tracking
        nextRefresh
      }

    } catch (error) {
      console.error('Error in getUserCredits:', error)
      throw error
    }
  }

  /**
   * Check if 24 hours have passed and refresh credits if needed (lazy refresh)
   */
  async checkAndRefreshCredits(userId: string): Promise<CreditRefreshResult> {
    try {
      // Get current balance first
      const currentCredits = await this.getUserCredits(userId)
      const previousBalance = currentCredits.balance

      // For now, we'll implement a simple check based on the user's last activity
      // In a production system, you'd want to track last_credit_refresh in the database
      
      // Check if user needs a refresh (simplified logic for MVP)
      // This would be replaced with proper database tracking of last_credit_refresh
      const shouldRefresh = await this.shouldRefreshCredits(userId)

      if (shouldRefresh) {
        // Add 20 credits (daily refresh)
        const { data, error } = await this.supabase.rpc('add_credits', {
          p_user_id: userId,
          p_amount: 20,
          p_reason: '24-hour credit refresh'
        })

        if (error) {
          console.error('Error refreshing credits:', error)
          return {
            wasRefreshed: false,
            newBalance: previousBalance,
            previousBalance,
            nextRefresh: currentCredits.nextRefresh
          }
        }

        const addResponse = data as unknown as { success: boolean; balance: number }
        if (addResponse?.success) {
          const newBalance = addResponse.balance || previousBalance
          const nextRefresh = new Date(Date.now() + 24 * 60 * 60 * 1000)

          // Notify subscribers of the balance change
          this.notifySubscribers(userId, newBalance)

          return {
            wasRefreshed: true,
            newBalance,
            previousBalance,
            nextRefresh
          }
        }
      }

      return {
        wasRefreshed: false,
        newBalance: previousBalance,
        previousBalance,
        nextRefresh: currentCredits.nextRefresh
      }

    } catch (error) {
      console.error('Error in checkAndRefreshCredits:', error)
      throw error
    }
  }

  /**
   * Deduct credits from user's balance
   */
  async deductCredits(userId: string, amount: number = 1, reason: string = 'prompt_enhancement'): Promise<CreditTransaction> {
    try {
      const { data, error } = await this.supabase.rpc('spend_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_reason: reason
      })

      if (error) {
        console.error('Error deducting credits:', error)
        return {
          success: false,
          newBalance: 0,
          error: error.message
        }
      }

      const spendResponse = data as unknown as { success: boolean; balance: number; error?: string; transaction_id?: string }
      if (!spendResponse?.success) {
        return {
          success: false,
          newBalance: spendResponse?.balance || 0,
          error: spendResponse?.error || 'Failed to deduct credits'
        }
      }

      const newBalance = spendResponse.balance || 0
      const transactionId = spendResponse.transaction_id

      // Notify subscribers of the balance change
      this.notifySubscribers(userId, newBalance)

      return {
        success: true,
        newBalance,
        transactionId
      }

    } catch (error) {
      console.error('Error in deductCredits:', error)
      return {
        success: false,
        newBalance: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Subscribe to credit balance updates for real-time UI updates
   */
  subscribeToCredits(userId: string, callback: CreditUpdateCallback): Unsubscribe {
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, new Set())
    }

    this.subscriptions.get(userId)!.add(callback)

    // Set up periodic balance checking (every 30 seconds)
    if (!this.refreshIntervals.has(userId)) {
      const interval = setInterval(async () => {
        try {
          const credits = await this.getUserCredits(userId)
          this.notifySubscribers(userId, credits.balance)
        } catch (error) {
          console.error('Error in periodic credit check:', error)
        }
      }, 30000) // Check every 30 seconds

      this.refreshIntervals.set(userId, interval)
    }

    // Return unsubscribe function
    return () => {
      const userSubscriptions = this.subscriptions.get(userId)
      if (userSubscriptions) {
        userSubscriptions.delete(callback)
        
        // If no more subscribers, clear the interval
        if (userSubscriptions.size === 0) {
          const interval = this.refreshIntervals.get(userId)
          if (interval) {
            clearInterval(interval)
            this.refreshIntervals.delete(userId)
          }
          this.subscriptions.delete(userId)
        }
      }
    }
  }

  /**
   * Add credits to user's balance (for admin/purchase operations)
   */
  async addCredits(userId: string, amount: number, reason: string = 'credit_purchase'): Promise<CreditTransaction> {
    try {
      const { data, error } = await this.supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_reason: reason
      })

      if (error) {
        console.error('Error adding credits:', error)
        return {
          success: false,
          newBalance: 0,
          error: error.message
        }
      }

      const addResponse = data as unknown as { success: boolean; balance: number; message?: string }
      if (!addResponse?.success) {
        return {
          success: false,
          newBalance: addResponse?.balance || 0,
          error: addResponse?.message || 'Failed to add credits'
        }
      }

      const newBalance = addResponse.balance || 0

      // Notify subscribers of the balance change
      this.notifySubscribers(userId, newBalance)

      return {
        success: true,
        newBalance
      }

    } catch (error) {
      console.error('Error in addCredits:', error)
      return {
        success: false,
        newBalance: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Check if user should receive a credit refresh (simplified logic for MVP)
   */
  private async shouldRefreshCredits(userId: string): Promise<boolean> {
    try {
      // For MVP, we'll use a simple localStorage-based approach
      // In production, this should be tracked in the database
      const lastRefreshKey = `credit_refresh_${userId}`
      const lastRefresh = localStorage.getItem(lastRefreshKey)
      
      if (!lastRefresh) {
        // First time, set the timestamp and don't refresh
        localStorage.setItem(lastRefreshKey, Date.now().toString())
        return false
      }

      const lastRefreshTime = parseInt(lastRefresh)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (now - lastRefreshTime >= twentyFourHours) {
        // Update the timestamp
        localStorage.setItem(lastRefreshKey, now.toString())
        return true
      }

      return false

    } catch (error) {
      console.error('Error checking refresh eligibility:', error)
      return false
    }
  }

  /**
   * Notify all subscribers of a balance change
   */
  private notifySubscribers(userId: string, newBalance: number): void {
    const userSubscriptions = this.subscriptions.get(userId)
    if (userSubscriptions) {
      userSubscriptions.forEach(callback => {
        try {
          callback(newBalance)
        } catch (error) {
          console.error('Error in credit subscription callback:', error)
        }
      })
    }
  }

  /**
   * Clean up all subscriptions and intervals
   */
  cleanup(): void {
    // Clear all intervals
    this.refreshIntervals.forEach(interval => clearInterval(interval))
    this.refreshIntervals.clear()
    
    // Clear all subscriptions
    this.subscriptions.clear()
  }
}

// Export singleton instance (will be initialized with supabase client)
let creditServiceInstance: CreditService | null = null

export function getCreditService(supabase: SupabaseClient<Database>): CreditService {
  if (!creditServiceInstance) {
    creditServiceInstance = new CreditService(supabase)
  }
  return creditServiceInstance
}