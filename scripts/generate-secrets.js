#!/usr/bin/env node

/**
 * Generate Secrets Script
 * 
 * Generates secure JWT_SECRET_KEY and ADMIN_PASSWORD_HASH for production use.
 * 
 * Usage:
 *   node scripts/generate-secrets.js [password]
 * 
 * If password not provided, will prompt for input.
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const readline = require('readline');

console.log('='.repeat(60));
console.log('🔐 Generating Production Secrets');
console.log('='.repeat(60));
console.log();

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('✅ JWT_SECRET_KEY generated:');
console.log(`   ${jwtSecret}`);
console.log();

// Get password from command line or prompt
const passwordArg = process.argv[2];

if (passwordArg) {
  generatePasswordHash(passwordArg);
} else {
  promptForPassword();
}

function promptForPassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter admin password (or press Enter for default "admin"): ', (password) => {
    rl.close();
    const finalPassword = password || 'admin';
    
    if (finalPassword === 'admin') {
      console.log('⚠️  WARNING: Using default password "admin" - NOT SECURE FOR PRODUCTION!');
      console.log();
    }
    
    generatePasswordHash(finalPassword);
  });
}

function generatePasswordHash(password) {
  bcrypt.hash(password, 10).then(hash => {
    console.log('✅ ADMIN_PASSWORD_HASH generated:');
    console.log(`   ${hash}`);
    console.log();
    console.log('='.repeat(60));
    console.log('📝 Add these to your .env file:');
    console.log('='.repeat(60));
    console.log();
    console.log(`JWT_SECRET_KEY=${jwtSecret}`);
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log();
    console.log('⚠️  NEVER commit these values to git!');
    console.log('⚠️  Keep them in .env (which is in .gitignore)');
    console.log();
  }).catch(err => {
    console.error('❌ Error generating password hash:', err);
    process.exit(1);
  });
}
