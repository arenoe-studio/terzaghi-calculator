/**
 * API Helper for communicating with Google Apps Script Backend
 */
async function apiCall(actionParam, options = {}) {
    const baseUrl = CONFIG.BACKEND_URL;
    let url = baseUrl + (actionParam || '');
    
    // Validate string URL
    if (typeof baseUrl !== 'string' || !baseUrl.startsWith('http')) {
        throw new Error(CONFIG.MSG.INVALID_BACKEND_URL);
    }
    
    const defaultOptions = {
        method: 'GET',
        mode: 'cors', 
        redirect: 'follow', // Crucial for GAS Web App redirects
        credentials: 'omit' // GAS does not allow 'include' for CORS from different origin
    };
    
    // Only add headers if method is POST
    if (options.method === 'POST') {
        defaultOptions.headers = {
            'Content-Type': 'text/plain;charset=utf-8' // Simple request avoids preflight
        };
    }
    
    const fetchOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, fetchOptions);
        
        // Handle opaque responses or empty bodies
        if (!response.ok) {
            if (response.status === 0) {
                throw new Error('Network error or CORS block. Are you logged in to Google?');
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}
