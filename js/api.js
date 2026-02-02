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
        mode: 'cors', // Important for GAS
        credentials: 'omit',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // GAS often works better with text/plain for CORS
        }
    };
    
    const fetchOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}
