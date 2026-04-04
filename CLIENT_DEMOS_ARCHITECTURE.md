# Client-Specific Dedicated Demos - Architecture

## Decision: Single Repo, Structured Approach ✅

After analysis, we'll use a **single repository** with a dedicated `clients/` folder structure.

---

## Architecture

### Directory Structure

```
views/tenants/
├── healthcare/          # Permanent showcase demos (multi-page)
├── jewelry/             # Public facing, professional
├── realestate/
├── fashion/
├── generic.ejs          # Simple fallback template
└── clients/             # 👈 Client-specific dedicated demos
    ├── README.md        # Instructions for adding clients
    ├── .gitignore       # Ignore sensitive client data if needed
    ├── acmecorp/
    │   ├── layout.ejs
    │   ├── home.ejs
    │   ├── features.ejs
    │   ├── pricing.ejs
    │   └── contact.ejs
    ├── techstartup/
    │   ├── layout.ejs
    │   ├── home.ejs
    │   └── demo.ejs
    └── enterprise-client/
        ├── layout.ejs
        ├── home.ejs
        └── dashboard.ejs
```

### Configuration

Each client gets an entry in `config/tenants.js`:

```javascript
// Client-specific demos (temporary or dedicated)
'acmecorp': {
  id: 'acmecorp',
  name: 'ACME Corporation Demo',
  subdomain: 'acmecorp',
  type: 'client',           // New type
  theme: 'acmecorp',        // Maps to views/tenants/clients/acmecorp/
  description: 'Dedicated demo for ACME Corp',
  features: ['Custom Feature 1', 'Custom Feature 2'],
  enabled: true,
  expiresAt: '2024-12-31'   // Optional: Auto-disable after date
}
```

---

## Implementation Plan

### Phase 1: Core Infrastructure ✅

1. Create `views/tenants/clients/` directory
2. Update routing to handle client demos
3. Add helper function `renderClient()`
4. Update middleware to detect client type

### Phase 2: Client Management 🔧

1. CLI tool to scaffold new client demos
2. Template generator for common patterns
3. Admin UI to enable/disable clients

### Phase 3: Advanced Features 🚀

1. Client-specific assets (CSS, JS, images)
2. Per-client analytics tracking
3. Automatic expiration
4. Client dashboard for updates

---

## Why Single Repo?

### ✅ Pros:
- **Simpler deployment** - One build, one deploy
- **Shared resources** - Common CSS, helpers, layouts
- **Version control** - All in one place
- **Easy maintenance** - Update framework affects all
- **Faster setup** - No submodules or external repos

### ⚠️ Cons:
- Repo size grows with clients
- All clients in same codebase
- Need good organization

### 💡 Mitigation:
- Use `.gitignore` for sensitive client data
- Archive old clients to separate branch
- Use environment-based client loading
- Implement lazy loading for client files

---

## Alternative: Separate Repo (Not Recommended Now)

```
devx360/                    # Main app
devx360-client-demos/       # Separate repo
  ├── acmecorp/
  ├── techstartup/
  └── ...
```

**Why not?**
- More complex deployment
- Sync issues between repos
- Harder to share common code
- Overkill for current scale

**When to use?**
- 50+ client demos
- Clients need their own git access
- Compliance requires separation
- Different teams manage clients

---

## Access Control

### Option 1: Environment Variables
```bash
ENABLED_CLIENTS=acmecorp,techstartup,enterprise
```

### Option 2: Database (Future)
```sql
CREATE TABLE client_demos (
  subdomain VARCHAR(50),
  enabled BOOLEAN,
  expires_at TIMESTAMP
);
```

### Option 3: Config File (Current)
```javascript
// config/tenants.js
enabled: true
```

---

## Workflow: Adding New Client

### Manual (Current):

1. Create folder: `views/tenants/clients/newclient/`
2. Add files: `layout.ejs`, `home.ejs`, etc.
3. Update `config/tenants.js`:
```javascript
'newclient': {
  id: 'newclient',
  type: 'client',
  theme: 'newclient',
  enabled: true
}
```
4. Add routes in `routes/tenant.js`
5. Deploy

### Automated (Future):

```bash
npm run create-client acmecorp

✓ Created views/tenants/clients/acmecorp/
✓ Generated layout.ejs
✓ Generated home.ejs
✓ Updated config/tenants.js
✓ Added routes
✓ Ready to customize!

Access at: http://acmecorp.localhost:3000
```

---

## Security Considerations

1. **Private Clients**: Use environment variables to enable
2. **Sensitive Data**: Keep in environment variables, not code
3. **Access Logs**: Track who accesses client demos
4. **Expiration**: Auto-disable after presentation
5. **Authentication**: Add password protection if needed

---

## Migration Path

### Week 1: Infrastructure
- [ ] Create clients/ directory structure
- [ ] Update routing system
- [ ] Add renderClient() helper
- [ ] Test with one dummy client

### Week 2: First Real Client
- [ ] Create first client demo
- [ ] Document process
- [ ] Create templates for common patterns

### Week 3: Automation
- [ ] Build CLI scaffolding tool
- [ ] Create starter templates
- [ ] Add admin UI for management

---

## Next Steps

**Immediate:**
1. Implement core infrastructure
2. Create example client demo
3. Update documentation

**Short-term:**
4. Build CLI tool
5. Create template library
6. Add expiration handling

**Long-term:**
7. Admin dashboard
8. Analytics per client
9. Automated archiving

---

## Decision Summary

✅ **Single Repository** with `clients/` folder  
✅ **File-based** client demos (not JSON templates)  
✅ **Full customization** per client (own HTML/CSS/JS)  
✅ **Version controlled** in main repo  
✅ **Easy deployment** (same as permanent demos)  

This gives you the flexibility of dedicated demos with the simplicity of single-repo management.

Ready to implement?
