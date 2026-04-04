# Client-Specific Demos

This directory contains dedicated demos for specific clients.

## Structure

Each client gets their own subdirectory with custom templates:

```
clients/
├── client-name/
│   ├── layout.ejs       # Client-specific layout
│   ├── home.ejs         # Home page
│   ├── features.ejs     # Features page (optional)
│   └── ...              # Additional pages
```

## Adding a New Client

1. Create directory: `clients/your-client-name/`
2. Add at minimum: `layout.ejs` and `home.ejs`
3. Update `config/tenants.js` with client config
4. Add routes in `routes/tenant.js`

## Template Guidelines

- Use consistent naming: lowercase with hyphens
- Include client branding (colors, logos)
- Keep it simple and focused
- Test on multiple devices

## Example Client Config

```javascript
'clientname': {
  id: 'clientname',
  name: 'Client Display Name',
  subdomain: 'clientname',
  type: 'client',
  theme: 'clientname',
  description: 'Demo description',
  enabled: true,
  expiresAt: '2024-12-31'  // Optional
}
```

