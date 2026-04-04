# 🎨 Dynamic Branding & URL Configuration

## Complete White-Label Ready System

Your application is now **100% rebrandable** via environment variables. Change your brand, domain, and all URLs without touching a single line of code.

---

## 🔧 Configuration (.env)

All branding is controlled by these environment variables:

```bash
# URLs and Domain
BASE_URL=http://localhost:3000
BASE_DOMAIN=devx360.in

# Branding
BRAND_NAME=DevX360
BRAND_EMAIL=contact@devx360.in
```

---

## 🎯 Instant Rebranding

### Example 1: Rebrand as "TechCorp"

**Edit `.env`:**
```bash
BASE_URL=https://techcorp.com
BASE_DOMAIN=techcorp.com
BRAND_NAME=TechCorp
BRAND_EMAIL=hello@techcorp.com
```

**Restart server:**
```bash
npm start
```

**Result:**
- Logo: `<TechCorp />`
- Footer: "© 2024 TechCorp"
- Email: hello@techcorp.com
- All demos: healthcare.techcorp.com, jewelry.techcorp.com, etc.

### Example 2: Rebrand as "Digital Solutions Inc"

**Edit `.env`:**
```bash
BRAND_NAME=Digital Solutions Inc
BRAND_EMAIL=contact@digitalsolutions.io
BASE_DOMAIN=digitalsolutions.io
```

**Result:**
- Logo: `<Digital Solutions Inc />`
- Everything else updates automatically

---

## 📋 What's Dynamic

### Brand Name
**Appears in:**
- Header logo (`<DevX360 />`)
- Footer copyright
- Page titles
- Contact forms
- Demo footers
- Startup logs

**EJS Template:**
```ejs
<%=app.brandName%>
```

### Brand Email
**Appears in:**
- Contact links
- Footer contact
- Email forms
- Mailto links

**EJS Template:**
```ejs
<%=app.brandEmail%>
```

### Base Domain
**Appears in:**
- Subdomain generation
- Links
- Demo URLs
- Code examples

**EJS Template:**
```ejs
<%=app.baseDomain%>
```

### Base URL
**Appears in:**
- Absolute links
- Demo cards
- External references
- API endpoints

**EJS Template:**
```ejs
<%=app.baseUrl%>
```

### Subdomain URLs
**Generated automatically:**

**EJS Template:**
```ejs
<%= getSubdomainUrl('healthcare') %>
```

**Development:**
```
http://healthcare.localhost:3000
```

**Production:**
```
https://healthcare.yourcompany.com
```

---

## 🗂️ Files Updated

### Main Site (15 files)
```
views/pages/home.ejs
views/pages/about.ejs
views/pages/contact.ejs
views/pages/services.ejs
views/pages/projects.ejs
views/pages/demos.ejs
views/partials/header.ejs
views/partials/footer.ejs
```

### Demo Sites (5 layouts)
```
views/tenants/healthcare/layout.ejs
views/tenants/jewelry/layout.ejs
views/tenants/realestate/layout.ejs
views/tenants/fashion/layout.ejs
views/tenants/clients/example-client/layout.ejs
```

### Configuration
```
config/app.js (centralized config)
app.js (inject into views)
.env.example (documentation)
```

---

## 🚀 Available Variables

In all EJS templates, you have access to:

### `app` Object
```javascript
app.brandName        // "DevX360"
app.brandEmail       // "contact@devx360.in"
app.baseDomain       // "devx360.in"
app.baseUrl          // "http://localhost:3000"
app.isProduction     // true/false
app.isDevelopment    // true/false
app.nodeEnv          // "development" or "production"
app.port             // 3000
```

### Helper Functions
```javascript
getBaseUrl()                    // http://localhost:3000
getSubdomainUrl('healthcare')   // http://healthcare.localhost:3000
```

---

## 💡 Usage Examples

### In EJS Templates

**Logo:**
```ejs
<span class="logo-name"><%=app.brandName%></span>
```

**Contact Link:**
```ejs
<a href="mailto:<%=app.brandEmail%>"><%=app.brandEmail%></a>
```

**Demo Link:**
```ejs
<a href="<%= getSubdomainUrl('healthcare') %>">
  Visit Healthcare Demo
</a>
```

**Conditional:**
```ejs
<% if (app.isProduction) { %>
  <script src="/analytics.js"></script>
<% } %>
```

---

## 🔒 Fallback Protection

Tenant layouts have fallback values:
```ejs
<%=typeof app!=='undefined'?app.brandName:'DevX360'%>
```

This prevents errors if `app` isn't available.

---

## 📊 Environment Detection

The system auto-detects environment:

**Development:**
- URLs: `http://localhost:3000`
- Subdomains: `subdomain.localhost:3000`

**Production (NODE_ENV=production):**
- URLs: `https://yourcompany.com`
- Subdomains: `subdomain.yourcompany.com`

**Override with BASE_URL:**
```bash
BASE_URL=https://staging.example.com
```

---

## ✅ Testing

1. **Check current branding:**
   ```bash
   npm start
   ```
   Look at startup logs:
   ```
   🚀 DevX360 Multi-Tenant Server Started
   🌐 Base URL: http://localhost:3000
   ```

2. **Test rebranding:**
   ```bash
   # Edit .env
   BRAND_NAME=TestCorp
   
   # Restart
   npm start
   
   # Check startup
   🚀 TestCorp Multi-Tenant Server Started
   ```

3. **Visit site:**
   - Check header logo
   - Check footer
   - Check demos page
   - All should show "TestCorp"

---

## 🎯 Benefits

✅ **White-label ready** - Rebrand for clients  
✅ **No code changes** - Just .env edits  
✅ **Instant updates** - Restart to apply  
✅ **Consistent** - One source of truth  
✅ **Professional** - No hardcoded values  
✅ **Scalable** - Works for all demos  
✅ **Environment-aware** - Auto dev/prod URLs  

---

## 📝 Quick Reference

| Need | Variable | Example |
|------|----------|---------|
| **Company name** | `BRAND_NAME` | "MyCompany" |
| **Contact email** | `BRAND_EMAIL` | "hi@mycompany.com" |
| **Your domain** | `BASE_DOMAIN` | "mycompany.com" |
| **Full URL** | `BASE_URL` | "https://mycompany.com" |

**That's it!** Change these 4 variables to rebrand everything.

---

## 🚀 Production Deployment

**Your .env for production:**
```bash
NODE_ENV=production
BASE_URL=https://yourcompany.com
BASE_DOMAIN=yourcompany.com
BRAND_NAME=Your Company
BRAND_EMAIL=contact@yourcompany.com
PORT=3000
```

All demos automatically work:
- healthcare.yourcompany.com
- jewelry.yourcompany.com
- realestate.yourcompany.com
- fashion.yourcompany.com
- clientname.yourcompany.com

**Zero configuration needed!** ✨
