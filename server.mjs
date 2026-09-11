/**
 * Standalone production server.
 *
 * Why this exists: `vite.config.js`'s plugins register all backend routes
 * (login/session auth, the /rpc proxy, the wallet vault API) through
 * Vite's `configureServer` hook — which only runs inside Vite's own dev
 * server process (`vite dev`). It is never invoked for `vite build` output
 * and there is no equivalent hook wired up for `vite preview` either. That
 * means a plain `npm run build` + serving the resulting dist/ folder with
 * nginx, `serve`, or any other static file server has ZERO backend: no
 * login, no /rpc, no wallet API — every one of those calls 404s, which is
 * exactly what surfaced as "Unexpected token '<' ... not valid JSON" on
 * 212.224.88.254 (a 404 HTML page returned where JSON was expected).
 *
 * This file is the real fix: one plain Node process that serves the built
 * dist/ static files AND the same auth/rpc/wallet-vault routes, using the
 * exact same handler functions vite.config.js uses in dev
 * (lib/app-middleware.mjs) — so behavior is identical in dev and prod, and
 * there's only one place that route logic is ever written.
 *
 * Usage:
 *   npm run build                 # produces dist/
 *   node server.mjs
 *   # or: npm run serve
 *
 * Configure the port with PORT in .env.local (default 3000). Put a real
 * reverse proxy (nginx, Caddy) in front of this for TLS in production if
 * needed — this server itself just needs to keep running (e.g. under pm2
 * or systemd) so /api/* and /rpc actually exist.
 *
 * .env.local is loaded below by hand (loadEnvFile), not via Node's
 * --env-file flag — that flag needs Node 20.6+, and process managers like
 * pm2 (or an older Node already installed on a given server) don't always
 * make it easy to pass CLI flags through, so `node server.mjs` alone works
 * on any reasonably modern Node version without depending on how it's
 * launched.
 */

import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

// .env.local must be loaded before lib/app-middleware.mjs (and everything
// it imports — auth.mjs, db.mjs, wallet-vault.mjs) is ever imported: those
// modules read MONGODB_URI/SESSION_SECRET/WALLET_ENCRYPTION_KEY/etc. at
// module top level, and ESM static imports are hoisted above the rest of
// this file's own code — so a plain top-of-file `import { ... } from
// "./lib/app-middleware.mjs"` would run before loadEnvFile() below ever
// executes, silently capturing `undefined` for every one of those values.
// Loading env synchronously first, then importing app-middleware
// dynamically (after it's populated), avoids that ordering trap entirely.
loadEnvFile(resolve(".env.local"));
const { authGate, dispatchApiRoute } = await import("./lib/app-middleware.mjs");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Never overwrite a value already set in the real environment (e.g. by
    // pm2's own env config, or `PORT=4000 node server.mjs`) — .env.local is
    // a fallback default, not an override.
    if (!(key in process.env)) process.env[key] = value;
  }
}

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const DIST_DIR = resolve("dist");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

// Multi-page app: each of these is a real build entry (see
// vite.config.js's rollupOptions.input) and should be served for its own
// directory-style path too (e.g. /admin/market-making -> the built HTML).
const PAGE_ALIASES = {
  "/": "/index.html",
  "/wallet-manager": "/wallet-manager.html",
  "/admin/market-making": "/admin/market-making.html",
  "/login": "/login.html",
};

if (!existsSync(DIST_DIR)) {
  console.error(`dist/ not found at ${DIST_DIR} — run "npm run build" first.`);
  process.exit(1);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    let pathname = decodeURIComponent(url.pathname);

    // 1. Session gate FIRST, before any route dispatch — this order matters
    // and getting it backwards is a real vulnerability, not a style choice.
    // Several handlers in app-middleware.mjs (handleRpc, handleSolanaRpc,
    // handleRelayProxy, handleManagedWalletRequest) have no auth check of
    // their own; they were written assuming the caller already gated the
    // request, which is exactly what vite.config.js's dev-mode plugin order
    // does (auth-gate plugin registered before local-rpc-proxy). This file
    // used to dispatch API routes BEFORE the gate, which meant every one of
    // those unguarded handlers — including a proxy that can spend your
    // Alchemy/Helius/Relay API quota, and /api/managed-wallets, which can
    // move funds — was reachable by anyone, no session required, on any
    // server actually running this file. Confirmed live: an unauthenticated
    // curl to /api/solana-rpc returned a real 200 with real RPC data before
    // this fix.
    const ok = await authGate(req, res, pathname, []);
    if (!ok) return;

    // 2. API / auth / rpc routes, now behind the gate.
    const handled = await dispatchApiRoute(req, res, pathname);
    if (handled) return;

    // 3. Static file serving from dist/.
    if (pathname in PAGE_ALIASES) pathname = PAGE_ALIASES[pathname];
    serveStatic(pathname, res);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: error.message || "Internal server error." }));
  }
});

function serveStatic(pathname, res) {
  // Prevent path traversal outside dist/.
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(DIST_DIR, safePath);
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 400;
    res.end("Bad request.");
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return streamFile(filePath, res);
  }

  // SPA-style fallback for any unknown path is deliberately NOT used here
  // (this is a multi-page app, not a client-routed SPA) — unknown paths
  // are a real 404 instead of silently serving index.html.
  res.statusCode = 404;
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.end("Not found.");
}

function streamFile(filePath, res) {
  const type = MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("content-type", type);
  // Built assets are content-hashed by Vite (e.g. /assets/main.abc123.js)
  // and safe to cache hard; HTML entry points are not hashed and should
  // always be revalidated so a redeploy is picked up immediately.
  res.setHeader("cache-control", filePath.endsWith(".html") ? "no-cache" : "public, max-age=31536000, immutable");
  createReadStream(filePath).pipe(res);
}

server.listen(PORT, HOST, () => {
  console.log(`Production server listening on http://${HOST}:${PORT} (serving ${DIST_DIR})`);
});
