import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { authService, AuthResult, UserProfile } from '../services/AuthService'
import { useSessionManager } from '../hooks/useSessionManager'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signInWithGoogle: () => Promise<AuthResult>
  signInWithGitHub: () => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize session manager for authenticated users
  const sessionManager = useSessionManager()

  // Load initial session and profile
  useEffect(() => {
    const loadInitialAuth = async () => {
      try {
        const sessionResult = await authService.getCurrentSession()
        
        if (sessionResult.success && sessionResult.user && sessionResult.session) {
          setUser(sessionResult.user)
          setSession(sessionResult.session)
          
          // Load user profile
          const userProfile = await authService.getUserProfile(sessionResult.user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error loading initial auth state:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialAuth()
  }, [])

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        setSession(session)
        
        // Load user profile on sign in
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const userProfile = await authService.getUserProfile(session.user.id)
          setProfile(userProfile)
        }
      } else {
        setUser(null)
        setSession(null)
        setProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Refresh user profile (useful after credit changes)
  const refreshProfile = async () => {
    if (user) {
      const userProfile = await authService.getUserProfile(user.id)
      setProfile(userProfile)
    }
  }

  // Auth methods
  const signUp = async (email: string, password: string, fullName: string): Promise<AuthResult> => {
    setLoading(true)
    try {
      const result = await authService.signUp(email, password, fullName)
      
      if (result.success && result.user && result.session) {
        setUser(result.user)
        setSession(result.session)
        
        // Load profile for new user
        const userProfile = await authService.getUserProfile(result.user.id)
        setProfile(userProfile)
      }
      
      return result
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true)
    try {
      const result = await authService.signIn(email, password)
      
      if (result.success && result.user && result.session) {
        setUser(result.user)
        setSession(result.session)
        
        // Load profile
        const userProfile = await authService.getUserProfile(result.user.id)
        setProfile(userProfile)
      }
      
      return result
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (): Promise<AuthResult> => {
    setLoading(true)
    try {
      return await authService.signInWithGoogle()
    } finally {
      // Don't set loading to false here as OAuth will redirect
    }
  }

  const signInWithGitHub = async (): Promise<AuthResult> => {
    setLoading(true)
    try {
      return await authService.signInWithGitHub()
    } finally {
      // Don't set loading to false here as OAuth will redirect
    }
  }

  const signOut = async (): Promise<AuthResult> => {
    setLoading(true)
    try {
      const result = await authService.signOut()
      
      if (result.success) {
        setUser(null)
        setSession(null)
        setProfile(null)
      }
      
      return result
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext }