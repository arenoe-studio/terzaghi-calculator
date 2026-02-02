/**
 * ============================================================================
 * SHEET MANAGER MODULE
 * ============================================================================
 * Handles all Google Sheets operations untuk user data storage
 *
 * Responsibilities:
 * - Find atau create user-specific Sheets
 * - Setup sheet headers dan formatting
 * - Manage sheet permissions
 *
 * Security Note:
 * - Sheets dibuat di Drive user, bukan Drive developer
 * - Developer tidak punya akses ke Sheet user
 * - Scope: drive.file (hanya file yang dibuat app ini)
 */

// ============================================================================
// MAIN SHEET OPERATIONS
// ============================================================================

/**
 * Get existing user sheet atau create new one jika belum ada
 *
 * Process:
 * 1. Get current user email
 * 2. Search for existing sheet dengan nama pattern
 * 3. If not found, create new sheet
 * 4. If found, validate structure
 * 5. Return sheet object
 *
 * @returns {Sheet} Google Sheet object untuk user ini
 * @throws {Error} Jika user tidak authenticated atau sheet creation gagal
 */
function getOrCreateUserSheet() {
  const userEmail = getCurrentUserEmail();
  if (!userEmail) {
    Logger.log("getOrCreateUserSheet: User email is null or empty");
    return null;
  }

  const sheetName = CONFIG.SHEET_NAME_PREFIX + userEmail;
  Logger.log("Starting sheet acquisition for: " + sheetName);

  try {
    // 1. Try to find existing
    let spreadsheet = findSpreadsheetByName(sheetName);
    
    if (spreadsheet) {
      Logger.log("Existing spreadsheet found: " + spreadsheet.getId());
    } else {
      // 2. Create if not found
      Logger.log("Spreadsheet not found, creating new one...");
      spreadsheet = createNewSpreadsheet(sheetName);
      if (!spreadsheet) {
        throw new Error("Creation returned null");
      }
    }

    // 3. Get or create the 'Calculations' tab
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_TAB_NAME);
    if (!sheet) {
      Logger.log("Tab '" + CONFIG.SHEET_TAB_NAME + "' not found, creating it.");
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_TAB_NAME);
      setupSheetHeaders(sheet);
      formatSheet(sheet);
    }

    // 4. Final validation before returning
    validateSheetStructure(sheet);
    return sheet;

  } catch (error) {
    Logger.log("CRITICAL ERROR in getOrCreateUserSheet: " + error.toString());
    // Rethrow so the caller knows failure happened
    throw error;
  }
}

/**
 * Find spreadsheet by name di Drive user
 *
 * Note: Karena scope drive.file, hanya bisa cari file yang dibuat oleh app ini
 *
 * @param {string} sheetName - Nama sheet yang dicari
 * @returns {Spreadsheet|null} Spreadsheet object atau null jika tidak ketemu
 */
/**
 * Find spreadsheet by name di Drive user
 *
 * Note: Karena scope drive.file, hanya bisa cari file yang dibuat oleh app ini
 *
 * @param {string} sheetName - Nama sheet yang dicari
 * @returns {Spreadsheet|null} Spreadsheet object atau null jika tidak ketemu
 */
function findSpreadsheetByName(sheetName) {
  try {
    // Note: getFilesByName only returns exact matches
    const files = DriveApp.getFilesByName(sheetName);

    while (files.hasNext()) {
      const file = files.next();

      // Skip if file is in trash
      if (file.isTrashed()) {
        continue;
      }

      // Check if it's a spreadsheet
      if (file.getMimeType() === MimeType.GOOGLE_SHEETS) {
        Logger.log("Found existing spreadsheet: " + file.getName() + " (ID: " + file.getId() + ")");
        return SpreadsheetApp.openById(file.getId());
      }
    }
    
    Logger.log("No existing non-trashed spreadsheet found with name: " + sheetName);
    return null;
  } catch (error) {
    Logger.log("findSpreadsheetByName error: " + error.toString());
    return null;
  }
}

/**
 * Create new spreadsheet di Drive user
 *
 * @param {string} sheetName - Nama untuk spreadsheet baru
 * @returns {Spreadsheet} Newly created spreadsheet
 */
function createNewSpreadsheet(sheetName) {
  try {
    // Create new spreadsheet
    const spreadsheet = SpreadsheetApp.create(sheetName);

    // Set timezone
    spreadsheet.setSpreadsheetTimeZone("Asia/Jakarta");

    Logger.log("Created new spreadsheet: " + spreadsheet.getUrl());

    return spreadsheet;
  } catch (error) {
    Logger.log("createNewSpreadsheet error: " + error.toString());
    throw new Error("Failed to create new spreadsheet: " + error.toString());
  }
}

// ============================================================================
// SHEET SETUP & FORMATTING
// ============================================================================

/**
 * Setup header row pada sheet baru
 *
 * @param {Sheet} sheet - Sheet object to setup
 */
function setupSheetHeaders(sheet) {
  try {
    // Set headers di row 1
    const headerRange = sheet.getRange(1, 1, 1, CONFIG.SHEET_HEADERS.length);
    headerRange.setValues([CONFIG.SHEET_HEADERS]);

    // Format header row
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#4285f4"); // Google blue
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");

    // Freeze header row
    sheet.setFrozenRows(1);

    Logger.log("Sheet headers setup complete");
  } catch (error) {
    Logger.log("setupSheetHeaders error: " + error.toString());
    throw new Error("Failed to setup sheet headers: " + error.toString());
  }
}

/**
 * Apply formatting ke sheet untuk readability
 *
 * @param {Sheet} sheet - Sheet object to format
 */
function formatSheet(sheet) {
  try {
    // Auto-resize columns
    for (let i = 1; i <= CONFIG.SHEET_HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }

    // Set alternating row colors untuk readability
    const lastRow = sheet.getMaxRows();
    if (lastRow > 1) {
      const dataRange = sheet.getRange(
        2,
        1,
        lastRow - 1,
        CONFIG.SHEET_HEADERS.length,
      );
      dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
    }

    // Set number formats untuk numeric columns
    // Column E onwards adalah numeric (kohesi, sudut geser, dll)
    if (sheet.getLastRow() > 1) {
      const numericRange = sheet.getRange(
        2,
        5,
        sheet.getLastRow() - 1,
        CONFIG.SHEET_HEADERS.length - 4,
      );
      numericRange.setNumberFormat("#,##0.000");
    }

    Logger.log("Sheet formatting applied");
  } catch (error) {
    Logger.log("formatSheet error: " + error.toString());
    // Non-critical error, don't throw
  }
}

/**
 * Validate bahwa sheet structure masih sesuai (header intact)
 *
 * @param {Sheet} sheet - Sheet to validate
 * @throws {Error} Jika structure invalid
 */
function validateSheetStructure(sheet) {
  try {
    const headerRange = sheet.getRange(1, 1, 1, CONFIG.SHEET_HEADERS.length);
    const actualHeaders = headerRange.getValues()[0];

    // Check each header
    for (let i = 0; i < CONFIG.SHEET_HEADERS.length; i++) {
      if (actualHeaders[i] !== CONFIG.SHEET_HEADERS[i]) {
        Logger.log(
          "Header mismatch at column " +
            (i + 1) +
            ': expected "' +
            CONFIG.SHEET_HEADERS[i] +
            '", got "' +
            actualHeaders[i] +
            '"',
        );

        // Auto-fix: reset headers
        setupSheetHeaders(sheet);
        return;
      }
    }

    // Structure valid
    Logger.log("Sheet structure validated successfully");
  } catch (error) {
    Logger.log("validateSheetStructure error: " + error.toString());
    // Try to fix by re-setting headers
    setupSheetHeaders(sheet);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get Sheet URL untuk user
 * Helper function untuk return sheet URL after save
 *
 * @returns {string} URL of user's sheet
 */
function getUserSheetUrl() {
  try {
    const sheet = getOrCreateUserSheet();
    if (!sheet) {
      Logger.log("getUserSheetUrl: getOrCreateUserSheet returned null");
      return "";
    }
    const url = sheet.getParent().getUrl();
    Logger.log("getUserSheetUrl: Success. URL: " + url);
    return url;
  } catch (error) {
    Logger.log("getUserSheetUrl error: " + error.toString());
    return "";
  }
}

/**
 * Count total calculations untuk user
 *
 * @returns {number} Number of saved calculations
 */
function getUserCalculationCount() {
  try {
    const sheet = getOrCreateUserSheet();
    return sheet.getLastRow() - 1; // Minus header row
  } catch (error) {
    Logger.log("getUserCalculationCount error: " + error.toString());
    return 0;
  }
}

// ============================================================================
// NOTES
// ============================================================================

/**
 * Dependencies:
 * - Code.gs: CONFIG object
 * - AuthHelper.gs: getCurrentUserEmail()
 *
 * Apps Script Services Used:
 * - SpreadsheetApp: Create dan manipulate sheets
 * - DriveApp: Search files (dengan scope drive.file)
 *
 * Security Considerations:
 * - Sheet dibuat di Drive user menggunakan context user
 * - Developer tidak bisa akses sheets di luar scope
 * - Sheet bisa di-share manual oleh user jika diperlukan
 *
 * Performance Notes:
 * - findSpreadsheetByName() bisa lambat jika user punya banyak files
 * - Consider caching spreadsheet ID di Properties Service (future optimization)
 */
