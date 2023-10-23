import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
  },
  plugins: [reactRefresh()],
});
