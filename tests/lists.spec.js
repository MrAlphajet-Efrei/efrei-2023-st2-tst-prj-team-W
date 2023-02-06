// @ts-check
const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");
const { PlaywrightDevPage } = require("../playwright-dev-page");

test.describe("checking informations of lists", () => {
  test("#5 - Should not have two managers for one team", async ({ page }) => {
    faker.locale = "fr";
    // first user
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const zipcode = faker.address.zipCode();

    // second user
    const name2 = faker.name.firstName();
    const email2 = faker.internet.email();
    const zipcode2 = faker.address.zipCode();

    // team
    const team = faker.name.lastName();

    const playwrightDev = new PlaywrightDevPage(page);

    // create the two users
    await playwrightDev.createUser(name, email, zipcode);
    await playwrightDev.createUser(name2, email2, zipcode2);

    // create the team
    await playwrightDev.createTeam(team);

    // création des deux managers
    await playwrightDev.addEmployeeToTeam(name, email, team);
    await playwrightDev.addEmployeeToTeam(name2, email2, team);

    // les employés deviennent managers
    await playwrightDev.employeToManager(name, email);
    await playwrightDev.employeToManager(name2, email2);

    //Vue sur l'équipe avec les employés ajoutés
    await page.goto("https://w.hr.dmerej.info/");
    await page.getByRole("link", { name: "List teams" }).click();
    await page
      .getByRole("row", { name: `${team} View members Delete` })
      .getByRole("link", { name: "View members" })
      .click();

    const uniqueManager = await page.locator(`li:has-text("manager")`).count();

    await expect(uniqueManager).toEqual(2);
  });
  test.describe("users list informations", () => {
    test("should return to the employee list when adding", async ({ page }) => {
      // this is the scenario of creating a new employee
      const name = faker.name.lastName();
      const email = faker.internet.email();
      faker.locale = "fr";
      const zipCode = faker.address.zipCode();

      const playwrightDev = new PlaywrightDevPage(page);
      await playwrightDev.createUser(name, email, zipCode);

      // now we check if we return to the list of employee
      await expect(page).toHaveURL("https://w.hr.dmerej.info/employees");
    });

    test("should return to the employee list when deleting", async ({
      page,
    }) => {
      faker.locale = "fr";

      const name = faker.name.lastName();
      const email = faker.internet.email();
      const zipCode = faker.address.zipCode();

      const playwrightDev = new PlaywrightDevPage(page);
      await playwrightDev.createUser(name, email, zipCode);

      //same as before but now we try to delete the user
      await page.goto("https://w.hr.dmerej.info/");
      await page.getByRole("link", { name: "List Employees" }).click();

      await page
        .getByRole("row", {
          name: `${name} ${email} no Edit Delete`,
        })
        .getByRole("link", { name: "Delete" })
        .click();
      await page.getByRole("button", { name: "Proceed" }).click();

      // now we check if we return to the list of employee
      await expect(page).toHaveURL("https://w.hr.dmerej.info/employees");
    });
  });

  test.describe("verif informations of a list of teams", () => {
    test("should return to the team list when adding a team", async ({
      page,
    }) => {
      const teamName = faker.company.name();

      const playwrightDev = new PlaywrightDevPage(page);
      await playwrightDev.createTeam(teamName);

      // now we check if we return to the list of teams
      await expect(page).toHaveURL("https://w.hr.dmerej.info/teams");
    });

    test("should return to the team list when deleting a team", async ({
      page,
    }) => {
      const teamName = faker.company.name();

      const playwrightDev = new PlaywrightDevPage(page);
      await playwrightDev.createTeam(teamName);

      // now we check if we return to the list of teams
      await expect(page).toHaveURL("https://w.hr.dmerej.info/teams");
    });
  });
});
