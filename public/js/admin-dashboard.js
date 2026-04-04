/**
 * Admin Dashboard JavaScript
 * Handles JWT auto-refresh and tenant management
 */

// =============================================================================
// Configuration
// =============================================================================

const REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutes (refresh before 5-minute expiry)
let refreshTimer = null;

// =============================================================================
// Authentication & Token Management
// =============================================================================

/**
 * Get JWT token from localStorage
 */
function getToken() {
    return localStorage.getItem('admin_token');
}

/**
 * Set JWT token in localStorage
 */
function setToken(token) {
    localStorage.setItem('admin_token', token);
}

/**
 * Remove JWT token from localStorage
 */
function removeToken() {
    localStorage.removeItem('admin_token');
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!getToken();
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/admin/login';
        return false;
    }
    return true;
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    
    const response = await fetch(endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });

    // If unauthorized, redirect to login
    if (response.status === 401) {
        removeToken();
        window.location.href = '/admin/login';
        throw new Error('Unauthorized');
    }

    return response;
}

/**
 * Refresh JWT token
 */
async function refreshToken() {
    try {
        console.log('[Auth] Refreshing token...');
        
        const response = await apiRequest('/api/admin/refresh', {
            method: 'POST'
        });

        const data = await response.json();

        if (data.success) {
            setToken(data.token);
            console.log('[Auth] Token refreshed successfully');
            updateSessionStatus(true);
            return true;
        } else {
            console.error('[Auth] Token refresh failed:', data.error);
            updateSessionStatus(false);
            return false;
        }
    } catch (error) {
        console.error('[Auth] Token refresh error:', error);
        updateSessionStatus(false);
        return false;
    }
}

/**
 * Start auto-refresh timer
 */
function startAutoRefresh() {
    // Clear existing timer if any
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }

    // Refresh token every 4 minutes
    refreshTimer = setInterval(async () => {
        await refreshToken();
    }, REFRESH_INTERVAL);

    console.log('[Auth] Auto-refresh started (every 4 minutes)');
}

/**
 * Stop auto-refresh timer
 */
function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
        console.log('[Auth] Auto-refresh stopped');
    }
}

/**
 * Update session status indicator
 */
function updateSessionStatus(isActive) {
    const statusEl = document.getElementById('sessionStatus');
    if (statusEl) {
        if (isActive) {
            statusEl.textContent = '● Active Session';
            statusEl.style.background = '#e8f5e9';
            statusEl.style.color = '#2e7d32';
        } else {
            statusEl.textContent = '● Session Expired';
            statusEl.style.background = '#ffebee';
            statusEl.style.color = '#c62828';
        }
    }
}

/**
 * Logout user
 */
function logout() {
    stopAutoRefresh();
    removeToken();
    window.location.href = '/admin/login';
}

// =============================================================================
// Tenant Management
// =============================================================================

/**
 * Load and display tenants
 */
async function loadTenants() {
    const tenantListEl = document.getElementById('tenantList');
    const errorContainer = document.getElementById('errorContainer');
    
    try {
        const response = await apiRequest('/api/admin/tenants');
        const data = await response.json();

        if (data.success) {
            displayTenants(data.tenants);
            errorContainer.innerHTML = '';
        } else {
            showError(data.error || 'Failed to load tenants');
        }
    } catch (error) {
        showError('Failed to load tenants: ' + error.message);
    }
}

/**
 * Display tenants in the UI
 */
function displayTenants(tenants) {
    const tenantListEl = document.getElementById('tenantList');
    
    if (tenants.length === 0) {
        tenantListEl.innerHTML = '<p>No tenants found.</p>';
        return;
    }

    const html = tenants.map(tenant => `
        <div class="tenant-item">
            <h3>
                <span class="tenant-badge ${tenant.type}">${tenant.type}</span>
                ${tenant.name}
            </h3>
            <p><strong>Subdomain:</strong> ${tenant.subdomain || '(root)'}</p>
            <p><strong>URL:</strong> https://${tenant.subdomain ? tenant.subdomain + '.' : ''}devx360.in</p>
            ${tenant.description ? `<p><strong>Description:</strong> ${tenant.description}</p>` : ''}
        </div>
    `).join('');

    tenantListEl.innerHTML = html;
}

/**
 * Show error message
 */
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `<div class="error">${message}</div>`;
}

/**
 * Refresh temporary tenants from Gist
 */
async function refreshTenants() {
    const refreshBtn = document.getElementById('refreshBtn');
    const originalText = refreshBtn.textContent;

    refreshBtn.disabled = true;
    refreshBtn.textContent = '🔄 Refreshing...';

    try {
        const response = await apiRequest('/api/admin/tenants/refresh', {
            method: 'POST'
        });

        const data = await response.json();

        if (data.success) {
            // Reload tenants after refresh
            await loadTenants();
            alert('✅ Temporary tenants refreshed successfully!');
        } else {
            showError(data.error || 'Failed to refresh tenants');
        }
    } catch (error) {
        showError('Failed to refresh tenants: ' + error.message);
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = originalText;
    }
}

// =============================================================================
// Initialization
// =============================================================================

/**
 * Initialize dashboard
 */
async function init() {
    // Check authentication
    if (!requireAuth()) {
        return;
    }

    // Load tenants
    await loadTenants();

    // Start auto-refresh for JWT
    startAutoRefresh();

    // Refresh token immediately to ensure it's valid
    await refreshToken();

    console.log('[Dashboard] Initialized successfully');
}

// Handle page visibility change (pause/resume auto-refresh)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('[Dashboard] Page hidden, pausing auto-refresh');
        stopAutoRefresh();
    } else {
        console.log('[Dashboard] Page visible, resuming auto-refresh');
        startAutoRefresh();
        // Refresh token immediately when page becomes visible
        refreshToken();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
