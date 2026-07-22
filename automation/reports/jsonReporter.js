import fs from 'fs';
import path from 'path';
import config from '../config/appium.config.js';
import logger from '../logs/logger.js';

export class JsonReporter {
  constructor() {
    this.jsonDir = config.directories.json;
    this.summaryDir = config.directories.summary;
    [this.jsonDir, this.summaryDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  generateReports(testCases, metrics) {
    logger.info('Generating JSON & Markdown Summary reports...', 'JsonReporter');

    const jsonContent = {
      timestamp: new Date().toISOString(),
      project: 'BRICK BRAIN AI - Android App',
      device: config.capabilities['appium:deviceName'],
      metrics,
      testCases
    };

    fs.writeFileSync(path.join(this.jsonDir, 'execution-results.json'), JSON.stringify(jsonContent, null, 2));

    const passedList = testCases.filter(t => t.status === 'PASSED');
    const failedList = testCases.filter(t => t.status === 'FAILED');
    const skippedList = testCases.filter(t => t.status === 'SKIPPED');

    const mdSummary = `# 📱 Android Appium E2E Automation Execution Summary

- **App Package**: \`${config.capabilities['appium:app']}\`
- **Automation Driver**: UiAutomator2 (Android Emulator API 30)
- **Execution Date**: ${new Date().toLocaleString()}
- **Total Test Cases**: **${metrics.total}**
- **Passed**: **${metrics.passed}** ✅
- **Failed**: **${metrics.failed}** ❌
- **Skipped**: **${metrics.skipped}** ⚠️
- **Pass Percentage**: **${metrics.passRate}%**
- **Execution Duration**: **${metrics.duration}s**

---

### PASSED TESTS (Sample Top 5)
${passedList.slice(0, 5).map(t => `- ✓ **${t.id}** - ${t.testName}`).join('\n')}

### FAILED TESTS
${failedList.length ? failedList.map(t => `- ✗ **${t.id}** - ${t.testName}\n  *Reason*: ${t.failureReason}`).join('\n') : '- *None* 🎉'}

### SKIPPED TESTS
${skippedList.length ? skippedList.map(t => `- - **${t.id}** - ${t.testName}\n  *Reason*: ${t.failureReason}`).join('\n') : '- *None*'}
`;

    fs.writeFileSync(path.join(this.summaryDir, 'summary.md'), mdSummary);
    logger.info('JSON & Markdown reports generated successfully.', 'JsonReporter');
  }
}

export default new JsonReporter();
