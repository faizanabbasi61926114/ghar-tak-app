const fs = require("fs");
const path = require("path");

// Expo only reads .env files inside the app directory; this monorepo keeps a
// single shared .env at the workspace root.
const envPath = path.resolve(__dirname, "../../../.env");

if (fs.existsSync(envPath)) {
  try {
    process.loadEnvFile(envPath);
  } catch (err) {
    console.warn(`Could not load ${envPath}: ${err.message}`);
  }
}
