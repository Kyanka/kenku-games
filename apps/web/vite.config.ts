import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  envDir: fileURLToPath(new URL("../..", import.meta.url)),
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Проксируем /api/* на сервер — фронт и бэк на одном origin, CORS не нужен
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
