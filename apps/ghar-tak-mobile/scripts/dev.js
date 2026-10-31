require("./load-env");

const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const replitDomain = process.env.REPLIT_DEV_DOMAIN;
// The workspace .env PORT belongs to the web app, not Expo.
const port = process.env.EXPO_PORT || "8081";

function lanAddress() {
  const candidates = [];
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const net of nets ?? []) {
      if (net.family === "IPv4" && !net.internal) candidates.push(net.address);
    }
  }
  // Skip virtual adapters (WSL/Docker use 172.x) and keep the usual LAN ranges first.
  return candidates.find((ip) => /^(192\.168\.|10\.)/.test(ip)) ?? candidates[0] ?? "localhost";
}

const lanIp = lanAddress();
const host = replitDomain || lanIp;

process.env.EXPO_PUBLIC_DOMAIN = replitDomain || `${lanIp}:${port}`;
process.env.EXPO_PUBLIC_REPL_ID = process.env.REPL_ID || "local";
process.env.REACT_NATIVE_PACKAGER_HOSTNAME = host;
if (process.env.REPLIT_EXPO_DEV_DOMAIN) {
  process.env.EXPO_PACKAGER_PROXY_URL = `https://${process.env.REPLIT_EXPO_DEV_DOMAIN}`;
}

const extraArgs = process.argv.slice(2).filter((arg) => arg !== "--");
const cli = path.resolve(__dirname, "../node_modules/expo/bin/cli");

const args = [cli, "start", "--port", port, ...extraArgs];
// Replit exposes the packager through HTTPS, so Metro must bind to localhost there.
if (replitDomain) args.push("--localhost");

const child = spawn(process.execPath, args, {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
