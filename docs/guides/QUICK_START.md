# 🚀 Quick Start Guide - Terzaghi Calculator dengan Backend

## TL;DR - 3 Steps to Launch

```
1. Deploy Backend → 2. Update Config → 3. Test & Launch
```

---

## 📋 Step-by-Step Deployment

### 🔷 STEP 1: Deploy Backend to Google Apps Script

```bash
# Terminal commands
cd gas-backend

# Login to Google (one-time)
clasp login

# Create new Apps Script project
clasp create --title "Terzaghi Calculator Backend" --type webapp

# Upload files to Google
clasp push

# Deploy as web app
clasp deploy --description "v2.0 initial release"

# Get deployment URL
clasp deployments
```

**Expected Output**:

```
- <DEPLOYMENT_ID> @1
   - AKfycby...XXXXXXXXXXX... (Web App URL) ← COPY THIS!
```

**Manual Alternative** (if clasp fails):

1. Go to https://script.google.com
2. New Project → "Terzaghi Calculator Backend"
3. Copy content from `Code.js`, `SheetManager.js`, `AuthHelper.js`
4. Paste into Apps Script editor (create 3 files)
5. Deploy → New Deployment → Web App
   - Execute as: User accessing
   - Who has access: Anyone
6. Copy Web App URL

---

### 🔷 STEP 2: Update Frontend Configuration

Open `index.html` and find this line (~528):

```javascript
BACKEND_URL: 'YOUR_APPS_SCRIPT_URL_HERE',  // TODO: Replace
```

Replace with your deployment URL:

```javascript
BACKEND_URL: 'https://script.google.com/macros/s/AKfycby.../exec',
```

**Save the file.**

---

### 🔷 STEP 3: Test Locally

1. **Open** `index.html` in browser (double-click or right-click → Open with → Browser)

2. **Test Save Toggle**:
   - Toggle switch di kanan atas
   - Login section muncul ✅

3. **Test Login**:
   - Click "Login dengan Google"
   - Google OAuth consent screen muncul
   - Approve permissions
   - User email ditampilkan ✅

4. **Test Calculation & Save**:
   - Isi form perhitungan
   - Click "Hitung Daya Dukung"
   - Save section muncul
   - Click "Simpan ke Google Sheet"
   - Sheet terbuka di Drive Anda ✅

5. **Test History**:
   - Click "Lihat Riwayat Perhitungan"
   - Modal dengan data muncul
   - Click "Muat" → form terisi
   - Click "Hapus" → data terhapus ✅

---

## 🌐 STEP 4 (Optional): Deploy Frontend to Web

### Option A: GitHub Pages (Free)

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - Terzaghi Calculator v2.0"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/terzaghi-calculator.git
git branch -M main
git push -u origin main

# Enable GitHub Pages
# Go to repo → Settings → Pages
# Source: gh-pages branch (will be created by GitHub Actions)
```

**GitHub Actions** (already configured in `.github/workflows/deploy.yml`) will:

- Automatically deploy to GitHub Pages on every push
- URL: `https://YOUR_USERNAME.github.io/terzaghi-calculator/`

### Option B: Other Hosting

Upload `index.html` and `save-features.js` to:

- Vercel (drag & drop)
- Netlify (drag & drop)
- Firebase Hosting
- Any static file server

---

## ⚡ Quick Troubleshooting

### Backend URL Error

**Problem**: "Backend URL belum dikonfigurasi"  
**Fix**: Update `CONFIG.BACKEND_URL` in index.html (Step 2)

### Login Not Working

**Problem**: OAuth screen doesn't appear  
**Fix**: Check backend URL is correct and accessible

### Save Button Disabled

**Problem**: "Simpan" button grayed out  
**Fix**:

1. Make sure save toggle is ON
2. Make sure you're logged in
3. Make sure calculation is done (q_ult displayed)

### History Empty

**Problem**: "Belum ada perhitungan"  
**Fix**: Save at least one calculation first

### Sheet Not Created

**Problem**: No sheet appears in Drive  
**Fix**:

1. Check backend deployment is successful
2. Check OAuth consent was approved
3. Check browser console for errors (F12)

---

## 📱 Features Overview

### ✅ What Works Now:

- ✅ Toggle save feature ON/OFF
- ✅ Google OAuth login
- ✅ Auto-create personal Google Sheets
- ✅ Save calculations to Sheet
- ✅ View calculation history
- ✅ Load previous calculations
- ✅ Delete calculations
- ✅ Secure (minimal OAuth scopes)
- ✅ User data isolation
- ✅ Mobile responsive
- ✅ Modern UI with animations

### 🎨 UI Components:

- 🔘 Toggle switch (top right)
- 🔐 Login section (shows when toggle ON)
- 💾 Save section (shows after login + calculation)
- 📋 History modal (full-screen on mobile)
- ⏳ Loading overlay (during API calls)

---

## 🎯 What's Next?

### Required:

- [ ] Deploy backend (Step 1)
- [ ] Update config (Step 2)
- [ ] Test end-to-end (Step 3)

### Optional:

- [ ] Deploy frontend to web (Step 4)
- [ ] Customize branding (logos, colors)
- [ ] Add more features (see FINAL_SUMMARY.md)

---

## 📚 Documentation Files

| File                          | Purpose                         |
| ----------------------------- | ------------------------------- |
| `README.md`                   | Project overview                |
| `FINAL_SUMMARY.md`            | Complete implementation summary |
| `gas-backend/DEPLOYMENT.md`   | Detailed backend deployment     |
| `tests/backend-test-guide.md` | Testing scenarios               |
| `docs/ARCHITECTURE.md`        | System architecture             |
| `docs/FRONTEND_COMPONENTS.md` | UI components guide             |

---

## 🆘 Need Help?

1. **Check console** (F12 in browser) for errors
2. **Check Apps Script logs** (in Apps Script editor → Execution logs)
3. **Verify OAuth scopes** (Google Account → Security → Third-party apps)
4. **Read error messages** (they're designed to be helpful!)

---

## 🎉 Success Criteria

You'll know it's working when:

- ✅ Toggle switch changes state smoothly
- ✅ Login button triggers Google OAuth
- ✅ After login, email is displayed
- ✅ After calculation, save section appears
- ✅ Save button creates Sheet in your Drive
- ✅ Sheet has your data with timestamp
- ✅ History modal shows saved calculations
- ✅ Load button repopulates form
- ✅ Everything looks professional and premium

---

## 💡 Pro Tips

1. **Test in Incognito** to verify fresh OAuth flow
2. **Check Sheet Name** should be "Terzaghi Calculator - your.email@example.com"
3. **Bookmark Sheet** for quick access to your calculations
4. **Backup CONFIG** before modifying index.html
5. **Use Git** to track changes

---

## 🏁 Ready to Deploy!

**Current Status**: ✅ All code complete  
**Estimated Time**: 10-15 minutes for full deployment  
**Difficulty**: Easy (copy-paste URL, click deploy)

**Good luck! 🚀**
