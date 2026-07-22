import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import config from '../config/appium.config.js';
import logger from '../logs/logger.js';

export class ExcelReporter {
  constructor() {
    this.excelDir = config.directories.excel;
    if (!fs.existsSync(this.excelDir)) {
      fs.mkdirSync(this.excelDir, { recursive: true });
    }
  }

  generateReports(testCases, metrics) {
    logger.info('Generating enterprise multi-sheet Excel reports...', 'ExcelReporter');

    const workbook = xlsx.utils.book_new();

    // Sheet 1: Executed Test Cases (All 440 Rows)
    const executedRows = testCases.map(t => ({
      'Test ID': t.id,
      'Module': t.module,
      'Test Name': t.testName,
      'Priority': t.priority,
      'Status': t.status,
      'Execution Time': t.executionTime,
      'Preconditions': t.preconditions,
      'Test Steps': t.testSteps,
      'Test Data': t.testData,
      'Expected Result': t.expectedResult,
      'Actual Result': t.actualResult,
      'Failure Reason': t.failureReason
    }));
    const wsExecuted = xlsx.utils.json_to_sheet(executedRows);
    wsExecuted['!cols'] = [{ wch: 18 }, { wch: 25 }, { wch: 45 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];
    xlsx.utils.book_append_sheet(workbook, wsExecuted, 'Executed Test Cases');

    // Sheet 2: Passed Tests
    const passedRows = testCases.filter(t => t.status === 'PASSED').map(t => ({
      'Test ID': t.id,
      'Module': t.module,
      'Test Name': t.testName,
      'Priority': t.priority,
      'Execution Time': t.executionTime
    }));
    const wsPassed = xlsx.utils.json_to_sheet(passedRows);
    xlsx.utils.book_append_sheet(workbook, wsPassed, 'Passed Tests');

    // Sheet 3: Failed Tests
    const failedRows = testCases.filter(t => t.status === 'FAILED').map(t => ({
      'Test ID': t.id,
      'Module': t.module,
      'Test Name': t.testName,
      'Priority': t.priority,
      'Failure Reason': t.failureReason,
      'Actual Result': t.actualResult
    }));
    const wsFailed = xlsx.utils.json_to_sheet(failedRows.length ? failedRows : [{ 'Info': 'No failures recorded' }]);
    xlsx.utils.book_append_sheet(workbook, wsFailed, 'Failed Tests');

    // Sheet 4: Skipped Tests
    const skippedRows = testCases.filter(t => t.status === 'SKIPPED').map(t => ({
      'Test ID': t.id,
      'Module': t.module,
      'Test Name': t.testName,
      'Reason': t.failureReason
    }));
    const wsSkipped = xlsx.utils.json_to_sheet(skippedRows.length ? skippedRows : [{ 'Info': 'No skipped tests' }]);
    xlsx.utils.book_append_sheet(workbook, wsSkipped, 'Skipped Tests');

    // Sheet 5: Execution Metrics
    const metricsRows = [
      { 'Metric Category': 'Project Name', 'Value': 'BRICK BRAIN AI - Android App' },
      { 'Metric Category': 'Total Test Cases', 'Value': metrics.total },
      { 'Metric Category': 'Executed', 'Value': metrics.executed },
      { 'Metric Category': 'Passed', 'Value': metrics.passed },
      { 'Metric Category': 'Failed', 'Value': metrics.failed },
      { 'Metric Category': 'Skipped', 'Value': metrics.skipped },
      { 'Metric Category': 'Blocked', 'Value': metrics.blocked },
      { 'Metric Category': 'Pass Rate (%)', 'Value': `${metrics.passRate}%` },
      { 'Metric Category': 'Execution Duration', 'Value': `${metrics.duration}s` },
      { 'Metric Category': 'Target Device', 'Value': config.capabilities['appium:deviceName'] },
      { 'Metric Category': 'Android OS Version', 'Value': 'Android 11.0 (API 30)' }
    ];
    const wsMetrics = xlsx.utils.json_to_sheet(metricsRows);
    wsMetrics['!cols'] = [{ wch: 30 }, { wch: 45 }];
    xlsx.utils.book_append_sheet(workbook, wsMetrics, 'Execution Metrics');

    // Sheet 6: Defect Summary
    const defectRows = testCases.filter(t => t.status === 'FAILED').map(t => ({
      'Defect ID': `DEF_${t.id}`,
      'Associated Test': t.id,
      'Module': t.module,
      'Severity': t.priority,
      'Summary': t.failureReason
    }));
    const wsDefects = xlsx.utils.json_to_sheet(defectRows.length ? defectRows : [{ 'Defect ID': 'N/A', 'Summary': 'Zero Defects Encountered' }]);
    xlsx.utils.book_append_sheet(workbook, wsDefects, 'Defect Summary');

    // Sheet 7: Pass Rate Summary
    const passRateSummary = [
      { 'Module': 'Overall Enterprise Suite', 'Total': metrics.total, 'Passed': metrics.passed, 'Failed': metrics.failed, 'Pass Rate': `${metrics.passRate}%` }
    ];
    const wsPassRate = xlsx.utils.json_to_sheet(passRateSummary);
    xlsx.utils.book_append_sheet(workbook, wsPassRate, 'Pass Rate Summary');

    // Write primary workbook
    const mainPath = path.join(this.excelDir, 'Automation_Test_Report.xlsx');
    xlsx.writeFile(workbook, mainPath);

    // Write individual standalone Excel reports
    const wbPassed = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wbPassed, wsPassed, 'Passed Tests');
    xlsx.writeFile(wbPassed, path.join(this.excelDir, 'Passed_Test_Cases.xlsx'));

    const wbFailed = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wbFailed, wsFailed, 'Failed Tests');
    xlsx.writeFile(wbFailed, path.join(this.excelDir, 'Failed_Test_Cases.xlsx'));

    const wbSummary = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wbSummary, wsMetrics, 'Summary');
    xlsx.writeFile(wbSummary, path.join(this.excelDir, 'Execution_Summary.xlsx'));

    logger.info(`Excel reports generated at: ${mainPath}`, 'ExcelReporter');
  }
}

export default new ExcelReporter();
