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

// Home page for demo tenants
router.get('/', (req, res) => {
  const tenant = req.tenant;

  if (!tenant || tenant.type === 'main') {
    // Not a demo tenant, pass to main routes
    return res.redirect('/');
  }

  let data;
  let template = 'tenants/generic';

  // Select appropriate data and template based on tenant theme
  switch (tenant.theme) {
    case 'restaurant':
      data = restaurantData;
      template = 'tenants/restaurant';
      break;
    case 'healthcare':
      data = healthcareData;
      template = 'tenants/healthcare';
      break;
    default:
      data = getGenericDemoData(tenant);
      template = 'tenants/generic';
  }

  res.render(template, {
    title: `${tenant.name} | DevX360 Demo`,
    layout: false, // Tenant templates are standalone
    ...data
  });
});

module.exports = router;
