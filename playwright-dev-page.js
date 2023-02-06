// playwright-dev-page.js
const { expect } = require("@playwright/test");

exports.PlaywrightDevPage = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.getStartedLink = page.locator("a", { hasText: "Get started" });
    this.gettingStartedHeader = page.locator("h1", { hasText: "Installation" });
    this.pomLink = page
      .locator("li", { hasText: "Guides" })
      .locator("a", { hasText: "Page Object Model" });
    this.tocList = page.locator("article div.markdown ul > li > a");
  }

  async goto() {
    await this.page.goto("https://playwright.dev");
  }

  async getStarted() {
    await this.getStartedLink.first().click();
    await expect(this.gettingStartedHeader).toBeVisible();
  }

  async pageObjectModel() {
    await this.getStarted();
    await this.pomLink.click();
  }

  async createUser(name, email, zipcode) {
    await this.page.goto("https://w.hr.dmerej.info/");
    await this.page.getByRole("link", { name: "Add new employee" }).click();
    await this.page.getByPlaceholder("Name").click();
    await this.page.getByPlaceholder("Name").fill(`${name}`);
    await this.page.getByPlaceholder("Email").click();
    await this.page.getByPlaceholder("Email").fill(`${email}`);
    await this.page.locator("#id_address_line1").click();
    await this.page.locator("#id_address_line1").fill("12 rue du testing");
    await this.page.getByPlaceholder("City").click();
    await this.page.getByPlaceholder("City").fill("testing City Zoo");
    await this.page.getByPlaceholder("Zip code").click();
    await this.page.getByPlaceholder("Zip code").fill(`${zipcode}`);
    await this.page.getByPlaceholder("Hiring date").fill("1993-03-09");
    await this.page.getByPlaceholder("Job title").click();
    await this.page.getByPlaceholder("Job title").fill("testeur");
    await this.page.getByRole("button", { name: "Add" }).click();
  }

  // async deleteUser(name, email) {}

  async createTeam(name) {
    await this.page.goto("https://w.hr.dmerej.info/");
    await this.page.getByRole("link", { name: "Create new team" }).click();
    await this.page.getByPlaceholder("Name").click();
    await this.page.getByPlaceholder("Name").fill(`${name}`);
    await this.page.getByRole("button", { name: "Add" }).click();
  }

  async addEmployeeToTeam(name, email, team) {
    await this.page.goto("https://w.hr.dmerej.info/");
    await this.page.getByRole("link", { name: "List Employees" }).click();
    await this.page
      .getByRole("row", { name: `${name} ${email} no Edit Delete` })
      .getByRole("link", { name: "Edit" })
      .click();
    await this.page.getByRole("link", { name: "Add to team" }).click();
    await this.page.getByLabel("Team").selectOption({ label: `${team} team` });
    await this.page.getByRole("button", { name: "Add" }).click();
  }

  async employeToManager(name, email) {
    await this.page.goto("https://w.hr.dmerej.info/");
    await this.page.getByRole("link", { name: "List Employees" }).click();
    await this.page
      .getByRole("row", { name: `${name} ${email} no Edit Delete` })
      .getByRole("link", { name: "Edit" })
      .click();
    await this.page.getByRole("link", { name: "Promote as manager" }).click();
    await this.page.getByRole("button", { name: "Proceed" }).click();
  }
};
