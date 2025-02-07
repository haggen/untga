import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Untitled Game/);
});

test("register", async ({ page }) => {
  await page.goto("/");

  // Click to register.
  await page.getByRole("link", { name: "Play now, free!" }).click();

  // Expects page to have the correct heading.
  await expect(
    page.getByRole("heading", { name: "Registration" })
  ).toBeVisible();

  // Fill out registration form.
  await page
    .getByRole("textbox", { name: "E-mail" })
    .fill(`test+${(Math.random() * 1000).toFixed(0)}@example.com`);
  await page.getByRole("textbox", { name: "Password" }).fill("password-123");

  // Submit the form.
  await page.getByRole("button", { name: "Register" }).click();

  // Expects redirection.
  await page.waitForURL("**/characters/create");
});
