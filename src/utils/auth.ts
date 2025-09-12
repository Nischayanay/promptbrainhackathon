import { supabase } from './supabase/client';
import { projectId, publicAnonKey } from './supabase/info';

// Export the shared client for direct use in components
export { supabase };

export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  login_count: number;
  last_login: string | null;
  account_status: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  access_token?: string;
}

// Sign up new user
export async function signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
  try {
    // Call our backend signup endpoint
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, fullName })
    });

    const result = await response.json();

    if (!response.ok) {
      console.log(`Signup error: ${result.error}`);
      return { success: false, error: result.error };
    }

    console.log('User created successfully');
    return { success: true, user: result.user };

  } catch (error) {
    console.log(`Signup network error: ${error}`);
    return { success: false, error: 'Network error during signup' };
  }
}

// Sign in existing user
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log(`Sign in error: ${error.message}`);
      return { success: false, error: error.message };
    }

    if (!data.session?.access_token) {
      return { success: false, error: 'No session created' };
    }

    // Track login in our backend
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/auth/track-login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.session.access_token}`
        }
      });
    } catch (trackError) {
      console.log(`Login tracking error: ${trackError}`);
      // Don't fail the login if tracking fails
    }

    console.log('User signed in successfully');
    return { 
      success: true, 
      access_token: data.session.access_token,
      user: data.user as any 
    };

  } catch (error) {
    console.log(`Sign in network error: ${error}`);
    return { success: false, error: 'Network error during sign in' };
  }
}

// Sign in with Google OAuth
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    // Do not forget to complete setup at https://supabase.com/docs/guides/auth/social-login/auth-google
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin // Redirect back to the app
      }
    });

    if (error) {
      console.log(`Google sign in error: ${error.message}`);
      return { success: false, error: error.message };
    }

    // OAuth redirects to callback URL, so this won't return the session immediately
    return { success: true };

  } catch (error) {
    console.log(`Google sign in network error: ${error}`);
    return { success: false, error: 'Network error during Google sign in' };
  }
}

// Sign in with GitHub OAuth
export async function signInWithGitHub(): Promise<AuthResponse> {
  try {
    // Do not forget to complete setup at https://supabase.com/docs/guides/auth/social-login/auth-github
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin // Redirect back to the app
      }
    });

    if (error) {
      console.log(`GitHub sign in error: ${error.message}`);
      return { success: false, error: error.message };
    }

    // OAuth redirects to callback URL, so this won't return the session immediately
    return { success: true };

  } catch (error) {
    console.log(`GitHub sign in network error: ${error}`);
    return { success: false, error: 'Network error during GitHub sign in' };
  }
}

// Get current session
export async function getCurrentSession(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log(`Session error: ${error.message}`);
      return { success: false, error: error.message };
    }

    if (!data.session?.access_token) {
      return { success: false, error: 'No active session' };
    }

    return { 
      success: true, 
      access_token: data.session.access_token,
      user: data.user as any 
    };

  } catch (error) {
    console.log(`Session check error: ${error}`);
    return { success: false, error: 'Error checking session' };
  }
}

// Get user profile from backend
export async function getUserProfile(accessToken: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (!response.ok) {
      console.log(`Profile fetch error: ${result.error}`);
      return { success: false, error: result.error };
    }

    return { success: true, user: result.user };

  } catch (error) {
    console.log(`Profile fetch network error: ${error}`);
    return { success: false, error: 'Network error fetching profile' };
  }
}

// Update user role after onboarding
export async function updateUserRole(accessToken: string, role: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/auth/update-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ role })
    });

    const result = await response.json();

    if (!response.ok) {
      console.log(`Role update error: ${result.error}`);
      return { success: false, error: result.error };
    }

    console.log('User role updated successfully');
    return { success: true, user: result.user };

  } catch (error) {
    console.log(`Role update network error: ${error}`);
    return { success: false, error: 'Network error updating role' };
  }
}

// Complete onboarding flow
export async function completeOnboarding(accessToken: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/auth/complete-onboarding`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (!response.ok) {
      console.log(`Onboarding completion error: ${result.error}`);
      return { success: false, error: result.error };
    }

    console.log('Onboarding completed successfully');
    return { success: true, user: result.user };

  } catch (error) {
    console.log(`Onboarding completion network error: ${error}`);
    return { success: false, error: 'Network error completing onboarding' };
  }
}

// Sign out
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(`Sign out error: ${error.message}`);
      return { success: false, error: error.message };
    }

    console.log('User signed out successfully');
    return { success: true };

  } catch (error) {
    console.log(`Sign out network error: ${error}`);
    return { success: false, error: 'Network error during sign out' };
  }
}

// Create profile for OAuth users
export async function createOAuthProfile(accessToken: string, userData: any): Promise<AuthResponse> {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/auth/create-oauth-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        fullName: userData.name,
        email: userData.email
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.log(`OAuth profile creation error: ${result.error}`);
      return { success: false, error: result.error };
    }

    console.log('OAuth profile created successfully');
    return { success: true, user: result.user };

  } catch (error) {
    console.log(`OAuth profile creation network error: ${error}`);
    return { success: false, error: 'Network error creating OAuth profile' };
  }
}