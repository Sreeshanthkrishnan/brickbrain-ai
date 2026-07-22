import { By, until } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

// Consolidates all dashboard sub-screens for simplicity and modularity

export class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.totalCostText = By.xpath("//p[contains(text(), 'Total Estimated Cost')]/following-sibling::p");
    this.materialSpentText = By.xpath("//p[contains(text(), 'Material Spent')]/following-sibling::p");
    this.laborBudgetText = By.xpath("//p[contains(text(), 'Labor Budget')]/following-sibling::p");
  }

  async clickSidebarItem(label) {
    // Click sidebar navigation item
    const xpath = `//button[span[text()='${label}']] | //button[contains(., '${label}')]`;
    const btn = By.xpath(xpath);
    await this.click(btn);
  }

  async readTotalCost() {
    return await this.getText(this.totalCostText);
  }
}

export class EstimatePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.projectNameInput = By.xpath("//input[@placeholder='e.g. Whitefield Residential Villa']");
    this.plotSizeInput = By.xpath("//input[@placeholder='Enter plot size']");
    this.floorsSelect = By.xpath("//select[option[contains(text(), 'Floor')]]");
    this.locationSelect = By.xpath("//select[option[text()='Select Location']]");
    this.typeSelect = By.xpath("//select[option[text()='Residential']]");
    this.submitBtn = By.xpath("//button[contains(., 'Generate Estimate')]");
    
    // Result elements
    this.resultTitle = By.xpath("//h1");
  }

  async fillEstimateForm(projectName, plotSize, floors, location, type = 'Residential', quality = 'Premium') {
    await this.sendKeys(this.projectNameInput, projectName);
    await this.sendKeys(this.plotSizeInput, plotSize);
    
    // Select floors
    const floorsOption = By.xpath(`//option[@value='${floors}']`);
    await this.click(this.floorsSelect);
    await this.click(floorsOption);

    // Select location
    const locationOption = By.xpath(`//option[@value='${location}']`);
    await this.click(this.locationSelect);
    await this.click(locationOption);

    // Select type
    const typeOption = By.xpath(`//option[@value='${type}']`);
    await this.click(this.typeSelect);
    await this.click(typeOption);

    // Select quality
    const qualityBtn = By.xpath(`//button[text()='${quality}']`);
    if (await this.isElementPresent(qualityBtn, 2000)) {
      await this.click(qualityBtn);
    }

    await this.click(this.submitBtn);
  }
}

export class MaterialsPage extends BasePage {
  constructor(driver) {
    super(driver);
    // Find generic inputs on the material calculator
    this.calcInput = By.xpath("//input[@type='number']");
    this.calculateBtn = By.xpath("//button[contains(., 'Calculate') or contains(., 'Compute')]");
  }

  async calculateMaterials(quantity) {
    if (await this.isElementPresent(this.calcInput, 3000)) {
      await this.sendKeys(this.calcInput, quantity.toString());
      if (await this.isElementPresent(this.calculateBtn, 2000)) {
        await this.click(this.calculateBtn);
      }
    }
  }
}

export class PricingPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.citySelector = By.xpath("//select");
    this.pricesGrid = By.xpath("//div[contains(@class, 'grid')]");
  }

  async selectCity(cityName) {
    if (await this.isElementPresent(this.citySelector, 3000)) {
      await this.click(this.citySelector);
      const option = By.xpath(`//option[contains(text(), '${cityName}')]`);
      await this.click(option);
    }
  }
}

export class TimelinePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.timelineContainer = By.xpath("//div[contains(@class, 'flex') or contains(@class, 'grid')]");
  }
}

export class BudgetPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.vendorInput = By.xpath("//input[@placeholder='Enter vendor name']");
    this.materialInput = By.xpath("//input[@placeholder='Enter material']");
    this.qtyInput = By.xpath("//input[@placeholder='Enter quantity']");
    this.priceInput = By.xpath("//input[@placeholder='Enter price']");
    this.amountInput = By.xpath("//input[@placeholder='Total amount']");
    this.submitExpenseBtn = By.xpath("//button[@type='submit']");
  }

  async logExpense(vendor, material, quantity, amount) {
    await this.sendKeys(this.vendorInput, vendor);
    await this.sendKeys(this.materialInput, material);
    await this.sendKeys(this.qtyInput, quantity);
    await this.sendKeys(this.amountInput, amount.toString());
    await this.click(this.submitExpenseBtn);

    // Accept Alert Popup "Expense recorded successfully!"
    try {
      await this.driver.wait(until.alertIsPresent(), 3000);
      const alert = await this.driver.switchTo().alert();
      await alert.accept();
    } catch (e) {
      // Ignored if no alert
    }
  }
}

export class LaborPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.attendanceLink = By.xpath("//button[contains(., 'Attendance') or contains(., 'Monitor')]");
    this.wageText = By.xpath("//*[contains(text(), 'wage') or contains(text(), 'Wage')]");
  }
}

export class ChatbotPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.chatInput = By.xpath("//input[@placeholder='Ask BrickBrain...'] | //input[@type='text']");
    this.sendBtn = By.xpath("//button[contains(., 'Send') or @type='submit']");
    this.messageList = By.xpath("//div[contains(@class, 'overflow-y-auto')]");
  }

  async sendQuery(message) {
    const el = await this.driver.wait(until.elementLocated(this.chatInput), 3000);
    await el.sendKeys(message);
    
    const sBtn = await this.driver.wait(until.elementLocated(this.sendBtn), 3000);
    await sBtn.click();
    await this.driver.sleep(1500); // Wait for response
  }
}

export class DefectPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.fileUploadInput = By.xpath("//input[@type='file']");
    this.defectDashboard = By.xpath("//*[contains(text(), 'Crack') or contains(text(), 'Defect') or contains(text(), 'Upload')]");
  }
}
