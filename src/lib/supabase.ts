import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for your tables
export const promptsTable = supabase.from('prompts')
export const userCreditsTable = supabase.from('user_credits')
export const userProfilesTable = supabase.from('user_profiles')
export const promptLogsTable = supabase.from('prompt_logs')
export const analyticsTable = supabase.from('analytics')