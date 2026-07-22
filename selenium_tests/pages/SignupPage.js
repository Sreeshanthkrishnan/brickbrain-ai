import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class SignupPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.nameInput = By.xpath("//input[@placeholder='Enter your name']");
    this.emailInput = By.xpath("//input[@placeholder='Enter your email']");
    this.phoneInput = By.xpath("//input[@placeholder='Enter your phone']");
    this.passwordInput = By.xpath("//input[@placeholder='Create password']");
    this.confirmPasswordInput = By.xpath("//input[@placeholder='Confirm password']");
    this.submitBtn = By.xpath("//button[@type='submit']");
  }

  async signup(name, email, phone, password, role = 'Homeowner') {
    await this.sendKeys(this.nameInput, name);
    await this.sendKeys(this.emailInput, email);
    await this.sendKeys(this.phoneInput, phone);
    await this.sendKeys(this.passwordInput, password);
    await this.sendKeys(this.confirmPasswordInput, password);
    
    // Choose role
    const roleBtn = By.xpath(`//form//button[text()='${role}']`);
    if (await this.isElementPresent(roleBtn, 2000)) {
      await this.click(roleBtn);
    }

    await this.click(this.submitBtn);
  }
}
