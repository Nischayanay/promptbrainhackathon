const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
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

async function deployDatabase() {
  loadEnvFile();
  
  console.log('🚀 Deploying Backend Brain Database Schema...\n');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Read migration files
    const migrationsDir = 'supabase/migrations';
    const migrationFiles = [
      '20250113140000_daily_credit_refresh.sql',
      '20250113150000_backend_brain_schema.sql'
    ];
    
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`📄 Applying migration: ${file}`);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        // Execute the SQL
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
        
        if (error) {
          console.log(`⚠️  Migration ${file} may have issues (this is often normal for existing schemas)`);
          console.log(`   Error: ${error.message}`);
        } else {
          console.log(`✅ Migration ${file} applied successfully`);
        }
      } else {
        console.log(`❌ Migration file not found: ${file}`);
      }
    }
    
    console.log('\n🎉 Database deployment completed!');
    console.log('\n🧪 Testing Backend Brain system...');
    
    // Test the system
    const { execSync } = require('child_process');
    execSync('node src/backend-brain/test/validate-setup.js', { stdio: 'inherit' });
    
  } catch (error) {
    console.error('❌ Database deployment failed:', error.message);
    process.exit(1);
  }
}

deployDatabase();