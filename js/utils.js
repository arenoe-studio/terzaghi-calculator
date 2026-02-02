/**
 * Utility functions for Terzaghi Calculator
 */

/**
 * Storage wrap untuk localStorage
 */
const Storage = {
    get(key, defaultValue = null) {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

/**
 * Show notification message dengan auto-hide
 */
function showNotification(message, type = 'info') {
    const messageArea = document.getElementById('messageArea');
    if (!messageArea) return;
    
    const typeClass = {
        'success': 'success-message',
        'error': 'error-message',
        'warning': 'warning-message',
        'info': 'info-message'
    }[type] || 'info-message';
    
    messageArea.innerHTML = `<div class="${typeClass}">${message}</div>`;
    
    // Auto-hide after configured duration
    if (type !== 'error') {
        const duration = (typeof CONFIG !== 'undefined' && CONFIG.NOTIFICATION_DURATION) ? CONFIG.NOTIFICATION_DURATION : 5000;
        setTimeout(() => {
            if (messageArea.innerHTML.includes(typeClass)) {
                messageArea.innerHTML = '';
            }
        }, duration);
    }
}

/**
 * Show/hide loading indicator
 */
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    } else {
        console.log(show ? 'Loading...' : 'Loading complete');
    }
}

/**
 * Format date untuk display
 */
function formatDate(date) {
    try {
        const d = new Date(date);
        return d.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return date;
    }
}
