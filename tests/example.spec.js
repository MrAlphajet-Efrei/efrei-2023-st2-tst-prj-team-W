// @ts-check
const { test, expect } = require("@playwright/test");

test("employee name dont contains integer", async ({ page }) => {
  await page.goto("https://w.hr.dmerej.info/add_employee");
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill("Joh");
  const name = await page.getByPlaceholder("Name").inputValue();
  await expect(name).not.toContain("0");
  await expect(name).not.toContain("1");
  await expect(name).not.toContain("2");
  await expect(name).not.toContain("3");
  await expect(name).not.toContain("4");
  await expect(name).not.toContain("5");
  await expect(name).not.toContain("6");
  await expect(name).not.toContain("7");
  await expect(name).not.toContain("8");
  await expect(name).not.toContain("9");
});

test.describe("Is the adding form for employee correct", () => {
  test("#10 - Should accept only 5 caracters for ZIP Code", async ({
    page,
  }) => {
    await page.goto("https://w.hr.dmerej.info/add_employee");

    await page.getByPlaceholder("Zip code").click();
    await page.getByPlaceholder("Zip code").fill("92500");

    // get the zip code placeholder
    const zipCodePlaceHolder = await page.getByPlaceholder("Zip code");

    // get the content of the placeholder
    const zipCode = await zipCodePlaceHolder.inputValue();

    // check if the zip code contain 5 number
    await expect(zipCode).toHaveLength(5);
  });
});

test.describe("#9 - Should lead the user to the list when adding or deleting an employee or a team", () => {
  test("should return to the employee list when adding", async ({ page }) => {
    // this is the scenario of creating a new employee
    await page.goto("https://w.hr.dmerej.info/");
    await page.getByRole("link", { name: "Add new employee" }).click();
    await page.getByPlaceholder("Name").click();
    await page.getByPlaceholder("Name").fill("test for testing");
    await page.getByPlaceholder("Email").click();
    await page.getByPlaceholder("Email").fill("testing@testing.com");
    await page.locator("#id_address_line1").click();
    await page.locator("#id_address_line1").fill("12 rue du testing");
    await page.getByPlaceholder("City").click();
    await page.getByPlaceholder("City").fill("testing City Zoo");
    await page.getByPlaceholder("Zip code").click();
    await page.getByPlaceholder("Zip code").fill("93939");
    await page.getByPlaceholder("Hiring date").fill("1993-03-09");
    await page.getByPlaceholder("Job title").click();
    await page.getByPlaceholder("Job title").fill("testeur");
    await page.getByRole("button", { name: "Add" }).click();

    // now we check if we return to the list of employee
    await expect(page).toHaveURL("https://w.hr.dmerej.info/employees");
  });

  test("should return to the employee list when deleting", async ({ page }) => {
    //same as before but now we try to delete the user
    await page.goto("https://w.hr.dmerej.info/");
    await page.getByRole("link", { name: "List Employees" }).click();
    await page
      .getByRole("row", {
        name: "test for testing testing@testing.com no Edit Delete",
      })
      .getByRole("link", { name: "Delete" })
      .click();
    await page.getByRole("button", { name: "Proceed" }).click();

    // now we check if we return to the list of employee
    await expect(page).toHaveURL("https://w.hr.dmerej.info/employees");
  });

  test("should return to the team list when adding a team", async ({
    page,
  }) => {
    // Here we add a team to the list
    await page.goto("https://w.hr.dmerej.info/");
    await page.getByRole("link", { name: "Create new team" }).click();
    await page.getByPlaceholder("Name").click();
    await page.getByPlaceholder("Name").fill("testeur City Zoo");
    await page.getByRole("button", { name: "Add" }).click();

    // now we check if we return to the list of teams
    await expect(page).toHaveURL("https://w.hr.dmerej.info/teams");
  });

  test("should return to the team list when deleting a team", async ({
    page,
  }) => {
    // Here we delete a team from the list
    await page.goto("https://w.hr.dmerej.info/");
    await page.getByRole("link", { name: "List teams" }).click();
    await page
      .getByRole("row", { name: "testeur City Zoo View members Delete" })
      .getByRole("link", { name: "Delete" })
      .click();
    await page.getByRole("button", { name: "Proceed" }).click();

    // now we check if we return to the list of teams
    await expect(page).toHaveURL("https://w.hr.dmerej.info/teams");
  });
});
