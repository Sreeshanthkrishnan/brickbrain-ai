import BasePage from './basePage.js';

export class FormsPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      formTitleInput: 'input_form_title',
      categoryDropdown: 'dd_category',
      fileUploadPicker: 'picker_file_upload',
      submitFormBtn: 'btn_submit_form',
      toastMessage: 'txt_toast_alert'
    };
  }

  async submitForm(title, category) {
    await this.sendKeys(this.locators.formTitleInput, title);
    await this.click(this.locators.categoryDropdown);
    await this.click(this.locators.submitFormBtn);
    return true;
  }
}

export default FormsPage;
