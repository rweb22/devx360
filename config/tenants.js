/**
 * Tenant Configuration System
 *
 * Manages tenant configurations for subdomain-based multi-tenant architecture.
 * Includes permanent showcase demos and client-specific demos.
 */

// =============================================================================
// Permanent Tenants (Hardcoded)
// =============================================================================

const PERMANENT_TENANTS = {
  // Main DevX360 website
  'www': {
    id: 'devx360',
    name: 'DevX360',
    subdomain: 'www',
    type: 'main',
    theme: 'default',
    description: 'Enterprise Software Solutions Portfolio',
    routes: ['index', 'projects'], // Use existing routes
    enabled: true
  },
  
  // Root domain (same as www)
  '': {
    id: 'devx360',
    name: 'DevX360',
    subdomain: '',
    type: 'main',
    theme: 'default',
    description: 'Enterprise Software Solutions Portfolio',
    routes: ['index', 'projects'],
    enabled: true
  },

  // Healthcare demo site
  'healthcare': {
    id: 'healthcare',
    name: 'MediCare Plus',
    subdomain: 'healthcare',
    type: 'demo',
    theme: 'healthcare',
    description: 'Patient management and telemedicine platform',
    features: ['Appointment booking', 'Telemedicine', 'Patient records', 'Prescription management'],
    enabled: true
  },

  // Jewelry demo site
  'jewelry': {
    id: 'jewelry',
    name: 'Lumière Jewelry',
    subdomain: 'jewelry',
    type: 'demo',
    theme: 'jewelry',
    description: 'Luxury fine jewelry e-commerce platform',
    features: ['Online catalog', 'Engagement rings', 'Custom design', 'GIA certified diamonds'],
    enabled: true
  },

  // Real Estate demo site
  'realestate': {
    id: 'realestate',
    name: 'Prime Realty',
    subdomain: 'realestate',
    type: 'demo',
    theme: 'realestate',
    description: 'Modern real estate property listing platform',
    features: ['Property search', 'Agent directory', 'Virtual tours', 'Market analytics'],
    enabled: true
  },

  // Fashion demo site
  'fashion': {
    id: 'fashion',
    name: 'Élégance Fashion',
    subdomain: 'fashion',
    type: 'demo',
    theme: 'fashion',
    description: 'High-end luxury fashion boutique e-commerce',
    features: ['Designer collections', 'Lookbook', 'Personal styling', 'Private appointments'],
    enabled: true
  }
};



// =============================================================================
// Tenant Lookup
// =============================================================================

/**
 * Get tenant configuration by subdomain
 * @param {string} subdomain - The subdomain to lookup
 * @returns {Object|null} Tenant configuration or null if not found
 */
function getTenant(subdomain) {
  if (PERMANENT_TENANTS[subdomain]) {
    return PERMANENT_TENANTS[subdomain];
  }
  return null;
}

/**
 * Get all active tenants
 * @returns {Object} All active tenants
 */
function getAllTenants() {
  return PERMANENT_TENANTS;
}

/**
 * Initialize tenant system
 */
function initialize() {
  console.log('[Tenants] Initializing tenant system...');
  console.log(`[Tenants] Loaded ${Object.keys(PERMANENT_TENANTS).length} tenant(s)`);
  console.log('[Tenants] Tenant system initialized');
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
  initialize,
  getTenant,
  getAllTenants,
  PERMANENT_TENANTS
};
