/* eslint-disable react-hooks/rules-of-hooks */

import { test } from "@playwright/test";
import { existsSync } from "fs";
import path from "path";

export const authenticatedTest = test.extend<
  object,
  { workerStorageState: string }
>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [
    async ({ browser }, use, { parallelIndex, project }) => {
      const state = path.resolve(
        test.info().project.outputDir,
        `state/${parallelIndex}.json`
      );

      if (existsSync(state)) {
        await use(state);
        return;
      }

      const page = await browser.newPage({
        baseURL: project.use.baseURL,
        storageState: undefined,
      });

      await page.goto("/registration");
      await page
        .getByLabel("E-mail")
        .fill(`player+${parallelIndex}@example.com`);
      await page.getByLabel("Password").fill("0123456789abcdef");
      await page.getByRole("button", { name: "Register" }).click();
      await page.waitForURL("/account/characters");

      await page.context().storageState({ path: state });
      await page.close();

      await use(state);
    },

    { scope: "worker" },
  ],
});
