# FASE 4 Summary: Frontend UI Implementation

## Status: ✅ CSS COMPLETE | ⏳ HTML & JS IN PROGRESS

### What Has Been Accomplished

#### 1. **Complete CSS Styling** ✅

**Added to index.html** (~480 lines of CSS):

- ✅ Save Toggle Switch (custom animated toggle)
- ✅ Login Section (with logged-in/logged-out states)
- ✅ Save Calculation Section
- ✅ History Modal (with items, actions, empty states)
- ✅ Loading Overlay (spinner animation)
- ✅ Responsive design for mobile
- ✅ Hover effects and transitions
- ✅ Modern, premium aesthetics

**Design Features**:

- Custom toggle switch dengan smooth animation
- Card-based layouts dengan shadows
- Color-coded buttons (blue=login, green=save, red=delete)
- Privacy badge untuk user trust
- Loading states dan empty states
- Mobile-responsive grid layouts

---

### What Needs to Be Done

#### 2. **HTML Components** (To Add)

Based on `docs/FRONTEND_COMPONENTS.md`, tambahkan ke `index.html`:

**Add after `<body>` tag**:

```html
<div class="save-toggle-container">
  <!-- Toggle switch -->
</div>
```

**Add inside calculator-container, after messageArea**:

```html
<div id="loginSection" class="login-section">
  <!-- Login UI -->
</div>
```

**Add after results-container**:

```html
<div id="saveSection" class="save-section">
  <!-- Save button & description input -->
</div>
```

**Add before `</body>`**:

```html
<div id="historyModal" class="history-modal">
  <!-- History modal with list -->
</div>
<div id="loadingOverlay" class="loading-overlay">
  <!-- Loading spinner -->
</div>
```

---

#### 3. **JavaScript Functions** (To Implement)

Tambahkan di section JavaScript (setelah existing functions):

**A. Save Feature Toggle**

```javascript
function toggleSaveFeature() {
  const isEnabled = document.getElementById("saveFeatureToggle").checked;
  Storage.set(CONFIG.STORAGE_KEY_SAVE_ENABLED, isEnabled);

  if (isEnabled) {
    document.getElementById("loginSection").classList.add("active");
    checkAuthStatus(); // Check if already logged in
  } else {
    document.getElementById("loginSection").classList.remove("active");
    document.getElementById("saveSection").classList.remove("active");
  }
}
```

**B. Authentication Flow**

```javascript
async function loginWithGoogle() {
  try {
    showLoading(true);

    // Call backend to trigger OAuth
    const response = await apiCall(CONFIG.API.GET_USER_INFO);

    if (response.success && response.data.authenticated) {
      // Save user info
      Storage.set(CONFIG.STORAGE_KEY_USER_EMAIL, response.data.email);
      Storage.set(CONFIG.STORAGE_KEY_USER_NAME, response.data.name);

      // Update UI
      displayUserInfo(response.data);
      showNotification(CONFIG.MSG.LOGIN_SUCCESS, "success");
    }

    showLoading(false);
  } catch (error) {
    showLoading(false);
    showNotification("Login gagal: " + error.message, "error");
  }
}

function handleLogout() {
  Storage.remove(CONFIG.STORAGE_KEY_USER_EMAIL);
  Storage.remove(CONFIG.STORAGE_KEY_USER_NAME);

  // Reset UI
  document.getElementById("loginPrompt").style.display = "block";
  document.getElementById("userInfo").style.display = "none";
  document.getElementById("loginButton").style.display = "inline-block";
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("saveSection").classList.remove("active");

  showNotification(CONFIG.MSG.LOGOUT_SUCCESS, "info");
}

function displayUserInfo(userInfo) {
  document.getElementById("loginPrompt").style.display = "none";
  document.getElementById("userInfo").style.display = "block";
  document.getElementById("userEmail").textContent = userInfo.email;
  document.getElementById("loginButton").style.display = "none";
  document.getElementById("logoutButton").style.display = "inline-block";

  // Show save section if calculation exists
  if (document.getElementById("hasilQult").textContent !== "-") {
    document.getElementById("saveSection").classList.add("active");
  }
}

async function checkAuthStatus() {
  // Check localStorage first
  const savedEmail = Storage.get(CONFIG.STORAGE_KEY_USER_EMAIL);

  if (savedEmail) {
    // Verify with backend
    try {
      const response = await apiCall(CONFIG.API.GET_USER_INFO);
      if (response.success && response.data.authenticated) {
        displayUserInfo(response.data);
      }
    } catch (error) {
      // Session expired, clear storage
      handleLogout();
    }
  }
}
```

**C. Save Calculation**

```javascript
async function saveCalculationToSheet() {
  try {
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
      qult: parseFloat(document.getElementById("hasilQult").textContent),
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
      showNotification(
        CONFIG.MSG.SAVE_SUCCESS +
          ` <a href="${response.sheetUrl}" target="_blank">Buka Sheet</a>`,
        "success",
      );

      // Clear description
      document.getElementById("calculationDescription").value = "";
    }
  } catch (error) {
    showLoading(false);
    showNotification(CONFIG.MSG.SAVE_ERROR + ": " + error.message, "error");
  }
}
```

**D. History Management**

```javascript
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

    if (response.data.length === 0) {
      document.getElementById("historyEmpty").style.display = "block";
    } else {
      renderHistoryList(response.data);
    }
  } catch (error) {
    document.getElementById("historyLoading").style.display = "none";
    showNotification(CONFIG.MSG.LOAD_ERROR, "error");
  }
}

function renderHistoryList(calculations) {
  const listContainer = document.getElementById("historyList");

  calculations.forEach((calc) => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
            <div class="history-item-header">
                <div class="history-item-title">
                    <h5>${calc.description}</h5>
                    <div class="history-item-date">${formatDate(calc.timestamp)}</div>
                </div>
                <div class="history-item-actions">
                    <button class="history-action-button history-load-button" 
                            onclick='loadCalculationFromHistory(${JSON.stringify(calc)})'>
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
                <div class="history-detail"><strong>B:</strong> ${calc.width} m</div>
                <div class="history-detail"><strong>q<sub>ult</sub>:</strong> ${calc.qult.toFixed(3)} kg/cm²</div>
                <div class="history-detail"><strong>q<sub>all</sub>:</strong> ${calc.qall.toFixed(3)} kg/cm²</div>
            </div>
        `;
    listContainer.appendChild(item);
  });
}

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
    'Perhitungan dimuat! Klik "Hitung" untuk melihat hasil.',
    "success",
  );
}

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
    showNotification(CONFIG.MSG.DELETE_ERROR, "error");
  }
}

function closeHistoryModal(event) {
  if (!event || event.target.id === "historyModal") {
    document.getElementById("historyModal").classList.remove("active");
  }
}
```

**E. Initialization**

```javascript
// Update showLoading() implementation
function showLoading(show) {
  const overlay = document.getElementById("loadingOverlay");
  if (show) {
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}

// DOMContentLoaded initialization
document.addEventListener("DOMContentLoaded", function () {
  // Load saved toggle preference
  const savedToggle = Storage.get(CONFIG.STORAGE_KEY_SAVE_ENABLED, false);
  document.getElementById("saveFeatureToggle").checked = savedToggle;

  if (savedToggle) {
    toggleSaveFeature();
  }

  // Validate config
  validateConfig();
});
```

---

### Implementation Strategy

Given the file size, we have 2 options:

**Option A: Manual Integration** (Recommended for learning)

1. Open `index.html` in editor
2. Add HTML components based on `docs/FRONTEND_COMPONENTS.md`
3. Add JavaScript functions to existing `<script>` section
4. Test incrementally

**Option B: Complete File Replacement**

1. I can generate complete new `index.html` with all changes
2. Replace existing file
3. Test end-to-end

**Which approach do you prefer?**

---

### Testing Checklist (After Integration)

- [ ] Toggle switch berfungsi
- [ ] Login section muncul saat toggle ON
- [ ] Login button trigger OAuth (akan error jika backend belum deployed)
- [ ] Save section muncul setelah perhitungan + login
- [ ] History modal dapat dibuka
- [ ] Loading overlay tampil saat API call
- [ ] Responsive di mobile

---

### Next Steps

1. **Complete HTML Integration** - Add components to index.html
2. **Add JavaScript Functions** - Implement all save/history logic
3. **Deploy Backend** - Use clasp to deploy Apps Script
4. **Update CONFIG.BACKEND_URL** - Point to deployed backend
5. **End-to-End Testing** - Follow `tests/backend-test-guide.md`

---

## Files Created This Phase

| File                        | Purpose             | Status      |
| --------------------------- | ------------------- | ----------- |
| index.html (CSS)            | All UI styles       | ✅ Complete |
| docs/FRONTEND_COMPONENTS.md | HTML snippets guide | ✅ Complete |
| FASE4_SUMMARY.md            | This file           | ✅ Complete |

**Total CSS Added**: ~480 lines  
**Total HTML To Add**: ~150 lines  
**Total JS To Add**: ~400 lines

---

**Ready for final integration in FASE 5?**

Or would you like me to complete the HTML & JS integration now?
