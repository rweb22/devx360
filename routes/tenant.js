/**
 * Tenant Routes
 *
 * Handles routes for demo tenant sites (healthcare, etc.)
 */

const express = require('express');
const router = express.Router();

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

// Healthcare routes
router.get('/healthcare', (req, res) => {
  renderHealthcare(res, 'home', 'MediCare Plus | Modern Healthcare Management');
});

router.get('/healthcare/services', (req, res) => {
  renderHealthcare(res, 'services', 'Our Services | MediCare Plus');
});

router.get('/healthcare/doctors', (req, res) => {
  renderHealthcare(res, 'doctors', 'Our Doctors | MediCare Plus');
});

router.get('/healthcare/appointments', (req, res) => {
  renderHealthcare(res, 'appointments', 'Book Appointment | MediCare Plus');
});

router.get('/healthcare/contact', (req, res) => {
  renderHealthcare(res, 'contact', 'Contact Us | MediCare Plus');
});

// Home page for demo tenants (fallback for old single-page demos)
router.get('/', (req, res) => {
  const tenant = req.tenant;

  if (!tenant || tenant.type === 'main') {
    // Not a demo tenant, pass to main routes
    return res.redirect('/');
  }

  // Redirect to healthcare demo for healthcare theme
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
