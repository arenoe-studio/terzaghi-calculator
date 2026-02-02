/**
 * API Helper for communicating with Google Apps Script Backend
 */
/**
 * API Helper for communicating with Google Apps Script Backend
 * Optimized for CORS bypass on external domains (GitHub Pages)
 */
async function apiCall(actionParam, options = {}) {
    const baseUrl = CONFIG.BACKEND_URL;
    
    // We force POST for everything to avoid GET redirect issues and preflights
    // We use Content-Type: text/plain to remain a "simple request" and avoid CORS preflight
    
    let action = '';
    let extraData = {};

    // Parse actionParam like "?action=getUserInfo" or ""
    if (actionParam && actionParam.startsWith('?')) {
        const params = new URLSearchParams(actionParam.substring(1));
        action = params.get('action');
        params.forEach((value, key) => {
            if (key !== 'action') extraData[key] = value;
        });
    }

    const payload = {
        action: action || options.action || 'info',
        ...extraData
    };

    // If it's a 'save' action, merge the data
    if (options.body) {
        try {
            const bodyObj = JSON.parse(options.body);
            Object.assign(payload, bodyObj);
        } catch (e) {
            // Fallback if not JSON
        }
    }

    const fetchOptions = {
        method: 'POST', // Always POST for GAS CORS stability
        mode: 'cors',
        redirect: 'follow',
        credentials: 'omit',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8' // Crucial: avoid preflight
        }
    };

    try {
        const response = await fetch(baseUrl, fetchOptions);
        
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
