const express = require('express');
const router = express.Router();

// Debug endpoint - check tenant detection
router.get('/debug-tenant', (req, res) => {
  res.json({
    hostname: req.hostname,
    subdomain: res.locals.subdomain,
    tenant: req.tenant ? {
      id: req.tenant.id,
      name: req.tenant.name,
      type: req.tenant.type,
      subdomain: req.tenant.subdomain
    } : null,
    baseDomain: res.locals.app.baseDomain,
    baseUrl: res.locals.app.baseUrl
  });
});

// Home page
router.get('/', (req, res) => {
  res.render('pages/home', {
    title: `${res.locals.app.brandName} | Enterprise Software Solutions`
  });
});

// Services page
router.get('/services', (req, res) => {
  res.render('pages/services', {
    title: `Services | ${res.locals.app.brandName}`
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: `About Us | ${res.locals.app.brandName}`
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: `Contact Us | ${res.locals.app.brandName}`
  });
});

// Demos page
router.get('/demos', (req, res) => {
  res.render('pages/demos', {
    title: `Live Demos | ${res.locals.app.brandName}`
  });
});

// Admin login page
router.get('/admin/login', (req, res) => {
  res.render('pages/admin-login', {
    title: `Admin Login | ${res.locals.app.brandName}`,
    layout: false // No layout for login page
  });
});

// Admin dashboard page
router.get('/admin/dashboard', (req, res) => {
  res.render('pages/admin-dashboard', {
    title: `Admin Dashboard | ${res.locals.app.brandName}`,
    layout: false // No layout for dashboard
  });
});

module.exports = router;

