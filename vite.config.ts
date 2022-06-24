import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { WebWorkerPlugin } from "@shopify/web-worker/webpack";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      lib: resolve(__dirname, "src/lib"),
      routes: resolve(__dirname, "src/routes"),
      idb: "https://cdn.jsdelivr.net/npm/idb@7/+esm",
    },
  },
});
