import { betterAuthAdmin } from "better-auth-admin";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import "dotenv/config";
import express, { type RequestHandler } from "express";
import { auth } from "./auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount Better Auth handler on all /api/auth/* routes
// Express 5 uses :splat* syntax for wildcards
app.all("/api/auth/*splat", toNodeHandler(auth));

// Mount Better Auth Admin Dashboard at /admin
app.use(
  "/admin",
  betterAuthAdmin({
    authUrl: `http://localhost:${PORT}`,
  }) as unknown as RequestHandler
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Auth API available at http://localhost:${PORT}/api/auth`);
  console.log(`🎛️  Admin Dashboard at http://localhost:${PORT}/admin`);
});
