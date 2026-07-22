import fs from 'fs';
import path from 'path';
import config from '../config/appium.config.js';
import logger from '../logs/logger.js';

export class HistoryManager {
  constructor() {
    this.reportsRootDir = config.directories.reports;
    this.latestDir = path.join(this.reportsRootDir, 'latest');
    this.historyDir = path.join(this.reportsRootDir, 'history');
  }

  archiveAndSyncBuild(buildNumber, metrics, testCases) {
    const formattedBuild = `build-${String(buildNumber).padStart(3, '0')}`;
    const targetBuildDir = path.join(this.historyDir, formattedBuild);

    [this.reportsRootDir, this.latestDir, this.historyDir, targetBuildDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    const htmlDir = config.directories.html;
    const summaryDir = config.directories.summary;
    const screenshotsDir = config.directories.screenshots;
    const logsDir = config.directories.logs;

    // Copy HTML reports to latest and build history
    ['execution-report.html', 'dashboard.html', 'trends.html'].forEach(file => {
      const src = path.join(htmlDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(this.latestDir, file));
        fs.copyFileSync(src, path.join(targetBuildDir, file));
      }
    });

    // Copy Summary Markdown
    const sumSrc = path.join(summaryDir, 'summary.md');
    if (fs.existsSync(sumSrc)) {
      fs.copyFileSync(sumSrc, path.join(this.latestDir, 'summary.md'));
      fs.copyFileSync(sumSrc, path.join(targetBuildDir, 'summary.md'));
    }

    // Write build metadata
    const meta = {
      buildNumber: formattedBuild,
      executionDate: new Date().toISOString(),
      metrics
    };
    fs.writeFileSync(path.join(targetBuildDir, 'build-info.json'), JSON.stringify(meta, null, 2));

    logger.info(`Archived build history to: ${targetBuildDir}`, 'HistoryManager');
    logger.info(`Updated latest report directory: ${this.latestDir}`, 'HistoryManager');
  }
}

export default new HistoryManager();
