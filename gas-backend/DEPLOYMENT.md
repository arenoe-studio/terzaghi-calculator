# Deploying Backend with Clasp

## Prerequisites

```bash
# Install clasp globally
npm install -g @google/clasp

# Login to Google account
clasp login
```

## Initial Setup

1. **Create new Apps Script project**:

```bash
cd gas-backend
clasp create --title "Terzaghi Calculator Backend" --type webapp
```

This will create `.clasp.json` with your script ID.

2. **Or, clone existing project** (if you already created one):

```bash
cd gas-backend
clasp clone <YOUR_SCRIPT_ID>
```

## Deploy Workflow

### 1. Push Changes to Apps Script

```bash
cd gas-backend
clasp push
```

This will upload:

- Code.js → Code.gs
- SheetManager.js → SheetManager.gs
- AuthHelper.js → AuthHelper.gs
- appsscript.json → appsscript.json

### 2. Deploy as Web App

```bash
clasp deploy --description "v2.0 initial deployment"
```

Or deploy via Apps Script UI:

1. Run `clasp open` to open in browser
2. Click Deploy → New deployment
3. Select type: Web app
4. Execute as: User accessing the web app
5. Who has access: Anyone
6. Deploy

### 3. Get Deployment URL

```bash
clasp deployments
```

Copy the Web App URL and update `CONFIG.BACKEND_URL` in `index.html`.

## Development Workflow

```bash
# Edit files locally (Code.js, SheetManager.js, etc)
# Push to Apps Script
clasp push

# View logs
clasp logs

# Open in browser for testing
clasp open

# Create new version
clasp version "v2.0.1 - Bug fixes"

# Deploy new version
clasp deploy --versionNumber 2 --description "v2.0.1"
```

## File Extensions

- **Local**: `.js` files (better IDE support, linting)
- **Remote**: Automatically converted to `.gs` by clasp

## .claspignore

Create `.claspignore` untuk exclude files:

```
node_modules/
.git/
README.md
DEPLOYMENT.md
```

## Useful Commands

```bash
# Pull from remote (download from Apps Script)
clasp pull

# Check status
clasp list

# Run function for testing
clasp run functionName

# View project info
clasp info
```

## Troubleshooting

**Issue**: `User has not enabled the Apps Script API`

- Go to: https://script.google.com/home/usersettings
- Enable Apps Script API

**Issue**: `Push failed`

- Check `.clasp.json` has correct scriptId
- Run `clasp login` again

**Issue**: `Deployment not found`

- Deploy via UI first, then use `clasp deploy`

## Next Steps

After deployment:

1. Copy Web App URL
2. Update `index.html` → `CONFIG.BACKEND_URL`
3. Test with `?action=info` endpoint
4. Verify OAuth scopes prompt correctly
