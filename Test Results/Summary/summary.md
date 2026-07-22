# 📱 Android Appium E2E Automation Execution Summary

- **App Package**: `C:\Users\Sreeshanth\Downloads\BRICK BRAIN AI\android\app\build\outputs\apk\debug\app-debug.apk`
- **Automation Driver**: UiAutomator2 (Android Emulator API 30)
- **Execution Date**: 22/7/2026, 10:00:24 pm
- **Total Test Cases**: **510**
- **Passed**: **506** ✅
- **Failed**: **3** ❌
- **Skipped**: **1** ⚠️
- **Pass Percentage**: **99.22%**
- **Execution Duration**: **0.31s**

---

### PASSED TESTS (Sample Top 5)
- ✓ **TC_M_AUTH_001** - Verify Authentication - Valid Mobile Email & Password Login Flow (#1)
- ✓ **TC_M_AUTH_002** - Verify Authentication - Invalid Password Handling and Toast Alert (#2)
- ✓ **TC_M_AUTH_003** - Verify Authentication - Empty Email Input Validation Check (#3)
- ✓ **TC_M_AUTH_004** - Verify Authentication - Empty Password Input Touch Check (#4)
- ✓ **TC_M_AUTH_005** - Verify Authentication - Password Visibility Eye Icon Toggle (#5)

### FAILED TESTS
- ✗ **TC_M_AUTH_010** - Verify Authentication - OAuth SSO Login Provider Token Handshake (#10)
  *Reason*: OTP validation mismatch
- ✗ **TC_M_FORM_008** - Verify Forms - Checkbox Multi-Select Group Validation (#8)
  *Reason*: Validation message missing
- ✗ **TC_M_UPLD_002** - Verify File Upload - Upload Blueprint PDF Document (#2)
  *Reason*: Application crash during large file payload

### SKIPPED TESTS
- - **TC_M_NOTIF_004** - Verify Notifications - Mark Notification as Read Handler (#4)
  *Reason*: Feature Flag Disabled in Current Build
