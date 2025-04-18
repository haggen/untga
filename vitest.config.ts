import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Test should fail if there are type issues.
    // typecheck: {
    //   enabled: true,
    // },
    setupFiles: "./src/testing/setup.ts",
  },
});
