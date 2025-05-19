import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: "./src/testing/setup.ts",
    include: ["./src/**/*.test.{ts,tsx}"],
  },
});
