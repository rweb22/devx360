# Quick Start: Multi-Tenant Setup

## 🚀 5-Minute Setup

### 1. Create GitHub Gist (Optional - for temporary demos)

```
1. Visit: https://gist.github.com
2. Create new gist (public or secret)
3. Filename: tenants.json
4. Copy content from: examples/tenants.json.example
5. Save and copy the Gist ID from URL
```

### 2. Set Environment Variables

**DigitalOcean App Platform:**
```
Settings → App-Level Environment Variables

Add these:
- BASE_DOMAIN = devx360.in
- GIST_ID = your-gist-id-here (optional)
- ADMIN_API_KEY = your-secret-key (optional)
```

**Local Development (.env file):**
```bash
cp .env.example .env
# Edit .env and fill in values
```

### 3. Configure DNS

```
DNS Provider (e.g., Cloudflare, GoDaddy):

Type: A     Name: @              Value: YOUR_SERVER_IP
Type: A     Name: *              Value: YOUR_SERVER_IP
```

The wildcard (*) allows all subdomains to work.

### 4. Deploy

```bash
git add .
git commit -m "Add multi-tenant support"
git push origin main
```

DigitalOcean will auto-deploy.

## ✅ Test Your Setup

### Main Site
```
https://devx360.in
or
https://www.devx360.in
```

### Permanent Demos
```
https://healthcare.devx360.in
```

### Temporary Demos (if Gist configured)
```
https://a.devx360.in
https://b.devx360.in
```

### Admin Dashboard
```
https://devx360.in/admin/login

Default password (development): admin
Production: Set ADMIN_PASSWORD_HASH in environment
```

See **[ADMIN_AUTH_GUIDE.md](ADMIN_AUTH_GUIDE.md)** for authentication setup.

## 📝 Managing Temporary Tenants

### Add a New Demo

1. Edit your GitHub Gist
2. Add new tenant to `tenants.json`:

```json
{
  "clientname": {
    "id": "clientname-demo",
    "name": "Client Name Demo",
    "subdomain": "clientname",
    "type": "demo",
    "theme": "generic",
    "description": "Custom demo for this client",
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "enabled": true
  }
}
```

3. Save the gist
4. Wait 5 minutes OR call refresh API
5. Visit: `https://clientname.devx360.in`

### Remove a Demo

**Option 1: Disable (keeps in gist)**
```json
{
  "clientname": {
    ...
    "enabled": false
  }
}
```

**Option 2: Delete (removes completely)**
Just delete the entire tenant object from gist.

## 🔧 Local Development Testing

### Setup /etc/hosts

**macOS/Linux:**
```bash
sudo nano /etc/hosts

# Add these lines:
127.0.0.1 healthcare.localhost
127.0.0.1 a.localhost
127.0.0.1 b.localhost
```

**Windows:**
```
C:\Windows\System32\drivers\etc\hosts

# Add these lines:
127.0.0.1 healthcare.localhost
127.0.0.1 a.localhost
127.0.0.1 b.localhost
```

### Test Locally

```bash
# Start server
npm start

# Visit in browser:
http://localhost:3000                    # Main site
http://restaurant.localhost:3000         # Restaurant demo
http://healthcare.localhost:3000         # Healthcare demo
http://a.localhost:3000                  # Temporary demo A
```

## 📚 Full Documentation

See **[MULTI_TENANT_SETUP.md](MULTI_TENANT_SETUP.md)** for complete documentation.

## 🆘 Troubleshooting

### "Tenant Not Found" error
- Check DNS wildcard record is configured
- Verify BASE_DOMAIN environment variable
- Check subdomain spelling

### Temporary tenants not loading
- Verify GIST_ID is correct
- Check gist is public/accessible
- Validate JSON syntax in tenants.json
- Call /api/admin/tenants/refresh

### Admin panel shows "Invalid password"
- Check ADMIN_PASSWORD_HASH is set correctly
- In development, default password is "admin"
- See ADMIN_AUTH_GUIDE.md for password setup

## 💰 Cost

**$0** - Completely free!
- No database needed
- GitHub Gist is free
- No extra DigitalOcean costs
- Single app serves all tenants

## 🎯 Use Cases

### Permanent Demos
Show capabilities for specific industries (restaurant, healthcare, etc.)

### Temporary Demos
Create custom demos for:
- Client presentations
- Sales demos
- POCs (Proof of Concepts)
- A/B testing different approaches

Remove when done - zero cost to maintain!
