import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import path from 'path';
import chromedriver from 'chromedriver';
import { fileURLToPath } from 'url';

import { config } from './config.js';
import { WelcomePage } from './pages/WelcomePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { SignupPage } from './pages/SignupPage.js';
import { DashboardPage, EstimatePage, MaterialsPage, PricingPage, TimelinePage, BudgetPage, LaborPage, ChatbotPage, DefectPage } from './pages/AppPages.js';

// Import reporting utilities
import { writeExcelReport } from './utils/excel_reporter.js';
import { writeHtmlReport } from './utils/html_reporter.js';
import { logInfo, logError, clearLog } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize reporting directories
fs.mkdirSync(path.join(__dirname, 'reports/screenshots'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'reports/logs'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'reports/html'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'reports/excel'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'reports/summary'), { recursive: true });

const testResults = [];
let driver = null;

async function takeScreenshot(testName) {
  if (!driver) return '';
  try {
    const screenshot = await driver.takeScreenshot();
    const filename = `${testName.replace(/[^a-zA-Z0-9]/g, '_')}_failed.png`;
    const filePath = path.join(__dirname, 'reports/screenshots', filename);
    fs.writeFileSync(filePath, screenshot, 'base64');
    return filePath;
  } catch (err) {
    logError(`Failed to capture screenshot for ${testName}`, err);
    return '';
  }
}

async function captureBrowserLogs() {
  if (!driver) return;
  try {
    const logs = await driver.manage().logs().get('browser');
    const browserLogFile = path.join(__dirname, 'reports/logs/browser.log');
    let logContent = '';
    for (const log of logs) {
      logContent += `[${new Date(log.timestamp).toISOString()}] [${log.level.name}] ${log.message}\n`;
    }
    fs.appendFileSync(browserLogFile, logContent);
  } catch (err) {
    // Suppress if logging not fully supported in this driver context
  }
}

async function acceptCookiesIfPresent() {
  try {
    const acceptBtn = By.xpath("//button[contains(., 'Accept All')]");
    const visible = await driver.wait(until.elementLocated(acceptBtn), 2500)
      .then(el => el.isDisplayed())
      .catch(() => false);
    if (visible) {
      const el = await driver.findElement(acceptBtn);
      await el.click();
      logInfo('Accepted cookie consent banner');
      await driver.sleep(500);
    }
  } catch (err) {
    // Suppress cookie errors
  }
}

async function runTest(module, name, testFn) {
  logInfo(`Starting E2E Test: [${module}] ${name}`);
  const startTime = Date.now();
  try {
    await testFn();
    const duration = Date.now() - startTime;
    logInfo(`✅ PASS: ${name} (${duration}ms)`);
    testResults.push({ name, module, status: 'Passed', duration, error: null, screenshot: null });
  } catch (err) {
    const duration = Date.now() - startTime;
    logError(`❌ FAIL: ${name} (${duration}ms)`, err);
    const screenshotPath = await takeScreenshot(name);
    testResults.push({ name, module, status: 'Failed', duration, error: err.message, screenshot: screenshotPath });
  }
  await captureBrowserLogs();
}

async function startBrowser() {
  logInfo('Initializing Chrome Webdriver with local chromedriver dependency...');
  const options = new chrome.Options();
  if (config.headless) {
    options.addArguments('--headless=new');
  }
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1280,1024');

  const service = new chrome.ServiceBuilder(chromedriver.path);

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service)
    .build();
  
  await driver.manage().setTimeouts({ implicit: 2000, pageLoad: 20000 });
}

function writeSummaryMarkdown(results) {
  const total = results.length;
  const passed = results.filter(r => r.status.toLowerCase() === 'passed').length;
  const failed = total - passed;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';
  const totalDuration = (results.reduce((sum, r) => sum + r.duration, 0) / 1000).toFixed(2);
  const failedList = results.filter(r => r.status.toLowerCase() === 'failed');

  let failedTestsMd = '';
  if (failedList.length > 0) {
    failedTestsMd = failedList.map(r => `- **${r.name}** (${r.module}): ${r.error}`).join('\n');
  } else {
    failedTestsMd = 'None';
  }

  const markdownContent = `# BrickBrain AI Selenium Test Summary

- **Application URL**: http://localhost:3001
- **Execution Date**: ${new Date().toLocaleString()}
- **Total Tests**: ${total}
- **Passed**: ${passed}
- **Failed**: ${failed}
- **Skipped**: 0
- **Pass Percentage**: ${passRate}%
- **Execution Time**: ${totalDuration}s

### Failed Tests
${failedTestsMd}

### Screenshots
All failure snapshots are saved in \`selenium_tests/reports/screenshots/\`.

### Report Location
- HTML: \`selenium_tests/reports/html/execution-report.html\`
- Excel: \`selenium_tests/reports/excel/Automation_Test_Report.xlsx\`
`;

  const summaryFile = path.join(__dirname, 'reports/summary/summary.md');
  fs.writeFileSync(summaryFile, markdownContent);
  logInfo(`Summary markdown report saved to: ${summaryFile}`);
}

async function executeSuite() {
  clearLog();
  logInfo('Starting BrickBrain E2E Selenium Suite Execution...');
  
  try {
    await startBrowser();

    const welcomePage = new WelcomePage(driver);
    const loginPage = new LoginPage(driver);
    const signupPage = new SignupPage(driver);
    const dashboardPage = new DashboardPage(driver);
    const estimatePage = new EstimatePage(driver);
    const materialsPage = new MaterialsPage(driver);
    const pricingPage = new PricingPage(driver);
    const timelinePage = new TimelinePage(driver);
    const budgetPage = new BudgetPage(driver);
    const laborPage = new LaborPage(driver);
    const chatbotPage = new ChatbotPage(driver);
    const defectPage = new DefectPage(driver);

    const testEmail = `e2e_builder_${Date.now()}@brickbrain.ai`;
    const testPassword = 'Password123!';

    // 1. Welcome Screen Loading & Onboarding Navigation
    await runTest('Authentication', 'Welcome Screen Loading', async () => {
      await welcomePage.navigate('/welcome');
      const loginBtnVisible = await welcomePage.isElementVisible(welcomePage.loginBtn, 5000);
      if (!loginBtnVisible) throw new Error('Welcome Screen login button not visible');
    });

    // 2. Registration Flow
    await runTest('Authentication', 'User Registration Flow', async () => {
      await welcomePage.clickSignup();
      await driver.sleep(1000);
      await signupPage.signup('E2E Builder User', testEmail, '9998887770', testPassword, 'Homeowner');
      
      // Wait for navigation to dashboard
      await driver.wait(until.urlContains('/app/dashboard'), 8000);
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/app/dashboard')) {
        throw new Error(`Failed to navigate to dashboard. Current URL: ${currentUrl}`);
      }

      // Close cookie consent early
      await acceptCookiesIfPresent();
    });

    // 2.b. Invalid Login Flow
    await runTest('Authentication', 'Invalid Login Flow', async () => {
      // Clear cookies and navigate to login to test explicitly
      await driver.manage().deleteAllCookies();
      await loginPage.navigate('/login');
      await driver.sleep(1000);
      await loginPage.login('invalid_user@brickbrain.ai', 'BadPassword123!');
      
      // Check for alert popup
      try {
        await driver.wait(until.alertIsPresent(), 3000);
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();
        if (!alertText.toLowerCase().includes('invalid')) {
          throw new Error(`Unexpected alert text: ${alertText}`);
        }
      } catch (err) {
        if (err.message.includes('alertIsPresent')) {
          throw new Error('Expected invalid credentials alert did not show up');
        } else {
          throw err;
        }
      }
    });

    // 3. User Login Flow
    await runTest('Authentication', 'User Login Flow', async () => {
      await loginPage.navigate('/login');
      await driver.sleep(1000);
      await loginPage.login(testEmail, testPassword);
      
      await driver.wait(until.urlContains('/app/dashboard'), 8000);
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/app/dashboard')) {
        throw new Error(`Failed to log in. Current URL: ${currentUrl}`);
      }

      // Close cookie consent early
      await acceptCookiesIfPresent();
    });

    // 4. Dashboard Home Load Verification
    await runTest('Dashboard', 'Dashboard Home Load Verification', async () => {
      const isTotalCostPresent = await dashboardPage.isElementVisible(dashboardPage.totalCostText, 5000);
      if (!isTotalCostPresent) throw new Error('Dashboard stats widgets not rendered');
    });

    // 5. Sidebar Navigation Verification
    await runTest('Dashboard', 'Sidebar Navigation Verification', async () => {
      await dashboardPage.clickSidebarItem('Labour Planning');
      await driver.wait(until.urlContains('/app/labor'), 5000);
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/app/labor')) {
        throw new Error(`Sidebar navigation failed to labor page. URL: ${currentUrl}`);
      }
      // Return to dashboard
      await dashboardPage.clickSidebarItem('Dashboard');
      await driver.wait(until.urlContains('/app/dashboard'), 5000);
    });

    // 6. AI Estimation & Cost Calculation
    await runTest('AI Cost Estimation', 'AI Cost Estimation & Calculations', async () => {
      await dashboardPage.navigate('/app/estimate');
      await driver.wait(until.urlContains('/app/estimate'), 5000);
      
      await estimatePage.fillEstimateForm('E2E Tower Project', '3500', '3', 'Bangalore, Karnataka', 'Residential', 'Premium');
      
      // Verify redirection to results
      await driver.wait(until.urlContains('/app/estimate/result'), 5000);
      const resultTitleVisible = await estimatePage.isElementVisible(estimatePage.resultTitle, 5000);
      if (!resultTitleVisible) throw new Error('Estimation results view did not load');
    });

    // 7. Materials Quantity Calculator
    await runTest('Material Calculator', 'Materials Quantity Calculator', async () => {
      await dashboardPage.navigate('/app/materials');
      await driver.wait(until.urlContains('/app/materials'), 5000);
      await materialsPage.calculateMaterials(2500);
      // Verify calculations output
      const resultTextPresent = await materialsPage.isElementVisible(By.xpath("//*[contains(text(), 'Cement') or contains(text(), 'Steel')]"), 5000);
      if (!resultTextPresent) throw new Error('Calculator results did not render');
    });

    // 8. Live Materials Pricing
    await runTest('Live Material Pricing', 'Live Materials Pricing Tracker', async () => {
      await dashboardPage.navigate('/app/pricing');
      await driver.wait(until.urlContains('/app/pricing'), 5000);
      await pricingPage.selectCity('Mumbai');
      await driver.sleep(1000);
      const pricesVisible = await pricingPage.isElementVisible(pricingPage.pricesGrid, 5000);
      if (!pricesVisible) throw new Error('Materials price list grid not visible');
    });

    // 9. Construction Gantt Timeline
    await runTest('Project Management', 'Construction Gantt Timeline Verification', async () => {
      await dashboardPage.navigate('/app/timeline');
      await driver.wait(until.urlContains('/app/timeline'), 5000);
      const timelineVisible = await timelinePage.isElementVisible(timelinePage.timelineContainer, 5000);
      if (!timelineVisible) throw new Error('Timeline Gantt grid not visible');
    });

    // 9.b. 3D House Visualizer
    await runTest('3D Modules', '3D House Visualizer Verification', async () => {
      await dashboardPage.navigate('/app/3d-house');
      await driver.wait(until.urlContains('/app/3d-house'), 5000);
      
      const isViewportVisible = await dashboardPage.isElementVisible(By.xpath("//*[contains(text(), '3D Viewport')]"), 5000);
      if (!isViewportVisible) throw new Error('Furnished 3D House Visualizer viewport not loaded');
      
      await dashboardPage.click(By.xpath("//button[text()='Interior View']"));
      await driver.sleep(1000);
      
      const isRoomSelectorVisible = await dashboardPage.isElementVisible(By.xpath("//button[contains(text(), 'Living Room') or contains(text(), 'Master Suite')]"), 5000);
      if (!isRoomSelectorVisible) throw new Error('Interior room selectors did not load in Interior View mode');
    });

    // 9.c. 3D Floor Plan Layout
    await runTest('3D Modules', '3D Floor Plan Verification', async () => {
      await dashboardPage.navigate('/app/3d-floor');
      await driver.wait(until.urlContains('/app/3d-floor'), 5000);
      
      const isFloorLayoutVisible = await dashboardPage.isElementVisible(By.xpath("//*[contains(text(), 'Floor Layout') or contains(text(), 'Ground Floor')]"), 5000);
      if (!isFloorLayoutVisible) throw new Error('3D Floor planning layout was not visible');

      // Click on a room item to load room details modal (interaction)
      const roomElement = By.xpath("//*[contains(text(), 'Living Room')]");
      await dashboardPage.click(roomElement);
      await driver.sleep(1000);
      
      // Verify room details modal loads
      const isModalVisible = await dashboardPage.isElementVisible(By.xpath("//*[contains(text(), 'Room Configuration') or contains(text(), 'Blueprint')]"), 5000);
      if (!isModalVisible) throw new Error('Room details configuration modal did not open on room click');
      
      // Close the modal
      const closeModalBtn = By.xpath("//h2[contains(., 'Visualizer')]/parent::div/following-sibling::button");
      if (await dashboardPage.isElementPresent(closeModalBtn, 2000)) {
        await dashboardPage.click(closeModalBtn);
        await driver.sleep(500);
      }
      
      const view3DButton = By.xpath("//button[contains(., 'View 3D Render')]");
      await dashboardPage.click(view3DButton);
      await driver.wait(until.urlContains('/app/3d-house'), 5000);
    });

    // 9.d. Milestones Verification
    await runTest('Project Management', 'Milestones Verification', async () => {
      await dashboardPage.navigate('/app/milestones');
      await driver.wait(until.urlContains('/app/milestones'), 5000);
      const milestonesVisible = await dashboardPage.isElementVisible(By.xpath("//*[contains(text(), 'Milestones') or contains(text(), 'Phases')]"), 5000);
      if (!milestonesVisible) throw new Error('Project milestones view not loaded');
    });

    // 10. Budget Tracking & Expenses Ledger
    await runTest('Budget Tracking', 'Budget Tracking & Expenses Log', async () => {
      await budgetPage.navigate('/app/expenses');
      
      // Log expense
      await budgetPage.logExpense('UltraTech E2E Vendor', 'Cement', '50 bags', 25000);
      await driver.sleep(1500);
      
      await budgetPage.navigate('/app/expenses');
      await driver.sleep(1000);
      
      const vendorListed = await budgetPage.isElementVisible(By.xpath("//*[contains(text(), 'UltraTech E2E Vendor')]"), 5000);
      if (!vendorListed) throw new Error('Logged expense did not appear in the budget table');
    });

    // 11. Labour Directory & Wages
    await runTest('Labour Planning', 'Labour Directory & Wages Verification', async () => {
      await dashboardPage.navigate('/app/labor');
      await driver.wait(until.urlContains('/app/labor'), 5000);
      const laborVisible = await laborPage.isElementVisible(laborPage.wageText, 5000);
      if (!laborVisible) throw new Error('Labor directory wage listings not visible');
    });

    // 11.b. Attendance Monitoring
    await runTest('Labour Planning', 'Attendance Monitoring Verification', async () => {
      await dashboardPage.navigate('/app/attendance');
      await driver.wait(until.urlContains('/app/attendance'), 5000);
      const attendanceVisible = await dashboardPage.isElementVisible(By.xpath("//*[contains(text(), 'Attendance') or contains(text(), 'Check-in')]"), 5000);
      if (!attendanceVisible) throw new Error('Attendance monitoring system view not loaded');
    });

    // 12. Team Directory
    await runTest('Team Management', 'Team Directory Verification', async () => {
      await dashboardPage.navigate('/app/team');
      await driver.wait(until.urlContains('/app/team'), 5000);
      const teamVisible = await dashboardPage.isElementVisible(By.xpath("//*[contains(text(), 'Ramesh') or contains(text(), 'Suresh') or contains(text(), 'Engineer')]"), 5000);
      if (!teamVisible) throw new Error('Team directory member listings not visible');
    });

    // 13. AI Chatbot Interface
    await runTest('AI Chatbot', 'AI Chatbot Query & Response Flow', async () => {
      await dashboardPage.navigate('/app/chatbot');
      await driver.wait(until.urlContains('/app/chatbot'), 5000);
      await chatbotPage.sendQuery('How many brick layers do I need?');
      const responseExists = await chatbotPage.isElementVisible(By.xpath("//*[contains(text(), 'brick') or contains(text(), 'labor') or contains(text(), 'cement')]"), 8000);
      if (!responseExists) throw new Error('Chatbot response message not rendered in chat container');
    });

    // 14. AI Defect Detection
    await runTest('AI Defect Detection', 'AI Defect Detection Interface', async () => {
      await defectPage.navigate('/app/site-photos');
      const uploadBtn = By.xpath("//button[contains(., 'Select & Upload')]");
      await defectPage.click(uploadBtn);
      
      await driver.wait(until.urlContains('/app/defects'), 8000);
      
      const hasDetections = await defectPage.isElementVisible(By.xpath("//*[contains(text(), 'Detected Issues')]"), 5000);
      if (!hasDetections) throw new Error('Defect detection listing view not loaded after scan');
    });

    // 15. Reports Export Trigger
    await runTest('Reports', 'Reports Export Verification', async () => {
      await dashboardPage.navigate('/app/reports');
      await driver.wait(until.urlContains('/app/reports'), 5000);
      const exportVisible = await dashboardPage.isElementVisible(By.xpath("//button[contains(., 'Generate Report')]"), 5000);
      if (!exportVisible) throw new Error('Export reports buttons not found on Reports page');

      // Click generate report button
      await dashboardPage.click(By.xpath("(//button[contains(., 'Generate')])[1]"));
      
      // Accept JavaScript alert
      try {
        await driver.wait(until.alertIsPresent(), 3000);
        const alert = await driver.switchTo().alert();
        await alert.accept();
      } catch (alertErr) {
        // Ignored
      }
    });

    // 15.b. Brand Header & Theme Consistency
    await runTest('General UI', 'Brand Header & Theme Consistency', async () => {
      const brandLogo = By.xpath("//h1[contains(., 'Brick') and contains(., 'Brain')]");
      const isLogoVisible = await dashboardPage.isElementVisible(brandLogo, 5000);
      if (!isLogoVisible) throw new Error('BrickBrain brand logo header not visible');

      const hasGlassTheme = await dashboardPage.isElementPresent(By.xpath("//div[contains(@class, 'glass')]"), 5000);
      if (!hasGlassTheme) throw new Error('Glassmorphism theme containers not found in application view');
    });

    // 16. Mobile Responsive Layout Compatibility
    await runTest('General UI', 'Mobile Responsive Layout Drawer', async () => {
      await driver.manage().window().setSize(375, 812);
      await driver.executeScript("Object.defineProperty(window, 'innerWidth', { get: function() { return 375; }, configurable: true });");
      await driver.executeScript("window.dispatchEvent(new Event('resize'));");
      await driver.sleep(1500);

      const hamburger = By.xpath("//*[local-name()='svg' and contains(@class, 'lucide-menu')]/ancestor::button");
      const isMobileMenuVisible = await dashboardPage.isElementVisible(hamburger, 5000);
      if (!isMobileMenuVisible) throw new Error('Mobile layout top hamburger button not visible');
      
      await dashboardPage.click(hamburger);
      await driver.sleep(1500);

      const drawerItem = By.xpath("//div[contains(@class, 'bg-black/50')]//button[contains(., 'Dashboard')]");
      const isDrawerItemVisible = await dashboardPage.isElementVisible(drawerItem, 5000);
      if (!isDrawerItemVisible) throw new Error('Mobile drawer links not visible after clicking hamburger');

      const overlay = By.xpath("//div[contains(@class, 'fixed') and contains(@class, 'bg-black')]");
      if (await dashboardPage.isElementPresent(overlay, 2000)) {
        await dashboardPage.click(overlay);
      } else {
        await dashboardPage.click(hamburger);
      }
      await driver.sleep(1500);

      await driver.manage().window().setSize(1280, 1024);
      await driver.executeScript("Object.defineProperty(window, 'innerWidth', { get: function() { return 1280; }, configurable: true });");
      await driver.executeScript("window.dispatchEvent(new Event('resize'));");
      await driver.sleep(1500);
    });

    // 17. User Logout Flow
    await runTest('Authentication', 'User Logout Flow', async () => {
      await dashboardPage.navigate('/app/profile');
      await driver.wait(until.urlContains('/app/profile'), 5000);
      
      const logoutBtn = By.xpath("//button[contains(., 'Log Out')]");
      await dashboardPage.click(logoutBtn);
      
      await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        return url.includes('/login') || url.includes('/welcome');
      }, 8000);

      const currentUrl = await driver.getCurrentUrl();
      logInfo(`Logout redirect completed to: ${currentUrl}`);
    });

  } catch (err) {
    logError('Fatal suite startup crash:', err);
    testResults.push({ name: 'Suite Startup', module: 'System', status: 'Failed', duration: 0, error: err.message, screenshot: null });
  } finally {
    if (driver) {
      logInfo('Quitting browser session...');
      await driver.quit();
    }
    
    // Write HTML, Excel, and Markdown reports
    try {
      writeExcelReport(testResults);
      writeHtmlReport(testResults);
      writeSummaryMarkdown(testResults);
      logInfo('All reports generated successfully.');
    } catch (reportErr) {
      logError('Error writing final reports:', reportErr);
    }

    const hasFailures = testResults.some(r => r.status.toLowerCase() === 'failed');
    process.exit(hasFailures ? 1 : 0);
  }
}

executeSuite();
