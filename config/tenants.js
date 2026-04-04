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
// Client-Specific Demos (Enable/Disable Here)
// =============================================================================

/**
 * Client demos configuration
 *
 * To add a new client:
 * 1. Create folder: views/tenants/clients/{client-folder-name}/
 * 2. Add your files: layout.ejs, home.ejs, etc.
 * 3. Enable below with folder name and display name
 *
 * The system will automatically:
 * - Create routes for all .ejs files (except layout.ejs)
 * - Use layout.ejs as the wrapper
 * - Make accessible at /client/{client-folder-name}
 */
const CLIENT_DEMOS = {
  // Example client (keep as template)
  'example-client': {
    name: 'Example Client Demo',
    enabled: true  // Set to false to disable
  }

  // Add your clients here:
  // 'acmecorp': {
  //   name: 'ACME Corporation',
  //   enabled: true
  // },
  // 'techco': {
  //   name: 'Tech Company',
  //   enabled: true
  // }
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
 * Get enabled client demos
 * @returns {Object} Enabled client demos
 */
function getEnabledClients() {
  const enabled = {};
  for (const [clientId, config] of Object.entries(CLIENT_DEMOS)) {
    if (config.enabled) {
      enabled[clientId] = config;
    }
  }
  return enabled;
}

/**
 * Check if a client demo is enabled
 * @param {string} clientId - Client folder name
 * @returns {boolean}
 */
function isClientEnabled(clientId) {
  return CLIENT_DEMOS[clientId] && CLIENT_DEMOS[clientId].enabled === true;
}

/**
 * Initialize tenant system
 */
function initialize() {
  console.log('[Tenants] Initializing tenant system...');
  console.log(`[Tenants] Loaded ${Object.keys(PERMANENT_TENANTS).length} permanent demo(s)`);

  const enabledClients = getEnabledClients();
  console.log(`[Tenants] Loaded ${Object.keys(enabledClients).length} client demo(s)`);

  if (Object.keys(enabledClients).length > 0) {
    console.log(`[Tenants] Active clients: ${Object.keys(enabledClients).join(', ')}`);
  }

  console.log('[Tenants] Tenant system initialized');
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
  initialize,
  getTenant,
  getAllTenants,
  getEnabledClients,
  isClientEnabled,
  PERMANENT_TENANTS,
  CLIENT_DEMOS
};
