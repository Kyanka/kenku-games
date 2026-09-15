import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Подтягиваем .env из корня монорепы (там VITE_API_URL)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: resolve(__dirname, "../../"),
});
