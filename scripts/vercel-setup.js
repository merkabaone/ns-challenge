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
  log('\n🚀 Vercel Deployment Setup', 'cyan');
  log('='*40, 'cyan');
  
  try {
    // Check if Vercel CLI is installed
    execSync('vercel --version', { stdio: 'ignore' });
    log('✅ Vercel CLI found!', 'green');
  } catch (error) {
    log('❌ Vercel CLI not found. Installing...', 'red');
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      log('✅ Vercel CLI installed!', 'green');
    } catch (installError) {
      log('❌ Failed to install Vercel CLI. Please install manually:', 'red');
      log('npm install -g vercel', 'cyan');
      return;
    }
  }
  
  // Check if already logged in
  try {
    execSync('vercel whoami', { stdio: 'ignore' });
    log('✅ Already logged in to Vercel!', 'green');
  } catch (error) {
    log('🔐 Please login to Vercel...', 'yellow');
    try {
      execSync('vercel login', { stdio: 'inherit' });
      log('✅ Logged in successfully!', 'green');
    } catch (loginError) {
      log('❌ Login failed. Please try again manually:', 'red');
      log('vercel login', 'cyan');
      return;
    }
  }
  
  log('\n📋 Choose deployment option:', 'bright');
  log('1. 🚀 Deploy now and setup environment variables', 'green');
  log('2. 🔧 Setup project configuration only', 'blue');
  log('3. 🌐 Setup environment variables for existing project', 'magenta');
  
  const choice = await prompt('\nEnter your choice (1-3): ');
  
  switch (choice) {
    case '1':
      await deployAndSetup();
      break;
    case '2':
      await setupProjectOnly();
      break;
    case '3':
      await setupEnvironmentVars();
      break;
    default:
      log('Invalid choice. Defaulting to project setup.', 'yellow');
      await setupProjectOnly();
  }
}

async function deployAndSetup() {
  log('\n🚀 Deploying to Vercel...', 'blue');
  
  try {
    // Deploy the project
    execSync('vercel --prod', { stdio: 'inherit' });
    
    // Get project info
    const projectInfo = execSync('vercel project ls --format json', { encoding: 'utf8' });
    const projects = JSON.parse(projectInfo);
    const currentProject = projects.find(p => p.name === 'ns-challenge');
    
    if (currentProject) {
      log(`✅ Deployed successfully! Project: ${currentProject.name}`, 'green');
      await setupEnvironmentVars(currentProject.name);
    } else {
      log('⚠️  Deployment successful but could not find project details.', 'yellow');
      await setupEnvironmentVars();
    }
    
  } catch (error) {
    log('❌ Deployment failed. Please check your project configuration.', 'red');
  }
}

async function setupProjectOnly() {
  log('\n🔧 Setting up project configuration...', 'blue');
  
  try {
    // Link project (this will create vercel.json if needed)
    execSync('vercel link', { stdio: 'inherit' });
    
    log('✅ Project linked successfully!', 'green');
    log('💡 Use "vercel --prod" to deploy when ready.', 'cyan');
    
  } catch (error) {
    log('❌ Failed to link project.', 'red');
  }
}

async function setupEnvironmentVars(projectName) {
  log('\n🌐 Setting up environment variables...', 'magenta');
  
  // Read .env.local if it exists
  const envPath = '.env.local';
  if (!fs.existsSync(envPath)) {
    log('⚠️  .env.local not found. Please create it first.', 'yellow');
    return;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  // Parse environment variables
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    }
  });
  
  // Filter only the variables we want to set on Vercel
  const vercelVars = Object.entries(envVars).filter(([key]) => 
    key.startsWith('NEXT_PUBLIC_') || key === 'SUPABASE_SERVICE_ROLE_KEY'
  );
  
  if (vercelVars.length === 0) {
    log('⚠️  No environment variables found to set.', 'yellow');
    return;
  }
  
  log(`📝 Found ${vercelVars.length} environment variables to set:`, 'cyan');
  vercelVars.forEach(([key]) => log(`  - ${key}`, 'cyan'));
  
  const confirm = await prompt('\nSet these variables on Vercel? (y/N): ');
  if (confirm.toLowerCase() !== 'y') {
    log('Setup cancelled.', 'yellow');
    return;
  }
  
  // Set environment variables on Vercel
  for (const [key, value] of vercelVars) {
    try {
      const projectFlag = projectName ? `--project-name=${projectName}` : '';
      execSync(`vercel env add ${key} ${projectFlag}`, { 
        input: `${value}\n`,
        stdio: ['pipe', 'inherit', 'inherit']
      });
      log(`✅ Set ${key}`, 'green');
    } catch (error) {
      log(`❌ Failed to set ${key}`, 'red');
    }
  }
  
  log('\n🎉 Environment variables setup complete!', 'green');
  log('💡 You can manage them at: https://vercel.com/dashboard', 'cyan');
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});