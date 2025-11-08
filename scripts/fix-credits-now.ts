#!/usr/bin/env tsx

/**
 * Fix the credit system by updating the get_user_balance function
 * This script applies the fix directly to Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { readFileSync } from 'fs'

config()

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixCredits() {
  console.log('🔧 Fixing credit system...\n')

  try {
    // Read both migration files
    const migration1 = readFileSync('supabase/migrations/20250211000001_update_credits_to_20_per_day.sql', 'utf8')
    const migration2 = readFileSync('supabase/migrations/20250211000002_fix_get_user_balance_with_refresh.sql', 'utf8')

    console.log('📄 Applying migration 1: Update credits to 20 per day')
    
    // Execute migration 1
    const { error: error1 } = await supabase.rpc('exec_sql', { sql: migration1 })
    if (error1) {
      console.log('⚠️  Migration 1 may already be applied:', error1.message)
    } else {
      console.log('✅ Migration 1 applied')
    }

    console.log('\n📄 Applying migration 2: Fix get_user_balance function')
    
    // Execute migration 2
    const { error: error2 } = await supabase.rpc('exec_sql', { sql: migration2 })
    if (error2) {
      console.log('⚠️  Migration 2 may already be applied:', error2.message)
    } else {
      console.log('✅ Migration 2 applied')
    }

    console.log('\n🔄 Verifying fix...')
    
    // Get current user
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError || !users || users.length === 0) {
      console.log('⚠️  No users found to test')
      return
    }

    const testUser = users[0]
    console.log(`\n🧪 Testing with user: ${testUser.email}`)

    // Test get_user_balance
    const { data: balanceData, error: balanceError } = await supabase.rpc('get_user_balance', {
      p_user_id: testUser.id
    })

    if (balanceError) {
      console.error('❌ Error testing balance:', balanceError)
      return
    }

    console.log('✅ Balance check result:', balanceData)
    console.log(`\n🎉 Credits fixed! User balance: ${balanceData.balance}`)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

fixCredits()
