// Script to copy built client to express-adapter package
import { cpSync, existsSync, mkdirSync, rmSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, "..", "build", "client");
const targetDir = join(
  __dirname,
  "..",
  "..",
  "packages",
  "express-adapter",
  "client"
);

console.log("📦 Copying client build to express-adapter...");
console.log(`   Source: ${sourceDir}`);
console.log(`   Target: ${targetDir}`);

if (!existsSync(sourceDir)) {
  console.error("❌ Source directory does not exist. Run 'pnpm build' first.");
  process.exit(1);
}

// Remove existing target directory
if (existsSync(targetDir)) {
  rmSync(targetDir, { recursive: true });
}

// Create target directory
mkdirSync(targetDir, { recursive: true });

// Copy files
cpSync(sourceDir, targetDir, { recursive: true });

console.log("✅ Client build copied successfully!");
