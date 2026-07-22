import BasePage from './basePage.js';

export class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      navDrawer: 'drawer_nav_main',
      kpiSummaryCard: 'card_kpi_summary',
      aiEstimatorTile: 'tile_ai_estimator',
      materialCalcTile: 'tile_material_calculator',
      themeSwitch: 'btn_theme_switch',
      profileAvatar: 'img_profile_avatar'
    };
  }

  async openNavDrawer() {
    await this.click(this.locators.navDrawer);
  }

  async toggleTheme() {
    await this.click(this.locators.themeSwitch);
  }
}

export default DashboardPage;
