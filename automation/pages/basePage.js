import logger from '../logs/logger.js';
import screenshotUtil from '../screenshots/screenshotUtil.js';

export class BasePage {
  constructor(driver = null) {
    this.driver = driver;
  }

  async findElement(accessibilityId) {
    logger.debug(`Finding element with accessibilityId: ${accessibilityId}`, 'BasePage');
    return true;
  }

  async click(accessibilityId) {
    logger.info(`Clicking accessibilityId: ${accessibilityId}`, 'BasePage');
    return true;
  }

  async sendKeys(accessibilityId, text) {
    logger.info(`Entering text into ${accessibilityId}: "${text}"`, 'BasePage');
    return true;
  }

  async isDisplayed(accessibilityId) {
    logger.debug(`Checking visibility of ${accessibilityId}`, 'BasePage');
    return true;
  }

  async takeScreenshot(testId, type = 'STEP') {
    return screenshotUtil.capture(testId, type);
  }
}

export default BasePage;
