import { useState, useEffect } from 'react'

export type AuthMethod = 'google' | 'github' | 'email' | null

interface AuthMethodMemory {
  method: AuthMethod
  timestamp: number
  email?: string
}

const STORAGE_KEY = 'pb_auth_method'
const EXPIRY_TIME = 30 * 24 * 60 * 60 * 1000 // 30 days

export function useAuthMethodMemory() {
  const [lastAuthMethod, setLastAuthMethod] = useState<AuthMethod>(null)
  const [lastEmail, setLastEmail] = useState<string>('')

  // Load saved auth method on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: AuthMethodMemory = JSON.parse(saved)
        
        // Check if not expired
        if (Date.now() - parsed.timestamp < EXPIRY_TIME) {
          setLastAuthMethod(parsed.method)
          setLastEmail(parsed.email || '')
        } else {
          // Clean up expired data
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch (error) {
      console.warn('Failed to load auth method memory:', error)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // Save auth method
  const saveAuthMethod = (method: AuthMethod, email?: string) => {
    try {
      const data: AuthMethodMemory = {
        method,
        timestamp: Date.now(),
        email
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setLastAuthMethod(method)
      setLastEmail(email || '')
    } catch (error) {
      console.warn('Failed to save auth method:', error)
    }
  }

  // Clear auth method memory
  const clearAuthMethod = () => {
    localStorage.removeItem(STORAGE_KEY)
    setLastAuthMethod(null)
    setLastEmail('')
  }

  // Get display text for last used method
  const getLastUsedText = (currentMethod: AuthMethod): string | null => {
    if (!lastAuthMethod || lastAuthMethod !== currentMethod) return null
    
    const timeAgo = getTimeAgo(Date.now() - getTimestamp())
    return `Last used ${timeAgo}`
  }

  // Get timestamp of last auth
  const getTimestamp = (): number => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: AuthMethodMemory = JSON.parse(saved)
        return parsed.timestamp
      }
    } catch (error) {
      // Ignore
    }
    return 0
  }

  return {
    lastAuthMethod,
    lastEmail,
    saveAuthMethod,
    clearAuthMethod,
    getLastUsedText,
    hasMemory: !!lastAuthMethod
  }
}

// Helper function to format time ago
function getTimeAgo(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'just now'
}