import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/product-review-api": {
        target: "https://fastapi-mongodb-production-34a8.up.railway.app/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/product-review-api/, ""),
      },
    },
  },
});
