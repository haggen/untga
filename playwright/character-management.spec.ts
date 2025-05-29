import { expect, type Page } from "@playwright/test";
import { test } from "~/../playwright/fixtures";

test.describe.serial("Character management", async () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("Create", async () => {
    await page.goto("/account/characters");
    await page
      .getByRole("link", { name: "Empty (create new character)" })
      .first()
      .click();
    await expect(page).toHaveURL("/account/characters/create");
    await page
      .getByRole("textbox", { name: "Name" })
      .fill(`Player ${Date.now()}`);
    await page.getByRole("button", { name: "Create character" }).click();
    await expect(page).toHaveURL(/\/protagonist\/\d+\/stats/);
  });

  test("Edit", async () => {
    await page.getByRole("link", { name: "Character menu" }).click();
    await expect(page).toHaveURL(/\/protagonist\/\d+\/characters\/\d+/);
    await page.getByRole("link", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/account\/characters\/\d+\/edit/);
    await page.getByRole("textbox", { name: "Bio" }).fill("Something else.");
    await page.getByRole("button", { name: "Update character" }).click();
    await expect(page.getByText("Character updated")).toHaveRole("alert");
  });

  test("Delete", async () => {
    const name = await page.getByLabel("Name").inputValue();
    await page.getByRole("button", { name: "Delete this character" }).click();
    await page.waitForURL("/account/characters");
    await expect(page.getByRole("link", { name })).toHaveCount(0);
  });
});
