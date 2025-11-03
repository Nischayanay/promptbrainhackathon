import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  session?: Session
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  credits: number
  last_credit_refresh: string
  created_at: string
  updated_at: string
}

export type AuthStateCallback = (event: string, session: Session | null) => void
export type Unsubscribe = () => void

export class AuthService {
  private supabase: SupabaseClient<Database>

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    console.log('🔧 AuthService Config:', { 
      url: supabaseUrl ? 'SET' : 'MISSING', 
      key: supabaseAnonKey ? 'SET' : 'MISSING' 
    })

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing Supabase environment variables:', { supabaseUrl, supabaseAnonKey })
      throw new Error('Missing Supabase environment variables')
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, fullName: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) {
        console.error('Signup error:', error.message)
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'No user created' }
      }

      // Create user profile with initial credits
      if (data.user && data.session) {
        await this.createUserProfile(data.user, fullName)
      }

      console.log('User signed up successfully:', data.user.email)
      return {
        success: true,
        user: data.user,
        session: data.session
      }

    } catch (error) {
      console.error('Signup network error:', error)
      return { success: false, error: 'Network error during signup' }
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error.message)
        return { success: false, error: error.message }
      }

      if (!data.session) {
        return { success: false, error: 'No session created' }
      }

      console.log('User signed in successfully:', data.user?.email)
      return {
        success: true,
        user: data.user,
        session: data.session
      }

    } catch (error) {
      console.error('Sign in network error:', error)
      return { success: false, error: 'Network error during sign in' }
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Google sign in error:', error.message)
        return { success: false, error: error.message }
      }

      // OAuth redirects, so this won't return the session immediately
      return { success: true }

    } catch (error) {
      console.error('Google sign in network error:', error)
      return { success: false, error: 'Network error during Google sign in' }
    }
  }

  /**
   * Sign in with GitHub OAuth
   */
  async signInWithGitHub(): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('GitHub sign in error:', error.message)
        return { success: false, error: error.message }
      }

      // OAuth redirects, so this won't return the session immediately
      return { success: true }

    } catch (error) {
      console.error('GitHub sign in network error:', error)
      return { success: false, error: 'Network error during GitHub sign in' }
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        console.error('Sign out error:', error.message)
        return { success: false, error: error.message }
      }

      console.log('User signed out successfully')
      return { success: true }

    } catch (error) {
      console.error('Sign out network error:', error)
      return { success: false, error: 'Network error during sign out' }
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()

      if (error) {
        console.error('Get user error:', error.message)
        return null
      }

      return user
    } catch (error) {
      console.error('Get user network error:', error)
      return null
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.getSession()

      if (error) {
        console.error('Session error:', error.message)
        return { success: false, error: error.message }
      }

      if (!data.session) {
        return { success: false, error: 'No active session' }
      }

      return {
        success: true,
        user: data.session.user,
        session: data.session
      }

    } catch (error) {
      console.error('Session check error:', error)
      return { success: false, error: 'Error checking session' }
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: AuthStateCallback): Unsubscribe {
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(callback)
    return () => subscription.unsubscribe()
  }

  /**
   * Create user profile with initial credits (internal method)
   */
  private async createUserProfile(user: User, fullName?: string): Promise<void> {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await this.supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (existingProfile) {
        console.log('User profile already exists')
        return
      }

      // Create user profile
      const { error: profileError } = await this.supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          plan_type: 'free'
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
      }

      // Initialize user credits with 20 credits
      const { error: creditsError } = await this.supabase.rpc('add_credits', {
        p_user_id: user.id,
        p_amount: 20,
        p_reason: 'Initial signup bonus'
      })

      if (creditsError) {
        console.error('Error initializing user credits:', creditsError)
      } else {
        console.log('User profile and credits created successfully')
      }

    } catch (error) {
      console.error('Error in createUserProfile:', error)
    }
  }

  /**
   * Get user profile with credits
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        return null
      }

      // Get user credits
      const { data: creditsResult, error: creditsError } = await this.supabase.rpc('get_user_balance', {
        p_user_id: userId
      })

      if (creditsError) {
        console.error('Error fetching user credits:', creditsError)
        return null
      }

      // Get user auth data
      const { data: { user }, error: userError } = await this.supabase.auth.getUser()

      if (userError || !user) {
        console.error('Error fetching user auth data:', userError)
        return null
      }

      return {
        id: profile.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        credits: creditsResult?.balance || 0,
        last_credit_refresh: new Date().toISOString(), // Will be updated by credit service
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }

    } catch (error) {
      console.error('Error in getUserProfile:', error)
      return null
    }
  }

  /**
   * Get Supabase client for direct access
   */
  getClient(): SupabaseClient<Database> {
    return this.supabase
  }
}

// Export singleton instance
export const authService = new AuthService()