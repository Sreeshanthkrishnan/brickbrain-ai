import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  server: {
    host: process.env.APPIUM_HOST || '127.0.0.1',
    port: parseInt(process.env.APPIUM_PORT || '4723', 10),
    baseUrl: process.env.APPIUM_SERVER || 'http://127.0.0.1:4723'
  },
  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'emulator-5554',
    'appium:app': process.env.APK_PATH || path.resolve(__dirname, '../../android/app/build/outputs/apk/debug/app-debug.apk'),
    'appium:appPackage': 'com.brickbrain.ai',
    'appium:appActivity': '.MainActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 300,
    'appium:autoGrantPermissions': true,
    'appium:uiautomator2ServerInstallTimeout': 60000
  },
  testSettings: {
    timeout: 30000,
    retryCount: 2,
    passRateThreshold: 95.0,
    maxCriticalFailures: 0.05
  },
  directories: {
    results: path.resolve(__dirname, '../../Test Results'),
    excel: path.resolve(__dirname, '../../Test Results/Excel'),
    html: path.resolve(__dirname, '../../Test Results/HTML'),
    json: path.resolve(__dirname, '../../Test Results/JSON'),
    screenshots: path.resolve(__dirname, '../../Test Results/Screenshots'),
    logs: path.resolve(__dirname, '../../Test Results/Logs'),
    summary: path.resolve(__dirname, '../../Test Results/Summary'),
    reports: path.resolve(__dirname, '../../reports')
  }
};

export default config;
