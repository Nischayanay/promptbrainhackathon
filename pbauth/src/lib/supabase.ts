import { createClient } from '@supabase/supabase-js'

// Use production Supabase for now
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qaugvrsaeydptmsxllcu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdWd2cnNhZXlkcHRtc3hsbGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDA3NzksImV4cCI6MjA2NTQ3Njc3OX0.MdbV6BTROTWJdFWUW1t3z45eC4nidMnNb5M-qNqPcqU'

console.log(`🔧 pbauth Supabase Config: ${supabaseUrl}`)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export interface AuthResult {
  success: boolean
  user?: any
  error?: string
  access_token?: string
}

export async function signUp(email: string, password: string, fullName: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
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

    // The database trigger will automatically create profile and initialize credits
    console.log('User signed up successfully:', data.user.email)
    return {
      success: true,
      user: data.user,
      access_token: data.session?.access_token
    }

  } catch (error) {
    console.error('Signup network error:', error)
    return { success: false, error: 'Network error during signup' }
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Sign in error:', error.message)
      return { success: false, error: error.message }
    }

    if (!data.session?.access_token) {
      return { success: false, error: 'No session created' }
    }

    console.log('User signed in successfully:', data.user?.email)
    return {
      success: true,
      user: data.user,
      access_token: data.session.access_token
    }

  } catch (error) {
    console.error('Sign in network error:', error)
    return { success: false, error: 'Network error during sign in' }
  }
}

export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/dashboard'
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

export async function signInWithGitHub(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000/dashboard'
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

export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut()

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

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

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

// Auth state listener
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
}