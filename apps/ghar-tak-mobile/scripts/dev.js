require("./load-env");

const path = require("path");
const { spawn } = require("child_process");

const replitDomain = process.env.REPLIT_DEV_DOMAIN;
// The workspace .env PORT belongs to the web app, not Expo.
const port = process.env.EXPO_PORT || "8081";

process.env.EXPO_PUBLIC_DOMAIN = replitDomain || `localhost:${port}`;
process.env.EXPO_PUBLIC_REPL_ID = process.env.REPL_ID || "local";
process.env.REACT_NATIVE_PACKAGER_HOSTNAME = replitDomain || "localhost";
if (process.env.REPLIT_EXPO_DEV_DOMAIN) {
  process.env.EXPO_PACKAGER_PROXY_URL = `https://${process.env.REPLIT_EXPO_DEV_DOMAIN}`;
}

const extraArgs = process.argv.slice(2).filter((arg) => arg !== "--");
const cli = path.resolve(__dirname, "../node_modules/expo/bin/cli");

const child = spawn(process.execPath, [cli, "start", "--localhost", "--port", port, ...extraArgs], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
