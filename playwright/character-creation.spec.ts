import { expect } from "@playwright/test";
import { authenticatedTest } from "./fixtures";

authenticatedTest("character creation", async ({ page }) => {
  await page.goto("/me/characters");

  await expect(page).toHaveTitle(/Characters/);

  await page
    .getByRole("link", { name: "Empty (create new character)" })
    .first()
    .click();

  await expect(page).toHaveURL(/\/characters\/create/);
  await expect(page).toHaveTitle(/Create new character/);

  await page
    .getByRole("textbox", { name: "Name" })
    .fill(`Player ${Date.now()}`);

  await page.getByRole("button", { name: "Create character" }).click();

  await expect(page).toHaveURL(/\/stats/);
});
