import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    dts({
      tsConfigFilePath: "./tsconfig.build.json",
      rollupTypes: false,
      exclude: ["**/*.test.ts", "**/*.stories.ts", "**/storys/**"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^lit/, /^@lit/],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
    cssCodeSplit: true,
  },
});
