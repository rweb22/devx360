/**
 * Tenant Middleware
 * 
 * Detects subdomain from incoming requests and attaches tenant configuration
 * to the request object for use in routes and views.
 */

const { getTenant, refreshTemporaryTenants } = require('../config/tenants');

/**
 * Extract subdomain from hostname
 * @param {string} hostname - Full hostname (e.g., restaurant.devx360.in)
 * @param {string} baseDomain - Base domain (e.g., devx360.in)
 * @returns {string} Subdomain or empty string for root domain
 */
function extractSubdomain(hostname, baseDomain) {
  // Remove port if present
  const host = hostname.split(':')[0];

  // Handle localhost for development
  if (host === 'localhost') {
    return '';
  }

  // Handle *.localhost pattern for development (e.g., restaurant.localhost)
  if (host.endsWith('.localhost')) {
    return host.replace('.localhost', '');
  }

  // If it's the base domain or www, return appropriate subdomain
  if (host === baseDomain || host === `www.${baseDomain}`) {
    return host === `www.${baseDomain}` ? 'www' : '';
  }

  // Extract subdomain for production (e.g., restaurant.devx360.in)
  const domainPattern = new RegExp(`\\.${baseDomain.replace('.', '\\.')}$`);
  if (domainPattern.test(host)) {
    return host.replace(domainPattern, '');
  }

  // Default to empty string (root domain)
  return '';
}

/**
 * Tenant detection middleware
 * Attaches tenant configuration to req.tenant
 */
function tenantMiddleware(options = {}) {
  const baseDomain = options.baseDomain || process.env.BASE_DOMAIN || 'devx360.in';
  const gistId = options.gistId || process.env.GIST_ID || null;

  // Periodically refresh temporary tenants in the background
  if (gistId) {
    setInterval(() => {
      refreshTemporaryTenants(gistId).catch(err => {
        console.error('[Tenant Middleware] Error refreshing tenants:', err.message);
      });
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  return (req, res, next) => {
    const hostname = req.hostname || req.get('host');
    const subdomain = extractSubdomain(hostname, baseDomain);

    // Get tenant configuration
    const tenant = getTenant(subdomain);

    if (tenant) {
      // Attach tenant to request
      req.tenant = tenant;
      
      // Make tenant available to views
      res.locals.tenant = tenant;
      res.locals.subdomain = subdomain;

      console.log(`[Tenant] Request for subdomain: "${subdomain}" → Tenant: "${tenant.name}"`);
    } else {
      // Unknown subdomain - could show a "tenant not found" page or redirect
      req.tenant = null;
      res.locals.tenant = null;
      res.locals.subdomain = subdomain;

      console.log(`[Tenant] Unknown subdomain: "${subdomain}"`);
    }

    next();
  };
}

/**
 * Require tenant middleware
 * Returns 404 if no valid tenant is found
 */
function requireTenant() {
  return (req, res, next) => {
    if (!req.tenant) {
      return res.status(404).render('pages/404', {
        title: 'Tenant Not Found | DevX360',
        message: `The subdomain "${res.locals.subdomain}" does not exist or is not active.`
      });
    }
    next();
  };
}

module.exports = {
  tenantMiddleware,
  requireTenant,
  extractSubdomain
};
