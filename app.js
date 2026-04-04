/**
 * DevX360 - Main Express.js Application
 *
 * This is the entry point for the DevX360 application.
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

// Import tenant system
const { initialize: initializeTenants } = require('./config/tenants');
const { tenantMiddleware } = require('./middleware/tenant');

// Import app configuration
const { getAppConfig, getSubdomainUrl, getBaseUrl } = require('./config/app');

// Import routes
const indexRouter = require('./routes/index');
const projectsRouter = require('./routes/projects');
const tenantRouter = require('./routes/tenant');
const adminRouter = require('./routes/admin');

// Create Express application
const app = express();

// =============================================================================
// View Engine Setup
// =============================================================================

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// =============================================================================
// Middleware Configuration
// =============================================================================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Tenant detection middleware (must come after body parsing)
app.use(tenantMiddleware({
  baseDomain: process.env.BASE_DOMAIN || 'devx360.in',
  gistId: process.env.GIST_ID || null
}));

// Inject app config into all views
app.use((req, res, next) => {
  res.locals.app = getAppConfig();
  res.locals.getSubdomainUrl = getSubdomainUrl;
  res.locals.getBaseUrl = getBaseUrl;
  next();
});

// =============================================================================
// Routes
// =============================================================================

// Conditional routing based on tenant type and path
app.use((req, res, next) => {
  // Skip for API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // If path starts with demo routes or client routes, use tenant router
  if (req.path.startsWith('/healthcare') || req.path.startsWith('/jewelry') || req.path.startsWith('/realestate') || req.path.startsWith('/fashion') || req.path.startsWith('/client/')) {
    return tenantRouter.handle(req, res, next);
  }

  // If it's a demo tenant (subdomain-based), use the tenant router
  if (req.tenant && req.tenant.type === 'demo') {
    return tenantRouter.handle(req, res, next);
  }

  // Otherwise, proceed to main routes
  next();
});

// Mount main routes (for devx360.in and www.devx360.in)
app.use('/', indexRouter);
app.use('/projects', projectsRouter);

// Admin API routes
app.use('/api/admin', adminRouter);

// =============================================================================
// Error Handling
// =============================================================================

// 404 Error Handler - Catch requests to undefined routes
app.use((req, res, next) => {
  res.status(404).render('pages/404', {
    title: `Page Not Found | ${res.locals.app.brandName}`,
    message: 'The page you are looking for does not exist.'
  });
});

// General Error Handler - Handle all other errors
app.use((err, req, res, next) => {
  // Log error for debugging (in development)
  console.error(err.stack);

  // Set status code (default to 500 for server errors)
  const statusCode = err.status || 500;

  // Render error page
  res.status(statusCode).render('pages/error', {
    title: `Error | ${res.locals.app.brandName}`,
    message: err.message || 'An unexpected error occurred.',
    error: process.env.NODE_ENV === 'development' ? err : { status: statusCode }
  });
});

// =============================================================================
// Server Startup
// =============================================================================

// Initialize tenant system and start server
async function startServer() {
  try {
    // Initialize tenants
    initializeTenants();

    // Get port from environment variable or use default
    const PORT = process.env.PORT || 3000;

    // Start the server
    app.listen(PORT, () => {
      const appConfig = getAppConfig();

      console.log('='.repeat(60));
      console.log(`🚀 ${appConfig.brandName} Multi-Tenant Server Started`);
      console.log('='.repeat(60));
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${appConfig.nodeEnv}`);
      console.log(`🏢 Base Domain: ${appConfig.baseDomain}`);
      console.log(`🌐 Base URL: ${appConfig.baseUrl}`);
      console.log(`🔐 Admin API Key: ${process.env.ADMIN_API_KEY ? 'Configured' : 'Not configured (admin endpoints unprotected!)'}`);
      console.log('='.repeat(60));
      console.log(`\n📝 Available URLs:`);
      console.log(`   Main site:          ${getBaseUrl()}`);
      console.log(`   Healthcare demo:    ${getSubdomainUrl('healthcare')}`);
      console.log(`   Jewelry demo:       ${getSubdomainUrl('jewelry')}`);
      console.log(`   Real Estate demo:   ${getSubdomainUrl('realestate')}`);
      console.log(`   Fashion demo:       ${getSubdomainUrl('fashion')}`);
      console.log(`   Example client:     ${getSubdomainUrl('example-client')}`);
      console.log(`   Admin login:        ${getBaseUrl()}/admin/login`);
      console.log('='.repeat(60));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;

