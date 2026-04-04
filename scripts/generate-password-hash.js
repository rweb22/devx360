#!/usr/bin/env node

/**
 * Generate Password Hash for Admin Authentication
 * 
 * Usage:
 *   node scripts/generate-password-hash.js
 *   node scripts/generate-password-hash.js YourPassword
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function main() {
  console.log('='.repeat(70));
  console.log('DevX360 Admin Authentication Setup');
  console.log('='.repeat(70));
  console.log();

  // Get password from command line or prompt
  let password = process.argv[2];

  if (!password) {
    console.log('⚠️  No password provided as argument.');
    console.log('   Usage: node scripts/generate-password-hash.js YourPassword');
    console.log();
    console.log('💡 For now, using default password: "admin"');
    console.log('   (You can run this script again with your own password)');
    console.log();
    password = 'admin';
  }

  console.log('🔐 Generating secure hash...');
  console.log();

  // Generate password hash
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  // Generate JWT secret
  const jwtSecret = crypto.randomBytes(32).toString('hex');

  console.log('✅ Generated successfully!');
  console.log();
  console.log('-'.repeat(70));
  console.log('ENVIRONMENT VARIABLES');
  console.log('-'.repeat(70));
  console.log();
  console.log('Add these to your .env file or DigitalOcean environment variables:');
  console.log();
  console.log('JWT_SECRET_KEY=' + jwtSecret);
  console.log('ADMIN_PASSWORD_HASH=' + hash);
  console.log();
  console.log('-'.repeat(70));
  console.log('FOR DIGITALOCEAN APP PLATFORM');
  console.log('-'.repeat(70));
  console.log();
  console.log('1. Go to your app dashboard');
  console.log('2. Settings → App-Level Environment Variables');
  console.log('3. Click "Edit"');
  console.log('4. Add these two variables:');
  console.log();
  console.log('   Name: JWT_SECRET_KEY');
  console.log('   Value: ' + jwtSecret);
  console.log();
  console.log('   Name: ADMIN_PASSWORD_HASH');
  console.log('   Value: ' + hash);
  console.log();
  console.log('5. Save and redeploy');
  console.log();
  console.log('-'.repeat(70));
  console.log('FOR LOCAL DEVELOPMENT (.env file)');
  console.log('-'.repeat(70));
  console.log();
  console.log('Create or edit .env file in your project root:');
  console.log();
  console.log('echo "JWT_SECRET_KEY=' + jwtSecret + '" >> .env');
  console.log('echo "ADMIN_PASSWORD_HASH=' + hash + '" >> .env');
  console.log();
  console.log('-'.repeat(70));
  console.log('LOGIN CREDENTIALS');
  console.log('-'.repeat(70));
  console.log();
  console.log('🌐 Login URL: https://devx360.in/admin/login');
  console.log('👤 Username: admin (implicit)');
  console.log('🔑 Password: ' + password);
  console.log();
  console.log('='.repeat(70));
  console.log();
  console.log('⚠️  SECURITY REMINDERS:');
  console.log('   • Never commit these values to git');
  console.log('   • Use strong passwords in production (12+ characters)');
  console.log('   • Keep these environment variables secure');
  console.log('   • Rotate passwords periodically');
  console.log();
  console.log('✅ Setup complete! You can now deploy and login.');
  console.log();
}

main().catch(console.error);
