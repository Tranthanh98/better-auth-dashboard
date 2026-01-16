import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import * as schema from "./schema.js";

// Get database path from environment
const dbPath = process.env.DATABASE_URL || "./data/auth.db";

// Ensure the directory exists
const dbDir = dirname(dbPath);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// Create SQLite database connection
const sqlite = new Database(dbPath);

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");

// Create Drizzle instance with schema
export const db = drizzle(sqlite, { schema });

// Export schema for use in other modules
export { schema };
