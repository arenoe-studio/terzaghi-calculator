# Google Apps Script Backend

Backend logic untuk Terzaghi Calculator yang berjalan di Google Apps Script.

## Files

- **Code.gs** - Main entry point dan API handler
- **SheetManager.gs** - Modul untuk manajemen Google Sheets
- **AuthHelper.gs** - Utilities untuk autentikasi
- **appsscript.json** - Manifest file (OAuth scopes & configuration)

## Deployment

1. Buka [script.google.com](https://script.google.com)
2. Buat project baru: "Terzaghi Calculator Backend"
3. Copy semua file .gs dari folder ini
4. Upload appsscript.json
5. Deploy → New deployment → Web App
6. Settings:
   - Execute as: **User accessing the web app**
   - Who has access: **Anyone**
7. Copy deployment URL ke `index.html`

## OAuth Scopes

```json
"oauthScopes": [
  "https://www.googleapis.com/auth/spreadsheets.currentonly",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email"
]
```

**Security Note**: Scope minimal hanya untuk file yang dibuat oleh app ini.

## Testing

Gunakan Apps Script built-in debugger:

1. Pilih function yang ingin di-test
2. Klik "Debug" atau "Run"
3. Lihat Execution log untuk output

## Quota Limits (Free Tier)

- Execution time: 6 min/execution
- URL Fetch calls: 20,000/day
- Concurrent executions: ~30
- Trigger total runtime: 90 min/day

Cukup untuk 100-1000 users dengan usage normal.
