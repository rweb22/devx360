/**
 * Application Configuration
 * 
 * Centralized configuration for all environment variables and settings.
 * This allows dynamic configuration without hardcoding values throughout the app.
 */

require('dotenv').config();

/**
 * Get base domain (e.g., "devx360.in" or "mycompany.com")
 */
function getBaseDomain() {
  return process.env.BASE_DOMAIN || 'devx360.in';
}

/**
 * Get base URL for the application
 * Development: http://localhost:3000
 * Production: https://devx360.in
 */
function getBaseUrl() {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  // Auto-detect based on environment
  if (process.env.NODE_ENV === 'production') {
    return `https://${getBaseDomain()}`;
  }
  
  // Development default
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}`;
}

/**
 * Get subdomain URL
 * @param {string} subdomain - The subdomain (e.g., "healthcare")
 * @returns {string} Full URL (e.g., "http://healthcare.localhost:3000" or "https://healthcare.devx360.in")
 */
function getSubdomainUrl(subdomain) {
  if (process.env.NODE_ENV === 'production') {
    return `https://${subdomain}.${getBaseDomain()}`;
  }
  
  // Development
  const port = process.env.PORT || 3000;
  return `http://${subdomain}.localhost:${port}`;
}

/**
 * Get brand name (e.g., "DevX360" or your custom brand)
 */
function getBrandName() {
  return process.env.BRAND_NAME || 'DevX360';
}

/**
 * Get brand email
 */
function getBrandEmail() {
  return process.env.BRAND_EMAIL || 'contact@devx360.in';
}

/**
 * Get brand website URL
 */
function getBrandUrl() {
  return getBaseUrl();
}

/**
 * Check if in production environment
 */
function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if in development environment
 */
function isDevelopment() {
  return !isProduction();
}

/**
 * Get all app config as object (for passing to templates)
 */
function getAppConfig() {
  return {
    baseDomain: getBaseDomain(),
    baseUrl: getBaseUrl(),
    brandName: getBrandName(),
    brandEmail: getBrandEmail(),
    brandUrl: getBrandUrl(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  };
}

module.exports = {
  getBaseDomain,
  getBaseUrl,
  getSubdomainUrl,
  getBrandName,
  getBrandEmail,
  getBrandUrl,
  isProduction,
  isDevelopment,
  getAppConfig
};
