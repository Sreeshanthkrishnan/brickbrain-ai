import { By, until } from 'selenium-webdriver';
import { config } from '../config.js';

export class BasePage {
  /**
   * @param {import('selenium-webdriver').WebDriver} driver
   */
  constructor(driver) {
    this.driver = driver;
  }

  async navigate(path = '') {
    const url = `${config.baseUrl}${path}`;
    console.log(`Navigating to: ${url}`);
    await this.driver.get(url);
    await this.driver.sleep(1000); // Allow react state to mount
  }

  async findElement(locator, timeout = config.timeout) {
    const el = await this.driver.wait(until.elementLocated(locator), timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    return el;
  }

  async click(locator, timeout = config.timeout) {
    const el = await this.findElement(locator, timeout);
    await el.click();
  }

  async sendKeys(locator, text, timeout = config.timeout) {
    const el = await this.findElement(locator, timeout);
    await el.clear();
    await el.sendKeys(text);
  }

  async getText(locator, timeout = config.timeout) {
    const el = await this.findElement(locator, timeout);
    return await el.getText();
  }

  async isElementPresent(locator, timeout = 2000) {
    try {
      await this.driver.wait(until.elementLocated(locator), timeout);
      return true;
    } catch (e) {
      return false;
    }
  }

  async isElementVisible(locator, timeout = 2000) {
    try {
      const el = await this.findElement(locator, timeout);
      return await el.isDisplayed();
    } catch (e) {
      return false;
    }
  }
}
