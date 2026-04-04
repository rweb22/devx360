# ⚡ Super Simple Client Demo Setup

## The SIMPLEST Way Possible

### Option 1: Use CLI (ONE Command - EASIEST!)

```bash
./scripts/create-client.sh techcorp "TechCorp Inc" "#2563eb"
```

**That's it!** The script:
- ✅ Creates the folder and files
- ✅ Adds to `config/clients.txt` automatically
- ✅ Done!

Restart server and visit: **`http://techcorp.localhost:3000`**

---

### Option 2: Manual (2 Steps)

**Step 1:** Create folder with files
```bash
mkdir -p views/tenants/clients/myclient
# Add: layout.ejs, home.ejs, etc.
```

**Step 2:** Add one line to `config/clients.txt`
```
example-client
myclient
```

**That's it!** Restart server and visit: **`http://myclient.localhost:3000`**

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

Edit **`config/clients.txt`**:

```txt
# Active clients (uncommented)
techcorp
acmecorp

# Disabled client (commented out or delete line)
# oldclient
```

**To enable:** Add line with client name
**To disable:** Comment out (#) or delete the line

That's it!

---

## 🚀 Complete Example

### 1. Create Client (ONE Command)

```bash
./scripts/create-client.sh techcorp "TechCorp Inc" "#2563eb"
```

Output:
```
✅ Added to config/clients.txt
✅ Client demo created successfully!
```

### 2. Restart Server

```bash
npm start
```

### 3. Done! ✅

Visit subdomain:
```
http://techcorp.localhost:3000
http://techcorp.localhost:3000/features
http://techcorp.localhost:3000/contact
```

Or fallback path:
```
http://localhost:3000/client/techcorp
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
