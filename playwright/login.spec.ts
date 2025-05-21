import { expect } from "@playwright/test";
import { authenticatedTest } from "./fixtures";

authenticatedTest("login", async ({ page }, { parallelIndex }) => {
  await page.goto("/login");

  await expect(page).toHaveTitle(/Log in/);

  await page
    .getByRole("textbox", { name: "E-mail" })
    .fill(`player+${parallelIndex}@example.com`);

  await page
    .getByRole("textbox", { name: "Password" })
    .fill("0123456789abcdef");

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL(/\/characters/);
});
