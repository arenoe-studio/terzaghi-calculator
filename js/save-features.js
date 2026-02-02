/**
 * ============================================================================
 * TERZAGHI CALCULATOR - SAVE FEATURE JAVASCRIPT
 * ============================================================================
 * Frontend logic untuk save/history features
 *
 * Features:
 * - Toggle save feature ON/OFF
 * - Google OAuth login/logout
 * - Save calculations to backend
 * - Load and display history
 * - Delete calculations
 *
 * Dependencies:
 * - CONFIG object (from index.html)
 * - Storage object (from index.html)
 * - apiCall function (from index.html)
 * - Backend API deployed
 */



// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

// Global state for current sheet URL and auto-open flag
let currentSheetUrl = null;

// Initialize the direct redirect link for the sheet button
function initOpenSheetLink() {
  const btn = document.getElementById('openSheetButtonStatic');
  if (btn) {
    const redirectUrl = CONFIG.BACKEND_URL + (CONFIG.BACKEND_URL.includes('?') ? '&' : '?') + 'action=openSheet';
    btn.href = redirectUrl;
    console.log("Direct open sheet link initialized:", redirectUrl);
  }
}

/**
 * Login dengan Google OAuth via Popup
 */
function loginWithGoogle() {
  try {
    showNotification("Membuka jendela login Google...", "info");
    
    // Open backend URL with action=login in a popup
    const width = 600, height = 700;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    
    const loginUrl = CONFIG.BACKEND_URL + (CONFIG.BACKEND_URL.includes('?') ? '&' : '?') + 'action=login';
    console.log("Opening login popup:", loginUrl);
    
    const loginWindow = window.open(
        loginUrl, 
        'GoogleLogin', 
        `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for message from the popup
    const messageHandler = function(event) {
        console.log("Received message:", event.data);
        if (event.data && event.data.type === 'TERZAGHI_LOGIN_SUCCESS') {
            const response = event.data;
            if (response.success && response.data.authenticated) {
                // Save and Update UI
                Storage.set(CONFIG.STORAGE_KEY_USER_EMAIL, response.data.email);
                Storage.set(CONFIG.STORAGE_KEY_USER_NAME, response.data.name);
                displayUserInfo(response.data);
                showNotification(CONFIG.MSG.LOGIN_SUCCESS, "success");
            }
            window.removeEventListener('message', messageHandler);
        }
    };

    window.addEventListener('message', messageHandler);

    const timer = setInterval(() => {
        if (!loginWindow || loginWindow.closed) {
            clearInterval(timer);
            setTimeout(() => window.removeEventListener('message', messageHandler), 2000);
        }
    }, 1000);

  } catch (error) {
    console.error("Login trigger error:", error);
    showNotification("Login gagal dipicu: " + error.message, "error");
  }
}

/**
 * Logout - Clear session data
 */
function handleLogout() {
  // Clear localStorage
  Storage.remove(CONFIG.STORAGE_KEY_USER_EMAIL);
  Storage.remove(CONFIG.STORAGE_KEY_USER_NAME);
  currentSheetUrl = null;

  // Reset UI to logged-out state
  document.getElementById("loginPrompt").style.display = "block";
  document.getElementById("userInfo").style.display = "none";
  document.getElementById("loginButton").style.display = "inline-block";
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("saveSection").classList.remove("active");
  
  showNotification(CONFIG.MSG.LOGOUT_SUCCESS, "info");
}

/**
 * Display user info after successful login
 */
function displayUserInfo(userInfo) {
  console.log("displayUserInfo called with:", userInfo);
  // Update Global URL
  if (userInfo && typeof userInfo.sheetUrl !== 'undefined') {
    currentSheetUrl = userInfo.sheetUrl;
    console.log("Global currentSheetUrl updated to:", currentSheetUrl);
  } else {
    console.warn("displayUserInfo: userInfo.sheetUrl is missing");
  }

  // Hide/Show elements based on login state
  const loginPrompt = document.getElementById("loginPrompt");
  const userInfoDiv = document.getElementById("userInfo");
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");
  const userEmail = document.getElementById("userEmail");

  if (loginPrompt) loginPrompt.style.display = "none";
  if (userInfoDiv) userInfoDiv.style.display = "block";
  if (loginButton) loginButton.style.display = "none";
  if (logoutButton) logoutButton.style.display = "inline-block";
  if (userEmail) userEmail.textContent = userInfo.email;

  // Show save section if calculation has results
  const qult = document.getElementById("hasilQult");
  if (qult && qult.textContent && qult.textContent !== "-") {
    const saveSection = document.getElementById("saveSection");
    if (saveSection) saveSection.classList.add("active");
  }
}

/**
 * Check auth status on page load or toggle
 */
async function checkAuthStatus() {
  // Check localStorage first
  const savedEmail = Storage.get(CONFIG.STORAGE_KEY_USER_EMAIL);
  const savedName = Storage.get(CONFIG.STORAGE_KEY_USER_NAME);

  if (savedEmail) {
    // 1. Initial display with cached data (to feel fast)
    displayUserInfo({
      email: savedEmail,
      name: savedName || "User",
      authenticated: true
    });

    // 2. Fetch full info (including sheetUrl) in background
    try {
      const response = await apiCall(CONFIG.API.GET_USER_INFO);
      if (response.success && response.data.authenticated) {
        displayUserInfo(response.data);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.log("Could not refresh user info from server:", error);
    }
  }
}

// ============================================================================
// SAVE CALCULATION
// ============================================================================

/**
 * Save calculation to Google Sheet
 */
async function saveCalculationToSheet() {
  try {
    // Check if calculation has been done
    const qult = document.getElementById("hasilQult").textContent;
    if (!qult || qult === "-") {
      showNotification(
        "Silakan lakukan perhitungan terlebih dahulu!",
        "warning",
      );
      return;
    }

    // Collect calculation data
    const data = {
      description:
        document.getElementById("calculationDescription").value ||
        `Perhitungan ${new Date().toLocaleDateString("id-ID")}`,
      foundationType: document.getElementById("tipePondasi").value,
      failureType: document.getElementById("tipeKeruntuhan").value,
      cohesion: parseFloat(document.getElementById("kohesi").value),
      frictionAngle: parseFloat(document.getElementById("sudutGeser").value),
      soilUnitWeight: parseFloat(document.getElementById("gammaTanah").value),
      width: parseFloat(document.getElementById("lebarPondasi").value),
      depth: parseFloat(document.getElementById("kedalamanPondasi").value),
      safetyFactor: parseFloat(document.getElementById("faktorKeamanan").value),
      gwtDepth: parseFloat(document.getElementById("kedalamanMAT").value),
      saturatedUnitWeight: parseFloat(
        document.getElementById("gammaSat").value,
      ),
      waterUnitWeight: parseFloat(document.getElementById("gammaAir").value),
      qult: parseFloat(qult),
      qall: parseFloat(document.getElementById("hasilQall").textContent),
    };

    showLoading(true);

    // POST to backend
    const response = await apiCall("", {
      method: "POST",
      body: JSON.stringify({
        action: "save",
        data: data,
      }),
    });

    showLoading(false);

    if (response.success) {
      // Update global sheet URL if returned from save
      if (response.sheetUrl) {
        currentSheetUrl = response.sheetUrl;
      }

      const message = response.sheetUrl
        ? `${CONFIG.MSG.SAVE_SUCCESS} <a href="${response.sheetUrl}" target="_blank" style="color: #0062e6; text-decoration: underline;">Buka Sheet →</a>`
        : CONFIG.MSG.SAVE_SUCCESS;

      showNotification(message, "success");

      // Clear description
      document.getElementById("calculationDescription").value = "";
    }
  } catch (error) {
    showLoading(false);
    console.error("Save error:", error);
    showNotification(CONFIG.MSG.SAVE_ERROR + ": " + error.message, "error");
  }
}

// ============================================================================
// HISTORY MANAGEMENT
// ============================================================================

/**
 * Show history modal and load data
 */
async function showHistoryModal() {
  document.getElementById("historyModal").classList.add("active");
  document.getElementById("historyLoading").style.display = "block";
  document.getElementById("historyEmpty").style.display = "none";
  document.getElementById("historyList").innerHTML = "";

  try {
    const response = await apiCall(
      CONFIG.API.GET_HISTORY + CONFIG.MAX_HISTORY_DISPLAY,
    );

    document.getElementById("historyLoading").style.display = "none";

    if (response.data && response.data.length === 0) {
      document.getElementById("historyEmpty").style.display = "block";
    } else if (response.data && response.data.length > 0) {
      renderHistoryList(response.data);
    }
  } catch (error) {
    document.getElementById("historyLoading").style.display = "none";
    console.error("Load history error:", error);
    showNotification(CONFIG.MSG.LOAD_ERROR + ": " + error.message, "error");
  }
}

/**
 * Render history items in modal
 */
function renderHistoryList(calculations) {
  const listContainer = document.getElementById("historyList");
  listContainer.innerHTML = ""; // Clear first

  calculations.forEach((calc) => {
    const item = document.createElement("div");
    item.className = "history-item";

    // Escape data for safe injection
    const calcDataEscaped = JSON.stringify(calc).replace(/'/g, "&#39;");

    item.innerHTML = `
            <div class="history-item-header">
                <div class="history-item-title">
                    <h5>${escapeHtml(calc.description || "Perhitungan")}</h5>
                    <div class="history-item-date">${formatDate(calc.timestamp)}</div>
                </div>
                <div class="history-item-actions">
                    <button class="history-action-button history-load-button" 
                            onclick='loadCalculationFromHistory(${calcDataEscaped})'>
                        Muat
                    </button>
                    <button class="history-action-button history-delete-button" 
                            onclick="deleteCalculationFromHistory(${calc.rowIndex})">
                        Hapus
                    </button>
                </div>
            </div>
            <div class="history-item-details">
                <div class="history-detail"><strong>Tipe:</strong> ${calc.foundationType}</div>
                <div class="history-detail"><strong>Keruntuhan:</strong> ${calc.failureType}</div>
                <div class="history-detail"><strong>B:</strong> ${calc.width} m</div>
                <div class="history-detail"><strong>q<sub>ult</sub>:</strong> ${calc.qult.toFixed(3)} kg/cm²</div>
                <div class="history-detail"><strong>q<sub>all</sub>:</strong> ${calc.qall.toFixed(3)} kg/cm²</div>
            </div>
        `;

    listContainer.appendChild(item);
  });
}

/**
 * Load calculation from history into form
 */
function loadCalculationFromHistory(calc) {
  // Populate form fields
  document.getElementById("tipePondasi").value = calc.foundationType;
  document.getElementById("tipeKeruntuhan").value = calc.failureType;
  document.getElementById("kohesi").value = calc.cohesion;
  document.getElementById("sudutGeser").value = calc.frictionAngle;
  document.getElementById("gammaTanah").value = calc.soilUnitWeight;
  document.getElementById("lebarPondasi").value = calc.width;
  document.getElementById("kedalamanPondasi").value = calc.depth;
  document.getElementById("faktorKeamanan").value = calc.safetyFactor;
  document.getElementById("kedalamanMAT").value = calc.gwtDepth;
  document.getElementById("gammaSat").value = calc.saturatedUnitWeight;
  document.getElementById("gammaAir").value = calc.waterUnitWeight;

  // Close modal
  closeHistoryModal();

  // Trigger calculation
  hitungDayaDukung();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  showNotification(
    "Perhitungan dimuat! Hasil perhitungan sudah ditampilkan di bawah.",
    "success",
  );
}

/**
 * Delete calculation from history
 */
async function deleteCalculationFromHistory(rowIndex) {
  if (!confirm("Yakin ingin menghapus perhitungan ini?")) return;

  try {
    showLoading(true);

    const response = await apiCall("", {
      method: "POST",
      body: JSON.stringify({
        action: "delete",
        rowIndex: rowIndex,
      }),
    });

    showLoading(false);

    if (response.success) {
      showNotification(CONFIG.MSG.DELETE_SUCCESS, "success");
      // Refresh history
      showHistoryModal();
    }
  } catch (error) {
    showLoading(false);
    console.error("Delete error:", error);
    showNotification(CONFIG.MSG.DELETE_ERROR + ": " + error.message, "error");
  }
}

/**
 * Close history modal
 */
function closeHistoryModal(event) {
  if (!event || event.target.id === "historyModal") {
    document.getElementById("historyModal").classList.remove("active");
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Update showLoading implementation
 * (Overrides placeholder from index.html)
 */
function showLoading(show) {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    if (show) {
      overlay.classList.add("active");
    } else {
      overlay.classList.remove("active");
    }
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Page initialization
 * Run when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("save-features.js: DOMContentLoaded");

  // Always check auth status on load
  checkAuthStatus();

  // Initialize the direct sheet link
  initOpenSheetLink();

  // Validate config
  const isValid = validateConfig();
  if (!isValid) {
    console.warn(
      "⚠️ Backend URL not configured. Save features will not work until deployed.",
    );
  }

  // Hook into hitungDayaDukung (Wait a bit to ensure calculator.js loaded)
  // We use direct ID attachment for safety
  setTimeout(() => {
    const calcBtn = document.querySelector(".calculate-button");
    if (calcBtn) {
      console.log("save-features.js: Found calculate button. Attaching wrapped handler.");
      // We overwrite the onclick attribute to intercept it
      // Note: original hitungDayaDukung is globally available
      
      const wrappedHitung = function() {
        console.log("save-features.js: Wrapped hitungDayaDukung triggered");
        
        // 1. Run original calculation
        if (typeof hitungDayaDukung === "function") {
          try {
            hitungDayaDukung();
            console.log("save-features.js: Original calculation finished");
          } catch (e) {
            console.error("save-features.js: Error in original calculation:", e);
          }
        } else {
          console.error("save-features.js: hitungDayaDukung function not found!");
        }

        // 2. Show save section check
        const userEmail = Storage.get(CONFIG.STORAGE_KEY_USER_EMAIL);
        const qultElement = document.getElementById("hasilQult");
        const qultText = qultElement ? qultElement.textContent : "";
        
        console.log("save-features.js: Post-calc check:", {
          userEmail: userEmail,
          qultText: qultText,
          hasValue: qultText && qultText !== "-"
        });

        if (
          userEmail &&
          qultElement &&
          qultText &&
          qultText !== "-"
        ) {
          console.log("save-features.js: Showing save section");
          document.getElementById("saveSection").classList.add("active");
        } else {
            console.log("save-features.js: Save section conditions not met");
        }
      };

      // Handle both onclick attribute and addEventListener
      calcBtn.onclick = wrappedHitung;
    } else {
      console.error("save-features.js: Calculate button not found!");
    }
  }, 500); // 500ms delay to be safe
});
