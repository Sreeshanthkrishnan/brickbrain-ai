import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  // Configurable base URL
  baseUrl: process.env.BASE_URL || 'http://localhost:3001',
  
  // Timeout for waiting elements
  timeout: parseInt(process.env.TEST_TIMEOUT || '10000', 10),
  
  // Headless mode toggle
  headless: process.env.HEADLESS !== 'false',
  
  // Directory to store failed test screenshots
  screenshotDir: path.join(__dirname, 'reports', 'screenshots'),
  
  // Report output paths
  htmlReportPath: path.join(__dirname, 'reports', 'selenium-report.html'),
  excelReportPath: path.join(__dirname, 'reports', 'selenium-report.xlsx')
};
