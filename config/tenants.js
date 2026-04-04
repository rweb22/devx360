/**
 * Tenant Configuration System
 * 
 * Manages both permanent (hardcoded) and temporary (GitHub Gist) tenants
 * for subdomain-based multi-tenant architecture.
 */

const https = require('https');

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
  }
};

// =============================================================================
// Temporary Tenants (GitHub Gist)
// =============================================================================

let temporaryTenants = {};
let lastFetchTime = null;
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch temporary tenants from GitHub Gist
 * @param {string} gistId - GitHub Gist ID
 * @returns {Promise<Object>} Temporary tenants object
 */
function fetchTemporaryTenants(gistId) {
  return new Promise((resolve, reject) => {
    if (!gistId) {
      console.log('[Tenants] No GIST_ID configured, skipping temporary tenants');
      resolve({});
      return;
    }

    const options = {
      hostname: 'api.github.com',
      path: `/gists/${gistId}`,
      method: 'GET',
      headers: {
        'User-Agent': 'DevX360-TenantManager'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const gist = JSON.parse(data);
            // Look for tenants.json file in the gist
            const tenantsFile = gist.files['tenants.json'];
            
            if (tenantsFile && tenantsFile.content) {
              const tenants = JSON.parse(tenantsFile.content);
              console.log(`[Tenants] Successfully loaded ${Object.keys(tenants).length} temporary tenant(s) from Gist`);
              resolve(tenants);
            } else {
              console.log('[Tenants] No tenants.json found in Gist');
              resolve({});
            }
          } else {
            console.error(`[Tenants] Failed to fetch Gist: ${res.statusCode}`);
            resolve({});
          }
        } catch (error) {
          console.error('[Tenants] Error parsing Gist data:', error.message);
          resolve({});
        }
      });
    });

    req.on('error', (error) => {
      console.error('[Tenants] Error fetching Gist:', error.message);
      resolve({});
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.error('[Tenants] Gist fetch timeout');
      resolve({});
    });

    req.end();
  });
}

/**
 * Refresh temporary tenants if needed
 * @param {string} gistId - GitHub Gist ID
 */
async function refreshTemporaryTenants(gistId) {
  const now = Date.now();
  
  if (!lastFetchTime || (now - lastFetchTime) > REFRESH_INTERVAL) {
    temporaryTenants = await fetchTemporaryTenants(gistId);
    lastFetchTime = now;
  }
}

// =============================================================================
// Tenant Lookup
// =============================================================================

/**
 * Get tenant configuration by subdomain
 * @param {string} subdomain - The subdomain to lookup
 * @returns {Object|null} Tenant configuration or null if not found
 */
function getTenant(subdomain) {
  // Check permanent tenants first (higher priority)
  if (PERMANENT_TENANTS[subdomain]) {
    return PERMANENT_TENANTS[subdomain];
  }

  // Check temporary tenants
  if (temporaryTenants[subdomain] && temporaryTenants[subdomain].enabled !== false) {
    return temporaryTenants[subdomain];
  }

  return null;
}

/**
 * Get all active tenants
 * @returns {Object} All active tenants (permanent + temporary)
 */
function getAllTenants() {
  return {
    ...PERMANENT_TENANTS,
    ...temporaryTenants
  };
}

/**
 * Initialize tenant system
 * @param {string} gistId - GitHub Gist ID for temporary tenants
 */
async function initialize(gistId) {
  console.log('[Tenants] Initializing tenant system...');
  console.log(`[Tenants] Loaded ${Object.keys(PERMANENT_TENANTS).length} permanent tenant(s)`);

  if (gistId) {
    await refreshTemporaryTenants(gistId);
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
  refreshTemporaryTenants,
  PERMANENT_TENANTS
};
