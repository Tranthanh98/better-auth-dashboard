import type { Config } from "@react-router/dev/config";

// SPA_MODE=true for Express adapter build (outputs static index.html)
// Default: SSR mode for standalone deployment
const isSpaMode = process.env.SPA_MODE === "true";

// BASE_PATH for Express adapter (e.g., "/admin")
const basePath = process.env.BASE_PATH || (isSpaMode ? "/admin" : "/");

export default {
  ssr: !isSpaMode,
  // Use different build directory for SPA mode
  ...(isSpaMode && { buildDirectory: "build-spa" }),
  // Set basename for routing (only for SPA mode)
  basename: basePath,
} satisfies Config;
