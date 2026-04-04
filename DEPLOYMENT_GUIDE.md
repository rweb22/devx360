# Deployment Guide

## ✅ Yes, the Root Directory is the Deployment Directory

Deploy the **entire repository** as-is. The root directory contains everything needed.

---

## 📁 Directory Structure

```
/home/ravi/workspace/devx360/    ← DEPLOY THIS ENTIRE DIRECTORY
├── app.js                       ← Main application entry point
├── package.json                 ← Dependencies and scripts
├── .env                         ← Environment configuration (create this)
├── config/                      ← Configuration files
├── routes/                      ← Route handlers
├── views/                       ← EJS templates
├── public/                      ← Static assets (CSS, JS, images)
├── middleware/                  ← Express middleware
├── scripts/                     ← Helper scripts
└── node_modules/                ← Dependencies (install with npm install)
```

---

## 🚀 Deployment Steps

### 1. Clone Repository

```bash
# SSH to your server
ssh root@206.189.141.60

# Navigate to deployment location
cd /root/lohan

# Clone or pull latest
git clone ssh://root@206.189.141.60/root/lohan/devx360.git
# OR if already cloned:
cd devx360 && git pull origin main
```

### 2. Install Dependencies

```bash
cd devx360
npm install
```

### 3. Create .env File

```bash
nano .env
```

**Minimum for production:**
```bash
NODE_ENV=production
PORT=3000
BASE_URL=https://devx360.in
BASE_DOMAIN=devx360.in
BRAND_NAME=DevX360
BRAND_EMAIL=contact@devx360.in

# Generate these with: node scripts/generate-secrets.js
JWT_SECRET_KEY=your-generated-secret
ADMIN_PASSWORD_HASH=your-generated-hash
```

### 4. Generate Secrets

```bash
node scripts/generate-secrets.js YourAdminPassword
# Copy output to .env
```

### 5. Build Assets (if needed)

```bash
npm run build
```

### 6. Start Application

**Development:**
```bash
npm start
```

**Production (with PM2):**
```bash
pm2 start app.js --name devx360
pm2 save
pm2 startup
```

---

## 🌐 Web Server Configuration (Nginx)

### Nginx Config for Multi-Tenant

```nginx
# Main site
server {
    listen 80;
    server_name devx360.in;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# All subdomains (tenants and clients)
server {
    listen 80;
    server_name *.devx360.in;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📋 Deployment Checklist

- [ ] Repository cloned/pulled to server
- [ ] `npm install` completed
- [ ] `.env` file created with production values
- [ ] `JWT_SECRET_KEY` generated and set
- [ ] `ADMIN_PASSWORD_HASH` generated and set
- [ ] `NODE_ENV=production` set
- [ ] Static assets built (`npm run build`)
- [ ] Application started (PM2 or other process manager)
- [ ] Nginx configured for main domain
- [ ] Nginx configured for wildcard subdomains
- [ ] DNS A records set for domain
- [ ] DNS wildcard record set for subdomains (*.devx360.in)
- [ ] SSL/TLS certificates installed (Let's Encrypt)
- [ ] Firewall configured (port 80, 443)
- [ ] Application accessible at https://devx360.in

---

## 🔍 Verify Deployment

### 1. Check Application is Running

```bash
pm2 status
# Should show 'devx360' as online

curl http://localhost:3000
# Should return HTML
```

### 2. Check Main Site

```bash
curl -H "Host: devx360.in" http://localhost:3000
```

### 3. Check Subdomain

```bash
curl -H "Host: healthcare.devx360.in" http://localhost:3000
```

### 4. Test in Browser

- Main: https://devx360.in
- Healthcare: https://healthcare.devx360.in
- Jewelry: https://jewelry.devx360.in
- Real Estate: https://realestate.devx360.in
- Fashion: https://fashion.devx360.in

---

## 🔄 Update/Redeploy

```bash
# SSH to server
ssh root@206.189.141.60

# Navigate to app directory
cd /root/lohan/devx360

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild assets
npm run build

# Restart application
pm2 restart devx360
```

---

## 📊 What Gets Deployed

**Include:**
- ✅ All `.js` files (app.js, routes/, config/, middleware/)
- ✅ All `.ejs` files (views/)
- ✅ package.json and package-lock.json
- ✅ public/ directory (CSS, JS, images)
- ✅ scripts/ directory
- ✅ .env.example (as template)
- ✅ Documentation (.md files)

**Exclude (in .gitignore):**
- ❌ node_modules/ (install with npm install)
- ❌ .env (create on server with production values)
- ❌ .git/ (automatically excluded when deploying)

---

## 🎯 Quick Deploy (One-Liner)

```bash
cd /root/lohan/devx360 && \
git pull origin main && \
npm install && \
npm run build && \
pm2 restart devx360
```

---

## ⚠️ Important Notes

1. **Never commit .env** - It's in .gitignore for security
2. **Create .env manually** on the server with production values
3. **Use PM2 or similar** - Don't run with `node app.js` in production
4. **Set NODE_ENV=production** - Affects performance and security
5. **Generate unique secrets** - Don't use example values
6. **Backup .env** - Keep a secure backup of production secrets

---

## 🆘 Troubleshooting

### App won't start?
```bash
# Check logs
pm2 logs devx360

# Check if port 3000 is in use
lsof -i :3000
```

### Can't access site?
```bash
# Check Nginx status
systemctl status nginx

# Check Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx
```

### Subdomains not working?
```bash
# Check DNS records
dig healthcare.devx360.in
dig *.devx360.in

# Should point to your server IP
```

---

## 📚 Related Documentation

- **ENV_VARIABLES.md** - All environment variables explained
- **DYNAMIC_BRANDING_GUIDE.md** - How to rebrand
- **ULTRA_SIMPLE_CLIENT_SETUP.md** - Adding client demos
- **.env.example** - Environment template

---

## ✅ Summary

**Deployment Directory:** Root of repository  
**Entry Point:** `app.js`  
**Start Command:** `npm start` or `pm2 start app.js`  
**Environment:** Set via `.env` file  
**Dependencies:** `npm install`  
**Build:** `npm run build` (for CSS)  

**That's it!** The root directory has everything needed for deployment.
