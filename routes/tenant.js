/**
 * Tenant Routes
 * 
 * Handles routes for demo tenant sites (restaurant, healthcare, etc.)
 */

const express = require('express');
const router = express.Router();

// =============================================================================
// Restaurant Demo Data
// =============================================================================

const restaurantData = {
  hero: {
    title: 'Tasty Bites Restaurant',
    subtitle: 'Experience culinary excellence with our modern dining platform',
    cta: 'Order Now'
  },
  features: [
    {
      icon: '🍽️',
      title: 'Online Ordering',
      description: 'Browse our menu and place orders for delivery or pickup'
    },
    {
      icon: '📅',
      title: 'Table Reservations',
      description: 'Reserve your table in advance with our smart booking system'
    },
    {
      icon: '👨‍🍳',
      title: 'Menu Management',
      description: 'Real-time menu updates with seasonal specials'
    },
    {
      icon: '🚚',
      title: 'Delivery Tracking',
      description: 'Track your order in real-time from kitchen to doorstep'
    }
  ],
  menu: [
    { category: 'Appetizers', count: 12 },
    { category: 'Main Course', count: 24 },
    { category: 'Desserts', count: 15 },
    { category: 'Beverages', count: 20 }
  ],
  stats: [
    { label: 'Daily Orders', value: '500+' },
    { label: 'Menu Items', value: '150+' },
    { label: 'Happy Customers', value: '10K+' },
    { label: 'Avg Delivery Time', value: '30 min' }
  ]
};

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
// Generic Demo Data (for temporary tenants)
// =============================================================================

function getGenericDemoData(tenant) {
  return {
    hero: {
      title: tenant.name || 'Demo Website',
      subtitle: tenant.description || 'Custom demo website built with DevX360',
      cta: 'Get Started'
    },
    features: tenant.features ? tenant.features.map((feature, index) => ({
      icon: ['🚀', '⚡', '🎯', '💡'][index % 4],
      title: feature,
      description: `Experience ${feature.toLowerCase()} with our platform`
    })) : [
      {
        icon: '🚀',
        title: 'Fast & Reliable',
        description: 'Built with modern technology for optimal performance'
      },
      {
        icon: '⚡',
        title: 'Easy to Use',
        description: 'Intuitive interface designed for great user experience'
      },
      {
        icon: '🎯',
        title: 'Customizable',
        description: 'Tailored to meet your specific business needs'
      }
    ],
    stats: [
      { label: 'Users', value: '1000+' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Support', value: '24/7' },
      { label: 'Satisfaction', value: '95%' }
    ]
  };
}

// =============================================================================
// Routes
// =============================================================================

// Helper to render with restaurant layout
function renderRestaurant(res, page, title) {
  res.app.render(`tenants/restaurant/${page}`, {}, (err, html) => {
    if (err) return res.status(500).send(err.message);
    res.render('tenants/restaurant/layout', {
      title,
      page,
      body: html,
      layout: false
    });
  });
}

// Restaurant routes
router.get('/restaurant', (req, res) => {
  renderRestaurant(res, 'home', 'Tasty Bites Restaurant | Home');
});

router.get('/restaurant/menu', (req, res) => {
  renderRestaurant(res, 'menu', 'Menu | Tasty Bites Restaurant');
});

router.get('/restaurant/reservations', (req, res) => {
  renderRestaurant(res, 'reservations', 'Reservations | Tasty Bites Restaurant');
});

router.get('/restaurant/about', (req, res) => {
  renderRestaurant(res, 'about', 'About Us | Tasty Bites Restaurant');
});

router.get('/restaurant/contact', (req, res) => {
  renderRestaurant(res, 'contact', 'Contact Us | Tasty Bites Restaurant');
});

// Home page for demo tenants (fallback for old single-page demos)
router.get('/', (req, res) => {
  const tenant = req.tenant;

  if (!tenant || tenant.type === 'main') {
    // Not a demo tenant, pass to main routes
    return res.redirect('/');
  }

  // Redirect to appropriate multi-page demo
  if (tenant.theme === 'restaurant') {
    return res.redirect('/restaurant');
  }

  if (tenant.theme === 'healthcare') {
    return res.redirect('/healthcare');
  }

  // Generic demo (temporary tenants)
  const data = getGenericDemoData(tenant);
  res.render('tenants/generic', {
    title: `${tenant.name} | DevX360 Demo`,
    layout: false,
    ...data
  });
});

module.exports = router;
