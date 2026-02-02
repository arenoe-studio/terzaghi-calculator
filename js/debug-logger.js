/**
 * Debug Logger Utility
 * Menangkap console.log/error/warn dan menampilkannya di overlay layar
 * Memudahkan debugging di mobile atau environment tanpa DevTools mudah
 */

const DebugLogger = {
    logs: [],
    isVisible: false,

    init: function() {
        this.createOverlay();
        this.interceptConsole();
        console.log("Debug Logger Initialized");
    },

    createOverlay: function() {
        // Container
        const container = document.createElement('div');
        container.id = 'debug-overlay';
        container.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 20px;
            width: 90%;
            max-width: 600px;
            height: 300px;
            background: rgba(0, 0, 0, 0.9);
            color: #0f0;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            border-radius: 8px;
            display: none;
            flex-direction: column;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            border: 1px solid #333;
        `;

        // Toolbar
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            padding: 8px;
            background: #222;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            border-radius: 8px 8px 0 0;
        `;

        const title = document.createElement('span');
        title.textContent = '🔍 System Logs';
        title.style.fontWeight = 'bold';

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '10px';

        // Buttons
        const copyBtn = this.createButton('📋 Copy', () => this.copyLogs());
        const clearBtn = this.createButton('🗑️ Clear', () => this.clearLogs());
        const closeBtn = this.createButton('❌ Close', () => this.toggleVisibility());

        actions.appendChild(copyBtn);
        actions.appendChild(clearBtn);
        actions.appendChild(closeBtn);

        toolbar.appendChild(title);
        toolbar.appendChild(actions);

        // Log Content Area
        const content = document.createElement('div');
        content.id = 'debug-content';
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            white-space: pre-wrap;
            word-break: break-all;
        `;

        container.appendChild(toolbar);
        container.appendChild(content);

        // Toggle Button (Floating)
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '🐞 Debug';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            padding: 8px 16px;
            background: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 20px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-weight: bold;
        `;
        toggleBtn.onclick = () => this.toggleVisibility();

        document.body.appendChild(container);
        document.body.appendChild(toggleBtn);

        this.container = container;
        this.contentElement = content;
    },

    createButton: function(text, handler) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            background: #444;
            color: #fff;
            border: none;
            padding: 2px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
        `;
        btn.onclick = handler;
        return btn;
    },

    toggleVisibility: function() {
        this.isVisible = !this.isVisible;
        this.container.style.display = this.isVisible ? 'flex' : 'none';
        if (this.isVisible) this.scrollToBottom();
    },

    interceptConsole: function() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const self = this;

        console.log = function(...args) {
            originalLog.apply(console, args);
            self.addLog('INFO', args);
        };

        console.error = function(...args) {
            originalError.apply(console, args);
            self.addLog('ERROR', args);
        };

        console.warn = function(...args) {
            originalWarn.apply(console, args);
            self.addLog('WARN', args);
        };

        // Catch global errors
        window.onerror = function(msg, url, line, col, error) {
            self.addLog('EXCEPTION', [`${msg}\nAt: ${url}:${line}:${col}`]);
        };
    },

    addLog: function(level, args) {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
        // Safely convert objects to string
        const message = args.map(arg => {
            try {
                return (typeof arg === 'object') ? JSON.stringify(arg) : String(arg);
            } catch (e) {
                return '[Circular/Complex Object]';
            }
        }).join(' ');

        const color = level === 'ERROR' || level === 'EXCEPTION' ? '#ff5555' : 
                      level === 'WARN' ? '#ffb86c' : '#50fa7b';

        const logLine = `[${timestamp}] [${level}] ${message}`;
        this.logs.push(logLine);

        // Add to DOM if exists
        if (this.contentElement) {
            const lineEl = document.createElement('div');
            lineEl.style.borderBottom = '1px solid #222';
            lineEl.style.padding = '2px 0';
            lineEl.innerHTML = `<span style="color: #888">[${timestamp}]</span> <span style="color: ${color}; font-weight: bold">[${level}]</span> ${this.escapeHtml(message)}`;
            
            this.contentElement.appendChild(lineEl);
            this.scrollToBottom();
        }
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    copyLogs: function() {
        const text = this.logs.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            alert('Logs copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy logs:', err);
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Logs copied (fallback method)');
        });
    },

    clearLogs: function() {
        this.logs = [];
        if (this.contentElement) this.contentElement.innerHTML = '';
        console.log("Logs cleared");
    },

    scrollToBottom: function() {
        if (this.contentElement) {
            this.contentElement.scrollTop = this.contentElement.scrollHeight;
        }
    }
};

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
    DebugLogger.init();
});
