# Local Execution Guide - Android Appium E2E Automation

## Prerequisites
1. **Node.js**: v20 or v22
2. **Java JDK**: OpenJDK 21
3. **Android SDK & Emulator**: Installed via Android Studio with API 30 image
4. **Appium Server**:
   ```bash
   npm install -g appium
   appium driver install uiautomator2
   ```

## Running the Suite Locally
1. Start Appium Server:
   ```bash
   appium --log appium.log
   ```
2. Build Android APK:
   ```bash
   npm run build
   npx cap sync android
   cd android && ./gradlew assembleDebug
   ```
3. Execute Master Automation Suite:
   ```bash
   node automation/runners/run_suite.js
   ```

## Generated Local Reports
- Excel Reports: `Test Results/Excel/Automation_Test_Report.xlsx`
- HTML Reports: `Test Results/HTML/execution-report.html`
- JSON Results: `Test Results/JSON/execution-results.json`
- Logs & Screenshots: `Test Results/Logs/` & `Test Results/Screenshots/`
