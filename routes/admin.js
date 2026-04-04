/**
 * Admin API Routes
 *
 * Provides API endpoints for managing temporary tenants
 * Requires JWT authentication for security
 */

const express = require('express');
const router = express.Router();
const { getAllTenants, refreshTemporaryTenants } = require('../config/tenants');
const { validatePassword, generateToken, requireAuth, JWT_EXPIRY } = require('../utils/auth');

// =============================================================================
// Public Authentication Routes (No JWT required)
// =============================================================================

/**
 * POST /api/admin/login
 * Authenticate admin and get JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }

    // Validate password
    const isValid = await validatePassword(password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      role: 'admin',
      username: 'admin',
      loginTime: new Date().toISOString()
    });

    res.json({
      success: true,
      token,
      expiresIn: JWT_EXPIRY,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('[Admin API] Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/admin/refresh
 * Refresh JWT token (extends session)
 */
router.post('/refresh', requireAuth, (req, res) => {
  try {
    // Generate new token with same payload
    const token = generateToken({
      role: req.user.role,
      username: req.user.username,
      loginTime: req.user.loginTime
    });

    res.json({
      success: true,
      token,
      expiresIn: JWT_EXPIRY,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('[Admin API] Refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// =============================================================================
// Protected Admin Routes (JWT required)
// =============================================================================

/**
 * GET /api/admin/tenants
 * List all active tenants (permanent + temporary)
 */
router.get('/tenants', requireAuth, (req, res) => {
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
router.post('/tenants/refresh', requireAuth, async (req, res) => {
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
router.get('/health', requireAuth, (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    user: {
      username: req.user.username,
      role: req.user.role,
      loginTime: req.user.loginTime
    },
    config: {
      gistId: process.env.GIST_ID ? 'configured' : 'not configured',
      baseDomain: process.env.BASE_DOMAIN || 'devx360.in',
      jwtSecret: process.env.JWT_SECRET_KEY ? 'configured' : 'not configured',
      adminPassword: process.env.ADMIN_PASSWORD_HASH ? 'configured' : 'not configured (using default)'
    }
  });
});

/**
 * GET /api/admin/gist-instructions
 * Returns instructions for setting up GitHub Gist
 */
router.get('/gist-instructions', requireAuth, (req, res) => {
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
