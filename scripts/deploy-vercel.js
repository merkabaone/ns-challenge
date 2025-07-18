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
  log('\n🚀 Vercel Deployment with Environment Variables', 'cyan');
  log('='*50, 'cyan');
  
  // Check if .env.local exists
  const envPath = '.env.local';
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local not found. Please create it first with your environment variables.', 'red');
    return;
  }
  
  // Read and parse environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    }
  });
  
  // Filter environment variables for Vercel
  const vercelVars = Object.entries(envVars).filter(([key]) => 
    key.startsWith('NEXT_PUBLIC_') || 
    key === 'SUPABASE_SERVICE_ROLE_KEY' ||
    key === 'WHISPER_API'
  );
  
  log(`\n📋 Found ${vercelVars.length} environment variables:`, 'cyan');
  vercelVars.forEach(([key]) => log(`  - ${key}`, 'cyan'));
  
  try {
    // Check if Vercel CLI is installed
    execSync('vercel --version', { stdio: 'ignore' });
    log('\n✅ Vercel CLI found!', 'green');
  } catch (error) {
    log('\n❌ Vercel CLI not found. Installing...', 'red');
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
  log('1. 🚀 Deploy with automatic environment variable setup', 'green');
  log('2. 🔧 Set environment variables only (no deploy)', 'blue');
  log('3. ⚡ Deploy without environment variables', 'yellow');
  
  const choice = await prompt('\nEnter your choice (1-3): ');
  
  if (choice === '1' || choice === '2') {
    log('\n🌐 Setting up environment variables...', 'blue');
    
    // Set environment variables
    for (const [key, value] of vercelVars) {
      try {
        log(`Setting ${key}...`, 'yellow');
        
        // Use vercel env add command
        const child = execSync(`echo "${value}" | vercel env add ${key} production`, { 
          stdio: ['pipe', 'pipe', 'pipe'],
          encoding: 'utf8'
        });
        
        log(`✅ Set ${key}`, 'green');
      } catch (error) {
        // Variable might already exist, try to update
        try {
          log(`Updating ${key}...`, 'yellow');
          execSync(`echo "${value}" | vercel env rm ${key} production -y`, { stdio: 'ignore' });
          execSync(`echo "${value}" | vercel env add ${key} production`, { stdio: 'ignore' });
          log(`✅ Updated ${key}`, 'green');
        } catch (updateError) {
          log(`⚠️  Could not set ${key} (may already exist)`, 'yellow');
        }
      }
    }
    
    log('\n✅ Environment variables configured!', 'green');
  }
  
  if (choice === '1' || choice === '3') {
    log('\n🚀 Deploying to Vercel...', 'blue');
    
    try {
      // Deploy to production
      execSync('vercel --prod', { stdio: 'inherit' });
      log('\n🎉 Deployment successful!', 'green');
      
      // Get deployment URL
      try {
        const deploymentUrl = execSync('vercel --prod --confirm', { encoding: 'utf8' }).trim();
        log(`\n🌐 Your app is live at: ${deploymentUrl}`, 'cyan');
      } catch (urlError) {
        log('🌐 Check your Vercel dashboard for the deployment URL', 'cyan');
      }
      
    } catch (deployError) {
      log('\n❌ Deployment failed. Please check the error above.', 'red');
      log('💡 Try running: vercel --prod', 'cyan');
    }
  }
  
  log('\n📚 Useful commands:', 'bright');
  log('vercel --prod              # Deploy to production', 'cyan');
  log('vercel env ls              # List environment variables', 'cyan');
  log('vercel logs               # View deployment logs', 'cyan');
  log('vercel --help             # Get help', 'cyan');
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});