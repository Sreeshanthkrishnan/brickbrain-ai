import logger from '../logs/logger.js';
import screenshotUtil from '../screenshots/screenshotUtil.js';

export class TestListener {
  onTestStart(testCase) {
    logger.info(`STARTING: [${testCase.id}] - ${testCase.testName}`, 'TestListener');
  }

  onTestSuccess(testCase) {
    logger.info(`PASSED: [${testCase.id}] (${testCase.executionTime})`, 'TestListener');
  }

  onTestFailure(testCase, error) {
    logger.error(`FAILED: [${testCase.id}] Reason: ${testCase.failureReason}`, 'TestListener');
    screenshotUtil.capture(testCase.id, 'FAILURE');
  }

  onTestSkipped(testCase) {
    logger.warn(`SKIPPED: [${testCase.id}] Reason: ${testCase.failureReason}`, 'TestListener');
  }
}

export default new TestListener();
