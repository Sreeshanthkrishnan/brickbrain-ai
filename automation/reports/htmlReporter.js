import fs from 'fs';
import path from 'path';
import config from '../config/appium.config.js';
import logger from '../logs/logger.js';

export class HtmlReporter {
  constructor() {
    this.htmlDir = config.directories.html;
    if (!fs.existsSync(this.htmlDir)) {
      fs.mkdirSync(this.htmlDir, { recursive: true });
    }
  }

  generateReports(testCases, metrics) {
    logger.info('Generating HTML reports (execution-report.html, dashboard.html, trends.html)...', 'HtmlReporter');

    const execReportHtml = this.buildExecutionReportHtml(testCases, metrics);
    const dashboardHtml = this.buildDashboardHtml(metrics);
    const trendsHtml = this.buildTrendsHtml(metrics);

    fs.writeFileSync(path.join(this.htmlDir, 'execution-report.html'), execReportHtml);
    fs.writeFileSync(path.join(this.htmlDir, 'dashboard.html'), dashboardHtml);
    fs.writeFileSync(path.join(this.htmlDir, 'trends.html'), trendsHtml);

    logger.info(`HTML reports generated in: ${this.htmlDir}`, 'HtmlReporter');
  }

  buildExecutionReportHtml(testCases, metrics) {
    const failedList = testCases.filter(t => t.status === 'FAILED');
    const passedList = testCases.filter(t => t.status === 'PASSED');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Android Appium E2E Automation Report</title>
  <style>
    :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --accent: #38bdf8; --pass: #22c55e; --fail: #ef4444; --warn: #eab308; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #334155; padding-bottom: 16px; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; color: var(--accent); }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .card { background: var(--card); border-radius: 8px; padding: 16px; border: 1px solid #334155; }
    .card-title { font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .card-val { font-size: 28px; font-weight: bold; margin-top: 8px; }
    .val-pass { color: var(--pass); } .val-fail { color: var(--fail); } .val-warn { color: var(--warn); }
    table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 8px; overflow: hidden; margin-top: 16px; }
    th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid #334155; font-size: 13px; }
    th { background: #334155; color: #f1f5f9; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
    .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; }
    .badge-pass { background: rgba(34, 197, 94, 0.2); color: var(--pass); }
    .badge-fail { background: rgba(239, 68, 68, 0.2); color: var(--fail); }
    .badge-skip { background: rgba(234, 179, 8, 0.2); color: var(--warn); }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>📱 Android Appium E2E Automation Report</h1>
      <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Target Device: Android Emulator (API 30) | Engine: UiAutomator2</p>
    </div>
    <div style="text-align: right; font-size: 12px; color: #94a3b8;">
      Execution Date: ${new Date().toLocaleString()}
    </div>
  </div>

  <div class="metrics-grid">
    <div class="card"><div class="card-title">Total Tests</div><div class="card-val">${metrics.total}</div></div>
    <div class="card"><div class="card-title">Passed</div><div class="card-val val-pass">${metrics.passed}</div></div>
    <div class="card"><div class="card-title">Failed</div><div class="card-val val-fail">${metrics.failed}</div></div>
    <div class="card"><div class="card-title">Skipped</div><div class="card-val val-warn">${metrics.skipped}</div></div>
    <div class="card"><div class="card-title">Pass Rate</div><div class="card-val val-pass">${metrics.passRate}%</div></div>
    <div class="card"><div class="card-title">Duration</div><div class="card-val">${metrics.duration}s</div></div>
  </div>

  <h2>Execution Details (Sample Executed Test Cases)</h2>
  <table>
    <thead>
      <tr>
        <th>Test Case ID</th>
        <th>Module</th>
        <th>Scenario / Test Name</th>
        <th>Priority</th>
        <th>Status</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      ${testCases.slice(0, 50).map(t => `
        <tr>
          <td><b>${t.id}</b></td>
          <td>${t.module}</td>
          <td>${t.testName}</td>
          <td>${t.priority}</td>
          <td><span class="badge ${t.status === 'PASSED' ? 'badge-pass' : t.status === 'FAILED' ? 'badge-fail' : 'badge-skip'}">${t.status}</span></td>
          <td>${t.executionTime}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;
  }

  buildDashboardHtml(metrics) {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Automation Dashboard</title>
  <style>body { background: #0f172a; color: #f8fafc; font-family: sans-serif; padding: 24px; }</style>
</head>
<body>
  <h1>📊 Automation Dashboard</h1>
  <p>Overall Pass Rate: <b>${metrics.passRate}%</b> (${metrics.passed}/${metrics.total} Passed)</p>
</body>
</html>`;
  }

  buildTrendsHtml(metrics) {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Execution Trends</title>
  <style>body { background: #0f172a; color: #f8fafc; font-family: sans-serif; padding: 24px; }</style>
</head>
<body>
  <h1>📈 Execution Trends</h1>
  <p>Latest Build Pass Rate: <b>${metrics.passRate}%</b></p>
</body>
</html>`;
  }
}

export default new HtmlReporter();
