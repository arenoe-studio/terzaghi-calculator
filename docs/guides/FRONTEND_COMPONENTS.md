# Frontend UI Components - HTML Snippets

## 1. Save Toggle Switch (Fixed Position - Top Right)

```html
<!-- Save Feature Toggle - Fixed position di top right -->
<div class="save-toggle-container">
  <span class="save-toggle-label">Aktifkan Penyimpanan</span>
  <label class="toggle-switch">
    <input
      type="checkbox"
      id="saveFeatureToggle"
      onchange="toggleSaveFeature()"
    />
    <span class="toggle-slider"></span>
  </label>
</div>
```

**Placement**: Setelah `<body>` tag, sebelum header-container

---

## 2. Login Section

```html
<!-- Login Section - Appears when save toggle is ON -->
<div id="loginSection" class="login-section">
  <div class="login-content">
    <!-- Not logged in state -->
    <div id="loginPrompt" class="login-info">
      <h4>💾 Simpan Riwayat Perhitungan</h4>
      <p style="margin: 0; font-size: 0.9rem; color: #566573;">
        Login dengan Google untuk menyimpan perhitungan Anda ke Google Sheets
        pribadi.
      </p>
    </div>

    <!-- Logged in state (hidden by default) -->
    <div id="userInfo" class="login-info" style="display: none;">
      <h4>Selamat datang!</h4>
      <p class="user-email" id="userEmail">-</p>
      <span class="privacy-badge">
        <span>🔒</span> Data tersimpan di Drive Anda
      </span>
    </div>

    <!-- Login/Logout button -->
    <div>
      <button id="loginButton" class="login-button" onclick="loginWithGoogle()">
        Login dengan Google
      </button>
      <button
        id="logoutButton"
        class="logout-button"
        onclick="handleLogout()"
        style="display: none;"
      >
        Logout
      </button>
    </div>
  </div>
</div>
```

**Placement**: Di dalam `calculator-container`, setelah `main-title` dan `messageArea`

---

## 3. Save Calculation Section

```html
<!-- Save Calculation Section - After results -->
<!-- Place this after the results-container div, before watermark -->
<div id="saveSection" class="save-section">
  <h4>💾 Simpan Perhitungan Ini</h4>

  <div class="save-input-group">
    <label for="calculationDescription">Nama/Deskripsi (Opsional):</label>
    <input
      type="text"
      id="calculationDescription"
      placeholder="Contoh: Fondasi Gedung A - Zona 1"
      maxlength="200"
    />
  </div>

  <button class="save-button" onclick="saveCalculationToSheet()">
    <span>💾</span>
    <span id="saveButtonText">Simpan ke Google Sheet</span>
  </button>

  <button class="history-button" onclick="showHistoryModal()">
    <span>📋</span> Lihat Riwayat Perhitungan
  </button>
</div>
```

**Placement**: Setelah `results-container`, sebelum `watermark`

---

## 4. History Modal

```html
<!-- History Modal - At end of body, before closing </body> -->
<div id="historyModal" class="history-modal" onclick="closeHistoryModal(event)">
  <div class="history-content" onclick="event.stopPropagation()">
    <!-- Header -->
    <div class="history-header">
      <h3>📋 Riwayat Perhitungan</h3>
      <button class="history-close-button" onclick="closeHistoryModal()">
        ×
      </button>
    </div>

    <!-- Body -->
    <div class="history-body">
      <!-- Loading state -->
      <div
        id="historyLoading"
        style="display: none; text-align: center; padding: 2rem;"
      >
        <div
          style="display: inline-block; border: 3px solid #f3f3f3; border-top: 3px solid #0062e6; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"
        ></div>
        <p style="margin-top: 1rem; color: #7f8c8d;">Memuat riwayat...</p>
      </div>

      <!-- Empty state -->
      <div id="historyEmpty" class="history-empty" style="display: none;">
        <p>📭 Belum ada perhitungan yang disimpan.</p>
        <p style="font-size: 0.9rem; color: #95a5a6;">
          Lakukan perhitungan dan klik "Simpan ke Google Sheet" untuk menyimpan.
        </p>
      </div>

      <!-- History list -->
      <div id="historyList" class="history-list">
        <!-- History items will be dynamically inserted here -->
      </div>
    </div>
  </div>
</div>
```

**Placement**: Sebelum closing `</body>` tag, setelah help modal

---

## 5. Loading Overlay

```html
<!-- Loading Overlay - Global loading indicator -->
<div id="loadingOverlay" class="loading-overlay">
  <div class="loading-spinner"></div>
</div>
```

**Placement**: Setelah history modal, sebelum closing `</body>` tag

---

## Integration Order

1.  **After `<body>`**: Save Toggle Switch
2.  **Inside calculator-container, after messageArea**: Login Section
3.  **After results-container**: Save Section
4.  **Before `</body>`**: History Modal + Loading Overlay

---

## Complete Body Structure

```
<body>
    <!-- 1. Save Toggle (fixed) -->
    <div class="save-toggle-container">...</div>

    <!-- Existing header -->
    <div class="header-container">...</div>

    <div class="calculator-container">
        <h2>...</h2>
        <div id="messageArea">...</div>

        <!-- 2. Login Section (NEW) -->
        <div id="loginSection" class="login-section">...</div>

        <!-- Existing calculator inputs -->
        ...

        <!-- Existing results -->
        <div class="results-container">...</div>

        <!-- 3. Save Section (NEW) -->
        <div id="saveSection" class="save-section">...</div>

        <!-- Existing watermark -->
        <div class="watermark">...</div>
    </div>

    <!-- Existing help button & modal -->
    ...

    <!-- 4. History Modal (NEW) -->
    <div id="historyModal" class="history-modal">...</div>

    <!-- 5. Loading Overlay (NEW) -->
    <div id="loadingOverlay" class="loading-overlay">...</div>

    <!-- Existing script -->
    <script>...</script>
</body>
```

---

## Next: JavaScript Implementation

After adding these HTML components, we'll implement:

- `toggleSaveFeature()` - Toggle save feature on/off
- `loginWithGoogle()` - OAuth login flow
- `handleLogout()` - Clear session
- `saveCalculationToSheet()` - Save data to backend
- `showHistoryModal()` - Display history
- `loadCalculationFromHistory(data)` - Repopulate form
- `deleteCalculationFromHistory(rowIndex)` - Delete entry

These functions will be added to the existing `<script>` section.
