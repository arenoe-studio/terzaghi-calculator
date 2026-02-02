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

// ============================================================================
// DATA TABLES - TERZAGHI BEARING CAPACITY FACTORS
// ============================================================================

// Data Tabel Faktor Daya Dukung Terzaghi (General Shear)
const generalShearFactors = [
    { phi: 0, Nc: 5.7, Nq: 1.0, Ngamma: 0.0 },
    { phi: 5, Nc: 7.3, Nq: 1.6, Ngamma: 0.5 },
    { phi: 10, Nc: 9.6, Nq: 2.7, Ngamma: 1.2 },
    { phi: 15, Nc: 12.9, Nq: 4.4, Ngamma: 2.5 },
    { phi: 20, Nc: 17.7, Nq: 7.4, Ngamma: 5.0 },
    { phi: 25, Nc: 25.1, Nq: 12.7, Ngamma: 9.7 },
    { phi: 30, Nc: 37.2, Nq: 22.5, Ngamma: 19.7 },
    { phi: 34, Nc: 52.6, Nq: 36.5, Ngamma: 36.0 },
    { phi: 35, Nc: 57.8, Nq: 41.4, Ngamma: 42.4 },
    { phi: 40, Nc: 95.7, Nq: 81.3, Ngamma: 100.4 },
    { phi: 45, Nc: 172.3, Nq: 173.3, Ngamma: 297.5 },
    { phi: 48, Nc: 258.3, Nq: 287.9, Ngamma: 780.1 },
    { phi: 50, Nc: 347.5, Nq: 415.1, Ngamma: 1153.2 }
];

// Data Tabel Faktor Daya Dukung Terzaghi (Local Shear)
// Note: Local shear biasanya menggunakan c' = 2/3 c dan phi' yang disesuaikan
// Tabel ini adalah aproksimasi N'c, N'q, N'gamma untuk phi INPUT (asli)
const localShearFactors = [
    { phi: 0, Nc: 5.7, Nq: 1.0, Ngamma: 0.0 },
    { phi: 5, Nc: 6.7, Nq: 1.4, Ngamma: 0.2 },
    { phi: 10, Nc: 8.0, Nq: 1.9, Ngamma: 0.5 },
    { phi: 15, Nc: 9.7, Nq: 2.7, Ngamma: 0.9 },
    { phi: 20, Nc: 11.8, Nq: 3.9, Ngamma: 1.7 },
    { phi: 25, Nc: 14.8, Nq: 5.6, Ngamma: 3.2 },
    { phi: 30, Nc: 19.0, Nq: 8.3, Ngamma: 5.7 },
    { phi: 35, Nc: 25.2, Nq: 12.6, Ngamma: 10.1 },
    { phi: 40, Nc: 35.1, Nq: 20.5, Ngamma: 18.8 },
    { phi: 45, Nc: 51.2, Nq: 35.1, Ngamma: 37.7 },
    { phi: 50, Nc: 81.3, Nq: 65.6, Ngamma: 87.1 }
];
