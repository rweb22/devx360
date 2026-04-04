# Vercel Deployment Guide

## ⚠️ Subdomain Limitation on Vercel Free Tier

**Vercel free tier does NOT support wildcard subdomains** like `healthcare.devx360.vercel.app`.

You have **three options**:

---

## ✅ Option 1: Use Path-Based Routes (Works Now!)

Your application already supports path-based routing as a fallback.

### Working URLs:

```
https://devx360.vercel.app/healthcare
https://devx360.vercel.app/jewelry
https://devx360.vercel.app/realestate
https://devx360.vercel.app/fashion
https://devx360.vercel.app/demos
https://devx360.vercel.app/client/example-client
```

**These work immediately - no changes needed!**

---

## ✅ Option 2: Add Custom Domain (Enables Subdomains)

If you own `devx360.in` and want subdomain routing:

### Step 1: Add Domain to Vercel

1. Go to your Vercel project
2. Settings → Domains
3. Add `devx360.in`
4. Add `*.devx360.in` (wildcard subdomain)

### Step 2: Configure DNS

Update your DNS provider (Namecheap, Cloudflare, etc.):

```
Type    Name    Value
A       @       76.76.21.21
CNAME   *       cname.vercel-dns.com
```

### Step 3: Update Environment Variables

In Vercel dashboard:
```
BASE_DOMAIN=devx360.in
BASE_URL=https://devx360.in
```

### Result:

```
https://devx360.in                 (main site)
https://healthcare.devx360.in      (healthcare demo)
https://jewelry.devx360.in         (jewelry demo)
https://realestate.devx360.in      (real estate demo)
https://fashion.devx360.in         (fashion demo)
```

---

## ✅ Option 3: Use Vercel Preview Deployments

Each branch gets its own URL:

```
main branch:      devx360.vercel.app
feature branch:   devx360-git-feature.vercel.app
```

But still **no subdomain support** on free tier.

---

## 🔧 Vercel Configuration

The `vercel.json` file is already configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/public/(.*)",
      "dest": "/public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/app.js"
    }
  ]
}
```

---

## 🌐 Environment Variables on Vercel

Set these in Vercel Dashboard → Settings → Environment Variables:

### Required:
```
NODE_ENV=production
BASE_URL=https://devx360.vercel.app
BASE_DOMAIN=devx360.vercel.app
```

### Optional (for branding):
```
BRAND_NAME=DevX360
BRAND_EMAIL=contact@devx360.in
```

### Security (generate with scripts/generate-secrets.js):
```
JWT_SECRET_KEY=your-secret-here
ADMIN_PASSWORD_HASH=your-hash-here
```

---

## 🚀 Deployment Steps

### Initial Deployment:

1. **Connect to GitHub:**
   - Go to vercel.com
   - Import your GitHub repository
   - Select `devx360` repo

2. **Configure Build:**
   - Framework Preset: Other
   - Build Command: `npm run build` (or leave default)
   - Output Directory: (leave empty for Node.js)
   - Install Command: `npm install`

3. **Set Environment Variables:**
   - Add the variables listed above

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

### Subsequent Deployments:

Automatic on every `git push` to main branch!

---

## 📋 Vercel vs Self-Hosted Comparison

| Feature | Vercel Free | Self-Hosted (DigitalOcean) |
|---------|-------------|----------------------------|
| **Subdomain Support** | ❌ Requires custom domain | ✅ Full wildcard support |
| **Path Routes** | ✅ Works perfectly | ✅ Works perfectly |
| **Custom Domain** | ✅ Free SSL | ✅ Free SSL (Let's Encrypt) |
| **Wildcard Subdomain** | ⚠️ Paid plan + custom domain | ✅ Free with DNS setup |
| **Auto Deploy** | ✅ On git push | ⚠️ Manual or CI/CD setup |
| **Cost** | 💰 Free | 💰 $5-10/month |
| **Performance** | ✅ Edge network | ⚠️ Single server |
| **Scalability** | ✅ Auto-scales | ⚠️ Manual scaling |

---

## 🎯 Recommended Approach

### For Testing (Current):
Use **path-based routes** on Vercel:
```
https://devx360.vercel.app/healthcare
```

### For Production:
**Option A:** Add custom domain to Vercel (best if you own domain)
```
https://healthcare.devx360.in
```

**Option B:** Deploy to DigitalOcean/VPS for full subdomain control
```
https://healthcare.devx360.in
```

---

## 🐛 Troubleshooting

### "Secure Connection Failed" or "PR_END_OF_FILE_ERROR"

This error occurs when trying to access:
```
https://healthcare.devx360.vercel.app
```

**Cause:** Vercel doesn't support subdomains on `*.vercel.app` for free tier.

**Solution:** Use path-based routes instead:
```
https://devx360.vercel.app/healthcare
```

### 404 Not Found

- Check `vercel.json` is committed
- Verify routes are configured
- Check deployment logs in Vercel dashboard

### Environment Variables Not Working

- Go to Vercel Dashboard → Settings → Environment Variables
- Add variables for Production environment
- Redeploy after adding variables

---

## 📝 Current Status

### ✅ Working on Vercel:
```
https://devx360.vercel.app                    (main site)
https://devx360.vercel.app/healthcare         (healthcare demo)
https://devx360.vercel.app/jewelry            (jewelry demo)
https://devx360.vercel.app/realestate         (real estate demo)
https://devx360.vercel.app/fashion            (fashion demo)
https://devx360.vercel.app/demos              (demos page)
https://devx360.vercel.app/about              (about page)
```

### ❌ NOT Working on Vercel Free:
```
https://healthcare.devx360.vercel.app         (subdomain not supported)
https://jewelry.devx360.vercel.app            (subdomain not supported)
```

---

## 🎓 Summary

1. **Vercel free tier** = No wildcard subdomains
2. **Path routes** = Work perfectly (use these!)
3. **Custom domain** = Enables subdomains (requires domain ownership)
4. **Your app supports both** = Already configured!

**Use path-based routes for now. Add custom domain later for subdomains.**

---

## 🔗 Useful Links

- [Vercel Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Node.js on Vercel](https://vercel.com/docs/runtimes#official-runtimes/node-js)
