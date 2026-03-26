import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // Allow Vite to serve files from the parent directory (src/, tokens.css)
    fs: { allow: [".."] },
  },
});
