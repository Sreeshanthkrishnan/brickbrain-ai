import BasePage from './basePage.js';

export class EstimationPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      sqftSlider: 'slider_sqft',
      qualityDropdown: 'dd_quality',
      calculateBtn: 'btn_calculate_cost',
      totalCostLabel: 'txt_total_cost',
      exportPdfBtn: 'btn_export_pdf'
    };
  }

  async calculateCost(sqft, quality) {
    await this.sendKeys(this.locators.sqftSlider, sqft);
    await this.click(this.locators.qualityDropdown);
    await this.click(this.locators.calculateBtn);
    return true;
  }
}

export default EstimationPage;
