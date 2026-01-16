import { Router, static as expressStatic } from "express";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Configuration options for Better Auth Admin Dashboard
 */
export interface BetterAuthAdminOptions {
  /**
   * The base URL of your Better Auth server
   * @example "http://localhost:3000" or "https://api.example.com"
   */
  authUrl: string;

  /**
   * Optional title for the admin dashboard
   * @default "Better Auth Admin"
   */
  title?: string;
}

/**
 * Runtime configuration injected into the client
 */
interface RuntimeConfig {
  authUrl: string;
  title?: string;
}

/**
 * Creates an Express router that serves the Better Auth Admin Dashboard
 *
 * **Important:** The dashboard must be mounted at `/admin` path.
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { betterAuthAdmin } from 'better-auth-admin';
 *
 * const app = express();
 *
 * // Mount admin dashboard at /admin (required)
 * app.use('/admin', betterAuthAdmin({
 *   authUrl: 'http://localhost:3000',
 * }));
 *
 * app.listen(8080);
 * ```
 */
export function betterAuthAdmin(options: BetterAuthAdminOptions): Router {
  const router = Router();

  // Resolve client directory path
  const clientPath = join(__dirname, "..", "client");

  // Runtime config to inject
  const runtimeConfig: RuntimeConfig = {
    authUrl: options.authUrl,
    title: options.title,
  };

  const configScript = `<script>window.__BETTER_AUTH_ADMIN__ = ${JSON.stringify(
    runtimeConfig
  )};</script>`;

  // Cache the modified index.html
  let cachedIndexHtml: string | null = null;

  const getIndexHtml = (): string => {
    if (cachedIndexHtml) {
      return cachedIndexHtml;
    }

    try {
      const indexPath = join(clientPath, "index.html");
      let html = readFileSync(indexPath, "utf-8");

      // Build already has correct /admin/ prefix in asset paths and basename
      // Just inject runtime config before closing </head> tag
      html = html.replace("</head>", `${configScript}</head>`);

      cachedIndexHtml = html;
      return html;
    } catch (error) {
      console.error("[better-auth-admin] Failed to read index.html:", error);
      return `<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body>
<h1>Better Auth Admin</h1>
<p>Failed to load admin dashboard. Make sure the client is built.</p>
</body>
</html>`;
    }
  };

  // Serve static assets (js, css, images, etc.)
  router.use(
    expressStatic(clientPath, {
      index: false, // Don't serve index.html automatically
      maxAge: "1d", // Cache static assets
    })
  );

  // SPA fallback - serve modified index.html for all routes
  // Using "{*splat}" syntax for Express 5 compatibility
  router.get("/{*splat}", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.send(getIndexHtml());
  });

  return router;
}

// Default export for convenience
export default betterAuthAdmin;
