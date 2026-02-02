# Scripts

Utility scripts for development and maintenance.

## Files

- **refactor.ps1** - Automated file refactoring PowerShell script

## Usage

### refactor.ps1

Automatically splits monolithic index.html into modular structure:

- Extracts CSS to `css/styles.css`
- Extracts JavaScript to `js/config.js` and `js/calculator.js`
- Creates clean index.html with proper includes

**Run:**

```powershell
cd "d:\04 PROJECTS\TERZAGHI CALCULATOR\terzaghi-calculator"
.\scripts\refactor.ps1
```

**Note**: This script has already been executed. It's kept for reference and potential future use.
