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
    return true;
  } catch (error) {
    log(`❌ ${description} failed!`, 'red');
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  log('\n🛠️  Frontend Development Tools', 'cyan');
  log('='*40, 'cyan');
  
  switch (command) {
    case 'lint':
      log('\n🔍 Running linting checks...', 'blue');
      runCommand('npm run lint', 'ESLint check');
      runCommand('npm run type-check', 'TypeScript check');
      break;
      
    case 'format':
      log('\n💅 Formatting code...', 'blue');
      runCommand('npx prettier --write .', 'Prettier format');
      break;
      
    case 'quality':
      log('\n🎯 Running quality checks...', 'blue');
      runCommand('npm run lint', 'ESLint check');
      runCommand('npm run type-check', 'TypeScript check');
      runCommand('npx prettier --check .', 'Prettier check');
      break;
      
    case 'fix':
      log('\n🔧 Auto-fixing issues...', 'blue');
      runCommand('npx eslint --fix .', 'ESLint auto-fix');
      runCommand('npx prettier --write .', 'Prettier format');
      break;
      
    case 'analyze':
      log('\n📊 Analyzing bundle...', 'blue');
      runCommand('npm run build', 'Build for analysis');
      runCommand('npx @next/bundle-analyzer', 'Bundle analysis');
      break;
      
    case 'deps':
      log('\n📦 Checking dependencies...', 'blue');
      runCommand('npm outdated', 'Check outdated packages');
      runCommand('npm audit', 'Security audit');
      break;
      
    case 'clean':
      log('\n🧹 Cleaning project...', 'blue');
      runCommand('rm -rf .next', 'Clean Next.js cache');
      runCommand('rm -rf node_modules/.cache', 'Clean node_modules cache');
      runCommand('npm prune', 'Remove unused packages');
      break;
      
    case 'setup-hooks':
      log('\n🎣 Setting up Git hooks...', 'blue');
      setupGitHooks();
      break;
      
    case 'perf':
      log('\n⚡ Performance analysis...', 'blue');
      runCommand('npm run build', 'Build for analysis');
      performanceAnalysis();
      break;
      
    default:
      showHelp();
  }
}

function setupGitHooks() {
  const preCommitHook = `#!/bin/sh
# Pre-commit hook for quality checks

echo "🔍 Running pre-commit checks..."

# Run linting
npm run lint || exit 1

# Run type checking
npm run type-check || exit 1

# Run prettier check
npx prettier --check . || exit 1

echo "✅ Pre-commit checks passed!"
`;

  const hooksDir = '.git/hooks';
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }
  
  const preCommitPath = path.join(hooksDir, 'pre-commit');
  fs.writeFileSync(preCommitPath, preCommitHook, { mode: 0o755 });
  
  log('✅ Git hooks installed!', 'green');
}

function performanceAnalysis() {
  log('\n📊 Performance Analysis Report', 'cyan');
  
  try {
    // Check bundle sizes
    const buildDir = '.next/static/chunks';
    if (fs.existsSync(buildDir)) {
      const files = fs.readdirSync(buildDir);
      const jsFiles = files.filter(f => f.endsWith('.js'));
      
      log('📦 Bundle Sizes:', 'blue');
      jsFiles.forEach(file => {
        const stats = fs.statSync(path.join(buildDir, file));
        const sizeKB = (stats.size / 1024).toFixed(2);
        log(`  ${file}: ${sizeKB} KB`, 'cyan');
      });
    }
    
    // Component analysis
    const componentsDir = 'components';
    if (fs.existsSync(componentsDir)) {
      const componentFiles = getAllFiles(componentsDir, '.tsx');
      log(`\n🧩 Components: ${componentFiles.length} files`, 'blue');
      
      componentFiles.forEach(file => {
        const stats = fs.statSync(file);
        const sizeKB = (stats.size / 1024).toFixed(2);
        if (stats.size > 5000) { // > 5KB
          log(`  ⚠️  ${file}: ${sizeKB} KB (large component)`, 'yellow');
        }
      });
    }
    
  } catch (error) {
    log('❌ Performance analysis failed', 'red');
  }
}

function getAllFiles(dir, ext) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, ext));
    } else if (item.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function showHelp() {
  log('\n🛠️  Frontend Development Tools Commands', 'cyan');
  log('='*45, 'cyan');
  log('');
  log('📋 Quality & Linting:', 'bright');
  log('  lint          Run ESLint and TypeScript checks', 'cyan');
  log('  format        Format code with Prettier', 'cyan');
  log('  quality       Run all quality checks', 'cyan');
  log('  fix           Auto-fix linting and formatting issues', 'cyan');
  log('');
  log('📊 Analysis:', 'bright');
  log('  analyze       Analyze bundle size', 'cyan');
  log('  perf          Performance analysis', 'cyan');
  log('  deps          Check dependencies and security', 'cyan');
  log('');
  log('🔧 Maintenance:', 'bright');
  log('  clean         Clean caches and temporary files', 'cyan');
  log('  setup-hooks   Install Git hooks for quality', 'cyan');
  log('');
  log('Usage: node scripts/dev-tools.js <command>', 'yellow');
}

main().catch(console.error);