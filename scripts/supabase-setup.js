#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = 'reset') {
  console.log(colorize(message, color));
}

function prompt(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  log('\n🗄️  Supabase Project Setup', 'cyan');
  log('='*40, 'cyan');
  
  try {
    // Check if Supabase CLI is installed
    execSync('supabase --version', { stdio: 'ignore' });
    log('✅ Supabase CLI found!', 'green');
  } catch (error) {
    log('❌ Supabase CLI not found. Installing...', 'red');
    try {
      execSync('npm install -g supabase', { stdio: 'inherit' });
      log('✅ Supabase CLI installed!', 'green');
    } catch (installError) {
      log('❌ Failed to install Supabase CLI. Please install manually:', 'red');
      log('npm install -g supabase', 'cyan');
      return;
    }
  }
  
  // Check if already logged in
  try {
    execSync('supabase projects list', { stdio: 'ignore' });
    log('✅ Already logged in to Supabase!', 'green');
  } catch (error) {
    log('🔐 Please login to Supabase...', 'yellow');
    try {
      execSync('supabase login', { stdio: 'inherit' });
      log('✅ Logged in successfully!', 'green');
    } catch (loginError) {
      log('❌ Login failed. Please try again manually:', 'red');
      log('supabase login', 'cyan');
      return;
    }
  }
  
  log('\n📋 Choose setup option:', 'bright');
  log('1. 🔗 Link existing Supabase project', 'green');
  log('2. 🆕 Create new Supabase project', 'blue');
  log('3. 🏠 Initialize local development only', 'magenta');
  
  const choice = await prompt('\nEnter your choice (1-3): ');
  
  switch (choice) {
    case '1':
      await linkExistingProject();
      break;
    case '2':
      await createNewProject();
      break;
    case '3':
      await initLocalDevelopment();
      break;
    default:
      log('Invalid choice. Defaulting to local development.', 'yellow');
      await initLocalDevelopment();
  }
}

async function linkExistingProject() {
  log('\n🔗 Linking existing project...', 'blue');
  
  try {
    // List available projects
    log('📋 Available projects:', 'cyan');
    execSync('supabase projects list', { stdio: 'inherit' });
    
    const projectRef = await prompt('\nEnter your project reference (ref): ');
    
    // Link the project
    execSync(`supabase link --project-ref ${projectRef}`, { stdio: 'inherit' });
    
    // Generate types
    log('\n🔧 Generating TypeScript types...', 'yellow');
    execSync('supabase gen types typescript --linked > lib/supabase/types.ts', { stdio: 'inherit' });
    
    log('✅ Project linked successfully!', 'green');
    await updateEnvFile(projectRef);
    
  } catch (error) {
    log('❌ Failed to link project. Check your project reference.', 'red');
  }
}

async function createNewProject() {
  log('\n🆕 Creating new project...', 'blue');
  
  const projectName = await prompt('Enter project name: ');
  const orgId = await prompt('Enter organization ID: ');
  const plan = await prompt('Enter plan (free/pro) [free]: ') || 'free';
  const region = await prompt('Enter region (us-east-1/eu-west-1/etc) [us-east-1]: ') || 'us-east-1';
  
  try {
    log('🏗️  Creating project (this may take a few minutes)...', 'yellow');
    const result = execSync(
      `supabase projects create ${projectName} --org-id ${orgId} --plan ${plan} --region ${region}`,
      { encoding: 'utf8' }
    );
    
    // Extract project reference from output
    const projectRef = result.match(/Project ref: (.+)/)?.[1];
    
    if (projectRef) {
      log(`✅ Project created! Reference: ${projectRef}`, 'green');
      
      // Link the new project
      execSync(`supabase link --project-ref ${projectRef}`, { stdio: 'inherit' });
      
      // Generate types
      log('🔧 Generating TypeScript types...', 'yellow');
      execSync('supabase gen types typescript --linked > lib/supabase/types.ts', { stdio: 'inherit' });
      
      await updateEnvFile(projectRef);
    } else {
      log('⚠️  Project created but could not extract reference. Please link manually.', 'yellow');
    }
    
  } catch (error) {
    log('❌ Failed to create project. Please check your inputs.', 'red');
  }
}

async function initLocalDevelopment() {
  log('\n🏠 Initializing local development...', 'magenta');
  
  try {
    // Initialize Supabase locally
    execSync('supabase init', { stdio: 'inherit' });
    
    // Start local development
    const startLocal = await prompt('Start local Supabase instance? (y/N): ');
    if (startLocal.toLowerCase() === 'y') {
      log('🚀 Starting local Supabase (this may take a few minutes)...', 'yellow');
      execSync('supabase start', { stdio: 'inherit' });
      
      // Update .env.local with local credentials
      const envContent = `
# Local Supabase Development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
`.trim();
      
      fs.writeFileSync('.env.local', envContent);
      log('✅ Local development environment configured!', 'green');
    }
    
  } catch (error) {
    log('❌ Failed to initialize local development.', 'red');
  }
}

async function updateEnvFile(projectRef) {
  log('\n📝 Updating environment file...', 'yellow');
  
  try {
    // Get project details
    const projectDetails = execSync(`supabase projects list --output json`, { encoding: 'utf8' });
    const projects = JSON.parse(projectDetails);
    const project = projects.find(p => p.ref === projectRef);
    
    if (project) {
      // Get project API keys
      const apiKeys = execSync(`supabase projects api-keys list --project-ref ${projectRef} --output json`, { encoding: 'utf8' });
      const keys = JSON.parse(apiKeys);
      
      const anonKey = keys.find(k => k.name === 'anon')?.api_key;
      const serviceKey = keys.find(k => k.name === 'service_role')?.api_key;
      
      const envContent = `
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://${projectRef}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceKey}

# Database URL (for migrations)
DATABASE_URL=${project.database?.host || 'your-db-url'}
`.trim();
      
      fs.writeFileSync('.env.local', envContent);
      log('✅ Environment file updated!', 'green');
    }
    
  } catch (error) {
    log('⚠️  Could not auto-update environment file. Please update manually.', 'yellow');
  }
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});