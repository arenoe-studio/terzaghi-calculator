# ✅ Deployment Checklist - Terzaghi Calculator v2.0

## Pre-Deployment Verification

### Backend Files (gas-backend/):

- [ ] `Code.js` - API routing (350 lines)
- [ ] `SheetManager.js` - Data layer (200 lines)
- [ ] `AuthHelper.js` - Auth logic (180 lines)
- [ ] `appsscript.json` - OAuth config (17 lines)
- [ ] `.clasp.json` - Clasp setup
- [ ] `.claspignore` - Deploy exclusions

### Frontend Files:

- [ ] `index.html` - Main app (~1,680 lines)
- [ ] `save-features.js` - Save logic (~450 lines)

### Documentation:

- [ ] `README.md` - Project overview
- [ ] `QUICK_START.md` - Deployment guide
- [ ] `FINAL_SUMMARY.md` - Complete summary
- [ ] `ARCHITECTURE_VISUAL.md` - Architecture diagram

---

## STEP 1: Backend Deployment

### 1.1 Install Clasp (One-time)

```powershell
npm install -g @google/clasp
```

- [ ] Clasp installed successfully
- [ ] Version check: `clasp --version`

### 1.2 Login to Google

```powershell
clasp login
```

- [ ] Browser opened for Google login
- [ ] Logged in successfully
- [ ] Credentials saved

### 1.3 Create Apps Script Project

```powershell
cd "d:\04 PROJECTS\TERZAGHI CALCULATOR\terzaghi-calculator\gas-backend"
clasp create --title "Terzaghi Calculator Backend" --type webapp
```

- [ ] Project created
- [ ] `.clasp.json` generated with scriptId
- [ ] Copy scriptId for reference: ********\_\_********

### 1.4 Push Code to Google

```powershell
clasp push
```

Expected output:

```
└─ gas-backend/AuthHelper.js
└─ gas-backend/Code.js
└─ gas-backend/SheetManager.js
└─ gas-backend/appsscript.json
Pushed 4 files.
```

- [ ] All 4 files pushed successfully
- [ ] No errors

### 1.5 Deploy as Web App

```powershell
clasp deploy --description "v2.0 initial release"
```

- [ ] Deployment created
- [ ] Deployment ID noted: ********\_\_********

### 1.6 Get Deployment URL

```powershell
clasp deployments
```

Expected output:

```
2 Deployments:
- AKfycbxXXXXXXXXXXXXXXXXX @1 (v2.0 initial release)
  - https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXX/exec
- @HEAD (v2.0 initial release)
  - https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXX/dev
```

- [ ] Web App URL retrieved
- [ ] Copy URL (the one with `/exec` at the end)
- [ ] Paste here: ********************\_\_\_\_********************

### 1.7 Verify Backend (Optional)

Open browser and navigate to:

```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=info
```

Expected JSON response:

```json
{
  "success": true,
  "message": "Terzaghi Calculator Backend API",
  "version": "2.0",
  "endpoints": {...}
}
```

- [ ] JSON response received
- [ ] Shows correct version (2.0)

---

## STEP 2: Frontend Configuration

### 2.1 Open index.html

- [ ] File opened in code editor (VS Code, Notepad++, etc.)

### 2.2 Find CONFIG.BACKEND_URL

Search for line containing:

```javascript
BACKEND_URL: 'YOUR_APPS_SCRIPT_URL_HERE',
```

Approximately at line 528.

- [ ] Line found

### 2.3 Replace with Deployment URL

Change to:

```javascript
BACKEND_URL: 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXX/exec',
```

**IMPORTANT**: Use the EXACT URL from Step 1.6 (with `/exec`)

- [ ] URL replaced
- [ ] No typos
- [ ] Comma at end preserved

### 2.4 Save File

- [ ] File saved (Ctrl+S)
- [ ] No syntax errors

---

## STEP 3: Local Testing

### 3.1 Open in Browser

Double-click `index.html` or right-click → Open with → Browser

- [ ] Page loaded successfully
- [ ] No console errors (F12)

### 3.2 Test Save Toggle

- [ ] Toggle switch visible (top right)
- [ ] Click toggle → Login section appears
- [ ] Click toggle again → Login section hides

### 3.3 Test Login Flow

With toggle ON:

- [ ] Click "Login dengan Google"
- [ ] Google OAuth consent screen appears
- [ ] App name shown: "Terzaghi Calculator Backend"
- [ ] Scopes shown:
  - [ ] "Create and edit spreadsheets created by this app"
  - [ ] "See and download files created by this app"
  - [ ] "Know your email address"
- [ ] Click "Allow"
- [ ] Redirected back to calculator
- [ ] Email displayed in login section
- [ ] "Logout" button visible

### 3.4 Test Calculation & Save

- [ ] Fill in calculation form:
  - Tipe Pondasi: Bujur Sangkar
  - Tipe Keruntuhan: Umum
  - Kohesi: 0.1
  - Sudut Geser: 25
  - γ tanah: 0.0018
  - Lebar: 1.5
  - Kedalaman: 1.0
  - Faktor Keamanan: 3
  - Kedalaman MAT: 2.0
  - γ jenuh: 0.002
  - γ air: 0.001
- [ ] Click "Hitung Daya Dukung"
- [ ] Results displayed (qult, qall)
- [ ] Save section appears below results
- [ ] Enter description: "Test Calculation 1"
- [ ] Click "Simpan ke Google Sheet"
- [ ] Success notification appears
- [ ] "Buka Sheet →" link present
- [ ] Click link → Opens Google Sheet
- [ ] Sheet name: "Terzaghi Calculator - your.email@gmail.com"
- [ ] Tab name: "Calculations"
- [ ] Headers in row 1 (bold, blue background)
- [ ] Data in row 2 with timestamp

### 3.5 Test History

- [ ] Click "Lihat Riwayat Perhitungan"
- [ ] History modal opens
- [ ] Shows 1 calculation
- [ ] Description matches: "Test Calculation 1"
- [ ] Timestamp shown correctly
- [ ] qult and qall values match

### 3.6 Test Load from History

- [ ] Click "Muat" button
- [ ] Modal closes
- [ ] Form fields populated with saved values
- [ ] Scroll to top automatically
- [ ] Click "Hitung" → Same results as before

### 3.7 Test Save Another Calculation

- [ ] Change some values (e.g., width = 2.0)
- [ ] Click "Hitung"
- [ ] Enter description: "Test Calculation 2"
- [ ] Click "Simpan"
- [ ] Success notification
- [ ] Open Sheet → Now has 2 rows of data

### 3.8 Test Delete from History

- [ ] Click "Lihat Riwayat"
- [ ] Shows 2 calculations
- [ ] Click "Hapus" on first calculation
- [ ] Confirmation dialog appears
- [ ] Click "OK"
- [ ] Success notification
- [ ] History refreshes → Now shows 1 calculation
- [ ] Check Sheet → Row deleted

### 3.9 Test Logout

- [ ] Click "Logout" button
- [ ] Login section resets to logged-out state
- [ ] Save section hides
- [ ] Email cleared

### 3.10 Test Persistence

- [ ] Refresh page (F5)
- [ ] Toggle state preserved (ON/OFF)
- [ ] If was logged in → Email still shown
- [ ] If was logged out → Shows login prompt

---

## STEP 4: Mobile Testing (Optional)

### 4.1 Open on Phone

- [ ] Transfer index.html to phone (or host temporarily)
- [ ] Open in mobile browser
- [ ] Page renders correctly
- [ ] Toggle switch visible and clickable
- [ ] Login section responsive
- [ ] History modal scrollable
- [ ] All buttons accessible

---

## STEP 5: Production Deployment (Optional)

### Option A: GitHub Pages

#### 5.1 Initialize Git (if not done)

```powershell
git init
git add .
git commit -m "feat: Terzaghi Calculator v2.0 with backend integration"
```

- [ ] Git repository initialized
- [ ] All files committed

#### 5.2 Create GitHub Repo

1. Go to https://github.com/new
2. Repository name: `terzaghi-calculator`
3. Description: "Terzaghi bearing capacity calculator with Google Sheets integration"
4. Public repository
5. Do NOT initialize with README (already have one)
6. Create repository

- [ ] Repository created
- [ ] Repo URL: ********************\_\_\_\_********************

#### 5.3 Push to GitHub

```powershell
git remote add origin https://github.com/YOUR_USERNAME/terzaghi-calculator.git
git branch -M main
git push -u origin main
```

- [ ] Code pushed to GitHub
- [ ] All files visible on GitHub

#### 5.4 Enable GitHub Pages

1. Go to repository → Settings → Pages
2. Source: "GitHub Actions"
3. Wait for deployment (check Actions tab)
4. Site will be published to: `https://YOUR_USERNAME.github.io/terzaghi-calculator/`

- [ ] GitHub Pages enabled
- [ ] Deployment successful
- [ ] Site accessible
- [ ] Public URL: ********************\_\_\_\_********************

#### 5.5 Update README (Optional)

Add live demo link to README.md:

```markdown
🔗 **Live Demo**: https://YOUR_USERNAME.github.io/terzaghi-calculator/
```

- [ ] README updated
- [ ] Pushed to GitHub

### Option B: Other Hosting (Vercel/Netlify/etc.)

- [ ] Upload `index.html` and `save-features.js`
- [ ] Configure build settings (none needed - static files)
- [ ] Deploy
- [ ] Get deployment URL: ********************\_\_\_\_********************
- [ ] Test live site

---

## STEP 6: Final Verification

### 6.1 Test Production Site

- [ ] Open live URL
- [ ] All features work (repeat Step 3 tests)
- [ ] No console errors
- [ ] Mobile responsive

### 6.2 Security Check

1. Go to https://myaccount.google.com/permissions
2. Find "Terzaghi Calculator Backend"
3. Click to view permissions

- [ ] Only minimal scopes shown:
  - [ ] "Create and edit spreadsheets created by this app"
  - [ ] "See and download files created by this app"
  - [ ] "Know your email address"
- [ ] NO "Full drive access" or "All spreadsheets"

### 6.3 Performance Check

- [ ] Page loads < 3 seconds
- [ ] Save operation < 2 seconds
- [ ] History load < 3 seconds
- [ ] No lag when typing

### 6.4 Multi-User Test (Optional)

- [ ] Login with different Google account
- [ ] Save calculation
- [ ] Verify separate Sheet created
- [ ] Original account cannot see new data

---

## STEP 7: Documentation

### 7.1 Update README

- [ ] Add deployment URL
- [ ] Add usage instructions
- [ ] Add screenshots (optional)

### 7.2 Create Release Notes (Optional)

```markdown
# v2.0 Release Notes

## New Features

✨ Google OAuth login
✨ Save calculations to Google Sheets
✨ View calculation history
✨ Load previous calculations
✨ Delete calculations
✨ Mobile-responsive UI

## Security

🔒 Minimal OAuth scopes
🔒 User data isolation
🔒 No password storage

## Deployment

- Backend: Google Apps Script
- Frontend: GitHub Pages
```

- [ ] Release notes created
- [ ] Tagged in Git: `git tag v2.0`

---

## ✅ Completion Checklist

### Must Complete:

- [ ] Step 1: Backend deployed ✅
- [ ] Step 2: Config updated ✅
- [ ] Step 3: Local tests pass ✅

### Optional:

- [ ] Step 4: Mobile tested ⭐
- [ ] Step 5: Production deployed 🌐
- [ ] Step 6: Final verification 🔍
- [ ] Step 7: Documentation updated 📝

---

## 🎉 Success Criteria

You've successfully deployed when:

- ✅ Backend URL responds with JSON
- ✅ Frontend CONFIG updated
- ✅ Login triggers Google OAuth
- ✅ Save creates Sheet in your Drive
- ✅ History shows saved data
- ✅ Load/Delete work correctly
- ✅ Mobile responsive (optional)
- ✅ Live on web (optional)

---

## 📞 Support & Troubleshooting

If something doesn't work:

1. **Check Console** (F12 → Console tab)
   - Look for error messages
   - Note any red text

2. **Verify Backend URL**
   - Must end with `/exec`
   - Must be from `clasp deployments` command
   - Must have `https://` protocol

3. **Check Apps Script Logs**
   - Open https://script.google.com
   - Your project → View → Executions
   - Check for error messages

4. **Common Issues**:
   - "Backend URL not configured" → Update CONFIG.BACKEND_URL
   - "OAuth error" → Check scopes in appsscript.json
   - "CORS error" → Backend must be deployed as Web App
   - "Permission denied" → Re-approve OAuth consent

---

## 📊 Project Stats (Final)

- **Total Files**: 20+
- **Total Lines of Code**: ~5,700
- **Backend**: 750 lines (JavaScript)
- **Frontend**: 2,100 lines (HTML/CSS/JS)
- **Documentation**: 2,500+ lines (Markdown)
- **Time to Deploy**: 10-15 minutes
- **Cost**: $0 (FREE!)

---

## 🏆 Congratulations!

If all checkboxes are checked, you have successfully:

- ✅ Built a full-stack web app
- ✅ Integrated Google Apps Script backend
- ✅ Implemented OAuth authentication
- ✅ Created secure, user-owned data storage
- ✅ Deployed to production (optional)

**Your Terzaghi Calculator is now live and ready to use!** 🚀

---

**Deployment Date**: ******\_******  
**Deployed By**: ******\_******  
**Backend URL**: ********************\_\_\_\_********************  
**Frontend URL**: ********************\_\_\_\_********************  
**Status**: ⭕ In Progress | ✅ Complete
