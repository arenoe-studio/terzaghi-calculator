/**
 * Configuration and Constants
 * Terzaghi Calculator
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

/**
 * Global configuration object untuk frontend
 * Centralized config untuk easy maintenance dan deployment
 */
const CONFIG = {
    // Backend Configuration
    // URL Backend Web App (Updated: 2026-02-02)
    BACKEND_URL: 'https://script.google.com/macros/s/AKfycbx4Y-BqfAxPvdGY8kDDcNFwXozjQSCUTcVmtyA2X2LkubyLwCXRrUqXL_SVS4PUGGxM2w/exec',
    
    // Feature Flags
    SAVE_FEATURE_ENABLED_DEFAULT: false, // Default state untuk save toggle
    ENABLE_HISTORY_FEATURE: true,
    ENABLE_DELETE_FEATURE: true,
    
    // UI Configuration
    MAX_HISTORY_DISPLAY: 50,
    NOTIFICATION_DURATION: 5000, // milliseconds
    LOADING_TIMEOUT: 10000, // max wait for backend response
    
    // LocalStorage Keys
    STORAGE_KEY_SAVE_ENABLED: 'terzaghi_save_enabled',
    STORAGE_KEY_USER_EMAIL: 'terzaghi_user_email',
    STORAGE_KEY_USER_NAME: 'terzaghi_user_name',
    
    // Messages
    MSG: {
        LOGIN_SUCCESS: 'Login berhasil! Sekarang Anda bisa menyimpan perhitungan.',
        LOGOUT_SUCCESS: 'Logout berhasil.',
        SAVE_SUCCESS: 'Perhitungan berhasil disimpan ke Google Sheet!',
        SAVE_ERROR: 'Gagal menyimpan perhitungan. Silakan coba lagi.',
        LOAD_ERROR: 'Gagal memuat riwayat perhitungan.',
        DELETE_SUCCESS: 'Perhitungan berhasil dihapus.',
        DELETE_ERROR: 'Gagal menghapus perhitungan.',
        LOGIN_REQUIRED: 'Silakan login terlebih dahulu untuk menyimpan perhitungan.',
        BACKEND_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        INVALID_BACKEND_URL: 'Backend URL belum dikonfigurasi. Hubungi administrator.'
    },
    
    // API Endpoints
    API: {
        GET_USER_INFO: '?action=getUserInfo',
        GET_HISTORY: '?action=getHistory&limit=',
        SAVE_CALCULATION: '', // POST to base URL
        DELETE_CALCULATION: '' // POST to base URL
    },
    
    // Version
    VERSION: '2.1'
};

/**
 * Validate configuration saat page load
 * Ensures critical config tidak missing
 */
function validateConfig() {
    if (CONFIG.BACKEND_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
        console.warn('Backend URL belum dikonfigurasi! Save features tidak akan berfungsi.');
        return false;
    }
    return true;
}


