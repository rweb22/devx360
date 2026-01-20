/**
 * DevX360 - Main Express.js Application
 * 
 * This is the entry point for the DevX360 application.
 */

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Import routes
const indexRouter = require('./routes/index');
const projectsRouter = require('./routes/projects');

// Create Express application
const app = express();

// =============================================================================
// View Engine Setup
// =============================================================================

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// =============================================================================
// Middleware Configuration
// =============================================================================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// =============================================================================
// Routes
// =============================================================================

// Mount routes
app.use('/', indexRouter);
app.use('/projects', projectsRouter);

// =============================================================================
// Error Handling
// =============================================================================

// 404 Error Handler - Catch requests to undefined routes
app.use((req, res, next) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found | DevX360',
    message: 'The page you are looking for does not exist.'
  });
});

// General Error Handler - Handle all other errors
app.use((err, req, res, next) => {
  // Log error for debugging (in development)
  console.error(err.stack);

  // Set status code (default to 500 for server errors)
  const statusCode = err.status || 500;

  // Render error page
  res.status(statusCode).render('pages/error', {
    title: 'Error | DevX360',
    message: err.message || 'An unexpected error occurred.',
    error: process.env.NODE_ENV === 'development' ? err : { status: statusCode }
  });
});

// =============================================================================
// Server Startup
// =============================================================================

// Get port from environment variable or use default
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`DevX360 server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

