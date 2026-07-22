import config from '../config/appium.config.js';
import logger from '../logs/logger.js';

export class RetryAnalyzer {
  constructor() {
    this.maxRetryCount = config.testSettings.retryCount || 2;
    this.retryMap = new Map();
  }

  shouldRetry(testId) {
    const currentCount = this.retryMap.get(testId) || 0;
    if (currentCount < this.maxRetryCount) {
      this.retryMap.set(testId, currentCount + 1);
      logger.warn(`Retrying test [${testId}] (Attempt ${currentCount + 1}/${this.maxRetryCount})`, 'RetryAnalyzer');
      return true;
    }
    return false;
  }
}

export default new RetryAnalyzer();
