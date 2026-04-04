/**
 * JWT Authentication Utilities
 * 
 * Handles JWT token generation, verification, and password validation
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// =============================================================================
// Configuration
// =============================================================================

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'default-secret-change-in-production';
const JWT_EXPIRY = '5m'; // 5 minutes
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || null;

// =============================================================================
// Password Validation
// =============================================================================

/**
 * Validate admin password
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is valid
 */
async function validatePassword(password) {
  // If no password hash is set, allow any password (development mode)
  if (!ADMIN_PASSWORD_HASH) {
    console.warn('[Auth] Warning: No ADMIN_PASSWORD_HASH set. Using default password!');
    // Default password for development: "admin"
    return password === 'admin';
  }

  try {
    return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } catch (error) {
    console.error('[Auth] Password validation error:', error.message);
    return false;
  }
}

/**
 * Hash a password (utility function for generating password hashes)
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// =============================================================================
// JWT Token Management
// =============================================================================

/**
 * Generate JWT access token
 * @param {object} payload - Token payload (e.g., { username: 'admin' })
 * @returns {string} JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    issuer: 'devx360'
  });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} Decoded payload or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'devx360'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('[Auth] Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      console.log('[Auth] Invalid token');
    }
    return null;
  }
}

/**
 * Decode token without verification (to check expiry)
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token or null
 */
function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

// =============================================================================
// Middleware
// =============================================================================

/**
 * Express middleware to protect routes with JWT
 * Checks for JWT in Authorization header or cookie
 */
function requireAuth(req, res, next) {
  // Get token from Authorization header or cookie
  let token = null;

  // Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // Check cookie if header doesn't have token
  if (!token && req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: No token provided'
    });
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired token'
    });
  }

  // Attach user info to request
  req.user = decoded;
  next();
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
  validatePassword,
  hashPassword,
  generateToken,
  verifyToken,
  decodeToken,
  requireAuth,
  JWT_EXPIRY
};
