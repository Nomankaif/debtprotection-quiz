// debtprotection-quiz/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/quiz/",
  server: {
    proxy: {
      "/quiz/api": {
        target: "http://localhost:5012",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
