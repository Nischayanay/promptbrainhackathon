import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CreditService, CreditTransaction, getCreditService } from '../services/CreditService'
import { useAuth } from './AuthContext'
import { authService } from '../services/AuthService'

interface CreditContextType {
  balance: number
  loading: boolean
  error: string | null
  refreshCredits: () => Promise<void>
  deductCredits: (amount?: number, reason?: string) => Promise<CreditTransaction>
  addCredits: (amount: number, reason?: string) => Promise<CreditTransaction>
  checkAndRefreshCredits: () => Promise<void>
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

interface CreditProviderProps {
  children: ReactNode
}

export function CreditProvider({ children }: CreditProviderProps) {
  const { user, session } = useAuth()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creditService, setCreditService] = useState<CreditService | null>(null)

  // Initialize credit service when auth is ready
  useEffect(() => {
    if (session) {
      const service = getCreditService(authService.getClient())
      setCreditService(service)
    } else {
      setCreditService(null)
    }
  }, [session])

  // Load initial balance and set up subscription when user changes
  useEffect(() => {
    if (!user || !creditService) {
      setBalance(0)
      setLoading(false)
      setError(null)
      return
    }

    let unsubscribe: (() => void) | null = null

    const loadInitialBalance = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get initial balance
        const credits = await creditService.getUserCredits(user.id)
        setBalance(credits.balance)

        // Set up real-time subscription
        unsubscribe = creditService.subscribeToCredits(user.id, (newBalance) => {
          setBalance(newBalance)
        })

        // Check for credit refresh on load
        await creditService.checkAndRefreshCredits(user.id)

      } catch (err) {
        console.error('Error loading credits:', err)
        setError(err instanceof Error ? err.message : 'Failed to load credits')
      } finally {
        setLoading(false)
      }
    }

    loadInitialBalance()

    // Cleanup subscription on unmount or user change
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user, creditService])

  // Refresh credits manually
  const refreshCredits = async () => {
    if (!user || !creditService) return

    try {
      setError(null)
      const credits = await creditService.getUserCredits(user.id)
      setBalance(credits.balance)
    } catch (err) {
      console.error('Error refreshing credits:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh credits')
    }
  }

  // Deduct credits
  const deductCredits = async (amount: number = 1, reason: string = 'prompt_enhancement'): Promise<CreditTransaction> => {
    if (!user || !creditService) {
      return {
        success: false,
        newBalance: balance,
        error: 'User not authenticated'
      }
    }

    try {
      setError(null)
      const result = await creditService.deductCredits(user.id, amount, reason)
      
      if (result.success) {
        setBalance(result.newBalance)
      } else {
        setError(result.error || 'Failed to deduct credits')
      }

      return result
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to deduct credits'
      setError(error)
      return {
        success: false,
        newBalance: balance,
        error
      }
    }
  }

  // Add credits
  const addCredits = async (amount: number, reason: string = 'credit_purchase'): Promise<CreditTransaction> => {
    if (!user || !creditService) {
      return {
        success: false,
        newBalance: balance,
        error: 'User not authenticated'
      }
    }

    try {
      setError(null)
      const result = await creditService.addCredits(user.id, amount, reason)
      
      if (result.success) {
        setBalance(result.newBalance)
      } else {
        setError(result.error || 'Failed to add credits')
      }

      return result
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add credits'
      setError(error)
      return {
        success: false,
        newBalance: balance,
        error
      }
    }
  }

  // Check and refresh credits (24-hour lazy refresh)
  const checkAndRefreshCredits = async () => {
    if (!user || !creditService) return

    try {
      setError(null)
      const result = await creditService.checkAndRefreshCredits(user.id)
      
      if (result.wasRefreshed) {
        setBalance(result.newBalance)
        console.log(`Credits refreshed: ${result.previousBalance} → ${result.newBalance}`)
      }
    } catch (err) {
      console.error('Error checking credit refresh:', err)
      // Don't set error for refresh checks as they're background operations
    }
  }

  const value: CreditContextType = {
    balance,
    loading,
    error,
    refreshCredits,
    deductCredits,
    addCredits,
    checkAndRefreshCredits
  }

  return (
    <CreditContext.Provider value={value}>
      {children}
    </CreditContext.Provider>
  )
}

export function useCredits(): CreditContextType {
  const context = useContext(CreditContext)
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider')
  }
  return context
}

export { CreditContext }