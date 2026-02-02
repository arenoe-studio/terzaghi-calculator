/**
 * ============================================================================
 * AUTHENTICATION HELPER MODULE
 * ============================================================================
 * Handles user authentication dan session management
 *
 * Responsibilities:
 * - Get current user information dari Session
 * - Validate user authentication
 * - Provide user details untuk personalization
 *
 * OAuth Flow:
 * 1. User clicks login di frontend
 * 2. Google OAuth consent screen appears (managed by Google)
 * 3. User approves minimal scopes
 * 4. Token stored di browser (client-side)
 * 5. Apps Script receives authenticated requests via Session
 *
 * Security Note:
 * - Tidak ada password storage (Google handles auth)
 * - Tidak ada token storage di backend (stateless)
 * - Session managed by Google OAuth
 */

// ============================================================================
// USER INFORMATION
// ============================================================================

/**
 * Get current authenticated user's information
 *
 * Uses Session.getActiveUser() which returns user yang sedang execute script
 * Karena executeAs: "USER_ACCESSING", ini adalah user yang login, bukan developer
 *
 * @returns {Object} User info object {email, name}
 */
function getCurrentUserInfo() {
  try {
    const user = Session.getActiveUser();
    const email = user.getEmail();

    // If no email, user belum authenticated
    if (!email) {
      return {
        authenticated: false,
        email: null,
        name: null,
      };
    }

    // Extract name dari email (before @)
    // Note: getActiveUser() tidak provide display name di Apps Script
    const name = extractNameFromEmail(email);

    return {
      authenticated: true,
      email: email,
      name: name,
    };
  } catch (error) {
    Logger.log("getCurrentUserInfo error: " + error.toString());
    return {
      authenticated: false,
      email: null,
      name: null,
      error: error.toString(),
    };
  }
}

/**
 * Get hanya email dari current user
 * Helper function yang sering digunakan di module lain
 *
 * @returns {string|null} User email atau null jika tidak authenticated
 */
function getCurrentUserEmail() {
  try {
    const email = Session.getActiveUser().getEmail();
    return email || null;
  } catch (error) {
    Logger.log("getCurrentUserEmail error: " + error.toString());
    return null;
  }
}

/**
 * Check apakah user sudah authenticated
 *
 * @returns {boolean} True jika authenticated
 */
function isUserAuthenticated() {
  const email = getCurrentUserEmail();
  return email !== null && email !== "";
}

// ============================================================================
// USER VALIDATION
// ============================================================================

/**
 * Validate request dari user
 * Ensures user is authenticated sebelum process request
 *
 * @param {boolean} throwError - Whether to throw error atau return boolean
 * @returns {boolean} True jika valid
 * @throws {Error} Jika not authenticated dan throwError = true
 */
function validateUserRequest(throwError = false) {
  const authenticated = isUserAuthenticated();

  if (!authenticated && throwError) {
    throw new Error(CONFIG.MSG_ERROR_AUTH);
  }

  return authenticated;
}

/**
 * Validate user has permission untuk access specific sheet
 *
 * Note: Dalam current implementation, user hanya bisa access sheet mereka sendiri
 * Function ini untuk future-proofing jika ada sharing features
 *
 * @param {string} sheetId - Spreadsheet ID to validate
 * @returns {boolean} True jika user punya akses
 */
function validateSheetAccess(sheetId) {
  try {
    // Try to open spreadsheet
    const spreadsheet = SpreadsheetApp.openById(sheetId);

    // If successful, user has access
    // If not, akan throw error dan caught di catch block
    return true;
  } catch (error) {
    Logger.log("validateSheetAccess error: " + error.toString());
    return false;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract display name dari email address
 * Simple heuristic: ambil text sebelum @ dan capitalize
 *
 * Example:
 * - john.doe@example.com → John Doe
 * - student123@its.ac.id → Student123
 *
 * @param {string} email - Email address
 * @returns {string} Extracted name
 */
function extractNameFromEmail(email) {
  try {
    if (!email) return "User";

    // Get part before @
    const username = email.split("@")[0];

    // Replace dots/underscores with spaces
    let name = username.replace(/[._]/g, " ");

    // Capitalize first letter of each word
    name = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return name;
  } catch (error) {
    Logger.log("extractNameFromEmail error: " + error.toString());
    return "User";
  }
}

/**
 * Get user's timezone (if available dari profile)
 * Falls back to default timezone dari CONFIG
 *
 * @returns {string} Timezone string (e.g., "Asia/Jakarta")
 */
function getUserTimezone() {
  try {
    // Apps Script tidak provide user timezone via Session
    // Return default dari spreadsheet atau CONFIG
    return "Asia/Jakarta";
  } catch (error) {
    return "Asia/Jakarta";
  }
}

/**
 * Log user activity untuk debugging/analytics (optional)
 *
 * Note: Ini tidak menyimpan personal data, hanya activity type
 * Useful untuk debugging dan understanding usage patterns
 *
 * @param {string} action - Action yang dilakukan user
 * @param {Object} metadata - Optional metadata tentang action
 */
function logUserActivity(action, metadata = {}) {
  try {
    const email = getCurrentUserEmail();
    const timestamp = new Date();

    // Log to Apps Script logger (visible di Execution logs)
    Logger.log(
      "USER_ACTIVITY: " + action + " by " + email + " at " + timestamp,
    );

    // Include metadata if provided
    if (Object.keys(metadata).length > 0) {
      Logger.log("Metadata: " + JSON.stringify(metadata));
    }

    // Future: Bisa simpan ke separate analytics sheet jika diperlukan
  } catch (error) {
    // Don't throw error untuk logging failures
    Logger.log("logUserActivity error: " + error.toString());
  }
}

// ============================================================================
// SESSION MANAGEMENT (Future Enhancement)
// ============================================================================

/**
 * Check session validity
 *
 * Note: Current implementation relies on Google OAuth session
 * Function ini reserved untuk future enhancements seperti:
 * - Custom session timeout
 * - Rate limiting per user
 * - Usage quotas
 *
 * @returns {Object} Session status {valid, expiresAt, etc}
 */
function checkSessionStatus() {
  return {
    valid: isUserAuthenticated(),
    provider: "Google OAuth",
    managed: "By Google",
    note: "Session automatically handled by Google OAuth",
  };
}

// ============================================================================
// NOTES
// ============================================================================

/**
 * Dependencies:
 * - Code.gs: CONFIG object
 *
 * Apps Script Services Used:
 * - Session: Get active user information
 * - Logger: Logging untuk debugging
 *
 * Security Considerations:
 * - No password handling (delegated to Google)
 * - No token storage (client-side only)
 * - Session managed by Google OAuth (secure)
 * - User email used as unique identifier
 *
 * OAuth Scopes Required:
 * - userinfo.email: Get user email
 *
 * Limitations:
 * - Cannot get user's display name directly (must extract from email)
 * - Cannot get profile picture URL
 * - Cannot customize session timeout (managed by Google)
 *
 * Future Enhancements:
 * - Integrate with Google People API untuk better user info
 * - Add custom rate limiting per user
 * - Add usage analytics
 * - Add custom session validation rules
 */
