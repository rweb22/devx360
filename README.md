# DevX360 Portfolio Website

A modern, hi-tech Express.js portfolio website for DevX360 - an enterprise software solutions firm.

## Features

- 🌓 **Dark/Light Theme** - Toggle between dark and light themes with persistence
- ✨ **Developer Aesthetics** - Clean, minimalist design with coding-inspired elements
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Express.js Backend** - Server-side rendering with EJS templates
- 🎨 **Modern Animations** - Smooth scrolling, typing effects, and scroll-triggered animations
- 📄 **Project Case Studies** - Detailed project pages with results and testimonials
- 🔧 **Configurable** - Easy to customize domain, company info, and content
- ♿ **Accessible** - ARIA labels, keyboard navigation, and screen reader support
- 🏢 **Multi-Tenant Architecture** - Single app serves multiple demo sites via subdomains (NEW!)

## 🆕 Multi-Tenant Support

DevX360 supports **subdomain-based multi-tenancy** - run multiple demo websites from a single application!

### Available Demo Sites

#### **Showcase Demos** (Permanent)
- **Healthcare**: `healthcare.devx360.in` - Medical management platform
- **Jewelry**: `jewelry.devx360.in` - Luxury jewelry e-commerce
- **Real Estate**: `realestate.devx360.in` - Property listings platform
- **Fashion**: `fashion.devx360.in` - High-end fashion boutique

#### **Client Demos** (Custom)
- Create fully customized demos for specific clients
- Location: `views/tenants/clients/{client-name}/`
- Quick setup: `./scripts/create-client.sh clientname`

### Key Benefits

✅ **Single Codebase** - One app serves all tenants
✅ **Full Customization** - Complete HTML/CSS/JS control per client
✅ **Fast Setup** - 30 seconds to create new client demo
✅ **Version Control** - All demos in git repository
✅ **Easy Deployment** - Single deployment for all demos

📖 **[Read the Client Demos Guide →](CLIENT_DEMOS_SUMMARY.md)**

## Project Structure

```
devx360/
├── app.js                    # Express.js entry point
├── package.json              # Dependencies and scripts
├── config/                   # Configuration
│   └── tenants.js            # Multi-tenant configuration
├── middleware/               # Express middleware
│   └── tenant.js             # Tenant detection middleware
├── public/                   # Static assets
│   ├── css/
│   │   └── styles.css        # All styles with CSS variables
│   ├── js/
│   │   └── main.js           # Client-side JavaScript
│   └── images/               # Image assets
├── views/                    # EJS templates
│   ├── layouts/
│   │   └── main.ejs          # Main layout template
│   ├── pages/                # Main site pages
│   │   ├── home.ejs          # Home/landing page
│   │   ├── projects.ejs      # Projects listing
│   │   ├── project.ejs       # Individual project detail
│   │   ├── 404.ejs           # Not found page
│   │   └── error.ejs         # Error page
│   ├── tenants/              # Demo tenant templates

│   │   ├── healthcare.ejs    # Healthcare demo
│   │   └── generic.ejs       # Generic demo template
│   └── partials/
│       ├── header.ejs        # Navigation header
│       └── footer.ejs        # Site footer
├── routes/                   # Express routes
│   ├── index.js              # Home and main routes
│   ├── projects.js           # Project routes with data
│   ├── tenant.js             # Tenant demo routes
│   └── admin.js              # Admin API routes
├── examples/                 # Example files
│   └── tenants.json.example  # Example tenant configuration
├── MULTI_TENANT_SETUP.md     # Multi-tenant setup guide
└── README.md
```

## Quick Start

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Start Production Server
```bash
npm start
```

The server runs on **http://localhost:3000** by default.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home/landing page |
| `/projects` | Projects listing page |
| `/projects/fintech-platform` | FinFlow case study |
| `/projects/healthcare-platform` | MedConnect case study |
| `/projects/inventory-system` | StockAI case study |
| `/projects/analytics-platform` | DataPulse case study |
| `/about` | About section (anchors to home) |
| `/contact` | Contact section (anchors to home) |

## Customization

### Domain & Company Info

Edit `js/main.js` - update the `CONFIG` object at the top:

```javascript
const CONFIG = {
    domain: 'devx360.in',        // Your domain
    companyName: 'DevX360',      // Company name
    email: 'contact@devx360.in', // Contact email
    phone: '+91-XXXXXXXXXX'      // Phone number
};
```

Also update these in `index.html`:
- Meta tags (og:url, twitter, etc.)
- Contact section email/links
- Footer copyright

### Theme Settings

The default theme is dark. To change the default theme, edit `js/main.js`:

```javascript
const CONFIG = {
    // ... other settings
    defaultTheme: 'dark' // Change to 'light' for light default
};
```

The theme toggle respects:
1. User's saved preference (localStorage)
2. System preference (`prefers-color-scheme`)
3. Default theme in CONFIG

### Colors

Edit `css/styles.css` - update CSS variables in `:root` for dark theme and `[data-theme="light"]` for light theme:

```css
:root {
  --bg-primary: #0a0a0f;      /* Main background */
  --bg-secondary: #12121a;    /* Section backgrounds */
  --bg-card: #1a1a24;         /* Card backgrounds */
  --accent-primary: #00d4ff;  /* Primary accent (cyan) */
  --accent-secondary: #8b5cf6;/* Secondary accent (purple) */
  --text-primary: #ffffff;    /* Main text color */
  --text-secondary: #94a3b8;  /* Muted text color */
  --border-color: #2a2a3a;    /* Border color */
}
```

### Content

#### Hero Section
- Update headline, subtitle, and CTA buttons in `index.html`
- Modify typing phrases in `js/main.js` (`initTypingEffect` function)

#### Services
- Edit the service cards in the services section
- Update icons, titles, descriptions, and tech tags

#### Portfolio/Case Studies
- Replace placeholder projects with real case studies
- Add actual project images (replace `.portfolio-placeholder` divs)
- Update technologies and results

#### About Section
- Modify company description and values
- Update statistics (projects, clients, etc.)

#### Contact
- Update email and location
- Configure form submission (see below)

### Form Integration

The contact form currently shows an alert. To integrate with your backend:

```javascript
// In js/main.js - initFormHandling function
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    // Example: Send to your API
    const response = await fetch('https://your-api.com/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if (response.ok) {
        alert('Message sent successfully!');
        contactForm.reset();
    }
});
```

## Adding Real Images

Replace the SVG placeholders in portfolio cards:

```html
<!-- Change this: -->
<div class="portfolio-placeholder">
    <svg>...</svg>
</div>

<!-- To this: -->
<img src="images/project-1.jpg" alt="Project description">
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## SEO

The page includes:
- Semantic HTML5 structure
- Meta description and keywords
- Open Graph tags for social sharing
- Twitter Card meta tags

## Performance Tips

1. Optimize images before adding
2. Use WebP format where possible
3. Consider lazy loading for portfolio images
4. Minify CSS/JS for production

---

Built with ❤️ for DevX360

