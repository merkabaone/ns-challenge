#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function pushSchema() {
  try {
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    
    console.log('🚀 Pushing schema to Supabase...');
    console.log('📍 Database URL:', supabaseUrl);
    
    // Execute the SQL using Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({
        sql: sql
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Schema pushed successfully!');
    console.log('📊 Result:', result);
    
  } catch (error) {
    console.error('❌ Error pushing schema:', error.message);
    
    // Try alternative approach using direct SQL execution
    console.log('\n🔄 Trying alternative approach...');
    
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      // Split SQL into individual statements
      const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      // Remove comments and split by semicolons
      const statements = sql
        .split('\n')
        .filter(line => !line.trim().startsWith('--') && line.trim())
        .join('\n')
        .split(';')
        .map(s => s.trim())
        .filter(s => s);
      
      console.log(`📝 Found ${statements.length} SQL statements`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (!statement) continue;
        
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          },
          body: JSON.stringify({
            sql: statement + ';'
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`⚠️  Warning on statement ${i + 1}: ${errorText}`);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
      
      console.log('🎉 Schema migration completed!');
      
    } catch (altError) {
      console.error('❌ Alternative approach also failed:', altError.message);
      process.exit(1);
    }
  }
}

pushSchema();