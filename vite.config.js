import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      "/product-review-api": {
        target: "http://34.101.77.135:8000/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/product-review-api/, ""),
      },
    },
  },
});
