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
4. Wait up to 5 minutes for auto-refresh OR call the refresh API:

```bash
curl -X POST http://devx360.in/api/admin/tenants/refresh \
  -H "X-API-Key: your-admin-api-key"
```

## Admin API Endpoints

### Authentication

All admin endpoints require an API key. Include it as:
- Header: `X-API-Key: your-secret-key`
- Query param: `?apiKey=your-secret-key`

### Available Endpoints

#### 1. List All Tenants
```bash
GET /api/admin/tenants
```

Response:
```json
{
  "success": true,
  "count": 5,
  "tenants": [...]
}
```

#### 2. Refresh Temporary Tenants
```bash
POST /api/admin/tenants/refresh
```

Forces immediate refresh from GitHub Gist.

#### 3. Health Check
```bash
GET /api/admin/health
```

Returns server health and configuration status.

#### 4. Gist Setup Instructions
```bash
GET /api/admin/gist-instructions
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
3. Set `ADMIN_API_KEY=your-secret-key` (optional but recommended)

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

### Admin API returns 401

1. Set `ADMIN_API_KEY` environment variable
2. Include API key in request header or query param

## Cost

✅ **Completely free solution!**
- GitHub Gist: Free
- No database required
- No external services
- No additional DigitalOcean costs

## Support

For questions or issues, check the main README.md or contact the DevX360 team.
