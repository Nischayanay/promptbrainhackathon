#!/usr/bin/env node

/**
 * Dashboard Revamp Deployment Script
 * 
 * This script handles the deployment of the dashboard revamp features:
 * 1. Runs database migrations
 * 2. Deploys Supabase functions
 * 3. Validates the deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Dashboard Revamp Deployment...\n');

// Check if Supabase CLI is available
try {
  execSync('supabase --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Supabase CLI not found. Please install it first:');
  console.error('npm install -g supabase');
  process.exit(1);
}

// Step 1: Run database migrations
console.log('📊 Running database migrations...');
try {
  execSync('supabase db push', { stdio: 'inherit' });
  console.log('✅ Database migrations completed successfully\n');
} catch (error) {
  console.error('❌ Database migration failed:', error.message);
  process.exit(1);
}

// Step 2: Deploy Supabase functions
console.log('🔧 Deploying Supabase functions...');
const functions = [
  'save-draft',
  'get-draft', 
  'save-session',
  'get-session'
];

for (const func of functions) {
  try {
    console.log(`  Deploying ${func}...`);
    execSync(`supabase functions deploy ${func}`, { stdio: 'inherit' });
    console.log(`  ✅ ${func} deployed successfully`);
  } catch (error) {
    console.error(`  ❌ Failed to deploy ${func}:`, error.message);
    process.exit(1);
  }
}

console.log('\n✅ All Supabase functions deployed successfully\n');

// Step 3: Validate deployment
console.log('🔍 Validating deployment...');

// Check if migration file exists
const migrationFile = 'supabase/migrations/20250210000001_dashboard_revamp_schema.sql';
if (!fs.existsSync(migrationFile)) {
  console.error('❌ Migration file not found:', migrationFile);
  process.exit(1);
}

// Check if function files exist
for (const func of functions) {
  const funcFile = `supabase/functions/${func}/index.ts`;
  if (!fs.existsSync(funcFile)) {
    console.error('❌ Function file not found:', funcFile);
    process.exit(1);
  }
}

console.log('✅ All deployment files validated\n');

// Step 4: Display next steps
console.log('🎉 Dashboard Revamp Deployment Complete!\n');
console.log('Next steps:');
console.log('1. Test the draft persistence functionality');
console.log('2. Test the session management features');
console.log('3. Verify the new chat interface works correctly');
console.log('4. Check the sidebar animations and interactions');
console.log('5. Monitor for any errors in the browser console\n');

console.log('📝 Key Features Deployed:');
console.log('• Input persistence with localStorage + Supabase backup');
console.log('• Session continuity (mode, sidebar state)');
console.log('• Inline chat interface (ChatGPT-like)');
console.log('• Redesigned sidebar with <150ms animations');
console.log('• Modern Apple/Chronicle-inspired design system');
console.log('• Enhanced error handling and loading states\n');

console.log('🔗 API Endpoints Available:');
functions.forEach(func => {
  console.log(`• /functions/v1/${func}`);
});

console.log('\n✨ Happy coding!');