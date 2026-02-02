# Terzaghi Calculator v2.0

Kalkulator online untuk analisis daya dukung pondasi dangkal menggunakan metode Terzaghi, dengan fitur penyimpanan data ke Google Sheets.

![Calculator Preview](assets/screenshots/calculator-ui.png)

## ✨ Features

### v2.0 (Current)

- ✅ **Perhitungan Daya Dukung Terzaghi** - Strip, Square, Circular foundations
- ✅ **General & Local Shear Failure** - Dengan bearing capacity factors lengkap
- ✅ **Pengaruh Muka Air Tanah** - Multiple groundwater scenarios
- ✅ **Optional Save Feature** - Toggle on/off untuk privasi
- ✅ **Google OAuth Login** - Aman dengan minimal permissions
- ✅ **Auto Google Sheet Creation** - Setiap user punya sheet pribadi
- ✅ **Calculation History** - View, load, dan manage perhitungan lama
- ✅ **100% Free** - Tidak ada biaya untuk developer maupun users

### v1.0 (Previous)

- Basic calculator tanpa penyimpanan data
- Static HTML only

## 🚀 Quick Start

### For Users

1. **Buka calculator**: [arenoe-studio.github.io/terzaghi-calculator](https://arenoe-studio.github.io/terzaghi-calculator)
2. **Gunakan tanpa login**: Langsung hitung daya dukung
3. **Aktifkan save (optional)**:
   - Toggle "Aktifkan Penyimpanan" ON
   - Login dengan Google
   - Setiap perhitungan bisa disimpan

**Detail user guide**: [docs/USER_GUIDE.md](docs/USER_GUIDE.md)

### For Developers

```bash
# Clone repository
git clone https://github.com/arenoe-studio/terzaghi-calculator.git
cd terzaghi-calculator

# Buka di browser
open index.html

# Deploy backend (Apps Script)
# Follow: docs/DEPLOYMENT_GUIDE.md
```

## 📁 Project Structure

```
terzaghi-calculator/
├── 📄 index.html                    # Main application (frontend)
├── 📁 css/                          # Stylesheets
│   └── styles.css
├── 📁 js/                           # JavaScript modules
│   ├── config.js                    # Configuration
│   ├── calculator.js                # Core Calculation Logic (Smart Conversion)
│   └── save-features.js             # Save/history features
│
├── 📁 gas-backend/                  # Google Apps Script backend
│   ├── Code.js                      # API routing
│   ├── SheetManager.js              # Data layer
│   ├── AuthHelper.js                # Authentication
│   └── appsscript.json              # Manifest
│
├── 📁 docs/                         # Documentation (organized)
│   ├── architecture/                # System design docs (ARCHITECTURE, FOLDER_STRUCTURE)
│   ├── guides/                      # User & Developer guides
│   ├── development/                 # Dev history & Refactoring logs
│   └── api/                         # API docs (future)
│
├── 📁 assets/                       # Images & screenshots
│   └── images/
├── 📁 tests/                        # Testing materials
├── 📁 scripts/                      # Utility scripts (Python, PowerShell)
└── 📁 archive/                      # Old versions (Legacy backup)
```

**New in v2.1**: Restructured for better organization and maintainability

## 🛠️ Tech Stack

| Component | Technology                      | Why                            |
| --------- | ------------------------------- | ------------------------------ |
| Frontend  | HTML + Vanilla JS + TailwindCSS | Zero build tools, fast loading |
| Backend   | Google Apps Script              | Free serverless, easy OAuth    |
| Database  | Google Sheets                   | Free, per-user privacy, visual |
| Auth      | Google OAuth 2.0                | Secure, no password management |
| Hosting   | GitHub Pages                    | Free, auto-deploy              |

## 🔒 Security & Privacy

- **Minimal OAuth Scopes**: Only `drive.file` (not full drive access!)
- **User Data Isolation**: Each user's data in their own Sheet
- **Developer Has Zero Access**: We cannot see user Sheets
- **Open Source**: Code is auditable by anyone
- **Revocable**: Users can revoke access anytime

**Detail security**: [docs/SECURITY.md](docs/SECURITY.md)

## 📚 Documentation

- **[PRD](docs/PRD.md)** - Product requirements & user stories
- **[Architecture](docs/ARCHITECTURE.md)** - System design & data flow
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - How to deploy
- **[User Guide](docs/USER_GUIDE.md)** - How to use
- **[API Reference](docs/API_REFERENCE.md)** - Backend API docs

## 🧪 Testing

```bash
# Manual testing checklist
See: tests/manual-test-checklist.md

# Test with sample data
See: tests/test-data.json
```

## 🎯 Roadmap

### v2.1 (Future)

- [ ] PDF export functionality
- [ ] Share calculation link
- [ ] Advanced charts & visualization
- [ ] Multiple language support

### v3.0 (Ideas)

- [ ] Progressive Web App (PWA)
- [ ] Offline mode
- [ ] Collaboration features
- [ ] Mobile native app

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for educational or commercial purposes.

## 👨‍💻 Authors

**Arenoe Studio**

- D4 Teknologi Rekayasa Konstruksi Bangunan Air
- Institut Teknologi Sepuluh Nopember
- Kelas C - TRKBA 2023

## 🙏 Acknowledgments

- ITS untuk fondasi pendidikan
- HMDS untuk support komunitas
- Terzaghi untuk metode bearing capacity analysis
- Google untuk free infrastructure (Apps Script, Sheets, OAuth)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/arenoe-studio/terzaghi-calculator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/arenoe-studio/terzaghi-calculator/discussions)
- **Email**: arenoe.studio@gmail.com

---

Made with ❤️ for civil engineering students and professionals
