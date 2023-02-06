const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");
const { PlaywrightDevPage } = require("../playwright-dev-page");

test.describe("test data for a user", () => {
  test("employee name doesn't contain integer", async ({ page }) => {
    const name = faker.name.lastName();
    const email = faker.internet.email();
    faker.locale = "fr";
    const zipcode = faker.address.zipCode();

    const playwrightDev = new PlaywrightDevPage(page);
    await playwrightDev.createUser(name, email, zipcode);
    //
    await page.goto("https://w.hr.dmerej.info/");
    await page.getByRole("link", { name: "List Employees" }).click();
    await page
      .getByRole("row", { name: `${name} ${email} no Edit Delete` })
      .click();
    await page
      .getByRole("row", { name: `${name} ${email} no Edit Delete` })
      .getByRole("link", { name: "Edit" })
      .click();

    const nameRes = await page
      .locator(`body > p:nth-child(3)`)
      .allTextContents();

    const expRegExcludeSpecialCharacterAndNumber = `/[${String.fromCharCode(
      34
    )}-${String.fromCharCode(64)}]/g`;

    const val = nameRes[0].split(" - ");
    await expect(val[0]).not.toMatch(expRegExcludeSpecialCharacterAndNumber);

    // utilisation des expression régulières pour éviter de faire
  });

  test("#10 - Should accept only 5 caracters for ZIP Code", async ({
    page,
  }) => {
    await page.goto("https://w.hr.dmerej.info/add_employee");
    const name = faker.name.lastName();
    const email = faker.internet.email();
    faker.locale = "fr";
    const zipcode = faker.address.zipCode();

    const playwrightDev = new PlaywrightDevPage(page);
    await playwrightDev.createUser(name, email, zipcode);

    await page.goto("https://w.hr.dmerej.info/");
    await page.getByRole("link", { name: "List Employees" }).click();
    await page
      .getByRole("row", { name: `${name} ${email} no Edit Delete` })
      .getByRole("link", { name: "Edit" })
      .click();

    await page.getByRole("link", { name: "Update address" }).click();

    const val = await page.getByPlaceholder("Zip code");

    const getValInput = await val.inputValue();
    await expect(getValInput).toHaveLength(5);
  });

  test("Should display the information when deleting a user", async ({
    page,
  }) => {
    const name = faker.name.firstName();
    const email = faker.internet.email().toLowerCase();
    faker.locale = "fr";
    const zipcode = faker.address.zipCode();

    const playwrightDev = new PlaywrightDevPage(page);

    await playwrightDev.createUser(name, email, zipcode);

    await page.goto("https://w.hr.dmerej.info/");

    await page.getByRole("link", { name: "List Employees" }).click();
    await page
      .getByRole("row", { name: `${name} ${email} no Edit Delete` })
      .getByRole("link", { name: "Delete" })
      .click();

    const test = await page.locator("body > p:nth-child(3)").allTextContents();

    const verifNameIsPresent = test[0].includes(name);
    const verifEmailIsPresent = test[0].includes(email);

    await expect(verifNameIsPresent).toEqual(true);
    await expect(verifEmailIsPresent).toEqual(true);
  });

  test("#2 - Should not create same employee twice", async ({ page }) => {
    const email = faker.internet.email();
    const name = faker.name.lastName();
    faker.locale = "fr";
    const zipCode = faker.address.zipCode();

    const playwrightDev = new PlaywrightDevPage(page);
    await playwrightDev.createUser(name, email, zipCode);
    const uniqueEmail = await page.locator(`tr:has-text("${email}")`).count();

    await expect(uniqueEmail).toEqual(1);
  });

  test("#3 - Should not accept an year of hiring invalid", async ({ page }) => {
    await page.goto("https://w.hr.dmerej.info/");
    await page.getByRole("link", { name: "Add new employee" }).click();
    await page.getByPlaceholder("Hiring date").click();
    await page.getByPlaceholder("Hiring date").fill("2015-02-05");

    const hiringDateHolder = await page.getByPlaceholder("Hiring date");
    const hiringDate = await hiringDateHolder.inputValue();
    const year = parseInt(hiringDate.substring(0, 4), 10);
    const today = new Date();

    await expect(hiringDate).toHaveLength(10);
    await expect(year).toBeGreaterThanOrEqual(1980);
    await expect(year).toBeLessThanOrEqual(
      today.getFullYear() + (today.getMonth() + 4)
    ); //+4 au cas où des gens sont embauchés dans les mois à suivre
  });
});
