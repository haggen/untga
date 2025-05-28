import { FullConfig } from "@playwright/test";
import { rmSync } from "fs";
import path from "path";

async function globalTeardown(config: FullConfig) {
  const stateDir = path.resolve(config.projects[0].outputDir, "state");
  rmSync(stateDir, { recursive: true, force: true });
}

export default globalTeardown;
