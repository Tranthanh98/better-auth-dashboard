import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// BASE_PATH for Express adapter (e.g., "/admin")
// When building for adapter, assets will be prefixed with this path
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
