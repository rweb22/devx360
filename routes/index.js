const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'DevX360 | Enterprise Software Solutions'
  });
});

// Services page
router.get('/services', (req, res) => {
  res.render('pages/services', {
    title: 'Services | DevX360'
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About Us | DevX360'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us | DevX360'
  });
});

// Admin login page
router.get('/admin/login', (req, res) => {
  res.render('pages/admin-login', {
    title: 'Admin Login | DevX360',
    layout: false // No layout for login page
  });
});

// Admin dashboard page
router.get('/admin/dashboard', (req, res) => {
  res.render('pages/admin-dashboard', {
    title: 'Admin Dashboard | DevX360',
    layout: false // No layout for dashboard
  });
});

module.exports = router;

