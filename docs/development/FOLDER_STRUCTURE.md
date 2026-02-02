# 📁 Folder Structure - Terzaghi Calculator v2.0

## Final Organization

```
terzaghi-calculator/
│
├── 📄 index.html                    # Main application (self-contained SPA)
├── 📄 README.md                     # Project overview & quick start
├── 📄 .gitignore                    # Git ignore rules
│
├── 📁 gas-backend/                  # Google Apps Script backend
│   ├── 📄 README.md                 # Backend deployment guide
│   ├── 📄 Code.gs                   # [TO CREATE] Main API handler
│   ├── 📄 SheetManager.gs           # [TO CREATE] Sheet operations
│   ├── 📄 AuthHelper.gs             # [TO CREATE] Auth utilities
│   └── 📄 appsscript.json           # [TO CREATE] OAuth manifest
│
├── 📁 docs/                         # 📚 All documentation
│   ├── 📄 README.md                 # Documentation index
│   ├── 📄 PRD.md                    # ✅ Product requirements
│   ├── 📄 ARCHITECTURE.md           # ✅ System architecture
│   ├── 📄 PROJECT_STRUCTURE.md      # ✅ Folder organization
│   ├── 📄 DEPLOYMENT_GUIDE.md       # [TO CREATE] Deployment steps
│   ├── 📄 USER_GUIDE.md             # [TO CREATE] End-user guide
│   ├── 📄 SECURITY.md               # [TO CREATE] Security details
│   └── 📄 API_REFERENCE.md          # [TO CREATE] Backend API docs
│
├── 📁 assets/                       # 🎨 Static assets
│   ├── 📄 README.md                 # ✅ Asset organization guide
│   │
│   ├── 📁 images/                   # Images & logos
│   │   ├── 🖼️ logo-its.png          # ✅ ITS logo (moved)
│   │   ├── 🖼️ logo-hmds.png         # ✅ HMDS logo (moved)
│   │   ├── 🖼️ diagram-mat.png       # ✅ Groundwater diagram (moved)
│   │   └── 🖼️ diagram-pondasi.png   # ✅ Foundation diagram (moved)
│   │
│   └── 📁 screenshots/              # UI screenshots for docs
│       ├── 📄 .gitkeep              # [TO CREATE] Keep folder in git
│       ├── 🖼️ calculator-ui.png     # [FUTURE] Main interface
│       ├── 🖼️ login-flow.png        # [FUTURE] Login process
│       └── 🖼️ history-modal.png     # [FUTURE] History view
│
├── 📁 tests/                        # 🧪 Testing materials
│   ├── 📄 README.md                 # ✅ Testing strategy
│   ├── 📄 manual-test-checklist.md  # [TO CREATE] QA checklist
│   └── 📄 test-data.json            # [TO CREATE] Sample test data
│
└── 📁 .github/                      # ⚙️ GitHub configuration
    └── 📁 workflows/
        └── 📄 deploy.yml            # ✅ Auto-deploy action
```

## Status Legend

- ✅ **Created** - File sudah dibuat dan siap
- 📄 **[TO CREATE]** - File yang akan dibuat di fase berikutnya
- 🖼️ **[FUTURE]** - File yang akan dibuat nanti (screenshot, dll)

## Folder Purpose Summary

| Folder              | Purpose               | Size (approx) |
| ------------------- | --------------------- | ------------- |
| 📁 **root**         | Main app (index.html) | 40 KB         |
| 📁 **gas-backend/** | Server-side logic     | 10-15 KB      |
| 📁 **docs/**        | All documentation     | 50-100 KB     |
| 📁 **assets/**      | Images & media        | 5 MB (images) |
| 📁 **tests/**       | Testing materials     | 5-10 KB       |
| 📁 **.github/**     | CI/CD config          | 1 KB          |

**Total Project Size**: ~5 MB (mostly images)

## What's Been Organized

### ✅ Completed in This Phase:

1. **Created folder structure**:
   - `gas-backend/` untuk backend code
   - `docs/` untuk semua dokumentasi
   - `assets/images/` dan `assets/screenshots/`
   - `tests/` untuk testing materials
   - `.github/workflows/` untuk CI/CD

2. **Moved files to proper locations**:
   - PRD.md, ARCHITECTURE.md, PROJECT_STRUCTURE.md → `docs/`
   - Logo ITS & HMDS → `assets/images/`
   - diagram-mat.png & diagram-pondasi.png → `assets/images/`

3. **Created READMEs** for every folder:
   - Root README.md (project overview)
   - gas-backend/README.md (deployment guide)
   - docs/README.md (documentation index)
   - assets/README.md (asset organization)
   - tests/README.md (testing strategy)

4. **Added supporting files**:
   - .gitignore (proper git exclusions)
   - .github/workflows/deploy.yml (auto-deployment)

## Next Steps (FASE 2)

Sekarang folder sudah rapi, kita akan:

1. Create boilerplate files (Code.gs, appsscript.json, etc)
2. Setup configuration constants
3. Create base helper functions
4. Prepare for main implementation

---

**Structure is now clean and professional! 🎉**

Ready for FASE 2: PEMBUATAN BOILERPLATE & KONFIGURASI GLOBAL
