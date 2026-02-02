# Testing Backend Logic - Manual Test Guide

## Prerequisites

1. Backend sudah di-deploy via clasp atau Apps Script editor
2. Deployment URL sudah didapat
3. Browser dengan Dev Tools ready

---

## Test 1: API Info Endpoint

**Purpose**: Verify backend is accessible and responding

### Steps:

```
1. Open browser
2. Navigate to: YOUR_DEPLOYMENT_URL?action=info
3. Expected response:
{
  "success": true,
  "message": "Terzaghi Calculator Backend API",
  "version": "2.0",
  "endpoints": {
    "getUserInfo": "?action=getUserInfo",
    "getHistory": "?action=getHistory&limit=100"
  }
}
```

**Status**: [ ] Pass [ ] Fail

---

## Test 2: Get User Info (Authentication)

**Purpose**: Test OAuth flow dan user identification

### Steps:

```
1. Navigate to: YOUR_DEPLOYMENT_URL?action=getUserInfo
2. Google OAuth consent screen akan muncul
3. Approve scopes:
   - Create and edit spreadsheets
   - See files created by this app
   - Know your email address
4. Expected response:
{
  "success": true,
  "data": {
    "authenticated": true,
    "email": "your.email@example.com",
    "name": "Your Name"
  }
}
```

**Verify**:

- [ ] OAuth prompt shows correct app name
- [ ] Scopes are minimal (NOT "see all your Drive files")
- [ ] Email returned correctly
- [ ] Name extracted from email

**Status**: [ ] Pass [ ] Fail

---

## Test 3: Save Calculation (Sheet Creation)

**Purpose**: Test automatic Sheet creation and data storage

### Steps:

```
1. Use Postman or curl to POST:

curl -X POST YOUR_DEPLOYMENT_URL \
-H "Content-Type: application/json" \
-d '{
  "action": "save",
  "data": {
    "description": "Test Calculation",
    "foundationType": "bujursangkar",
    "failureType": "umum",
    "cohesion": 0.1,
    "frictionAngle": 25,
    "soilUnitWeight": 0.0018,
    "width": 1.5,
    "depth": 1.0,
    "safetyFactor": 3,
    "gwtDepth": 2.0,
    "saturatedUnitWeight": 0.002,
    "waterUnitWeight": 0.001,
    "qult": 15.234,
    "qall": 5.078
  }
}'

2. Expected response:
{
  "success": true,
  "message": "Data berhasil disimpan ke Google Sheet",
  "sheetUrl": "https://docs.google.com/spreadsheets/d/..."
}

3. Open sheetUrl di browser
4. Verify:
   - Sheet name: "Terzaghi Calculator - your.email@example.com"
   - Tab name: "Calculations"
   - Headers ada di row 1 (bold, blue background)
   - Data ada di row 2
   - All 15 columns present
```

**Verify**:

- [ ] Sheet auto-created di Drive user
- [ ] Sheet name correct
- [ ] Headers formatted properly
- [ ] Data saved correctly
- [ ] Timestamp ada
- [ ] Description saved

**Status**: [ ] Pass [ ] Fail

---

## Test 4: Get History

**Purpose**: Test data retrieval dari Sheet

### Steps:

```
1. Navigate to: YOUR_DEPLOYMENT_URL?action=getHistory&limit=10
2. Expected response:
{
  "success": true,
  "data": [
    {
      "rowIndex": 2,
      "timestamp": "2026-02-02T09:37:00.000Z",
      "description": "Test Calculation",
      "foundationType": "bujursangkar",
      // ... all fields
      "qult": 15.234,
      "qall": 5.078
    }
  ],
  "count": 1
}
```

**Verify**:

- [ ] Returns array of calculations
- [ ] Most recent first (reversed order)
- [ ] All fields present
- [ ] Count matches array length

**Status**: [ ] Pass [ ] Fail

---

## Test 5: Save Multiple Calculations

**Purpose**: Test data appending (not overwriting)

### Steps:

```
1. POST 3 different calculations
2. Get history
3. Verify:
   - 3 rows in Sheet (plus header = 4 total)
   - Data di rows 2, 3, 4
   - History returns 3 items
   - Correct order (newest first)
```

**Status**: [ ] Pass [ ] Fail

---

## Test 6: Delete Calculation

**Purpose**: Test row deletion

### Steps:

```
1. POST delete request:

curl -X POST YOUR_DEPLOYMENT_URL \
-H "Content-Type: application/json" \
-d '{
  "action": "delete",
  "rowIndex": 2
}'

2. Expected response:
{
  "success": true,
  "message": "Perhitungan berhasil dihapus"
}

3. Get history again
4. Verify row deleted dari Sheet
```

**Status**: [ ] Pass [ ] Fail

---

## Test 7: Error Handling

**Purpose**: Test validation and error responses

### Test 7a: Invalid Data

```
POST dengan missing required field:
{
  "action": "save",
  "data": {
    "description": "Test",
    // Missing required fields
  }
}

Expected:
{
  "success": false,
  "error": "Data tidak valid"
}
```

### Test 7b: Invalid Action

```
GET ?action=invalidAction

Expected:
{
  "success": false,
  "error": "Unknown action: invalidAction"
}
```

### Test 7c: Invalid Row Index

```
DELETE rowIndex: 999 (doesn't exist)

Expected:
{
  "success": false,
  "error": "Invalid row index"
}
```

**Status**: [ ] Pass [ ] Fail

---

## Test 8: Multi-User Isolation

**Purpose**: Verify user data separation

### Steps:

```
1. Login dengan Account A
2. Save calculation
3. Note Sheet URL
4. Logout & login dengan Account B
5. Save different calculation
6. Verify:
   - Account B has different Sheet
   - Account B cannot see Account A's data
   - Sheets have different names (different emails)
```

**Status**: [ ] Pass [ ] Fail

---

## Test 9: Performance

**Purpose**: Measure response times

### Measurements:

```
- Info endpoint: _____ ms
- Get user info: _____ ms
- Save calculation: _____ ms
- Get history (10 items): _____ ms
- Get history (100 items): _____ ms
```

**Acceptable**:

- Info: < 500ms
- Save: < 2000ms
- History: < 3000ms

**Status**: [ ] Pass [ ] Fail

---

## Test 10: OAuth Scope Verification

**Purpose**: Security audit

### Steps:

```
1. Go to: https://myaccount.google.com/permissions
2. Find "Terzaghi Calculator"
3. Click to view permissions
4. Verify ONLY these scopes:
   ✓ Create and edit spreadsheets created by this app
   ✓ See and download files created by this app
   ✓ Know your email address

   ✗ NOT "See and download all your Google Drive files"
   ✗ NOT "Full access to Google Drive"
```

**Status**: [ ] Pass [ ] Fail

---

## Summary

**Total Tests**: 10  
**Passed**: **\_**  
**Failed**: **\_**

## **Critical Issues**:

## **Non-Critical Issues**:

**Ready for Frontend Integration**: [ ] Yes [ ] No

---

## Next Steps

If all tests pass:

1. ✅ Backend logic verified
2. ✅ Ready for FASE 4 (Frontend Integration)
3. Update `CONFIG.BACKEND_URL` in index.html
4. Begin frontend implementation
