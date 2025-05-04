import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: "./public/manifest.json",
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {},
    },
    sourcemap: true,
    minify: false,
  },
});
