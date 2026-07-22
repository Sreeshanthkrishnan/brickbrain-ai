import BasePage from './basePage.js';

export class AuthPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      emailInput: 'input_email',
      passwordInput: 'input_password',
      loginButton: 'btn_login',
      signupButton: 'btn_signup',
      forgotPasswordLink: 'link_forgot_password',
      rememberMeCheckbox: 'chk_remember_me',
      roleDropdown: 'dd_role_selector'
    };
  }

  async login(email, password) {
    await this.sendKeys(this.locators.emailInput, email);
    await this.sendKeys(this.locators.passwordInput, password);
    await this.click(this.locators.loginButton);
    return true;
  }
}

export default AuthPage;
