/**
 * Tenant Configuration System
 *
 * Manages tenant configurations for subdomain-based multi-tenant architecture.
 * Includes permanent showcase demos and client-specific demos.
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// Permanent Tenants (Hardcoded)
// =============================================================================

// Get dynamic brand name from environment
const { getBrandName } = require('./app');

const PERMANENT_TENANTS = {
  // Main website
  'www': {
    id: 'main',
    name: getBrandName(),
    subdomain: 'www',
    type: 'main',
    theme: 'default',
    description: 'Enterprise Software Solutions Portfolio',
    routes: ['index', 'projects'], // Use existing routes
    enabled: true
  },

  // Root domain (same as www)
  '': {
    id: 'main',
    name: getBrandName(),
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
// Client-Specific Demos (Auto-loaded from config/clients.txt)
// =============================================================================

/**
 * Load enabled client demos from config/clients.txt
 *
 * Each line in the file should be a client folder name
 * Lines starting with # are ignored (comments)
 * Empty lines are ignored
 *
 * Example clients.txt:
 *   # My active clients
 *   techcorp
 *   acmecorp
 *   example-client
 */
function loadEnabledClientsFromFile() {
  const clientsFile = path.join(__dirname, 'clients.txt');
  const enabledClients = {};

  try {
    const content = fs.readFileSync(clientsFile, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Trim whitespace
      line = line.trim();

      // Skip empty lines and comments
      if (!line || line.startsWith('#')) {
        return;
      }

      // Validate client name (alphanumeric, hyphens, underscores only)
      if (!/^[a-z0-9-_]+$/i.test(line)) {
        console.warn(`[Tenants] Invalid client name on line ${index + 1}: "${line}" (skipping)`);
        return;
      }

      enabledClients[line] = {
        name: line.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        enabled: true
      };
    });

    console.log(`[Tenants] Loaded ${Object.keys(enabledClients).length} client(s) from clients.txt`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn('[Tenants] clients.txt not found - no client demos loaded');
    } else {
      console.error('[Tenants] Error reading clients.txt:', error.message);
    }
  }

  return enabledClients;
}

// Load clients from file
const CLIENT_DEMOS = loadEnabledClientsFromFile();



// =============================================================================
// Tenant Lookup
// =============================================================================

/**
 * Get tenant configuration by subdomain
 * @param {string} subdomain - The subdomain to lookup
 * @returns {Object|null} Tenant configuration or null if not found
 */
function getTenant(subdomain) {
  // Check permanent tenants first
  if (PERMANENT_TENANTS[subdomain]) {
    return PERMANENT_TENANTS[subdomain];
  }

  // Check client demos
  if (CLIENT_DEMOS[subdomain] && CLIENT_DEMOS[subdomain].enabled) {
    return {
      id: subdomain,
      name: CLIENT_DEMOS[subdomain].name,
      subdomain: subdomain,
      type: 'client',
      theme: subdomain,
      description: `Custom demo for ${CLIENT_DEMOS[subdomain].name}`,
      enabled: true
    };
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
