/**
 * ============================================================================
 * TERZAGHI CALCULATOR - GOOGLE APPS SCRIPT BACKEND
 * ============================================================================
 * Main entry point untuk Web App yang menangani autentikasi dan API routing
 *
 * Features:
 * - User authentication via Google OAuth
 * - Auto-create user-specific Google Sheets
 * - CRUD operations untuk calculation history
 * - RESTful-style API responses
 *
 * Security:
 * - Minimal OAuth scopes (drive.file, spreadsheets.currentonly)
 * - Execute as "User accessing" untuk data isolation
 * - No developer access to user data
 *
 * @author Your Name
 * @version 2.0
 * @license MIT
 */

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

/**
 * Global configuration object
 * Centralized config untuk menghindari hard-coded values
 */
const CONFIG = {
  // Sheet Configuration
  SHEET_NAME_PREFIX: "Terzaghi Calculator - ",
  SHEET_TAB_NAME: "Calculations",

  // Data Limits
  MAX_HISTORY_ITEMS: 100,
  MAX_DESCRIPTION_LENGTH: 200,

  // Response Messages
  MSG_SUCCESS_SAVE: "Data berhasil disimpan ke Google Sheet",
  MSG_SUCCESS_DELETE: "Perhitungan berhasil dihapus",
  MSG_ERROR_AUTH: "Autentikasi gagal. Silakan login ulang",
  MSG_ERROR_SAVE: "Gagal menyimpan data",
  MSG_ERROR_LOAD: "Gagal memuat riwayat perhitungan",
  MSG_ERROR_DELETE: "Gagal menghapus perhitungan",
  MSG_ERROR_INVALID_DATA: "Data tidak valid",

  // Sheet Headers (sesuai dengan struktur data)
  SHEET_HEADERS: [
    "Timestamp",
    "Deskripsi",
    "Tipe Pondasi",
    "Tipe Keruntuhan",
    "Kohesi (c)",
    "Sudut Geser (φ)",
    "Berat Vol. Tanah (γ)",
    "Lebar/Diameter (B)",
    "Kedalaman (Df)",
    "Faktor Keamanan (SF)",
    "Kedalaman MAT (Dw)",
    "Berat Vol. Jenuh (γsat)",
    "Berat Vol. Air (γw)",
    "Daya Dukung Ultimit (qult)",
    "Daya Dukung Aman (qall)",
  ],

  // API version
  VERSION: "2.0",
};

// ============================================================================
// MAIN WEB APP ENTRY POINT
// ============================================================================

/**
 * Entry point untuk GET requests
 * Handles routing berdasarkan action parameter
 *
 * @param {Object} e - Event object dari Apps Script
 * @param {Object} e.parameter - Query parameters dari URL
 * @returns {ContentService.TextOutput} JSON response
 */
function doGet(e) {
  try {
    const action = e.parameter.action || "info";

    // Router berdasarkan action
    switch (action) {
      case "info":
        return createJsonResponse({
          success: true,
          message: "Terzaghi Calculator Backend API",
          version: CONFIG.VERSION,
          endpoints: {
            getUserInfo: "?action=getUserInfo",
            getHistory: "?action=getHistory&limit=100",
          },
        });

      case "getUserInfo":
        return handleGetUserInfo();

      case "login":
        return handleLogin();

      case "getHistory":
        const limit = parseInt(e.parameter.limit) || CONFIG.MAX_HISTORY_ITEMS;
        return handleGetHistory(limit);

      default:
        return createJsonResponse(
          {
            success: false,
            error: "Unknown action: " + action,
          },
          400,
        );
    }
  } catch (error) {
    Logger.log("doGet error: " + error.toString());
    return createJsonResponse(
      {
        success: false,
        error: error.toString(),
      },
      500,
    );
  }
}

/**
 * Entry point untuk POST requests
 * Handles data submission (save, delete)
 *
 * @param {Object} e - Event object dari Apps Script
 * @param {string} e.postData.contents - JSON payload dari frontend
 * @returns {ContentService.TextOutput} JSON response
 */
function doPost(e) {
  try {
    // Parse JSON payload
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    // Router berdasarkan action
    switch (action) {
      case "getUserInfo":
        return handleGetUserInfo();

      case "getHistory":
        const limit = parseInt(payload.limit) || CONFIG.MAX_HISTORY_ITEMS;
        return handleGetHistory(limit);

      case "save":
        return handleSaveCalculation(payload.data);

      case "delete":
        return handleDeleteCalculation(payload.rowIndex);

      default:
        return createJsonResponse(
          {
            success: false,
            error: "Unknown action: " + action,
          },
          400,
        );
    }
  } catch (error) {
    Logger.log("doPost error: " + error.toString());
    return createJsonResponse(
      {
        success: false,
        error: error.toString(),
      },
      500,
    );
  }
}

// ============================================================================
// API HANDLERS
// ============================================================================

/**
 * Menangani login flow via popup
 * Mengembalikan HTML yang akan mengirimkan data ke window.opener via postMessage
 */
function handleLogin() {
  const userInfo = getCurrentUserInfo();
  const sheetUrl = getUserSheetUrl();
  const data = JSON.stringify({
    success: true,
    data: {
      ...userInfo,
      sheetUrl: sheetUrl || ""
    }
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Login Success</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; background: #f4f8ff; color: #333; }
          .loader { border: 4px solid #f3f3f3; border-top: 4px solid #0062e6; border-radius: 50%; width: 30px; height: 30px; animation: spin 2s linear infinite; margin: 20px auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <h3>Login Berhasil!</h3>
        <p>Mohon tunggu sebentar, sedang mengalihkan...</p>
        <div class="loader"></div>
        <script>
          const data = ${data};
          // Kirim data ke aplikasi utama
          if (window.opener) {
            window.opener.postMessage({ type: 'TERZAGHI_LOGIN_SUCCESS', ...data }, '*');
            setTimeout(() => window.close(), 1000);
          } else {
            document.body.innerHTML = "<h3>Login Berhasil!</h3><p>Anda bisa menutup jendela ini sekarang.</p>";
          }
        </script>
      </body>
    </html>
  `;
  
  return HtmlService.createHtmlOutput(html)
    .setTitle("Login Success - Terzaghi Calculator")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Get information tentang user yang sedang login
 *
 * @returns {ContentService.TextOutput} JSON response dengan user info
 */
function handleGetUserInfo() {
  try {
    const userInfo = getCurrentUserInfo();

    if (!userInfo.email) {
      return createJsonResponse(
        {
          success: false,
          error: CONFIG.MSG_ERROR_AUTH,
        },
        401,
      );
    }

    const sheetUrl = getUserSheetUrl();
    Logger.log("Returning user info for " + userInfo.email + " with sheetUrl: " + sheetUrl);

    return createJsonResponse({
      success: true,
      data: {
        ...userInfo,
        sheetUrl: sheetUrl || "" 
      },
    });
  } catch (error) {
    Logger.log("handleGetUserInfo error: " + error.toString());
    return createJsonResponse(
      {
        success: false,
        error: error.toString(),
      },
      500,
    );
  }
}

/**
 * Save calculation data ke user's Google Sheet
 *
 * @param {Object} data - Calculation data dari frontend
 * @returns {ContentService.TextOutput} JSON response dengan sheet URL
 */
function handleSaveCalculation(data) {
  try {
    // Validate data
    if (!validateCalculationData(data)) {
      return createJsonResponse(
        {
          success: false,
          error: CONFIG.MSG_ERROR_INVALID_DATA,
        },
        400,
      );
    }

    // Get or create user's sheet
    const sheet = getOrCreateUserSheet();

    // Prepare row data
    const rowData = prepareRowData(data);

    // Append to sheet
    sheet.appendRow(rowData);

    // Get sheet URL
    const sheetUrl = sheet.getParent().getUrl();

    return createJsonResponse({
      success: true,
      message: CONFIG.MSG_SUCCESS_SAVE,
      sheetUrl: sheetUrl,
    });
  } catch (error) {
    Logger.log("handleSaveCalculation error: " + error.toString());
    return createJsonResponse(
      {
        success: false,
        error: CONFIG.MSG_ERROR_SAVE + ": " + error.toString(),
      },
      500,
    );
  }
}

/**
 * Get calculation history dari user's Google Sheet
 *
 * @param {number} limit - Maximum number of records to return
 * @returns {ContentService.TextOutput} JSON response dengan array of calculations
 */
function handleGetHistory(limit) {
  try {
    const sheet = getOrCreateUserSheet();
    const lastRow = sheet.getLastRow();

    // If only header exists (no data)
    if (lastRow <= 1) {
      return createJsonResponse({
        success: true,
        data: [],
        count: 0,
      });
    }

    // Calculate range to fetch
    const numRows = Math.min(lastRow - 1, limit);
    const startRow = lastRow - numRows + 1;

    // Get data
    const range = sheet.getRange(
      startRow,
      1,
      numRows,
      CONFIG.SHEET_HEADERS.length,
    );
    const values = range.getValues();

    // Convert to array of objects
    const calculations = values
      .map((row, index) => {
        return {
          rowIndex: startRow + index,
          timestamp: row[0],
          description: row[1],
          foundationType: row[2],
          failureType: row[3],
          cohesion: row[4],
          frictionAngle: row[5],
          soilUnitWeight: row[6],
          width: row[7],
          depth: row[8],
          safetyFactor: row[9],
          gwtDepth: row[10],
          saturatedUnitWeight: row[11],
          waterUnitWeight: row[12],
          qult: row[13],
          qall: row[14],
        };
      })
      .reverse(); // Most recent first

    return createJsonResponse({
      success: true,
      data: calculations,
      count: calculations.length,
    });
  } catch (error) {
    Logger.log("handleGetHistory error: " + error.toString());
    return createJsonResponse(
      {
        success: false,
        error: CONFIG.MSG_ERROR_LOAD + ": " + error.toString(),
      },
      500,
    );
  }
}

/**
 * Delete calculation dari user's Google Sheet
 *
 * @param {number} rowIndex - Row number to delete (1-indexed)
 * @returns {ContentService.TextOutput} JSON response
 */
function handleDeleteCalculation(rowIndex) {
  try {
    const sheet = getOrCreateUserSheet();

    // Validate row index
    if (!rowIndex || rowIndex < 2 || rowIndex > sheet.getLastRow()) {
      return createJsonResponse(
        {
          success: false,
          error: "Invalid row index",
        },
        400,
      );
    }

    // Delete row
    sheet.deleteRow(rowIndex);

    return createJsonResponse({
      success: true,
      message: CONFIG.MSG_SUCCESS_DELETE,
    });
  } catch (error) {
    Logger.log("handleDeleteCalculation error: " + error.toString());
    return createJsonResponse(
      {
        success: false,
        error: CONFIG.MSG_ERROR_DELETE + ": " + error.toString(),
      },
      500,
    );
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create standardized JSON response
 *
 * @param {Object} data - Response data
 * @param {number} httpCode - HTTP status code (default: 200)
 * @returns {ContentService.TextOutput} JSON response
 */
function createJsonResponse(data, httpCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);

  // Note: Apps Script doesn't support custom HTTP codes in response
  // but we include it for documentation purposes
  return output;
}

/**
 * Validate calculation data before saving
 *
 * @param {Object} data - Calculation data
 * @returns {boolean} True if valid
 */
function validateCalculationData(data) {
  // Check required fields
  const requiredFields = [
    "foundationType",
    "failureType",
    "cohesion",
    "frictionAngle",
    "soilUnitWeight",
    "width",
    "depth",
    "safetyFactor",
    "gwtDepth",
    "saturatedUnitWeight",
    "waterUnitWeight",
    "qult",
    "qall",
  ];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      Logger.log("Validation failed: missing field " + field);
      return false;
    }
  }

  // Validate numeric fields
  const numericFields = [
    "cohesion",
    "frictionAngle",
    "soilUnitWeight",
    "width",
    "depth",
    "safetyFactor",
    "gwtDepth",
    "saturatedUnitWeight",
    "waterUnitWeight",
    "qult",
    "qall",
  ];

  for (const field of numericFields) {
    if (isNaN(parseFloat(data[field]))) {
      Logger.log("Validation failed: " + field + " is not a number");
      return false;
    }
  }

  return true;
}

/**
 * Prepare row data array dari calculation object
 *
 * @param {Object} data - Calculation data
 * @returns {Array} Array of values untuk sheet row
 */
function prepareRowData(data) {
  const timestamp = new Date();
  const description =
    data.description ||
    "Perhitungan " +
      Utilities.formatDate(timestamp, "Asia/Jakarta", "yyyy-MM-dd HH:mm");

  return [
    timestamp,
    description.substring(0, CONFIG.MAX_DESCRIPTION_LENGTH),
    data.foundationType,
    data.failureType,
    parseFloat(data.cohesion),
    parseFloat(data.frictionAngle),
    parseFloat(data.soilUnitWeight),
    parseFloat(data.width),
    parseFloat(data.depth),
    parseFloat(data.safetyFactor),
    parseFloat(data.gwtDepth),
    parseFloat(data.saturatedUnitWeight),
    parseFloat(data.waterUnitWeight),
    parseFloat(data.qult),
    parseFloat(data.qall),
  ];
}

// ============================================================================
// NOTES & DEPENDENCIES
// ============================================================================

/**
 * Dependencies:
 * - AuthHelper.gs: getCurrentUserInfo()
 * - SheetManager.gs: getOrCreateUserSheet()
 *
 * External APIs:
 * - Google Sheets API (via SpreadsheetApp)
 * - Google Drive API (via DriveApp)
 *
 * Next Steps:
 * - Implement AuthHelper.gs untuk user authentication
 * - Implement SheetManager.gs untuk sheet operations
 * - Test semua endpoints dengan Apps Script debugger
 */
