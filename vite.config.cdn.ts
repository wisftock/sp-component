import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "SpComponent",
      formats: ["iife"],
      fileName: () => "sp-component.min.js",
    },
    outDir: "dist-cdn",
    emptyOutDir: true,
    rollupOptions: {
      // Bundle everything including Lit — no external deps for CDN
      external: [],
    },
    minify: "terser",
    sourcemap: false,
  },
});
