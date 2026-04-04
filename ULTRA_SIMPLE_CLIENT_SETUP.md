# ⚡ Ultra-Simple Client Demo Setup

## It Can't Get Simpler Than This

---

## 🎯 ONE Command to Add a Client

```bash
./scripts/create-client.sh techcorp "TechCorp Inc" "#2563eb"
```

**Output:**
```
✅ Created views/tenants/clients/techcorp/
✅ Added to config/clients.txt
✅ Client demo created successfully!
```

**Restart server:**
```bash
npm start
```

**Access:**
```
http://techcorp.localhost:3000
http://techcorp.localhost:3000/features
http://techcorp.localhost:3000/contact
```

**DONE!** That's the entire process.

---

## 📝 What You Need to Know

### 1. Clients are Listed in ONE Text File

**File:** `config/clients.txt`

```txt
# My active clients
techcorp
acmecorp
example-client
```

### 2. One Line Per Client

- Client name = folder name in `views/tenants/clients/`
- Lines starting with `#` are comments (ignored)
- Empty lines are ignored

### 3. Brand Configuration (.env)

All branding is configurable via environment variables:
```bash
BASE_URL=http://localhost:3000
BASE_DOMAIN=localhost
BRAND_NAME=DevX360
BRAND_EMAIL=contact@devx360.in
```

Change these to rebrand instantly!

### 3. Enable/Disable by Adding/Removing Lines

**Enable:**
```txt
techcorp
```

**Disable:** (comment out or delete)
```txt
# techcorp
```

**That's it!** No code editing. Just a text file.

---

## 🌐 Subdomain Routing (Professional URLs)

Your clients get clean subdomain URLs:

```
techcorp.localhost:3000          (development)
techcorp.devx360.in              (production)
```

**NOT** path-based:
```
❌ localhost:3000/client/techcorp
```

Works exactly like permanent demos:
```
✓ healthcare.devx360.in
✓ jewelry.devx360.in
✓ techcorp.devx360.in  ← Client demo
```

---

## 📂 Folder Structure

```
views/tenants/clients/techcorp/
├── layout.ejs       ← Wrapper (header/footer)
├── home.ejs         ← Homepage (at techcorp.localhost:3000/)
├── features.ejs     ← Features page (at /features)
├── pricing.ejs      ← Pricing page (at /pricing)
└── contact.ejs      ← Contact page (at /contact)
```

**URL Mapping (Automatic):**
- `home.ejs` → `techcorp.localhost:3000/`
- `features.ejs` → `techcorp.localhost:3000/features`
- `pricing.ejs` → `techcorp.localhost:3000/pricing`
- Any `.ejs` file → Automatic route!

---

## 🔧 Manual Setup (Without CLI)

### Step 1: Create Folder

```bash
mkdir -p views/tenants/clients/myclient
```

### Step 2: Add Files

Create at minimum:
- `layout.ejs` (copy from example-client)
- `home.ejs` (copy from example-client)

### Step 3: Enable in config/clients.txt

Add one line:
```txt
myclient
```

### Step 4: Restart Server

```bash
npm start
```

### Step 5: Access

```
http://myclient.localhost:3000
```

---

## ✅ Complete Checklist

- [ ] Run CLI: `./scripts/create-client.sh clientname "Name" "#color"`
- [ ] Client automatically added to `config/clients.txt` ✓
- [ ] Customize content in `views/tenants/clients/clientname/*.ejs`
- [ ] Restart server: `npm start`
- [ ] Test: `http://clientname.localhost:3000`
- [ ] Deploy (automatic - just git push)

---

## 🎨 Customization

Edit files in your client folder:

```
views/tenants/clients/techcorp/
├── layout.ejs       ← Change logo, colors, branding
├── home.ejs         ← Customize homepage
├── features.ejs     ← Edit features
└── contact.ejs      ← Update contact info
```

No other files to touch!

---

## 🚀 Production URLs

Development:
```
http://techcorp.localhost:3000
```

Production (after deployment):
```
https://techcorp.devx360.in
```

Same code, different domain!

---

## 📊 Summary

| What | How |
|------|-----|
| **Add client** | One CLI command |
| **Enable** | Automatic (or add to clients.txt) |
| **Disable** | Comment out line in clients.txt |
| **URL** | clientname.devx360.in |
| **Add page** | Create .ejs file (auto-routes) |
| **Customize** | Edit files in client folder |
| **Deploy** | Git push (automatic) |

---

## 🎯 The Simplest Process Ever

```
1. Run: ./scripts/create-client.sh clientname
2. Restart server
3. Visit: clientname.localhost:3000
```

**That's it. Three steps. Can't be simpler.** 🎉
