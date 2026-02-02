# Project Structure

## Directory Layout

```
terzaghi-calculator/
│
├── index.html                  # Main application (frontend)
├── README.md                   # Project overview & setup instructions
├── PRD.md                      # Product Requirements Document
├── ARCHITECTURE.md             # System architecture documentation
├── PROJECT_STRUCTURE.md        # This file
│
├── gas-backend/                # Google Apps Script backend
│   ├── Code.gs                 # Main backend logic
│   ├── SheetManager.gs         # Sheet operations module
│   ├── AuthHelper.gs           # Authentication utilities
│   ├── appsscript.json         # Apps Script manifest (OAuth scopes)
│   └── README.md               # Backend-specific documentation
│
├── docs/                       # Documentation & guides
│   ├── DEPLOYMENT_GUIDE.md     # How to deploy (GitHub Pages + Apps Script)
│   ├── USER_GUIDE.md           # End-user instructions
│   ├── SECURITY.md             # Security & privacy details
│   └── API_REFERENCE.md        # Backend API documentation
│
├── assets/                     # Static assets (if needed)
│   ├── images/
│   │   ├── logo-its.png        # ITS logo (to replace placeholder)
│   │   └── logo-hmds.png       # HMDS logo (to replace placeholder)
│   └── screenshots/
│       ├── calculator-ui.png
│       ├── login-flow.png
│       └── history-modal.png
│
├── tests/                      # Testing files (optional for v2.0)
│   ├── manual-test-checklist.md
│   └── test-data.json          # Sample calculation data for testing
│
└── .github/                    # GitHub configuration
    └── workflows/
        └── deploy.yml          # Auto-deploy to GitHub Pages (optional)
```

---

## File Descriptions

### Root Files

**`index.html`** (Main Application)

- Self-contained single-page application
- Includes all HTML, CSS (Tailwind), and JavaScript
- Current version already exists, will be modified to add:
  - Save feature toggle
  - Login UI
  - History modal
  - Backend integration code

**`README.md`**

- Project overview
- Quick start guide
- Links to detailed documentation
- Screenshots
- License information

**`PRD.md`** (Created)

- Complete product requirements
- User stories and acceptance criteria
- Success metrics

**`ARCHITECTURE.md`** (Created)

- Technical architecture diagrams
- Component breakdown
- Data flow
- Security model

---

### `/gas-backend/` (Google Apps Script)

**Purpose**: Server-side logic that runs on Google's infrastructure

**`Code.gs`** (Main file)

```javascript
// Entry point for Web App
function doGet(e) {}

// Main API functions
function getUserInfo() {}
function saveCalculation(data) {}
function getCalculationHistory(limit) {}
function deleteCalculation(rowId) {}
```

**`SheetManager.gs`** (Modular approach)

```javascript
// Separate file for Sheet operations
function getOrCreateUserSheet() {}
function findSheetByEmail(email) {}
function createNewSheet(email) {}
function setupSheetHeaders(sheet) {}
```

**`AuthHelper.gs`** (Helper utilities)

```javascript
// Authentication utilities
function getCurrentUserEmail() {}
function validateRequest(e) {}
```

**`appsscript.json`** (Manifest)

```json
{
  "timeZone": "Asia/Jakarta",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/userinfo.email"
  ],
  "webapp": {
    "executeAs": "USER_ACCESSING",
    "access": "ANYONE"
  }
}
```

---

### `/docs/` (Documentation)

**`DEPLOYMENT_GUIDE.md`**

- Step-by-step deployment instructions
- GitHub Pages setup
- Apps Script deployment process
- OAuth consent screen configuration
- Testing checklist

**`USER_GUIDE.md`**

- How to use the calculator
- How to enable save feature
- How to login
- How to view/manage history
- FAQ section

**`SECURITY.md`**

- OAuth scope explanation
- Data privacy guarantees
- What developer can/cannot access
- User data control
- Security best practices

**`API_REFERENCE.md`**

- Backend API endpoints
- Request/response formats
- Error codes
- Example usage

---

### `/assets/` (Static Assets)

**`/images/`**

- Replace placeholder logos with actual images
- Icons for UI elements

**`/screenshots/`**

- For README and documentation
- Show UI features visually

---

### `/tests/` (Testing Materials)

**`manual-test-checklist.md`**

- Comprehensive testing checklist
- Browser compatibility tests
- Security verification steps

**`test-data.json`**

- Sample calculation parameters
- Expected results for validation

---

## Module Organization (Frontend)

Since `index.html` is a monolithic file, the JavaScript will be organized into logical sections:

```html
<script>
  // ============================================
  // SECTION 1: CONSTANTS & DATA
  // ============================================
  const generalShearFactors = [...];
  const localShearFactors = [...];
  const APPS_SCRIPT_URL = 'https://script.google.com/...';

  // ============================================
  // SECTION 2: UTILITY FUNCTIONS
  // ============================================
  function getElementValue(id) { }
  function displayMessage(message, type) { }
  function clearMessages() { }

  // ============================================
  // SECTION 3: CALCULATION ENGINE (EXISTING)
  // ============================================
  function interpolate(phi, factorTable, ...) { }
  function hitungDayaDukung() { }

  // ============================================
  // SECTION 4: SAVE FEATURE TOGGLE (NEW)
  // ============================================
  function initSaveFeature() { }
  function toggleSaveFeature(enabled) { }
  function saveSavePreference(enabled) { }

  // ============================================
  // SECTION 5: AUTHENTICATION (NEW)
  // ============================================
  function loginWithGoogle() { }
  function logout() { }
  function checkAuthStatus() { }
  function displayUserInfo(userInfo) { }

  // ============================================
  // SECTION 6: DATA PERSISTENCE (NEW)
  // ============================================
  function saveCalculation() { }
  function loadHistory() { }
  function loadCalculation(data) { }
  function deleteCalculation(id) { }

  // ============================================
  // SECTION 7: UI MANAGEMENT (NEW)
  // ============================================
  function showLoginSection() { }
  function hideLoginSection() { }
  function showHistoryModal() { }
  function closeHistoryModal() { }
  function renderHistoryTable(data) { }

  // ============================================
  // SECTION 8: EVENT LISTENERS & INITIALIZATION
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    initSaveFeature();
    checkAuthStatus();
  });
</script>
```

---

## Dependencies & Libraries

### Frontend

| Library                    | Version | Source | Purpose                     |
| -------------------------- | ------- | ------ | --------------------------- |
| TailwindCSS                | 3.x     | CDN    | Utility-first CSS framework |
| Google Fonts (Montserrat)  | -       | CDN    | Typography                  |
| No additional JS libraries | -       | -      | Vanilla JavaScript only     |

### Backend

| Service            | Purpose             |
| ------------------ | ------------------- |
| Google Apps Script | Server-side runtime |
| Google Sheets API  | Data storage        |
| Google Drive API   | File management     |
| Google OAuth 2.0   | Authentication      |

**Note**: All backend services are built-in to Apps Script, no external dependencies needed.

---

## Development Workflow

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/[username]/terzaghi-calculator.git

# 2. Open index.html in browser (works as static file)
open index.html

# 3. For backend: manually copy code to Apps Script editor
#    (No local Apps Script development environment)
```

### Version Control

- Git for source control
- GitHub for hosting
- Branching strategy:
  - `main` → production
  - `develop` → staging
  - `feature/*` → new features

---

## Build & Deployment

### Frontend (GitHub Pages)

```bash
# Automatic deployment on push to main branch
git push origin main
# → GitHub Pages auto-deploys from root/index.html
```

### Backend (Apps Script)

1. Open script.google.com
2. Paste code from `/gas-backend/` files
3. Deploy as Web App
4. Copy deployment URL
5. Update `APPS_SCRIPT_URL` in `index.html`

---

## Configuration Management

### Frontend Config

```javascript
// Embedded in index.html
const CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/xxx/exec",
  maxHistoryItems: 100,
  saveEnabled: false, // default toggle state
  version: "2.0",
};
```

### Backend Config

```javascript
// In Code.gs
const CONFIG = {
  sheetNamePrefix: "Terzaghi Calculator - ",
  maxRowsToReturn: 100,
  cacheExpiration: 300, // 5 minutes
};
```

**No environment variables needed** - all config is in code or Apps Script properties.

---

## Next Steps

1. ✅ Structure defined
2. ⏳ Create boilerplate files
3. ⏳ Implement backend logic
4. ⏳ Integrate frontend
5. ⏳ Testing & deployment

**Ready to proceed to FASE 2: PEMBUATAN BOILERPLATE & KONFIGURASI GLOBAL?**
