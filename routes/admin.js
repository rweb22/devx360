/**
 * Admin API Routes
 * 
 * Provides API endpoints for managing temporary tenants
 * Requires API key authentication for security
 */

const express = require('express');
const router = express.Router();
const { getAllTenants, refreshTemporaryTenants } = require('../config/tenants');

// =============================================================================
// Authentication Middleware
// =============================================================================

/**
 * Simple API key authentication
 * Set ADMIN_API_KEY environment variable to protect admin endpoints
 */
function authenticateApiKey(req, res, next) {
  const apiKey = process.env.ADMIN_API_KEY;
  
  // If no API key is set, skip authentication (for development)
  if (!apiKey) {
    console.warn('[Admin API] Warning: No ADMIN_API_KEY set. Admin endpoints are unprotected!');
    return next();
  }

  const providedKey = req.headers['x-api-key'] || req.query.apiKey;

  if (providedKey !== apiKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid API key'
    });
  }

  next();
}

// Apply authentication to all admin routes
router.use(authenticateApiKey);

// =============================================================================
// Admin Routes
// =============================================================================

/**
 * GET /api/admin/tenants
 * List all active tenants (permanent + temporary)
 */
router.get('/tenants', (req, res) => {
  try {
    const tenants = getAllTenants();
    const tenantList = Object.entries(tenants).map(([subdomain, config]) => ({
      subdomain,
      ...config
    }));

    res.json({
      success: true,
      count: tenantList.length,
      tenants: tenantList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/admin/tenants/refresh
 * Force refresh temporary tenants from GitHub Gist
 */
router.post('/tenants/refresh', async (req, res) => {
  try {
    const gistId = process.env.GIST_ID;

    if (!gistId) {
      return res.status(400).json({
        success: false,
        error: 'No GIST_ID configured'
      });
    }

    await refreshTemporaryTenants(gistId);

    res.json({
      success: true,
      message: 'Temporary tenants refreshed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    config: {
      gistId: process.env.GIST_ID ? 'configured' : 'not configured',
      baseDomain: process.env.BASE_DOMAIN || 'devx360.in',
      adminApiKey: process.env.ADMIN_API_KEY ? 'configured' : 'not configured'
    }
  });
});

/**
 * GET /api/admin/gist-instructions
 * Returns instructions for setting up GitHub Gist
 */
router.get('/gist-instructions', (req, res) => {
  const instructions = {
    title: 'GitHub Gist Setup Instructions',
    steps: [
      {
        step: 1,
        title: 'Create a GitHub Gist',
        description: 'Go to https://gist.github.com and create a new gist'
      },
      {
        step: 2,
        title: 'Create tenants.json file',
        description: 'Add a file named "tenants.json" with your tenant configuration'
      },
      {
        step: 3,
        title: 'Format your tenants',
        description: 'Use the example format below'
      },
      {
        step: 4,
        title: 'Get Gist ID',
        description: 'Copy the Gist ID from the URL (e.g., abc123def456)'
      },
      {
        step: 5,
        title: 'Set environment variable',
        description: 'Set GIST_ID environment variable in your deployment'
      }
    ],
    exampleFormat: {
      "a": {
        "id": "demo-a",
        "name": "Client A Demo",
        "subdomain": "a",
        "type": "demo",
        "theme": "generic",
        "description": "Custom demo for Client A",
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "enabled": true
      },
      "b": {
        "id": "demo-b",
        "name": "Client B Demo",
        "subdomain": "b",
        "type": "demo",
        "theme": "generic",
        "description": "Custom demo for Client B",
        "enabled": true
      }
    }
  };

  res.json(instructions);
});

module.exports = router;
