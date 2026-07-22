import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class WelcomePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.loginBtn = By.xpath("//button[span[text()='Login']]");
    this.signupBtn = By.xpath("//button[span[text()='Create Account']]");
    this.guestBtn = By.xpath("//button[span[text()='Continue as Guest']]");
  }

  async clickLogin() {
    await this.click(this.loginBtn);
  }

  async clickSignup() {
    await this.click(this.signupBtn);
  }

  async clickGuest() {
    await this.click(this.guestBtn);
  }
}
