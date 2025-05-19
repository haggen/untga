import { expect, test } from "@playwright/test";

const salt = String(Date.now());

test("registration", async ({ page }) => {
  await page.goto("/registration");

  await expect(page).toHaveTitle(/Registration/);

  await page
    .getByRole("textbox", { name: "E-mail" })
    .fill(`player+${salt}@example.com`);
  await page
    .getByRole("textbox", { name: "Password" })
    .fill("0123456789abcdef");

  await page.getByRole("button", { name: "Register" }).click();

  await expect(page).toHaveURL("/me/characters");
});

test("login", async ({ page }) => {
  await page.goto("/login");

  await expect(page).toHaveTitle("Log in");

  await page
    .getByRole("textbox", { name: "E-mail" })
    .fill(`player+${salt}@example.com`);

  await page
    .getByRole("textbox", { name: "Password" })
    .fill("0123456789abcdef");

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL("/me/characters");
});

test("character creation", async ({ page }) => {
  await page.goto("/me/characters");

  await page
    .getByRole("link", { name: "Empty (create new character)" })
    .first()
    .click();

  await expect(page).toHaveURL("/me/characters/create");

  await page.getByRole("textbox", { name: "Name" }).fill(`Player ${salt}`);

  await page.getByRole("button", { name: "Create character" }).click();

  await expect(page).toHaveURL(new RegExp("/play/d+/stats"));
});
