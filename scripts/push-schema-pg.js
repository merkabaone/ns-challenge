#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function pushSchema() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🚀 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Executing schema migration...');
    
    // Execute the entire SQL file
    await client.query(sql);
    
    console.log('🎉 Schema migration completed successfully!');
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `);
    
    console.log('📊 Tables created:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // If there's an error, try to show which part failed
    if (error.position) {
      console.error('📍 Error position:', error.position);
    }
    
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

pushSchema();