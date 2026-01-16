import { cpSync, existsSync, rmSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = join(__dirname, "../../../client/build-spa/client");
const destination = join(__dirname, "../client");

// Remove existing client folder
if (existsSync(destination)) {
  rmSync(destination, { recursive: true, force: true });
  console.log("Removed existing client folder");
}

// Copy new client build
cpSync(source, destination, { recursive: true });
console.log(`Copied client build to ${destination}`);
