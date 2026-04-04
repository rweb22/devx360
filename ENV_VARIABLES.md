# Environment Variables Guide

## Overview

This document lists all environment variables used by the application, categorized by requirement level.

---

## ✅ NONE Required (All Have Defaults)

**The application will run with ZERO environment variables set.**

All variables have sensible defaults. However, you should configure them for production.

---

## 📋 All Environment Variables

### 🔧 Server Configuration

#### `PORT`
- **Required:** No
- **Default:** `3000`
- **Description:** Port number the server will listen on
- **Example:** `PORT=8080`

#### `NODE_ENV`
- **Required:** No
- **Default:** `development`
- **Description:** Application environment (development/production)
- **Example:** `NODE_ENV=production`
- **Impact:** 
  - Affects URL generation (http vs https)
  - Enables/disables certain features
  - Changes logging behavior

---

### 🌐 Multi-Tenant Configuration

#### `BASE_DOMAIN`
- **Required:** No
- **Default:** `devx360.in`
- **Description:** Base domain for multi-tenant routing
- **Example:** `BASE_DOMAIN=mycompany.com`
- **Used for:**
  - Subdomain tenant detection
  - Generating demo URLs
  - Cookie domain settings

#### `BASE_URL`
- **Required:** No
- **Default:** Auto-detected based on `NODE_ENV` and `PORT`
  - Development: `http://localhost:3000`
  - Production: `https://{BASE_DOMAIN}`
- **Description:** Full base URL of the application
- **Example:** `BASE_URL=https://mycompany.com`
- **Used for:**
  - Absolute URLs in emails
  - API endpoints
  - Redirect URLs

---

### 🎨 Branding

#### `BRAND_NAME`
- **Required:** No
- **Default:** `DevX360`
- **Description:** Your company/brand name
- **Example:** `BRAND_NAME=MyCompany`
- **Used for:**
  - Logo in header/footer
  - Page titles
  - Email signatures
  - Demo credits

#### `BRAND_EMAIL`
- **Required:** No
- **Default:** `contact@devx360.in`
- **Description:** Primary contact email
- **Example:** `BRAND_EMAIL=hello@mycompany.com`
- **Used for:**
  - Contact forms
  - Footer email links
  - mailto: links

---

### 🔐 Authentication & Security

#### `JWT_SECRET_KEY`
- **Required:** No (but **STRONGLY RECOMMENDED** for production)
- **Default:** Falls back to hardcoded key (INSECURE!)
- **Description:** Secret key for JWT token signing
- **Example:** `JWT_SECRET_KEY=a1b2c3d4e5f6...`
- **Generate:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Security:** 
  - ⚠️ MUST be set in production
  - Keep secret and never commit to git
  - Rotate periodically

#### `ADMIN_PASSWORD_HASH`
- **Required:** No
- **Default:** Uses password "admin" (INSECURE!)
- **Description:** Bcrypt hash of admin password
- **Example:** `ADMIN_PASSWORD_HASH=$2a$10$...`
- **Generate:**
  ```bash
  node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(console.log)"
  ```
- **Security:**
  - ⚠️ MUST be set in production
  - Never commit actual password
  - Use strong password (12+ chars)

---

### 📦 Optional Features

#### `GIST_ID`
- **Required:** No
- **Default:** `null` (feature disabled)
- **Description:** GitHub Gist ID for dynamic tenant configuration
- **Example:** `GIST_ID=abc123def456...`
- **Status:** ⚠️ DEPRECATED - Use `config/clients.txt` instead
- **Note:** This feature was replaced by the simpler clients.txt approach

---

## 🚀 Quick Start Configurations

### Minimal (Development)
```bash
# No .env file needed!
# Application runs with all defaults
```

### Recommended (Development)
```bash
PORT=3000
NODE_ENV=development
BASE_DOMAIN=localhost
BASE_URL=http://localhost:3000
BRAND_NAME=DevX360
BRAND_EMAIL=contact@devx360.in
```

### Production (Secure)
```bash
# Server
PORT=3000
NODE_ENV=production

# Domain & Branding
BASE_DOMAIN=mycompany.com
BASE_URL=https://mycompany.com
BRAND_NAME=MyCompany
BRAND_EMAIL=contact@mycompany.com

# Security (REQUIRED!)
JWT_SECRET_KEY=<generate-with-crypto-randomBytes>
ADMIN_PASSWORD_HASH=<generate-with-bcrypt>
```

---

## 🔍 Environment Variable Priority

1. **Actual .env file** (highest priority)
2. **System environment variables**
3. **Application defaults** (lowest priority)

---

## 📝 Example .env File

See `.env.example` in the repository root for a complete template.

---

## ⚠️ Security Warnings

### Development
- ✅ Default admin password "admin" is OK
- ✅ Default JWT secret is OK
- ✅ http:// URLs are OK

### Production
- ❌ MUST set `JWT_SECRET_KEY`
- ❌ MUST set `ADMIN_PASSWORD_HASH`
- ❌ MUST use https:// (`BASE_URL`)
- ❌ NEVER commit secrets to git
- ✅ Use environment variables or secrets manager

---

## 🧪 Testing Your Configuration

### Check what's loaded:
```bash
npm start
```

Look for startup logs:
```
🌐 Base URL: http://localhost:3000
🏢 Base Domain: devx360.in
🔐 Admin API Key: Not configured (admin endpoints unprotected!)
```

### Verify each variable:
```bash
node -e "require('dotenv').config(); console.log(process.env.BRAND_NAME)"
```

---

## 🔄 Changing Variables

### Development:
1. Edit `.env` file
2. Restart server: `npm start`

### Production:
1. Update environment variables in hosting platform
2. Restart application
3. Verify with startup logs

---

## 📚 Related Documentation

- **DYNAMIC_BRANDING_GUIDE.md** - Detailed branding configuration
- **.env.example** - Template file with all variables
- **config/app.js** - Source code for config handling

---

## Summary Table

| Variable | Required | Default | Production Safe? |
|----------|----------|---------|------------------|
| `PORT` | No | 3000 | ✅ Yes |
| `NODE_ENV` | No | development | ✅ Set to "production" |
| `BASE_DOMAIN` | No | devx360.in | ✅ Change to yours |
| `BASE_URL` | No | Auto-detected | ✅ Set explicitly |
| `BRAND_NAME` | No | DevX360 | ✅ Change to yours |
| `BRAND_EMAIL` | No | contact@devx360.in | ✅ Change to yours |
| `JWT_SECRET_KEY` | No | Hardcoded | ❌ MUST SET |
| `ADMIN_PASSWORD_HASH` | No | "admin" | ❌ MUST SET |
| `GIST_ID` | No | null | ✅ Not used |

---

**TL;DR:** Application runs with zero configuration, but set `JWT_SECRET_KEY` and `ADMIN_PASSWORD_HASH` for production!
