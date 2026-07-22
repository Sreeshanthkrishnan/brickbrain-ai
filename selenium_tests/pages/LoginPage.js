import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.emailInput = By.xpath("//input[@type='email']");
    this.passwordInput = By.xpath("//input[@type='password']");
    this.loginSubmitBtn = By.xpath("//button[@type='submit']");
  }

  async login(email, password) {
    await this.sendKeys(this.emailInput, email);
    await this.sendKeys(this.passwordInput, password);
    await this.click(this.loginSubmitBtn);
  }
}
