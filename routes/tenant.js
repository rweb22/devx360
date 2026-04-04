/**
 * Tenant Routes
 *
 * Handles routes for demo tenant sites (healthcare, etc.)
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { getTenant, getEnabledClients, isClientEnabled } = require('../config/tenants');

// =============================================================================
// Healthcare Demo Data
// =============================================================================

const healthcareData = {
  hero: {
    title: 'MediCare Plus',
    subtitle: 'Your complete healthcare management solution',
    cta: 'Book Appointment'
  },
  features: [
    {
      icon: '📱',
      title: 'Telemedicine',
      description: 'Connect with doctors via video consultations from home'
    },
    {
      icon: '📋',
      title: 'Patient Records',
      description: 'Secure digital health records accessible anytime'
    },
    {
      icon: '💊',
      title: 'E-Prescriptions',
      description: 'Digital prescriptions sent directly to your pharmacy'
    },
    {
      icon: '🗓️',
      title: 'Appointment Booking',
      description: 'Easy online scheduling with automated reminders'
    }
  ],
  services: [
    { name: 'General Medicine', doctors: 15 },
    { name: 'Pediatrics', doctors: 8 },
    { name: 'Cardiology', doctors: 12 },
    { name: 'Dermatology', doctors: 6 }
  ],
  stats: [
    { label: 'Registered Patients', value: '50K+' },
    { label: 'Doctors', value: '200+' },
    { label: 'Consultations/Day', value: '1000+' },
    { label: 'Patient Satisfaction', value: '98%' }
  ]
};

// =============================================================================
// Routes
// =============================================================================

// Helper to render with healthcare layout
function renderHealthcare(res, page, title) {
  res.app.render(`tenants/healthcare/${page}`, {}, (err, html) => {
    if (err) return res.status(500).send(err.message);
    res.render('tenants/healthcare/layout', {
      title,
      page,
      body: html,
      layout: false
    });
  });
}

// Helper to render with jewelry layout
function renderJewelry(res, page, title) {
  res.app.render(`tenants/jewelry/${page}`, {}, (err, html) => {
    if (err) return res.status(500).send(err.message);
    res.render('tenants/jewelry/layout', {
      title,
      page,
      body: html,
      layout: false
    });
  });
}

// Helper to render with real estate layout
function renderRealEstate(res, page, title) {
  res.app.render(`tenants/realestate/${page}`, {}, (err, html) => {
    if (err) return res.status(500).send(err.message);
    res.render('tenants/realestate/layout', {
      title,
      page,
      body: html,
      layout: false
    });
  });
}

// Helper to render with fashion layout
function renderFashion(res, page, title) {
  res.app.render(`tenants/fashion/${page}`, {}, (err, html) => {
    if (err) return res.status(500).send(err.message);
    res.render('tenants/fashion/layout', {
      title,
      page,
      body: html,
      layout: false
    });
  });
}

// Helper to render client-specific demos
function renderClient(res, clientName, page, title) {
  res.app.render(`tenants/clients/${clientName}/${page}`, {}, (err, html) => {
    if (err) return res.status(500).send(err.message);
    res.render(`tenants/clients/${clientName}/layout`, {
      title,
      page,
      body: html,
      layout: false
    });
  });
}

// Middleware to prevent cross-demo access when on a subdomain
function preventCrossDemoAccess(allowedTheme) {
  return (req, res, next) => {
    // If accessing via subdomain and tenant theme doesn't match the route
    if (req.tenant && req.tenant.type === 'demo' && req.tenant.theme !== allowedTheme) {
      return res.status(404).send('Page not found');
    }
    next();
  };
}

// Healthcare routes
router.get('/healthcare', preventCrossDemoAccess('healthcare'), (req, res) => {
  renderHealthcare(res, 'home', 'MediCare Plus | Modern Healthcare Management');
});

router.get('/healthcare/services', preventCrossDemoAccess('healthcare'), (req, res) => {
  renderHealthcare(res, 'services', 'Our Services | MediCare Plus');
});

router.get('/healthcare/doctors', preventCrossDemoAccess('healthcare'), (req, res) => {
  renderHealthcare(res, 'doctors', 'Our Doctors | MediCare Plus');
});

router.get('/healthcare/appointments', preventCrossDemoAccess('healthcare'), (req, res) => {
  renderHealthcare(res, 'appointments', 'Book Appointment | MediCare Plus');
});

router.get('/healthcare/contact', preventCrossDemoAccess('healthcare'), (req, res) => {
  renderHealthcare(res, 'contact', 'Contact Us | MediCare Plus');
});

// Jewelry routes
router.get('/jewelry', preventCrossDemoAccess('jewelry'), (req, res) => {
  renderJewelry(res, 'home', 'Lumière | Exquisite Fine Jewelry');
});

router.get('/jewelry/collections', preventCrossDemoAccess('jewelry'), (req, res) => {
  renderJewelry(res, 'collections', 'Collections | Lumière');
});

router.get('/jewelry/engagement', preventCrossDemoAccess('jewelry'), (req, res) => {
  renderJewelry(res, 'engagement', 'Engagement Rings | Lumière');
});

router.get('/jewelry/about', preventCrossDemoAccess('jewelry'), (req, res) => {
  renderJewelry(res, 'about', 'About Us | Lumière');
});

router.get('/jewelry/contact', preventCrossDemoAccess('jewelry'), (req, res) => {
  renderJewelry(res, 'contact', 'Contact | Lumière');
});

// Real Estate routes
router.get('/realestate', preventCrossDemoAccess('realestate'), (req, res) => {
  renderRealEstate(res, 'home', 'Prime Realty | Find Your Dream Home');
});

router.get('/realestate/properties', preventCrossDemoAccess('realestate'), (req, res) => {
  renderRealEstate(res, 'properties', 'Properties | Prime Realty');
});

router.get('/realestate/agents', preventCrossDemoAccess('realestate'), (req, res) => {
  renderRealEstate(res, 'agents', 'Our Agents | Prime Realty');
});

router.get('/realestate/about', preventCrossDemoAccess('realestate'), (req, res) => {
  renderRealEstate(res, 'about', 'About Us | Prime Realty');
});

router.get('/realestate/contact', preventCrossDemoAccess('realestate'), (req, res) => {
  renderRealEstate(res, 'contact', 'Contact Us | Prime Realty');
});

// Fashion routes
router.get('/fashion', preventCrossDemoAccess('fashion'), (req, res) => {
  renderFashion(res, 'home', 'Élégance | Luxury Fashion Boutique');
});

router.get('/fashion/collections', preventCrossDemoAccess('fashion'), (req, res) => {
  renderFashion(res, 'collections', 'Collections | Élégance');
});

router.get('/fashion/lookbook', preventCrossDemoAccess('fashion'), (req, res) => {
  renderFashion(res, 'lookbook', 'Lookbook 2024 | Élégance');
});

router.get('/fashion/about', preventCrossDemoAccess('fashion'), (req, res) => {
  renderFashion(res, 'about', 'About Us | Élégance');
});

router.get('/fashion/contact', preventCrossDemoAccess('fashion'), (req, res) => {
  renderFashion(res, 'contact', 'Contact | Élégance');
});

// Client-specific demo routes are auto-discovered below
// No need to manually add routes - just enable in config/tenants.js!

// Home page for demo tenants
router.get('/', (req, res) => {
  const tenant = req.tenant;

  if (!tenant || tenant.type === 'main') {
    // Not a demo tenant, pass to main routes
    return res.redirect('/');
  }

  // Client-specific demo (subdomain-based)
  if (tenant.type === 'client') {
    const clientId = tenant.theme;

    // Check if client is enabled
    if (!isClientEnabled(clientId)) {
      return res.status(404).send('Client demo not available');
    }

    // Render client home page
    return renderClient(res, clientId, 'home', `${tenant.name} | Home`);
  }

  // Redirect to appropriate multi-page demo based on theme
  if (tenant.theme === 'healthcare') {
    return res.redirect('/healthcare');
  }

  if (tenant.theme === 'jewelry') {
    return res.redirect('/jewelry');
  }

  if (tenant.theme === 'realestate') {
    return res.redirect('/realestate');
  }

  if (tenant.theme === 'fashion') {
    return res.redirect('/fashion');
  }

  // Unknown tenant - redirect to main site
  return res.redirect('/');
});

// =============================================================================
// Auto-Discovery: Client Demo Routes
// =============================================================================

/**
 * Automatically create routes for all enabled client demos
 *
 * Creates two types of routes:
 * 1. Subdomain routes: clientname.devx360.in/page
 * 2. Path routes: devx360.in/client/clientname/page (fallback)
 */
(function registerClientDemoRoutes() {
  const enabledClients = getEnabledClients();
  const clientsDir = path.join(__dirname, '../views/tenants/clients');

  for (const [clientId, config] of Object.entries(enabledClients)) {
    const clientDir = path.join(clientsDir, clientId);

    // Check if client directory exists
    if (!fs.existsSync(clientDir)) {
      console.warn(`[Routes] Warning: Client directory not found: ${clientDir}`);
      continue;
    }

    // Get all .ejs files in the client directory
    let files;
    try {
      files = fs.readdirSync(clientDir).filter(file => file.endsWith('.ejs'));
    } catch (error) {
      console.error(`[Routes] Error reading client directory ${clientId}:`, error.message);
      continue;
    }

    // Register routes for each page (except layout.ejs and home.ejs)
    files.forEach(file => {
      const pageName = file.replace('.ejs', '');

      // Skip layout file and home (home is handled by root route)
      if (pageName === 'layout' || pageName === 'home') return;

      // Create page title
      const pageTitle = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} | ${config.name}`;

      // Register subdomain route: clientname.devx360.in/pagename
      router.get(`/${pageName}`, (req, res, next) => {
        // Only handle if this is the correct client subdomain
        if (req.tenant && req.tenant.type === 'client' && req.tenant.theme === clientId) {
          if (!isClientEnabled(clientId)) {
            return res.status(404).send('Client demo not available');
          }
          return renderClient(res, clientId, pageName, pageTitle);
        }
        next();
      });

      // Also register fallback path route: devx360.in/client/clientname/pagename
      router.get(`/client/${clientId}/${pageName}`, (req, res) => {
        if (!isClientEnabled(clientId)) {
          return res.status(404).send('Client demo not available');
        }
        renderClient(res, clientId, pageName, pageTitle);
      });
    });

    // Register fallback path route for home: devx360.in/client/clientname
    router.get(`/client/${clientId}`, (req, res) => {
      if (!isClientEnabled(clientId)) {
        return res.status(404).send('Client demo not available');
      }
      renderClient(res, clientId, 'home', `${config.name} | Home`);
    });

    console.log(`[Routes] ✓ Registered routes for client: ${clientId} (${files.length - 1} pages)`);
  }

  console.log(`[Routes] Client demo routes registered: ${Object.keys(enabledClients).length} client(s)`);
})();

module.exports = router;
