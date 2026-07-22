# Troubleshooting Guide - Android Automation

## Common Issues & Resolutions

### 1. Appium Session Connection Refused
**Symptom**: `ECONNREFUSED 127.0.0.1:4723`
**Fix**: Ensure Appium server is started prior to test runner execution:
```bash
appium --log appium.log &
```

### 2. Node.js ES Module Mismatch (`ERR_REQUIRE_ESM`)
**Symptom**: `require() of ES Module ... not supported`
**Fix**: Ensure setup-node action uses Node 22 (`node-version: 22`).

### 3. Emulator Boot Slowdown on CI
**Symptom**: AVD emulator takes >6 minutes to boot on non-nested VM runners.
**Fix**: Use optimized emulator flags in workflow:
```yaml
emulator-options: -no-window -gpu swiftshader_indirect -no-audio -no-boot-check
disable-animations: true
```
