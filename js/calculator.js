// ============================================================================
// KONSTANTA & CONFIG
// ============================================================================

// Faktor Konversi Satuan (Base: kg, cm)
const UNIT_FACTORS = {
    // Tekanan (Pressure/Stress) - Base: kg/cm²
    stress: {
        'kgcm2': 1,
        'tonm2': 0.1,        // 1 Ton/m² = 0.1 kg/cm²
        'knm2': 0.0101972    // 1 kN/m² ≈ 0.0102 kg/cm² (g=9.81 m/s²)
    },
    // Berat Volume (Density/Unit Weight) - Base: kg/cm³
    density: {
        'kgcm3': 1,
        'tonm3': 0.001,      // 1 Ton/m³ = 0.001 kg/cm³
        'knm3': 0.00010197   // 1 kN/m³ ≈ 0.0001 kg/cm³
    }
};

// Label Satuan untuk Display Output
const UNIT_LABELS = {
    stress: {
        'kgcm2': 'kg/cm²',
        'tonm2': 'Ton/m²',
        'knm2': 'kN/m²'
    },
    density: {
        'kgcm3': 'kg/cm³',
        'tonm3': 'Ton/m³',
        'knm3': 'kN/m³'
    }
};

// Data Tabel Faktor Daya Dukung Terzaghi (General Shear)
const generalShearFactors = [
    { phi: 0, Nc: 5.70, Nq: 1.00, Ng: 0.00 }, { phi: 1, Nc: 6.00, Nq: 1.10, Ng: 0.01 },
    { phi: 2, Nc: 6.30, Nq: 1.22, Ng: 0.04 }, { phi: 3, Nc: 6.62, Nq: 1.35, Ng: 0.06 },
    { phi: 4, Nc: 6.97, Nq: 1.49, Ng: 0.10 }, { phi: 5, Nc: 7.34, Nq: 1.64, Ng: 0.14 },
    { phi: 6, Nc: 7.73, Nq: 1.81, Ng: 0.20 }, { phi: 7, Nc: 8.15, Nq: 2.00, Ng: 0.27 },
    { phi: 8, Nc: 8.60, Nq: 2.21, Ng: 0.35 }, { phi: 9, Nc: 9.09, Nq: 2.44, Ng: 0.44 },
    { phi: 10, Nc: 9.61, Nq: 2.69, Ng: 0.56 }, { phi: 11, Nc: 10.16, Nq: 2.98, Ng: 0.69 },
    { phi: 12, Nc: 10.76, Nq: 3.29, Ng: 0.85 }, { phi: 13, Nc: 11.41, Nq: 3.63, Ng: 1.04 },
    { phi: 14, Nc: 12.11, Nq: 4.02, Ng: 1.26 }, { phi: 15, Nc: 12.86, Nq: 4.45, Ng: 1.52 },
    { phi: 16, Nc: 13.68, Nq: 4.92, Ng: 1.82 }, { phi: 17, Nc: 14.60, Nq: 5.45, Ng: 2.18 },
    { phi: 18, Nc: 15.12, Nq: 6.04, Ng: 2.59 }, { phi: 19, Nc: 16.56, Nq: 6.70, Ng: 3.07 },
    { phi: 20, Nc: 17.69, Nq: 7.44, Ng: 3.64 }, { phi: 21, Nc: 18.92, Nq: 8.26, Ng: 4.31 },
    { phi: 22, Nc: 20.27, Nq: 9.19, Ng: 5.09 }, { phi: 23, Nc: 21.75, Nq: 10.23, Ng: 6.00 },
    { phi: 24, Nc: 23.36, Nq: 11.40, Ng: 7.08 }, { phi: 25, Nc: 25.13, Nq: 12.72, Ng: 8.34 },
    { phi: 26, Nc: 27.09, Nq: 14.21, Ng: 9.84 }, { phi: 27, Nc: 29.24, Nq: 15.90, Ng: 11.60 },
    { phi: 28, Nc: 31.61, Nq: 17.81, Ng: 13.70 }, { phi: 29, Nc: 34.24, Nq: 19.98, Ng: 16.18 },
    { phi: 30, Nc: 37.16, Nq: 22.46, Ng: 19.13 }, { phi: 31, Nc: 40.41, Nq: 25.28, Ng: 22.65 },
    { phi: 32, Nc: 44.04, Nq: 28.52, Ng: 26.87 }, { phi: 33, Nc: 48.09, Nq: 32.23, Ng: 31.94 },
    { phi: 34, Nc: 52.64, Nq: 36.50, Ng: 38.04 }, { phi: 35, Nc: 57.75, Nq: 41.44, Ng: 45.41 },
    { phi: 36, Nc: 63.53, Nq: 47.16, Ng: 54.36 }, { phi: 37, Nc: 70.01, Nq: 53.80, Ng: 65.27 },
    { phi: 38, Nc: 77.50, Nq: 61.55, Ng: 78.61 }, { phi: 39, Nc: 85.97, Nq: 70.61, Ng: 95.03 },
    { phi: 40, Nc: 95.66, Nq: 81.27, Ng: 115.31 }, { phi: 41, Nc: 106.81, Nq: 93.85, Ng: 140.51 },
    { phi: 42, Nc: 119.67, Nq: 108.75, Ng: 171.99 }, { phi: 43, Nc: 134.58, Nq: 126.50, Ng: 211.56 },
    { phi: 44, Nc: 151.95, Nq: 147.74, Ng: 261.60 }, { phi: 45, Nc: 172.28, Nq: 173.28, Ng: 325.34 },
    { phi: 46, Nc: 196.22, Nq: 204.19, Ng: 407.11 }, { phi: 47, Nc: 224.55, Nq: 241.80, Ng: 512.84 },
    { phi: 48, Nc: 258.28, Nq: 287.85, Ng: 650.67 }, { phi: 49, Nc: 298.71, Nq: 344.63, Ng: 831.99 },
    { phi: 50, Nc: 347.50, Nq: 415.14, Ng: 1072.80 }
];

// Data Tabel Faktor Daya Dukung Terzaghi (Local Shear)
const localShearFactors = [
    { phi: 0, NcP: 5.70, NqP: 1.00, NgP: 0.00 }, { phi: 1, NcP: 5.90, NqP: 1.07, NgP: 0.005 },
    { phi: 2, NcP: 6.10, NqP: 1.14, NgP: 0.02 }, { phi: 3, NcP: 6.30, NqP: 1.22, NgP: 0.04 },
    { phi: 4, NcP: 6.51, NqP: 1.30, NgP: 0.055 }, { phi: 5, NcP: 6.74, NqP: 1.39, NgP: 0.074 },
    { phi: 6, NcP: 6.97, NqP: 1.49, NgP: 0.10 }, { phi: 7, NcP: 7.22, NqP: 1.59, NgP: 0.128 },
    { phi: 8, NcP: 7.47, NqP: 1.70, NgP: 0.16 }, { phi: 9, NcP: 7.74, NqP: 1.82, NgP: 0.20 },
    { phi: 10, NcP: 8.02, NqP: 1.94, NgP: 0.24 }, { phi: 11, NcP: 8.32, NqP: 2.08, NgP: 0.30 },
    { phi: 12, NcP: 8.63, NqP: 2.22, NgP: 0.35 }, { phi: 13, NcP: 8.96, NqP: 2.38, NgP: 0.42 },
    { phi: 14, NcP: 9.31, NqP: 2.55, NgP: 0.48 }, { phi: 15, NcP: 9.67, NqP: 2.73, NgP: 0.57 },
    { phi: 16, NcP: 10.06, NqP: 2.92, NgP: 0.67 }, { phi: 17, NcP: 10.47, NqP: 3.13, NgP: 0.76 },
    { phi: 18, NcP: 10.90, NqP: 3.36, NgP: 0.88 }, { phi: 19, NcP: 11.36, NqP: 3.61, NgP: 1.03 },
    { phi: 20, NcP: 11.85, NqP: 3.88, NgP: 1.12 }, { phi: 21, NcP: 12.37, NqP: 4.17, NgP: 1.35 },
    { phi: 22, NcP: 12.92, NqP: 4.48, NgP: 1.55 }, { phi: 23, NcP: 13.51, NqP: 4.82, NgP: 1.74 },
    { phi: 24, NcP: 14.14, NqP: 5.20, NgP: 1.97 }, { phi: 25, NcP: 14.80, NqP: 5.60, NgP: 2.25 },
    { phi: 26, NcP: 15.53, NqP: 6.05, NgP: 2.59 }, { phi: 27, NcP: 16.30, NqP: 6.54, NgP: 2.88 },
    { phi: 28, NcP: 17.13, NqP: 7.07, NgP: 3.29 }, { phi: 29, NcP: 18.03, NqP: 7.66, NgP: 3.76 },
    { phi: 30, NcP: 18.99, NqP: 8.31, NgP: 4.39 }, { phi: 31, NcP: 20.03, NqP: 9.03, NgP: 4.83 },
    { phi: 32, NcP: 21.16, NqP: 9.82, NgP: 5.51 }, { phi: 33, NcP: 22.39, NqP: 10.69, NgP: 6.32 },
    { phi: 34, NcP: 23.72, NqP: 11.67, NgP: 7.22 }, { phi: 35, NcP: 25.18, NqP: 12.75, NgP: 8.35 },
    { phi: 36, NcP: 26.77, NqP: 13.97, NgP: 9.41 }, { phi: 37, NcP: 28.51, NqP: 15.32, NgP: 10.90 },
    { phi: 38, NcP: 30.43, NqP: 16.85, NgP: 12.75 }, { phi: 39, NcP: 32.53, NqP: 18.56, NgP: 14.71 },
    { phi: 40, NcP: 34.87, NqP: 20.50, NgP: 17.22 }, { phi: 41, NcP: 37.45, NqP: 22.70, NgP: 19.75 },
    { phi: 42, NcP: 40.33, NqP: 25.21, NgP: 22.50 }, { phi: 43, NcP: 43.54, NqP: 28.06, NgP: 26.25 },
    { phi: 44, NcP: 47.13, NqP: 31.34, NgP: 30.40 }, { phi: 45, NcP: 51.17, NqP: 35.11, NgP: 36.00 },
    { phi: 46, NcP: 55.73, NqP: 39.48, NgP: 41.70 }, { phi: 47, NcP: 60.91, NqP: 44.45, NgP: 49.30 },
    { phi: 48, NcP: 66.80, NqP: 50.46, NgP: 59.25 }, { phi: 49, NcP: 73.55, NqP: 57.41, NgP: 71.45 },
    { phi: 50, NcP: 81.31, NqP: 65.60, NgP: 85.75 }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getElementValue(id) {
    const value = document.getElementById(id).value;
    return value === "" ? null : parseFloat(value);
}

function getSelectedUnit(id) {
    const element = document.getElementById(id);
    return element ? element.value : null;
}

/**
 * Konversi nilai input ke satuan basis (kg/cm² atau kg/cm³)
 * @param {number} value - Nilai input
 * @param {string} type - Tipe satuan: 'stress' atau 'density'
 * @param {string} unit - Kode satuan input (misal 'knm2')
 * @returns {number} Nilai dalam satuan basis
 */
function toBaseUnit(value, type, unit) {
    if (value === null || isNaN(value)) return null;
    const factor = UNIT_FACTORS[type][unit];
    if (!factor) {
        console.error(`Unknown unit: ${unit} for type ${type}`);
        return value; // Fallback: anggap sudah base
    }
    return value * factor;
}

/**
 * Konversi nilai dari satuan basis ke target unit
 * @param {number} baseValue - Nilai dalam satuan basis
 * @param {string} type - Tipe satuan
 * @param {string} targetUnit - Satuan tujuan
 * @returns {number} Nilai terkonversi
 */
function fromBaseUnit(baseValue, type, targetUnit) {
    if (baseValue === null || isNaN(baseValue)) return null;
    const factor = UNIT_FACTORS[type][targetUnit];
    return baseValue / factor;
}

function displayMessage(message, type = 'info') {
    const messageArea = document.getElementById('messageArea');
    const messageClass = type === 'error' ? 'error-message' : 'info-message';
    messageArea.innerHTML = `<div class="${messageClass}">${message}</div>`;
}

function clearMessages() {
    document.getElementById('messageArea').innerHTML = '';
    document.getElementById('formulaDisplayContainer').style.display = 'none';
    document.getElementById('formulaText').innerHTML = '';
}

function interpolate(phi, factorTable, factorKeyNc, factorKeyNq, factorKeyNg) {
    phi = Math.max(0, Math.min(50, phi)); 

    let lower = null;
    let upper = null;

    for (let i = 0; i < factorTable.length; i++) {
        if (factorTable[i].phi <= phi) {
            lower = factorTable[i];
        }
        if (factorTable[i].phi >= phi && upper === null) {
            upper = factorTable[i];
        }
    }
    
    if (!lower && upper) lower = upper; 
    if (!upper && lower) upper = lower;

    if (!lower || !upper) return { Nc: null, Nq: null, Ng: null }; 

    if (lower.phi === phi) return { Nc: lower[factorKeyNc], Nq: lower[factorKeyNq], Ng: lower[factorKeyNg] };
    if (upper.phi === phi) return { Nc: upper[factorKeyNc], Nq: upper[factorKeyNq], Ng: upper[factorKeyNg] };
    
    if (upper.phi - lower.phi === 0) {
        return { Nc: lower[factorKeyNc], Nq: lower[factorKeyNq], Ng: lower[factorKeyNg] };
    }

    const calc = (key) => lower[key] + ( (phi - lower.phi) * (upper[key] - lower[key]) ) / (upper.phi - lower.phi);
    
    return {
        Nc: calc(factorKeyNc),
        Nq: calc(factorKeyNq),
        Ng: calc(factorKeyNg)
    };
}

// Fungsi untuk menampilkan/menyembunyikan modal bantuan
function toggleHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
    }
}

// Fungsi untuk menutup modal jika area luar diklik
function closeHelpModalOutside(event) {
    const modal = document.getElementById('helpModal');
    if (event.target === modal) { 
        modal.style.display = 'none';
    }
}

// ============================================================================
// MAIN CALCULATION FUNCTION
// ============================================================================

function hitungDayaDukung() {
    clearMessages();

    // 1. Ambil Input User
    const tipePondasi = document.getElementById('tipePondasi').value;
    const tipeKeruntuhan = document.getElementById('tipeKeruntuhan').value;
    
    const c_raw = getElementValue('kohesi');
    const unit_c = getSelectedUnit('unit_kohesi');
    
    const phi_input = getElementValue('sudutGeser');
    
    const gamma_raw = getElementValue('gammaTanah');
    const unit_gamma = getSelectedUnit('unit_gammaTanah');
    
    const B_m_input = getElementValue('lebarPondasi');
    const Df_m_input = getElementValue('kedalamanPondasi');
    const SF_input = getElementValue('faktorKeamanan');
    
    const Dw_m_input = getElementValue('kedalamanMAT');
    
    const gamma_sat_raw = getElementValue('gammaSat');
    const unit_gammaSat = getSelectedUnit('unit_gammaSat');
    
    const gamma_w_raw = getElementValue('gammaAir');
    const unit_gammaAir = getSelectedUnit('unit_gammaAir');

    // 2. Validasi Input (Cek Null/NaN pada raw values)
    if (c_raw === null || isNaN(c_raw)) { displayMessage("Error: Kohesi (c) harus berupa angka.", 'error'); return; }
    if (phi_input === null || isNaN(phi_input)) { displayMessage("Error: Sudut Geser (φ) harus berupa angka.", 'error'); return; }
    if (gamma_raw === null || isNaN(gamma_raw)) { displayMessage("Error: Berat Volume Tanah (γ) harus berupa angka.", 'error'); return; }
    if (B_m_input === null || isNaN(B_m_input)) { displayMessage("Error: Lebar Pondasi (B) harus berupa angka.", 'error'); return; }
    if (Df_m_input === null || isNaN(Df_m_input)) { displayMessage("Error: Kedalaman Pondasi (Df) harus berupa angka.", 'error'); return; }
    if (SF_input === null || isNaN(SF_input)) { displayMessage("Error: Faktor Keamanan (SF) harus berupa angka.", 'error'); return; }
    
    // Validasi Range
    if (phi_input < 0 || phi_input > 50) { displayMessage("Error: Sudut geser (φ) harus antara 0 dan 50 derajat.", 'error'); return; }
    if (SF_input <= 0) { displayMessage("Error: Faktor Keamanan (SF) harus lebih besar dari 0.", 'error'); return; }
    if (B_m_input <= 0 || Df_m_input < 0 ) { displayMessage("Error: Lebar Pondasi (B) harus positif dan Kedalaman (Df) tidak boleh negatif.", 'error'); return; }
    
    // Validasi MAT (jika diisi)
    const isMAT = Dw_m_input !== null && !isNaN(Dw_m_input);
    if (isMAT && Dw_m_input < 0) { displayMessage("Error: Kedalaman MAT (Dw) tidak boleh negatif.", 'error'); return; }

    if (isMAT) {
        if (gamma_sat_raw === null || isNaN(gamma_sat_raw) || gamma_w_raw === null || isNaN(gamma_w_raw)) {
            displayMessage("Error: Jika MAT diperhitungkan, γsat dan γw harus diisi.", 'error'); return;
        }
    }

    // 3. Konversi ke UNIT BASIS (kg/cm², kg/cm³, cm)
    // Semua perhitungan dilakukan dalam kg dan cm untuk konsistensi rumus
    const c = toBaseUnit(c_raw, 'stress', unit_c);
    const gamma = toBaseUnit(gamma_raw, 'density', unit_gamma);
    const gamma_sat = isMAT ? toBaseUnit(gamma_sat_raw, 'density', unit_gammaSat) : 0;
    const gamma_w = isMAT ? toBaseUnit(gamma_w_raw, 'density', unit_gammaAir) : 0;
    
    const B_cm = B_m_input * 100; // m to cm
    const Df_cm = Df_m_input * 100; // m to cm
    const Dw_cm = isMAT ? Dw_m_input * 100 : null; // m to cm
    const phi = phi_input;
    const SF = SF_input;

    // Validasi Logika Fisik (setelah konversi)
    if (gamma <= 0) { displayMessage("Error: Berat Volume Tanah (γ) harus positif.", 'error'); return; }
    if (isMAT) {
        if (gamma_sat <= 0 || gamma_w <= 0) { displayMessage("Error: Nilai γsat dan γw harus positif.", 'error'); return; }
        if (gamma_sat < gamma_w) { displayMessage("Error: Gamma jenuh (γsat) tidak logis (lebih kecil dari γ air).", 'error'); return; }
    }

    // 4. Hitung Gamma Efektif / Prima
    const gamma_prima = isMAT ? (gamma_sat - gamma_w) : 0;
    
    // Determine output unit based on Cohesion input unit (primary stress unit)
    const outputStressUnit = unit_c; 
    const outputDensityUnit = unit_gamma; 
    const outputStressLabel = UNIT_LABELS['stress'][outputStressUnit];
    const outputDensityLabel = UNIT_LABELS['density'][outputDensityUnit];

    // Display Gamma Prima (converted back to user unit)
    const gp_display = fromBaseUnit(gamma_prima, 'density', outputDensityUnit);
    document.getElementById('hasilGammaPrima').textContent = isMAT ? gp_display.toFixed(4) : '-';
    // FIXED: Use parentElement to access correct sibling for unit text
    document.getElementById('hasilGammaPrima').parentElement.nextElementSibling.textContent = outputDensityLabel;


    // 5. Hitung Faktor Daya Dukung
    let factors;
    let c_eff = c;
    let Nc_symbol = "N<sub>c</sub>";
    let Nq_symbol = "N<sub>q</sub>";
    let Ng_symbol = "N<sub>γ</sub>";
    let c_symbol = "c";

    document.getElementById('cPrimaRow').style.display = 'none';

    if (tipeKeruntuhan === 'umum') {
        factors = interpolate(phi, generalShearFactors, 'Nc', 'Nq', 'Ng');
    } else { // lokal
        factors = interpolate(phi, localShearFactors, 'NcP', 'NqP', 'NgP');
        c_eff = (2/3) * c;
        Nc_symbol = "N'<sub>c</sub>";
        Nq_symbol = "N'<sub>q</sub>";
        Ng_symbol = "N'<sub>γ</sub>";
        c_symbol = "c'";
        
        // Display c' converted
        const c_eff_display = fromBaseUnit(c_eff, 'stress', outputStressUnit);
        document.getElementById('hasilCprime').textContent = c_eff_display.toFixed(3);
        // FIXED: Use parentElement
        document.getElementById('hasilCprime').parentElement.nextElementSibling.textContent = outputStressLabel;
        document.getElementById('cPrimaRow').style.display = 'flex';
    }

    if (factors.Nc === null) {
        displayMessage("Error: Interpolasi gagal (NaN). Periksa sudut geser.", 'error');
        return;
    }
    const { Nc, Nq, Ng } = factors;

    // 6. Hitung Overburden (q) & Gamma Efektif (gamma_eff)
    let q_adjusted_for_MAT; 
    let gamma_effective_for_MAT; 

    if (!isMAT) {
        // No Water Table
        q_adjusted_for_MAT = gamma * Df_cm;
        gamma_effective_for_MAT = gamma;
    } else {
        // With Water Table Logic
        if (Dw_cm < Df_cm) { 
            // Case 1: MAT di atas dasar pondasi
            q_adjusted_for_MAT = (gamma * Dw_cm) + (gamma_prima * (Df_cm - Dw_cm));
            gamma_effective_for_MAT = gamma_prima;
        } else if (Dw_cm === Df_cm) { 
            // Case 2: MAT pas di dasar
            q_adjusted_for_MAT = gamma * Df_cm;
            gamma_effective_for_MAT = gamma_prima;
        } else { 
            // Case 3: MAT di bawah dasar
            q_adjusted_for_MAT = gamma * Df_cm;
            const d_cm = Dw_cm - Df_cm; 
            if (d_cm >= B_cm) { 
                gamma_effective_for_MAT = gamma;
            } else { 
                gamma_effective_for_MAT = gamma_prima + (d_cm / B_cm) * (gamma - gamma_prima);
            }
        }
    }
    
    // Display intermediate results (converted)
    const q_adj_display = fromBaseUnit(q_adjusted_for_MAT, 'stress', outputStressUnit);
    const g_eff_display = fromBaseUnit(gamma_effective_for_MAT, 'density', outputDensityUnit);
    
    document.getElementById('hasilQadj').textContent = q_adj_display.toFixed(3);
    // FIXED: Use parentElement
    document.getElementById('hasilQadj').parentElement.nextElementSibling.textContent = outputStressLabel;
    
    document.getElementById('hasilGammaEff').textContent = g_eff_display.toFixed(4);
    // FIXED: Use parentElement
    document.getElementById('hasilGammaEff').parentElement.nextElementSibling.textContent = outputDensityLabel;


    // 7. Hitung Daya Dukung Ultimit (q_ult)
    let q_ult;
    let formulaString = "";
    let sc_val = 1, sq_val = 1, sg_val = 1;

    // Rumus Umum Terzaghi (Base Unit: kg/cm²)
    if (tipePondasi === 'lajur') {
            q_ult = (c_eff * Nc) + (q_adjusted_for_MAT * Nq) + (0.5 * gamma_effective_for_MAT * B_cm * Ng);
            formulaString = `q<sub>ult</sub> = (${c_symbol} × ${Nc_symbol}) + (q<sub>adj</sub> × ${Nq_symbol}) + (0.5 × γ<sub>eff</sub> × B × ${Ng_symbol})`;
    } else if (tipePondasi === 'bujursangkar') {
        if (tipeKeruntuhan === 'umum') {
            sc_val = 1.3; sg_val = 0.8; 
            q_ult = (c_eff * Nc * sc_val) + (q_adjusted_for_MAT * Nq * sq_val) + (0.5 * gamma_effective_for_MAT * B_cm * Ng * sg_val);
            formulaString = `q<sub>ult</sub> = (1,3 × ${c_symbol} × ${Nc_symbol}) + (q<sub>adj</sub> × ${Nq_symbol}) + (0,4 × γ<sub>eff</sub> × B × ${Ng_symbol})`;
        } else { 
            q_ult = (0.867 * c_eff * Nc) + (q_adjusted_for_MAT * Nq) + (0.4 * gamma_effective_for_MAT * B_cm * Ng);
            formulaString = `q<sub>ult</sub> = (0,867 × ${c_symbol} × ${Nc_symbol}) + (q<sub>adj</sub> × ${Nq_symbol}) + (0,4 × γ<sub>eff</sub> × B × ${Ng_symbol})`;
        }
    } else { // lingkaran
            if (tipeKeruntuhan === 'umum') {
            sc_val = 1.3; sg_val = 0.6;
            q_ult = (c_eff * Nc * sc_val) + (q_adjusted_for_MAT * Nq * sq_val) + (0.5 * gamma_effective_for_MAT * B_cm * Ng * sg_val);
            formulaString = `q<sub>ult</sub> = (1,3 × ${c_symbol} × ${Nc_symbol}) + (q<sub>adj</sub> × ${Nq_symbol}) + (0,3 × γ<sub>eff</sub> × B × ${Ng_symbol})`;
        } else { 
            q_ult = (0.867 * c_eff * Nc) + (q_adjusted_for_MAT * Nq) + (0.3 * gamma_effective_for_MAT * B_cm * Ng);
            formulaString = `q<sub>ult</sub> = (0,867 × ${c_symbol} × ${Nc_symbol}) + (q<sub>adj</sub> × ${Nq_symbol}) + (0,3 × γ<sub>eff</sub> × B × ${Ng_symbol})`;
        }
    }

    const q_all = q_ult / SF;

    // 8. Tampilkan Output Akhir (Konversi balik ke unit pilihan)
    const q_ult_display = fromBaseUnit(q_ult, 'stress', outputStressUnit);
    const q_all_display = fromBaseUnit(q_all, 'stress', outputStressUnit);

    document.getElementById('hasilNc').textContent = Nc.toFixed(2);
    document.getElementById('hasilNq').textContent = Nq.toFixed(2);
    document.getElementById('hasilNgamma').textContent = Ng.toFixed(3);
    
    document.getElementById('hasilQult').textContent = q_ult_display.toFixed(3);
    // FIXED: Use parentElement
    document.getElementById('hasilQult').parentElement.nextElementSibling.textContent = outputStressLabel;
    
    document.getElementById('hasilQall').textContent = q_all_display.toFixed(3);
    // FIXED: Use parentElement
    document.getElementById('hasilQall').parentElement.nextElementSibling.textContent = outputStressLabel;

    // Tampilkan Formula
    document.getElementById('formulaText').innerHTML = formulaString;
    document.getElementById('formulaDisplayContainer').style.display = 'block';
}
