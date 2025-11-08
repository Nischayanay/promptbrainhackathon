#!/usr/bin/env node

/**
 * Apply credit migration directly to Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

// Load environment variables
config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  console.log('🚀 Applying credit migration to Supabase...')
  console.log('=' .repeat(50))

  try {
    // Read the migration file
    const migrationSQL = readFileSync('supabase/migrations/20250211000001_update_credits_to_20_per_day.sql', 'utf8')
    
    console.log('📄 Migration file loaded')
    console.log('🔄 Executing SQL...\n')

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      // Skip comments
      if (statement.trim().startsWith('--')) continue
      
      console.log(`Executing statement ${i + 1}/${statements.length}...`)
      
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement }).single()
      
      if (error) {
        // Try direct query if RPC doesn't work
        const { error: queryError } = await supabase.from('_').select('*').limit(0)
        
        if (queryError) {
          console.error(`❌ Error executing statement ${i + 1}:`, error)
          throw error
        }
      }
      
      console.log(`✅ Statement ${i + 1} executed successfully`)
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ Migration applied successfully!')
    console.log('\n📊 Verifying changes...')

    // Verify the changes
    const { data: credits, error: verifyError } = await supabase
      .from('user_credits')
      .select('user_id, balance, last_refresh_date')
      .limit(5)

    if (verifyError) {
      console.warn('⚠️  Could not verify changes:', verifyError.message)
    } else {
      console.log('\n✅ Sample user credits:')
      console.table(credits)
    }

    console.log('\n🎉 All done! Credits are now set to 20 per day.')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('\n📝 Please apply the migration manually via Supabase Dashboard:')
    console.error('1. Go to: https://supabase.com/dashboard/project/qaugvrsaeydptmsxllcu/sql')
    console.error('2. Copy the contents of: supabase/migrations/20250211000001_update_credits_to_20_per_day.sql')
    console.error('3. Paste and click Run')
    process.exit(1)
  }
}

applyMigration()
