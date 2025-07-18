#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for terminal output
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
  log('\n🚀 NS Challenge - Automated Environment Setup', 'cyan');
  log('='*50, 'cyan');
  
  // Check if .env.local already exists
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    log('\n⚠️  .env.local already exists!', 'yellow');
    const overwrite = await prompt('Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      log('Setup cancelled.', 'yellow');
      return;
    }
  }

  log('\n📋 Choose your setup method:', 'bright');
  log('1. 🔗 I have existing Supabase project credentials', 'green');
  log('2. 🆕 Create new Supabase project (requires Supabase CLI)', 'blue');
  log('3. ⚡ Quick start with placeholder values', 'magenta');
  
  const choice = await prompt('\nEnter your choice (1-3): ');
  
  let envVars = {};
  
  switch (choice) {
    case '1':
      envVars = await setupExistingProject();
      break;
    case '2':
      envVars = await setupNewProject();
      break;
    case '3':
      envVars = await setupPlaceholders();
      break;
    default:
      log('Invalid choice. Using placeholder setup.', 'yellow');
      envVars = await setupPlaceholders();
  }
  
  // Write environment file
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envPath, envContent);
  log(`\n✅ Environment file created at ${envPath}`, 'green');
  
  // Display next steps
  log('\n📦 Next Steps:', 'bright');
  log('1. npm install', 'cyan');
  log('2. npx shadcn@latest init', 'cyan');
  log('3. npm run dev', 'cyan');
  
  if (choice === '3') {
    log('\n⚠️  Remember to update your Supabase credentials in .env.local', 'yellow');
  }
  
  log('\n🎯 Ready for competition! Good luck! 🏆', 'green');
}

async function setupExistingProject() {
  log('\n🔗 Setting up with existing Supabase project...', 'blue');
  
  const supabaseUrl = await prompt('Enter your Supabase URL: ');
  const supabaseAnonKey = await prompt('Enter your Supabase Anon Key: ');
  
  // Optional service role key
  const serviceKey = await prompt('Enter your Service Role Key (optional, press Enter to skip): ');
  
  const vars = {
    'NEXT_PUBLIC_SUPABASE_URL': supabaseUrl,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': supabaseAnonKey,
  };
  
  if (serviceKey) {
    vars['SUPABASE_SERVICE_ROLE_KEY'] = serviceKey;
  }
  
  return vars;
}

async function setupNewProject() {
  log('\n🆕 Setting up new Supabase project...', 'blue');
  
  try {
    // Check if Supabase CLI is installed
    execSync('supabase --version', { stdio: 'ignore' });
  } catch (error) {
    log('❌ Supabase CLI not found. Please install it first:', 'red');
    log('npm install -g supabase', 'cyan');
    log('Then run: supabase login', 'cyan');
    return await setupPlaceholders();
  }
  
  const projectName = await prompt('Enter project name (e.g., ns-challenge): ');
  const orgId = await prompt('Enter your Supabase organization ID: ');
  
  try {
    log('Creating new Supabase project...', 'yellow');
    
    // This would need actual Supabase CLI commands
    // For now, we'll guide the user through manual setup
    log('🔧 Manual setup required:', 'yellow');
    log('1. Go to https://supabase.com/dashboard', 'cyan');
    log('2. Click "New Project"', 'cyan');
    log(`3. Name it "${projectName}"`, 'cyan');
    log('4. Copy the URL and keys when ready', 'cyan');
    
    const continueSetup = await prompt('\nPress Enter when you have your credentials ready...');
    
    return await setupExistingProject();
  } catch (error) {
    log('❌ Error creating project. Using placeholder setup.', 'red');
    return await setupPlaceholders();
  }
}

async function setupPlaceholders() {
  log('\n⚡ Setting up with placeholder values...', 'magenta');
  
  return {
    'NEXT_PUBLIC_SUPABASE_URL': 'https://your-project-id.supabase.co',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'your-anon-key-here',
    'SUPABASE_SERVICE_ROLE_KEY': 'your-service-role-key-here',
    'CUSTOM_KEY': 'your-custom-value-here',
  };
}

// Handle errors gracefully
process.on('SIGINT', () => {
  log('\n\n👋 Setup cancelled by user.', 'yellow');
  process.exit(0);
});

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});