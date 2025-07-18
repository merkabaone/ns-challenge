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

function runCommand(command, description) {
  log(`\n🔧 ${description}...`, 'yellow');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed!`, 'green');
  } catch (error) {
    log(`❌ ${description} failed!`, 'red');
    throw error;
  }
}

async function main() {
  log('\n🚀 NS Challenge - Competition Quick Setup', 'cyan');
  log('='*50, 'cyan');
  
  try {
    // Check if we're in the right directory
    if (!fs.existsSync('package.json')) {
      log('❌ Not in project root. Run this from the ns-challenge directory.', 'red');
      return;
    }
    
    log('\n📦 Installing dependencies...', 'blue');
    runCommand('npm install', 'Dependency installation');
    
    log('\n⚙️  Setting up environment...', 'blue');
    if (!fs.existsSync('.env.local')) {
      runCommand('node scripts/setup-env.js', 'Environment setup');
    } else {
      log('✅ Environment file already exists!', 'green');
    }
    
    log('\n🎨 Initializing ShadCN/UI...', 'blue');
    try {
      runCommand('npx shadcn@latest init --yes', 'ShadCN/UI initialization');
    } catch (error) {
      log('⚠️  ShadCN init failed, but continuing...', 'yellow');
    }
    
    log('\n🔧 Adding essential components...', 'blue');
    const components = ['button', 'card', 'input', 'form', 'dialog', 'toast'];
    
    for (const component of components) {
      try {
        runCommand(`npx shadcn@latest add ${component} --yes`, `Adding ${component} component`);
      } catch (error) {
        log(`⚠️  Failed to add ${component}, continuing...`, 'yellow');
      }
    }
    
    log('\n🎯 Competition setup complete!', 'green');
    log('\n📝 Next steps:', 'bright');
    log('1. Update .env.local with your Supabase credentials', 'cyan');
    log('2. npm run dev', 'cyan');
    log('3. Start building your amazing app!', 'cyan');
    
    log('\n🏆 Good luck in the competition!', 'green');
    
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    log('Try running individual commands manually.', 'yellow');
  }
}

main();