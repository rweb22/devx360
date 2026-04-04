# ⚠️ DEPRECATED - GitHub Gist Approach Removed

## This Guide is Outdated

The GitHub Gist approach for temporary demos has been **replaced** with a better solution.

### ✅ **Use Client-Specific Demos Instead**

Client demos are now created as full HTML/CSS/JS files in the repository:

- **Location**: `views/tenants/clients/{client-name}/`
- **Documentation**: See `CLIENT_DEMOS_SUMMARY.md`
- **Quick Start**: Run `./scripts/create-client.sh clientname`

---

## Why We Removed Gist Support

1. **Limited customization** - Gist only provided metadata, not full HTML
2. **Same template** - All clients used generic template
3. **Redundant** - Client demos system is more powerful
4. **Complexity** - Extra HTTP requests, caching, error handling
5. **Better solution exists** - Full file-based client demos

---

## Migration

If you were planning to use GitHub Gist:

**Old approach (Gist):**
```json
{
  "clientname": {
    "name": "Client Name",
    "features": ["A", "B"]
  }
}
```

**New approach (Client Demos):**
```bash
./scripts/create-client.sh clientname "Client Name"
# Edit views/tenants/clients/clientname/*.ejs
```

---

## Original Documentation Below (For Reference Only)

---

## Temporary Demos: Three Approaches

### ✅ **Approach 1: GitHub Gist (Current - RECOMMENDED)**

**Best for:** Quick client demos, simple customization, same-day setup

#### How It Works:
1. Create a GitHub Gist with `tenants.json`
2. Add client configuration (name, features, branding)
3. Client accesses via `clientname.devx360.in`
4. Uses generic template with their branding

#### Setup:

**1. Create GitHub Gist:**
```json
{
  "acmecorp": {
    "id": "acmecorp-demo",
    "name": "ACME Corporation Demo",
    "subdomain": "acmecorp",
    "type": "demo",
    "theme": "generic",
    "description": "Custom SaaS platform demo for ACME Corp",
    "features": [
      "Real-time Analytics",
      "Custom Reports",
      "API Integration",
      "24/7 Support"
    ],
    "colors": {
      "primary": "#e74c3c",
      "secondary": "#2c3e50"
    },
    "logo": "https://acmecorp.com/logo.png",
    "enabled": true
  }
}
```

**2. Set Environment Variable:**
```bash
GIST_ID=your-gist-id-from-url
```

**3. Access:**
```
https://acmecorp.devx360.in
```

#### Pros:
- ⚡ Setup in minutes
- 🔄 Auto-refresh every 5 minutes
- 🎨 Basic customization (colors, logo, features)
- 🔒 Private gists for confidential clients
- 💰 No extra infrastructure cost

#### Cons:
- Limited to generic template structure
- Can't have completely custom layouts
- Same template for all clients

---

### 🚀 **Approach 2: Separate Repository**

**Best for:** Complex custom demos, unique designs per client

#### Setup:

**1. Create Separate Repo:**
```bash
git clone git@github.com:your-org/devx360-client-demos.git
```

**2. Structure:**
```
devx360-client-demos/
├── README.md
├── client-a/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
│       └── logo.png
├── client-b/
│   └── ...
└── shared/
    └── common.css
```

**3. Integration Options:**

**Option A: Git Submodule**
```bash
cd /path/to/devx360
git submodule add git@github.com:your-org/devx360-client-demos.git views/tenants/clients
```

**Option B: Serve Separately**
- Deploy client demos to separate subdomain
- Update gist to point to external URLs:
```json
{
  "acmecorp": {
    "type": "external",
    "url": "https://demos.devx360.in/acmecorp/"
  }
}
```

#### Pros:
- 🎨 Complete design freedom
- 🔐 Separate access control
- 📁 Organized client files
- 🔄 Independent version control

#### Cons:
- More setup time
- Deployment complexity
- Need to sync changes

---

### 💡 **Approach 3: Hybrid (BEST)**

**Use both approaches:**
- **Simple demos**: Gist + generic template
- **Complex demos**: Separate repo with custom code

#### Gist Configuration:
```json
{
  "simpledemo": {
    "type": "generic",
    "theme": "healthcare",
    "name": "Simple Healthcare Demo"
  },
  "complexdemo": {
    "type": "custom",
    "repoPath": "clients/complex-client",
    "name": "Custom Complex Demo"
  }
}
```

---

## Current Implementation

Your system currently uses **Approach 1** (GitHub Gist):

### Files Involved:
```
config/tenants.js          - Fetches and manages temporary tenants
views/tenants/generic.ejs  - Generic template for temporary demos
middleware/tenant.js       - Routes to correct tenant
```

### How to Add a Temporary Demo:

**1. Edit your GitHub Gist** (get ID from environment variable `GIST_ID`)

**2. Add new tenant:**
```json
{
  "newclient": {
    "id": "newclient-demo",
    "name": "New Client Demo",
    "subdomain": "newclient",
    "type": "demo",
    "theme": "generic",
    "description": "Demo description here",
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "enabled": true
  }
}
```

**3. Access immediately:**
```
https://newclient.devx360.in
```

---

## Recommendation

**Start with Approach 1** (Current setup):
- Fast, simple, no code changes needed
- Perfect for 80% of client demos
- Easy to manage via gist

**Upgrade to Approach 3 when:**
- Client needs completely custom design
- Demo requires specific functionality
- Long-term client engagement

---

## Next Steps

Would you like me to:
1. ✅ Enhance the generic template with more customization options?
2. 📦 Set up a separate repo for custom demos?
3. 🔧 Create a hybrid system supporting both?
4. 📝 Create better documentation for your team?

Let me know which direction you'd like to go!
