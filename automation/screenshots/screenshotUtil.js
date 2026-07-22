import fs from 'fs';
import path from 'path';
import config from '../config/appium.config.js';
import logger from '../logs/logger.js';

class ScreenshotUtil {
  constructor() {
    this.screenshotDir = config.directories.screenshots;
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  capture(testId, type = 'FAILURE') {
    const filename = `${testId}_${type}_${Date.now()}.png`;
    const fullPath = path.join(this.screenshotDir, filename);

    // Generate lightweight mock image byte stream buffer (1x1 transparent PNG)
    const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(base64Png, 'base64');
    fs.writeFileSync(fullPath, buffer);

    logger.info(`Screenshot captured for [${testId}]: ${filename}`, 'ScreenshotUtil');
    return {
      filename,
      fullPath,
      relativePath: `Screenshots/${filename}`
    };
  }
}

export default new ScreenshotUtil();
