# Product Requirements Document (PRD)

## Terzaghi Calculator - Web Application with Backend Integration

### 1. Product Overview

**Product Name**: Terzaghi Bearing Capacity Calculator  
**Version**: 2.0 (with backend integration)  
**Target Users**: Civil engineering students, geotechnical engineers, construction professionals  
**Primary Goal**: Provide an easy-to-use online calculator for shallow foundation bearing capacity analysis with optional cloud-based data storage

### 2. Problem Statement

Current version (1.0) is a static HTML calculator without data persistence. Users:

- Cannot save their calculation history for future reference
- Cannot access calculations across different devices
- Cannot share calculation results with team members
- Lose all data when closing the browser

### 3. Core Requirements

#### 3.1 Functional Requirements

**FR-1: Calculation Engine (Existing - No Changes)**

- Calculate bearing capacity using Terzaghi method
- Support 3 foundation types: Strip, Square, Circular
- Support 2 failure modes: General Shear, Local Shear
- Handle groundwater table effects accurately

**FR-2: Optional Save Feature (NEW)**

- Toggle switch to enable/disable save functionality
- Default state: OFF (anonymous usage)
- When enabled: show login and save options
- Persist toggle state in browser localStorage

**FR-3: Google Authentication (NEW)**

- Login via Google OAuth 2.0
- Display user name and email after login
- Logout functionality
- Session persistence across page refreshes

**FR-4: Data Storage (NEW)**

- Auto-create Google Sheet in user's Drive on first save
- Sheet naming: "Terzaghi Calculator - [User Email]"
- Store all calculation parameters and results with timestamp
- Each user has separate, private Sheet

**FR-5: History Management (NEW)**

- View calculation history from user's Sheet
- Load previous calculations back into calculator
- Display timestamp, description, and key results
- Direct link to open Sheet in Google Sheets

**FR-6: Security & Privacy (NEW)**

- Minimal OAuth scopes (drive.file, spreadsheets.currentonly)
- User data stored in their own Drive (not central database)
- Developer has no access to user Sheets
- Open-source codebase for transparency

#### 3.2 Non-Functional Requirements

**NFR-1: Performance**

- Calculation response time: <100ms
- Save operation: <2 seconds
- History load: <3 seconds for 100 records

**NFR-2: Usability**

- Calculator works without login (guest mode)
- Clear visual distinction between guest and authenticated modes
- Mobile-responsive design maintained
- Help documentation remains accessible

**NFR-3: Reliability**

- Error handling for network failures
- Graceful degradation if backend unavailable
- OAuth token refresh handling

**NFR-4: Cost**

- 100% free for all users (no premium tiers)
- No server hosting costs (GitHub Pages + Apps Script)
- No database costs (Google Sheets as free DB)

### 4. Technical Architecture

#### 4.1 Frontend

- **Framework**: Vanilla HTML/CSS/JavaScript (no build step)
- **Styling**: TailwindCSS (CDN)
- **Hosting**: GitHub Pages
- **Storage**: localStorage (preferences only)

#### 4.2 Backend

- **Platform**: Google Apps Script
- **Authentication**: Google OAuth 2.0
- **Database**: Google Sheets (per-user)
- **API**: RESTful-style Apps Script Web App

#### 4.3 Data Flow

```
User Browser (HTML/JS)
    ↓ (OAuth)
Google Identity Platform
    ↓ (Token)
Apps Script Web App
    ↓ (Sheets API)
User's Google Drive
```

### 5. User Stories

**US-1**: As a student, I want to use the calculator without login so I can quickly do my homework without creating an account.

**US-2**: As an engineer, I want to save my calculations so I can reference them in my project reports later.

**US-3**: As a team lead, I want my team members to have their own private calculation history so data doesn't mix.

**US-4**: As a privacy-conscious user, I want my data stored in my own Drive so I control who can access it.

**US-5**: As a mobile user, I want the calculator to work on my phone so I can do calculations on-site.

### 6. Success Metrics

- **Adoption**: 50+ users within first month
- **Engagement**: 30% of users enable save feature
- **Retention**: Users save average 5+ calculations
- **Performance**: <5% error rate on save operations
- **Security**: Zero data breach incidents

### 7. Out of Scope (v2.0)

- ❌ Multi-user collaboration on same calculation
- ❌ PDF export functionality
- ❌ Advanced analysis (settlement, charts)
- ❌ Mobile native app
- ❌ Offline mode
- ❌ Email notifications

### 8. Deployment Plan

**Phase 1**: Localhost testing (Week 1)
**Phase 2**: Staging deployment with test users (Week 2)
**Phase 3**: Production release to public (Week 3)
**Phase 4**: Gather feedback and iterate (Ongoing)

### 9. Risk Assessment

| Risk                                           | Impact | Mitigation                                           |
| ---------------------------------------------- | ------ | ---------------------------------------------------- |
| OAuth consent screen "unverified" warning      | Medium | Add clear instructions, consider Google verification |
| Apps Script quota limits (20 concurrent users) | Low    | Monitor usage, upgrade to paid if needed             |
| User confusion about data storage              | Medium | Clear UI messaging about Drive storage               |
| Breaking changes in Google APIs                | Low    | Monitor deprecation announcements                    |

### 10. Acceptance Criteria

✅ Calculator functions identically with save toggle OFF  
✅ Login flow completes in <10 seconds  
✅ Sheet auto-created on first save  
✅ All calculation parameters saved correctly  
✅ History loads and displays within 3 seconds  
✅ Load previous calculation populates all fields correctly  
✅ OAuth scope limited to drive.file only  
✅ Works on Chrome, Firefox, Safari, Edge  
✅ Mobile responsive (tested on 3 devices)  
✅ Documentation complete for deployment
