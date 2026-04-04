# Multi-Tenant Setup Guide

## Overview

DevX360 now supports a **multi-tenant architecture** that allows a single Express.js application to serve multiple demo websites via subdomains:

- **Main site**: `devx360.in` or `www.devx360.in`
- **Permanent demos**: `restaurant.devx360.in`, `healthcare.devx360.in`
- **Temporary demos**: `a.devx360.in`, `b.devx360.in`, etc. (managed via GitHub Gist)

## Architecture

### Components

1. **Tenant Configuration** (`config/tenants.js`)
   - Manages permanent (hardcoded) tenants
   - Fetches temporary tenants from GitHub Gist
   - Auto-refreshes every 5 minutes

2. **Tenant Middleware** (`middleware/tenant.js`)
   - Detects subdomain from incoming requests
   - Attaches tenant configuration to `req.tenant`
   - Makes tenant data available to views

3. **Tenant Routes** (`routes/tenant.js`)
   - Handles demo tenant home pages
   - Serves tenant-specific templates

4. **Admin API** (`routes/admin.js`)
   - Provides endpoints to manage and monitor tenants
   - Protected by API key authentication

5. **Tenant Templates** (`views/tenants/`)
   - `restaurant.ejs` - Restaurant demo template
   - `healthcare.ejs` - Healthcare demo template
   - `generic.ejs` - Generic template for temporary tenants

## Configuration

### Environment Variables

Set these environment variables in your deployment:

```bash
# Required for production
BASE_DOMAIN=devx360.in          # Your base domain
PORT=3000                        # Server port (optional, defaults to 3000)

# Optional - for temporary tenants
GIST_ID=abc123def456            # GitHub Gist ID for temporary tenants

# Optional - for admin API security
ADMIN_API_KEY=your-secret-key   # Protects admin endpoints
```

### Local Development

For local development, you can test subdomains using:

1. Edit `/etc/hosts` (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
   ```
   127.0.0.1 localhost
   127.0.0.1 restaurant.localhost
   127.0.0.1 healthcare.localhost
   127.0.0.1 a.localhost
   127.0.0.1 b.localhost
   ```

2. Start the server:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

3. Access different tenants:
   - Main site: `http://localhost:3000`
   - Restaurant: `http://restaurant.localhost:3000`
   - Healthcare: `http://healthcare.localhost:3000`

## DNS Configuration

For production deployment, configure DNS with a **wildcard A record**:

```
A     devx360.in          → Your server IP (e.g., 206.189.141.60)
A     *.devx360.in        → Your server IP (wildcard for all subdomains)
```

This allows all subdomains to point to your single server.

## Managing Temporary Tenants

### Step 1: Create a GitHub Gist

1. Go to https://gist.github.com
2. Create a new gist (can be public or secret)
3. Create a file named **`tenants.json`**
4. Add your tenant configuration (see format below)
5. Save the gist and copy the **Gist ID** from the URL

### Step 2: Gist Format

Example `tenants.json`:

```json
{
  "a": {
    "id": "demo-a",
    "name": "Client A Demo",
    "subdomain": "a",
    "type": "demo",
    "theme": "generic",
    "description": "Custom demo for Client A showcasing our platform",
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "enabled": true
  },
  "b": {
    "id": "demo-b",
    "name": "Client B Demo",
    "subdomain": "b",
    "type": "demo",
    "theme": "generic",
    "description": "Tailored demo for Client B's specific needs",
    "features": ["Real-time analytics", "Custom reports", "API integration"],
    "enabled": true
  }
}
```

### Step 3: Configure Environment Variable

Set the `GIST_ID` environment variable in your DigitalOcean App Platform:

1. Go to your app in DigitalOcean App Platform
2. Navigate to **Settings** → **App-Level Environment Variables**
3. Add: `GIST_ID` = `your-gist-id-here`
4. Redeploy the app

### Step 4: Add/Remove Tenants

To add or remove temporary tenants:

1. Edit your GitHub Gist
2. Update the `tenants.json` content
3. Save the gist
4. Wait up to 5 minutes for auto-refresh OR use the admin dashboard

## Admin Dashboard

### Access

Navigate to:
```
https://devx360.in/admin/login
```

### Authentication

The admin panel uses **JWT (JSON Web Token)** authentication with auto-refresh:

- **Token expiry**: 5 minutes
- **Auto-refresh**: Every 4 minutes (while active)
- **Session**: Maintained as long as you're active

**Default Development Password**: `admin`
**Production**: Set `ADMIN_PASSWORD_HASH` environment variable

See **[ADMIN_AUTH_GUIDE.md](ADMIN_AUTH_GUIDE.md)** for detailed authentication setup.

### Quick Setup

1. **Generate JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Generate Password Hash** (replace 'YourPassword'):
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword', 10).then(console.log)"
   ```

3. **Set Environment Variables**:
   - `JWT_SECRET_KEY` = (generated secret)
   - `ADMIN_PASSWORD_HASH` = (generated hash)

4. **Login**:
   - Visit https://devx360.in/admin/login
   - Enter your password
   - Access the dashboard

### Dashboard Features

- View all active tenants (permanent + temporary)
- Refresh temporary tenants from GitHub Gist
- Real-time session status
- Auto-refresh JWT (keeps you logged in while active)

## Admin API Endpoints

### Authentication

All admin API endpoints require JWT authentication via `Authorization: Bearer <token>` header.

Get token by logging in at `/api/admin/login`.

### Available Endpoints

#### 1. Login
```bash
POST /api/admin/login
Content-Type: application/json

{"password": "your-password"}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "expiresIn": "5m"
}
```

#### 2. Refresh Token
```bash
POST /api/admin/refresh
Authorization: Bearer <token>
```

Response: New token with fresh 5-minute expiry

#### 3. List All Tenants
```bash
GET /api/admin/tenants
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "count": 5,
  "tenants": [...]
}
```

#### 4. Refresh Temporary Tenants
```bash
POST /api/admin/tenants/refresh
Authorization: Bearer <token>
```

Forces immediate refresh from GitHub Gist.

#### 5. Health Check
```bash
GET /api/admin/health
Authorization: Bearer <token>
```

Returns server health and configuration status.

#### 6. Gist Setup Instructions
```bash
GET /api/admin/gist-instructions
Authorization: Bearer <token>
```

Returns detailed instructions for setting up GitHub Gist.

## Permanent Tenants

Permanent tenants are hardcoded in `config/tenants.js`:

- **Main site** (`www` or empty subdomain): DevX360 portfolio
- **restaurant**: Restaurant ordering and reservation demo
- **healthcare**: Healthcare management platform demo

To add more permanent tenants, edit `config/tenants.js`.

## Deployment to DigitalOcean App Platform

### Step 1: Push to Git

All changes are version-controlled. Push to your repository:

```bash
git add .
git commit -m "Add multi-tenant support"
git push origin main
```

### Step 2: Configure Environment Variables

In DigitalOcean App Platform dashboard:

1. Set `BASE_DOMAIN=devx360.in`
2. Set `GIST_ID=your-gist-id` (optional)
3. Set `JWT_SECRET_KEY=your-jwt-secret` (required for admin access)
4. Set `ADMIN_PASSWORD_HASH=your-password-hash` (required for admin access)

### Step 3: Deploy

DigitalOcean will automatically deploy your changes.

## Testing

### Test Locally

```bash
# Terminal 1: Start server
npm start

# Terminal 2: Test endpoints
curl http://localhost:3000
curl http://localhost:3000/api/admin/tenants
```

### Test with Subdomains

Edit `/etc/hosts` and access:
- http://restaurant.localhost:3000
- http://healthcare.localhost:3000

## Troubleshooting

### Subdomain not working

1. Check DNS configuration (wildcard A record)
2. Verify `BASE_DOMAIN` environment variable
3. Check server logs for tenant detection

### Temporary tenants not loading

1. Verify `GIST_ID` is set correctly
2. Check gist is public or accessible
3. Verify `tenants.json` format is valid JSON
4. Call `/api/admin/tenants/refresh` to force refresh

### Admin login fails

1. Check `ADMIN_PASSWORD_HASH` is set correctly
2. In development, default password is `admin`
3. Regenerate password hash if needed
4. See ADMIN_AUTH_GUIDE.md for detailed setup

### JWT token expires immediately

1. Check `JWT_SECRET_KEY` is configured
2. Verify auto-refresh is working (check browser console)
3. Clear localStorage and login again

## Cost

✅ **Completely free solution!**
- GitHub Gist: Free
- No database required
- No external services
- No additional DigitalOcean costs

## Support

For questions or issues, check the main README.md or contact the DevX360 team.
