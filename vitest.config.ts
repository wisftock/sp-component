import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";
import { fileURLToPath } from "node:url";

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        // qrcode is an optional external dep; mock it in tests to avoid transform errors
        "qrcode": fileURLToPath(new URL("./src/__mocks__/qrcode.ts", import.meta.url)),
      },
    },
    test: {
      environment: "happy-dom",
      setupFiles: ["./src/test-setup.ts"],
      include: ["src/**/*.test.ts"],
      coverage: {
        provider: "v8",
        include: ["src/components/**/*.ts"],
        exclude: [
          "src/components/**/*.types.ts",
          "src/components/**/*.stories.ts",
        ],
      },
    },
  }),
);
