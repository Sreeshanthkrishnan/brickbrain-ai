import fs from 'fs';
import path from 'path';
import config from '../config/appium.config.js';

class Logger {
  constructor() {
    this.logDir = config.directories.logs;
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    this.logFilePath = path.join(this.logDir, 'execution.log');
    this.deviceLogPath = path.join(this.logDir, 'device-logcat.log');
  }

  log(level, message, context = '') {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}\n`;
    console.log(logLine.trim());
    try {
      fs.appendFileSync(this.logFilePath, logLine);
    } catch (e) {
      // Ignore sync file write error
    }
  }

  info(msg, ctx) { this.log('INFO', msg, ctx); }
  warn(msg, ctx) { this.log('WARN', msg, ctx); }
  error(msg, ctx) { this.log('ERROR', msg, ctx); }
  debug(msg, ctx) { this.log('DEBUG', msg, ctx); }

  logDevice(msg) {
    const timestamp = new Date().toISOString();
    try {
      fs.appendFileSync(this.deviceLogPath, `[${timestamp}] ${msg}\n`);
    } catch (e) {}
  }
}

export default new Logger();
