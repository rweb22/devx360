# ⚡ Super Simple Client Demo Setup

## The ONLY 2 Steps You Need

### Step 1: Create Client Folder with Files

**Option A: Use CLI (Recommended)**
```bash
./scripts/create-client.sh clientname "Client Name" "#color"
```

**Option B: Manual**
```bash
mkdir -p views/tenants/clients/myclient
# Add your files: layout.ejs, home.ejs, etc.
```

---

### Step 2: Enable in ONE Place

Edit **`config/tenants.js`** and add your client:

```javascript
const CLIENT_DEMOS = {
  'example-client': {
    name: 'Example Client Demo',
    enabled: true
  },
  
  // 👇 Add your client here
  'myclient': {
    name: 'My Client Name',
    enabled: true  // ✅ Turn on
  }
};
```

**That's it!** Restart the server and visit:
```
http://localhost:3000/client/myclient
```

---

## 🎯 How It Works

### Auto-Discovery Magic ✨

The system automatically:
1. ✅ Scans `views/tenants/clients/` for enabled clients
2. ✅ Finds all `.ejs` files (except layout.ejs)
3. ✅ Creates routes automatically
4. ✅ Maps URLs to files

**File → URL Mapping:**
```
home.ejs      →  /client/myclient
features.ejs  →  /client/myclient/features
pricing.ejs   →  /client/myclient/pricing
contact.ejs   →  /client/myclient/contact
```

**No route configuration needed!** Just create the `.ejs` file.

---

## 📁 Client Folder Structure

```
views/tenants/clients/myclient/
├── layout.ejs       ← Required: Wrapper template
├── home.ejs         ← Required: Homepage
├── features.ejs     ← Optional: Any other page
├── pricing.ejs      ← Optional: Add as many as you want
├── contact.ejs      ← Optional
└── whatever.ejs     ← Optional: Automatic route created!
```

---

## 🔌 Enable/Disable Clients

In `config/tenants.js`:

```javascript
const CLIENT_DEMOS = {
  'client-a': {
    name: 'Client A',
    enabled: true   // ✅ Active
  },
  'client-b': {
    name: 'Client B',
    enabled: false  // ❌ Disabled (404)
  },
  'client-c': {
    name: 'Client C',
    enabled: true   // ✅ Active
  }
};
```

**Just flip the boolean!** No code changes needed.

---

## 🚀 Complete Example

### 1. Create Client

```bash
./scripts/create-client.sh techcorp "TechCorp Inc" "#2563eb"
```

### 2. Enable Client

Edit `config/tenants.js`:
```javascript
const CLIENT_DEMOS = {
  'example-client': { name: 'Example Client Demo', enabled: true },
  'techcorp': { name: 'TechCorp Inc', enabled: true }  // ← Add this
};
```

### 3. Restart Server

```bash
npm start
```

### 4. Done! ✅

```
http://localhost:3000/client/techcorp
http://localhost:3000/client/techcorp/features
http://localhost:3000/client/techcorp/contact
```

---

## 📋 Quick Reference

| Action | What to Do |
|--------|-----------|
| **Add client** | Run CLI, enable in config |
| **Disable client** | Set `enabled: false` |
| **Add page** | Create `.ejs` file (auto-routes) |
| **Remove page** | Delete `.ejs` file |
| **Rename client** | Rename folder + update config |
| **Check active** | See startup logs |

---

## 🎨 Customization Per Client

Each client folder is **completely independent**:

- ✅ Own HTML structure
- ✅ Own CSS/styling
- ✅ Own colors/branding
- ✅ Own JavaScript
- ✅ Different number of pages
- ✅ Custom layouts

**Zero shared code** between clients (unless you want it).

---

## ⚡ Benefits

### Old Way (Manual Routes):
```
1. Create folder
2. Add files
3. Edit routes/tenant.js
4. Add 5+ lines per page
5. Restart server
```

### New Way (Auto-Discovery):
```
1. Create folder
2. Add files
3. Enable in config (1 line)
4. Restart server
```

**Saved:** 90% of configuration work!

---

## 🔍 Debugging

### Check What's Enabled

Look at server startup logs:
```bash
[Tenants] Loaded 4 permanent demo(s)
[Tenants] Loaded 2 client demo(s)
[Tenants] Active clients: example-client, techcorp
[Routes] ✓ Registered routes for client: example-client (3 pages)
[Routes] ✓ Registered routes for client: techcorp (4 pages)
[Routes] Client demo routes registered: 2 client(s)
```

### Client Not Working?

1. **Folder exists?** Check `views/tenants/clients/{name}/`
2. **Enabled?** Check `config/tenants.js` → `enabled: true`
3. **Has files?** At least `layout.ejs` and `home.ejs`
4. **Restarted?** Must restart server after changes

---

## 🎯 Summary

**To add a client demo:**
1. Create folder with files (or use CLI)
2. Enable in `config/tenants.js` (ONE line)
3. Restart server

**Routes are automatic. Pages are automatic. Everything just works.** ✨

That's the simplicity you wanted! 🎉
