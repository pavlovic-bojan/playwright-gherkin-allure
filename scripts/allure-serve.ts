#!/usr/bin/env node

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Allure Server Script
 * 
 * Starts Allure server to view test results.
 * Handles Windows path issues by finding and executing the Allure JAR directly.
 */

// Get project root directory
const projectRoot = path.resolve(__dirname, '..');
const resultsPath = path.join(projectRoot, 'output', 'allure');

/**
 * Recursively finds the Allure JAR file in the node_modules directory
 * @param dir - Directory to search in
 * @returns Path to the JAR file or null if not found
 */
function findJarFile(dir: string): string | null {
  try {
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
  } catch (error) {
    // Ignore permission errors or other filesystem issues
  }
  
  return null;
}

/**
 * Main function to start the Allure server
 */
function main(): void {
  // Check if results directory exists
  if (!fs.existsSync(resultsPath)) {
    console.error('❌ Allure results not found at:', resultsPath);
    console.error('Please run tests first: npm test');
    process.exit(1);
  }

  // Find Allure JAR file
  const allurePackagePath = path.join(projectRoot, 'node_modules', 'allure-commandline');
  const jarPath = findJarFile(allurePackagePath);

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
  } catch (error: any) {
    // User pressed Ctrl+C to stop the server
    if (error.signal === 'SIGINT') {
      console.log('\n\n👋 Allure server stopped.');
      process.exit(0);
    }
    console.error('❌ Error running Allure:', error.message);
    process.exit(1);
  }
}

// Run main function
main();
