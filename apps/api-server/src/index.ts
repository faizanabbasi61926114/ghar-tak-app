import "dotenv/config";
import app from "./app";
import { logger } from "./lib/logger";

// API_PORT, or PORT where the host sets that (most container platforms do). In development
// .env holds both: PORT is the website's, so API_PORT comes first.
const rawPort = process.env["API_PORT"] || process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "API_PORT (or PORT) environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
