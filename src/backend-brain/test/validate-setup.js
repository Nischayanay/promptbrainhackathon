// Backend Brain Setup Validation
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            process.env[key] = value;
          }
        }
      }
    }
  } catch (error) {
    console.log('Warning: Could not load .env file');
  }
}

async function validateSetup() {
  // Load environment variables first
  loadEnvFile();
  console.log('🔍 Backend Brain Setup Validation\n');

  const checks = [];

  // Check 1: Environment Variables
  console.log('1. Environment Variables');
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GEMINI_API_KEY'
  ];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    if (value) {
      console.log(`   ✅ ${envVar}: Set (${value.substring(0, 10)}...)`);
      checks.push(true);
    } else {
      console.log(`   ❌ ${envVar}: Missing`);
      checks.push(false);
    }
  }

  // Check 2: File Structure
  console.log('\n2. File Structure');
  const requiredFiles = [
    'src/backend-brain/services/backend-brain-service.ts',
    'src/backend-brain/modules/input-analyzer/index.ts',
    'src/backend-brain/modules/context-architect/index.ts',
    'src/backend-brain/database/client.ts',
    'src/backend-brain/types/index.ts'
  ];

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}: Exists`);
      checks.push(true);
    } else {
      console.log(`   ❌ ${file}: Missing`);
      checks.push(false);
    }
  }

  // Check 3: Database Migration Files
  console.log('\n3. Database Migration Files');
  const migrationFiles = [
    'supabase/migrations/20250113140000_daily_credit_refresh.sql',
    'supabase/migrations/20250113150000_backend_brain_schema.sql'
  ];

  for (const file of migrationFiles) {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}: Exists`);
      checks.push(true);
    } else {
      console.log(`   ❌ ${file}: Missing`);
      checks.push(false);
    }
  }

  // Check 4: Supabase Functions
  console.log('\n4. Supabase Functions');
  const functionFiles = [
    'supabase/functions/backend-brain-enhance/index.ts',
    'supabase/functions/daily-credit-refresh/index.ts'
  ];

  for (const file of functionFiles) {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}: Exists`);
      checks.push(true);
    } else {
      console.log(`   ❌ ${file}: Missing`);
      checks.push(false);
    }
  }

  // Check 5: Test Files
  console.log('\n5. Test Files');
  const testFiles = [
    'src/backend-brain/test/demo.ts',
    'src/backend-brain/test/system-test.ts'
  ];

  for (const file of testFiles) {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}: Exists`);
      checks.push(true);
    } else {
      console.log(`   ❌ ${file}: Missing`);
      checks.push(false);
    }
  }

  // Summary
  const passedChecks = checks.filter(Boolean).length;
  const totalChecks = checks.length;
  const percentage = Math.round((passedChecks / totalChecks) * 100);

  console.log('\n' + '='.repeat(50));
  console.log('📊 Validation Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passedChecks}/${totalChecks} checks (${percentage}%)`);

  if (percentage === 100) {
    console.log('🎉 Backend Brain is ready to use!');
    console.log('\n🚀 Next steps:');
    console.log('1. Run: supabase db push (if not done)');
    console.log('2. Test: node src/backend-brain/test/demo.js');
  } else if (percentage >= 80) {
    console.log('⚠️  Backend Brain is mostly ready, but some issues need attention');
    console.log('\n🔧 Fix the issues above, then run the test again');
  } else {
    console.log('❌ Backend Brain needs setup work before it can be used');
    console.log('\n🔧 Please address the missing requirements above');
  }

  return percentage === 100;
}

// Run if called directly
if (require.main === module) {
  validateSetup().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(console.error);
}

module.exports = { validateSetup };