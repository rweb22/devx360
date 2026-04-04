# Admin Authentication Guide

## Overview

The DevX360 admin system uses **JWT (JSON Web Token)** authentication with automatic token refresh to manage tenant configurations. This provides secure, session-based access without requiring a database.

## Authentication Flow

```
1. Admin enters password
   ↓
2. Server validates against ADMIN_PASSWORD_HASH
   ↓
3. Server generates JWT token (5-minute expiry)
   ↓
4. Client stores token in localStorage
   ↓
5. Client auto-refreshes token every 4 minutes
   ↓
6. If inactive for 5+ minutes, token expires → redirect to login
```

## Environment Variables

### Required for Production

```bash
# JWT Secret Key (required)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET_KEY=a1b2c3d4e5f6...

# Admin Password Hash (required)
# Generate: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourSecurePassword123', 10).then(console.log)"
ADMIN_PASSWORD_HASH=$2a$10$abc123def456...
```

### Development Mode

If environment variables are **not set**:
- Default password: `admin`
- Default JWT secret: `default-secret-change-in-production`
- ⚠️ **Warning logged** on startup

## Setting Up Admin Access

### Step 1: Generate JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output:
# 5f8d9c2e1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d
```

### Step 2: Generate Password Hash

```bash
# Replace 'YourSecurePassword123' with your actual password
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourSecurePassword123', 10).then(console.log)"

# Example output:
# $2a$10$rKjK8y5ZqM9X.vW8jP2Xj.aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2u
```

### Step 3: Set Environment Variables

#### For DigitalOcean App Platform:

1. Go to your app in DigitalOcean dashboard
2. **Settings** → **App-Level Environment Variables**
3. Add:
   - `JWT_SECRET_KEY` = (your generated secret)
   - `ADMIN_PASSWORD_HASH` = (your generated hash)
4. **Save** and redeploy

#### For Local Development (.env):

```bash
# .env file
JWT_SECRET_KEY=5f8d9c2e1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d
ADMIN_PASSWORD_HASH=$2a$10$rKjK8y5ZqM9X.vW8jP2Xj.aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2u
```

## Using the Admin Panel

### 1. Access Login Page

```
https://devx360.in/admin/login
```

### 2. Enter Password

- Enter your password (default: `admin` in development)
- Click "Login"

### 3. Dashboard Access

Upon successful login:
- Redirected to `/admin/dashboard`
- JWT token stored in localStorage
- Session indicator shows "● Active Session"

### 4. Auto-Refresh Mechanism

The client automatically refreshes the JWT token:
- **Refresh interval**: Every 4 minutes
- **Token expiry**: 5 minutes
- **Safety margin**: 1 minute before expiry

**Timeline:**
```
0:00 - Login (token issued)
4:00 - Auto-refresh #1 (new token)
8:00 - Auto-refresh #2 (new token)
12:00 - Auto-refresh #3 (new token)
...continues as long as user is active
```

### 5. Session Expiry

If user is **inactive** for 5+ minutes:
- Token expires
- Next API request returns 401
- User redirected to login page

## Admin API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Public Endpoints (No Auth Required)

#### POST /api/admin/login
Authenticate and receive JWT token.

**Request:**
```bash
curl -X POST https://devx360.in/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "your-password"}'
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "5m",
  "message": "Login successful"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": "Invalid password"
}
```

### Protected Endpoints (Auth Required)

#### POST /api/admin/refresh
Refresh JWT token (extends session).

**Request:**
```bash
curl -X POST https://devx360.in/api/admin/refresh \
  -H "Authorization: Bearer <your-token>"
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "5m",
  "message": "Token refreshed successfully"
}
```

#### GET /api/admin/tenants
List all active tenants.

**Request:**
```bash
curl https://devx360.in/api/admin/tenants \
  -H "Authorization: Bearer <your-token>"
```

#### POST /api/admin/tenants/refresh
Force refresh temporary tenants from GitHub Gist.

**Request:**
```bash
curl -X POST https://devx360.in/api/admin/tenants/refresh \
  -H "Authorization: Bearer <your-token>"
```

#### GET /api/admin/health
Health check and configuration status.

**Request:**
```bash
curl https://devx360.in/api/admin/health \
  -H "Authorization: Bearer <your-token>"
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-04-04T10:30:00.000Z",
  "user": {
    "username": "admin",
    "role": "admin",
    "loginTime": "2026-04-04T10:00:00.000Z"
  },
  "config": {
    "gistId": "configured",
    "baseDomain": "devx360.in",
    "jwtSecret": "configured",
    "adminPassword": "configured"
  }
}
```

## Frontend Auto-Refresh Implementation

The dashboard JavaScript automatically handles token refresh:

**Key Features:**
- Refreshes every 4 minutes (before 5-minute expiry)
- Pauses when tab is hidden (saves resources)
- Resumes when tab becomes visible
- Shows session status indicator
- Automatic redirect to login on expiry

**Implementation:**

```javascript
// Auto-refresh every 4 minutes
const REFRESH_INTERVAL = 4 * 60 * 1000;

setInterval(async () => {
    await refreshToken();
}, REFRESH_INTERVAL);

// Pause when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoRefresh();
    } else {
        startAutoRefresh();
        refreshToken(); // Immediate refresh when tab visible
    }
});
```

## Security Features

### Password Hashing
- Uses **bcrypt** with 10 salt rounds
- One-way hashing (cannot be reversed)
- Resistant to rainbow table attacks

### JWT Security
- Signed with secret key (prevents tampering)
- 5-minute expiry (limits exposure if token stolen)
- Issuer validation (`devx360`)
- Auto-refresh keeps session alive for active users

### Best Practices
✅ Use strong passwords (12+ characters, mixed case, numbers, symbols)
✅ Use unique JWT secret (32+ random bytes)
✅ Enable HTTPS in production (DigitalOcean does this automatically)
✅ Rotate passwords periodically
✅ Keep JWT_SECRET_KEY private (never commit to git)

## Troubleshooting

### Cannot Login - "Invalid password"

**Cause:** Password doesn't match hash or hash not set correctly.

**Solution:**
1. Verify `ADMIN_PASSWORD_HASH` is set correctly
2. Regenerate hash:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword', 10).then(console.log)"
   ```
3. Update environment variable
4. Redeploy

### Token Expires Too Quickly

**Cause:** Auto-refresh not working.

**Solution:**
1. Check browser console for errors
2. Ensure `/api/admin/refresh` endpoint is accessible
3. Check network tab - should see refresh call every 4 minutes

### "Unauthorized" on Every Request

**Cause:** JWT_SECRET_KEY mismatch or token invalid.

**Solution:**
1. Clear localStorage: `localStorage.removeItem('admin_token')`
2. Login again
3. Verify JWT_SECRET_KEY is set and matches

### Session Indicator Shows "Session Expired"

**Cause:** Token refresh failed.

**Solution:**
1. Check network tab for failed refresh requests
2. Verify JWT_SECRET_KEY is configured
3. Login again to get fresh token

## Password Reset

Since there's no database, password reset requires environment variable update:

1. Generate new password hash:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NewPassword123', 10).then(console.log)"
   ```

2. Update `ADMIN_PASSWORD_HASH` in environment

3. Redeploy (DigitalOcean App Platform)

4. Login with new password

## Development vs Production

### Development Mode
- Default password: `admin`
- Default JWT secret: `default-secret-change-in-production`
- Warnings logged to console
- Good for testing

### Production Mode
- **Must set** `ADMIN_PASSWORD_HASH`
- **Must set** `JWT_SECRET_KEY`
- No defaults
- Secure configuration required

## Helper Scripts

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate Password Hash
```bash
# Replace 'YourPassword' with actual password
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword', 10).then(console.log)"
```

### Test Password Against Hash
```bash
# Test if password matches hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.compare('YourPassword', '$2a$10$yourHashHere').then(console.log)"
```

## Quick Setup Summary

```bash
# 1. Generate JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "JWT_SECRET_KEY=$JWT_SECRET"

# 2. Generate password hash (change 'YourPassword')
PASS_HASH=$(node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword', 10).then(console.log)")
echo "ADMIN_PASSWORD_HASH=$PASS_HASH"

# 3. Add to DigitalOcean environment variables
# 4. Redeploy
# 5. Login at https://devx360.in/admin/login
```

## Support

For issues or questions:
- Check this guide
- Review browser console for errors
- Check server logs for authentication errors
- Verify environment variables are set correctly
