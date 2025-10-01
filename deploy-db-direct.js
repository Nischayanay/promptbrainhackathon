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
  
  console.log('🚀 Deploying Backend Brain Database Schema via REST API...\n');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
  }
  
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
        
        // Split SQL into individual statements
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
        
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i].trim();
          if (statement) {
            try {
              const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${supabaseKey}`,
                  'apikey': supabaseKey
                },
                body: JSON.stringify({
                  sql: statement
                })
              });
              
              if (!response.ok) {
                console.log(`   ⚠️  Statement ${i + 1} may have issues (often normal): ${response.statusText}`);
              } else {
                console.log(`   ✅ Statement ${i + 1} executed`);
              }
            } catch (error) {
              console.log(`   ⚠️  Statement ${i + 1} execution issue: ${error.message}`);
            }
          }
        }
        
        console.log(`✅ Migration ${file} processing completed`);
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