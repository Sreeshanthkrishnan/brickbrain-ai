import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../reports/logs');
const logFile = path.join(logDir, 'execution.log');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export function logInfo(message) {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [INFO] ${message}`;
  console.log(formatted);
  fs.appendFileSync(logFile, formatted + '\n');
}

export function logError(message, err = null) {
  const timestamp = new Date().toISOString();
  let formatted = `[${timestamp}] [ERROR] ${message}`;
  if (err) {
    formatted += ` - Error: ${err.message || err}\nStack: ${err.stack || ''}`;
  }
  console.error(formatted);
  fs.appendFileSync(logFile, formatted + '\n');
}

export function clearLog() {
  if (fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
  }
}
