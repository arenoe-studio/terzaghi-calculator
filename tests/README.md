# Tests

Testing materials untuk Terzaghi Calculator.

## Files

- **manual-test-checklist.md** - Comprehensive testing checklist untuk manual QA
- **test-data.json** - Sample calculation data untuk validation

## Testing Strategy

### Phase 1: Unit Testing (Manual)

Karena ini vanilla JavaScript, kita menggunakan manual testing dengan checklist terstruktur.

### Phase 2: Integration Testing

Test interaksi frontend-backend:

- Login flow
- Save calculation
- Load history
- Error scenarios

### Phase 3: Browser Compatibility

Test di multiple browsers:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Phase 4: Mobile Testing

Test di mobile devices:

- Android Chrome
- iOS Safari
- Responsive design validation

## Running Tests

### 1. Setup Test Environment

```bash
# Buka index.html di browser
open index.html

# Atau gunakan local server
python -m http.server 8000
# Buka http://localhost:8000
```

### 2. Execute Manual Tests

Ikuti checklist di `manual-test-checklist.md`:

- [ ] Calculation accuracy
- [ ] Save feature toggle
- [ ] Login/logout flow
- [ ] History CRUD operations
- [ ] Error handling
- [ ] Security verification

### 3. Use Test Data

Import sample data dari `test-data.json` untuk konsistensi.

## Test Data Format

```json
{
  "testCase1": {
    "description": "Standard bearing capacity - Square foundation",
    "inputs": {
      "foundationType": "bujursangkar",
      "failureType": "umum",
      "c": 0.1,
      "phi": 25
      // ... more parameters
    },
    "expectedOutputs": {
      "qult": 15.234,
      "qall": 5.078
    }
  }
}
```

## Reporting Issues

Jika menemukan bug saat testing:

1. Dokumentasikan steps to reproduce
2. Include browser/OS info
3. Screenshot jika UI issue
4. Expected vs actual behavior
5. Buat GitHub issue

## Future: Automated Testing

Untuk v3.0, consider:

- Jest untuk unit tests
- Selenium/Playwright untuk E2E tests
- GitHub Actions untuk CI/CD
