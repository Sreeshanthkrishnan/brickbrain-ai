# CI/CD Execution Guide - GitHub Actions & Pages

## Pipeline Triggers
The `.github/workflows/android-e2e.yml` workflow triggers on:
- `push` to `main` or `master`
- `pull_request` to `main` or `master`
- `workflow_dispatch` (Manual execution via GitHub UI)
- `schedule` (Daily nightly regression at 2 AM UTC)

## 21-Stage Execution Pipeline
1. Checkout Repository
2. Setup Java JDK 21
3. Setup Android SDK
4. Install Android Dependencies
5. Build Android Debug APK (`assembleDebug`)
6. Start Android AVD Emulator
7. Verify Emulator Readiness (`adb devices`)
8. Install Debug APK (`adb install`)
9. Start Appium Server (v2 UiAutomator2)
10. Verify Appium Health (`/status`)
11. Execute Appium 400+ E2E Test Suite (`run_suite.js`)
12. Capture Screenshots
13. Capture Device & Appium Logs
14. Generate Excel Reports (`Automation_Test_Report.xlsx`)
15. Generate HTML Reports (`execution-report.html`, `dashboard.html`, `trends.html`)
16. Generate JSON Report (`execution-results.json`)
17. Generate Markdown Summary (`summary.md`)
18. Upload Test Artifacts (30-day retention)
19. Publish Reports to GitHub Pages (`reports/latest/` & `reports/history/`)
20. Update Historical Reports
21. Publish GitHub Actions Summary (`$GITHUB_STEP_SUMMARY`)
