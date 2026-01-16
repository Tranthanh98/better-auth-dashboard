import type { Config } from "@react-router/dev/config";

// SPA mode config for Express adapter
// This outputs a static index.html that can be served by any static file server
export default {
  ssr: false,
  buildDirectory: "build-spa",
} satisfies Config;
