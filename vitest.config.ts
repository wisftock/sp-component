import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "happy-dom",
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
