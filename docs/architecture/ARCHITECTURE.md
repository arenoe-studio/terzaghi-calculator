# System Architecture - Terzaghi Calculator v2.0

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  index.html (GitHub Pages)                                 │ │
│  │  - TailwindCSS for styling                                 │ │
│  │  - Vanilla JavaScript (no framework)                       │ │
│  │  - localStorage for preferences                            │ │
│  └───────────────┬────────────────────────────────────────────┘ │
│                  │                                               │
└──────────────────┼───────────────────────────────────────────────┘
                   │
                   │ HTTPS Calls
                   │
        ┌──────────┴──────────┐
        │                     │
        v                     v
┌──────────────┐    ┌──────────────────────┐
│   Google     │    │  Apps Script Web App │
│   OAuth 2.0  │◄───┤  (script.google.com) │
└──────────────┘    └──────┬───────────────┘
                           │
                           │ Sheets API
                           │
                    ┌──────v──────────┐
                    │  Google Drive   │
                    │  (User's Sheet) │
                    └─────────────────┘
```

## Component Architecture

### 1. Frontend (Client-Side)

**File**: `index.html`

**Responsibilities**:

- Render calculator UI and collect user inputs
- Perform bearing capacity calculations (client-side)
- Display results and formulas
- Manage save feature toggle state
- Handle OAuth authentication flow
- Send/receive data to/from backend
- Display calculation history

**Key Modules**:

```javascript
// Calculation Engine
-hitungDayaDukung() - // Main calculation function
  interpolate() - // Bearing capacity factor interpolation
  getElementValue() - // Input validation helper
  // Authentication Module (NEW)
  toggleSaveFeature() - // Enable/disable save mode
  loginWithGoogle() - // Initiate OAuth flow
  logout() - // Clear session
  checkAuthStatus() - // Verify login state
  // Data Persistence Module (NEW)
  saveCalculation() - // Send data to backend
  loadHistory() - // Fetch calculation history
  loadCalculation(id) - // Restore previous calculation
  deleteCalculation(id) - // Remove from history
  // UI Management
  showLoginUI() - // Display login section
  hideLoginUI() - // Hide when toggle OFF
  displayHistory() - // Render history modal
  showNotification(); // Success/error messages
```

**Dependencies**:

- TailwindCSS v3 (CDN)
- Google Fonts (Montserrat)

---

### 2. Backend (Server-Side)

**File**: `gas-backend/Code.gs` (Google Apps Script)

**Responsibilities**:

- Authenticate user via Session.getActiveUser()
- Create/access user-specific Google Sheets
- Perform CRUD operations on calculation data
- Return data in JSON format

**Key Functions**:

```javascript
// Entry Point
doGet(e)
  → Serve HTML or handle API routing
  → Return ContentService.createTextOutput()

// Authentication
getUserInfo()
  → Session.getActiveUser().getEmail()
  → Return {email, name}

// Sheet Management
getOrCreateUserSheet()
  → Search for existing "Terzaghi Calculator - [email]"
  → If not found: create new Sheet with headers
  → Set appropriate permissions
  → Return Sheet object

// Data Operations
saveCalculation(data)
  → Validate incoming data
  → getOrCreateUserSheet()
  → appendRow([timestamp, ...data])
  → Return {success: true, sheetUrl}

getCalculationHistory(limit=100)
  → getOrCreateUserSheet()
  → sheet.getRange(2, 1, lastRow, lastCol).getValues()
  → Format as JSON array
  → Return calculations

deleteCalculation(rowIndex)
  → getOrCreateUserSheet()
  → sheet.deleteRow(rowIndex)
  → Return {success: true}
```

**OAuth Scopes** (defined in `appsscript.json`):

```json
[
  "https://www.googleapis.com/auth/spreadsheets.currentonly",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email"
]
```

---

### 3. Data Storage

**Google Sheets Structure** (per user):

| Column | Field Name                 | Type     | Example             |
| ------ | -------------------------- | -------- | ------------------- |
| A      | Timestamp                  | DateTime | 2026-02-02 16:14:42 |
| B      | Description                | String   | Pondasi Gedung A    |
| C      | Foundation Type            | String   | bujursangkar        |
| D      | Failure Type               | String   | umum                |
| E      | Cohesion (c)               | Number   | 0.1                 |
| F      | Friction Angle (φ)         | Number   | 25                  |
| G      | Soil Unit Weight (γ)       | Number   | 0.0018              |
| H      | Width (B)                  | Number   | 1.5                 |
| I      | Depth (Df)                 | Number   | 1.0                 |
| J      | Safety Factor (SF)         | Number   | 3                   |
| K      | GWT Depth (Dw)             | Number   | 2.0                 |
| L      | Saturated Unit Weight      | Number   | 0.002               |
| M      | Water Unit Weight          | Number   | 0.001               |
| N      | Ultimate Bearing Capacity  | Number   | 15.234              |
| O      | Allowable Bearing Capacity | Number   | 5.078               |

---

## Communication Protocol

### Frontend → Backend

**Endpoint**: Apps Script Web App URL  
**Method**: GET with query parameters OR POST with payload

**Example: Save Calculation**

```javascript
// JavaScript fetch call
fetch(APPS_SCRIPT_URL + "?action=save", {
  method: "POST",
  body: JSON.stringify({
    description: "Pondasi A",
    foundationType: "bujursangkar",
    // ... all parameters
    qult: 15.234,
    qall: 5.078,
  }),
});
```

**Apps Script Response**:

```json
{
  "success": true,
  "sheetUrl": "https://docs.google.com/spreadsheets/d/...",
  "message": "Data berhasil disimpan"
}
```

---

## Security Architecture

### Authentication Flow

1. User clicks "Login dengan Google"
2. Frontend redirects to Google OAuth consent screen
3. User approves minimal scopes
4. Google returns token to frontend (client-side)
5. Frontend includes token in API calls to Apps Script
6. Apps Script validates token via `Session.getActiveUser()`

### Data Access Control

- **Developer**: NO access to user Sheets (created in user's Drive)
- **User**: Full access to their own Sheet
- **Apps Script**: Only accesses Sheets created by itself (`drive.file` scope)

### Trust Model

```
Code Transparency (Open Source)
    ↓
Community Audit
    ↓
User Trust
    ↓
OAuth Approval
    ↓
Limited Scope Access
```

---

## Scalability Considerations

### Current Limits (Free Tier)

| Resource                   | Limit           | Mitigation                        |
| -------------------------- | --------------- | --------------------------------- |
| Apps Script Execution Time | 6 min/execution | Optimize Sheet operations         |
| URL Fetch Calls            | 20,000/day      | Not applicable (using Sheets API) |
| Concurrent Executions      | ~30             | Acceptable for small-medium usage |
| Sheet Size                 | 10M cells       | One sheet per user (distributed)  |

### Scaling Strategy

**Phase 1** (0-100 users): Current architecture  
**Phase 2** (100-1000 users): Monitor quotas  
**Phase 3** (1000+ users): Consider:

- Google Cloud Project with higher quotas
- Caching layer with Apps Script Cache Service
- Rate limiting on frontend

---

## Development & Deployment Workflow

```
Local Development
    ↓
Git Commit (GitHub)
    ↓
GitHub Pages (Auto-deploy HTML)
    ↓
Manual Deploy Apps Script
    ↓
Update Web App URL in HTML
    ↓
Test End-to-End
    ↓
Production Release
```

---

## Error Handling Strategy

### Frontend Errors

- Network failures → Retry with exponential backoff
- Invalid input → Inline validation messages
- Auth failures → Prompt re-login

### Backend Errors

- Sheet not found → Auto-create
- Permission denied → Return clear error message
- Quota exceeded → Return 503 with retry-after

---

## Monitoring & Logging

**Frontend**:

- Console logs for debugging (removable in production)
- User-facing error messages

**Backend**:

- Apps Script Logger.log() for debugging
- Stackdriver logging (automatic)
- Error tracking: try-catch blocks with meaningful messages

---

## Future Architecture Enhancements

**v2.1 Possibilities**:

- Redis/Firebase for faster caching
- WebSocket for real-time collaboration
- Progressive Web App (PWA) for offline mode
- Cloud Functions for advanced calculations
- PostgreSQL for complex querying

**Current Decision**: Keep it simple with Sheets for v2.0
