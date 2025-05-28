/* eslint-disable react-hooks/rules-of-hooks */

import { test } from "@playwright/test";
import { existsSync } from "fs";
import path from "path";

const extendedTest = test.extend<
  { storageState: string; seed: number; protagonistId: string },
  { workerStorageState: string; workerSeed: number }
>({
  workerSeed: [
    async ({}, use) => {
      use(Date.now() - new Date("2025-01-01T00:00:00Z").getTime());
    },
    { scope: "worker" },
  ],

  seed: async ({ workerSeed }, use) => {
    use(workerSeed);
  },

  workerStorageState: [
    async ({ browser, workerSeed }, use, { parallelIndex, project }) => {
      const file = path.resolve(
        test.info().project.outputDir,
        `state/worker-${parallelIndex}.json`
      );

      if (existsSync(file)) {
        await use(file);
        return;
      }

      const page = await browser.newPage({
        baseURL: project.use.baseURL,
        storageState: undefined,
      });

      await page.goto("/registration");
      await page.getByLabel("E-mail").fill(`player+${workerSeed}@example.com`);
      await page.getByLabel("Password").fill("0123456789abcdef");
      await page.getByRole("button", { name: "Register" }).click();
      await page.waitForURL("/account/characters");

      await page.context().storageState({ path: file });
      await page.close();

      await use(file);
    },
    { scope: "worker" },
  ],

  // Read storage state from worker fixture.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Create a new character and save its ID.
  protagonistId: async ({ page }, use) => {
    await page.goto("/account/characters/create");

    await page
      .getByRole("textbox", { name: "Name" })
      .fill(`Player ${Date.now()}`);

    await page.getByRole("button", { name: "Create character" }).click();

    await page.waitForURL(/\/play\/\d+\/stats/);

    const protagonistId = page.url().match(/\/(\d+)\//)?.[1];

    if (!protagonistId) {
      throw new Error("Protagonist ID not found in URL");
    }

    use(protagonistId);
  },
});

export { extendedTest as test };
