import { expect, type Page } from "@playwright/test";
import { test } from "~/../playwright/fixtures";

test.describe.serial("Session management", async () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("Create", async ({ seed }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(`player+${seed}@example.com`);
    await page.getByLabel("Password").fill("0123456789abcdef");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/account\/characters/);
  });

  test("Invalidate", async ({}) => {
    await page.getByRole("link", { name: "Settings" }).click();
    await page.waitForURL(/\/settings/);
    await page.getByRole("button", { name: "Invalidate" }).first().click();
    await expect(page).toHaveURL(/\/login/);
  });
});
