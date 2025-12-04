#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get project root directory
const projectRoot = path.resolve(__dirname, '..');
const resultsPath = path.join(projectRoot, 'output', 'allure');

// Check if results directory exists
if (!fs.existsSync(resultsPath)) {
  console.error('❌ Allure results not found at:', resultsPath);
  console.error('Please run tests first: npm test');
  process.exit(1);
}

// Find Allure JAR file
const allurePackagePath = path.join(projectRoot, 'node_modules', 'allure-commandline');
let jarPath = null;

function findJarFile(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      const found = findJarFile(fullPath);
      if (found) return found;
    } else if (file.name.endsWith('.jar') && file.name.includes('allure')) {
      return fullPath;
    }
  }
  
  return null;
}

jarPath = findJarFile(allurePackagePath);

if (!jarPath || !fs.existsSync(jarPath)) {
  console.error('❌ Allure JAR file not found!');
  console.error('Please install allure-commandline: npm install --save-dev allure-commandline');
  process.exit(1);
}

console.log('🚀 Starting Allure server...');
console.log('📊 Results:', resultsPath);
console.log('📦 JAR:', jarPath);
console.log('🌐 Report will open in browser automatically...\n');

// Change to project root
process.chdir(projectRoot);

// Run Allure serve using Java directly
try {
  execSync(`java -jar "${jarPath}" serve "${resultsPath}"`, {
    stdio: 'inherit',
    cwd: projectRoot
  });
} catch (error) {
  // User pressed Ctrl+C to stop the server
  if (error.signal === 'SIGINT') {
    console.log('\n\n👋 Allure server stopped.');
    process.exit(0);
  }
  console.error('❌ Error running Allure:', error.message);
  process.exit(1);
}

