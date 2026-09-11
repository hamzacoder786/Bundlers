import { defineConfig } from "vite";
import path from "node:path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { authGate, dispatchApiRoute } from "./lib/app-middleware.mjs";

// Vite's own dev-mode infrastructure (HMR client, dependency pre-bundling,
// on-disk module resolution, and the actual library files it imports from
// node_modules, e.g. /node_modules/vite/dist/client/env.mjs) must stay
// reachable without a session. Blocking any of it breaks every page
// silently: Vite injects a <script src="/@vite/client"> tag into every HTML
// response, that script imports further files straight out of
// node_modules, and if any of that 401s the client runtime throws before
// any app code runs — the page loads with a 200 but renders nothing.
// (server.mjs, the production server, never serves any of this, so it
// isn't part of the shared PUBLIC_PATH_PREFIXES list in app-middleware.mjs.)
const DEV_ONLY_PUBLIC_PREFIXES = ["/@vite/", "/@id/", "/@fs/", "/@react-refresh", "/node_modules/"];

export default defineConfig({
  server: {
    host: "127.0.0.1",
  },
  plugins: [
    // @solana/web3.js and @relayprotocol/relay-svm-wallet-adapter (used by
    // src/cross-chain-relay.js) assume a Node-like environment — they call
    // Buffer.from(...) directly, which doesn't exist in a browser and isn't
    // auto-polyfilled by Vite the way older webpack setups did it. Without
    // this, any Solana-signing step in Wallet Wash's cross-chain relay
    // fails at runtime with "Buffer is not defined" (confirmed live: it got
    // through bridging ETH to Solana and detecting the balance, then failed
    // signing the Solana -> ETH bridge-back transaction). Scoped to just
    // Buffer/global — not the full polyfill set — since that's the only gap
    // actually hit.
    nodePolyfills({
      include: ["buffer"],
      globals: { Buffer: true, global: true, process: false },
    }),
    {
      name: "auth-gate",
      configureServer(server) {
        // The real gate: every route not explicitly public requires a valid
        // session, checked on every single request — not just the first
        // page load.
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url || "/", "http://127.0.0.1");
          const ok = await authGate(req, res, url.pathname, DEV_ONLY_PUBLIC_PREFIXES);
          if (ok) next();
        });
      },
    },
    {
      name: "local-rpc-proxy",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === "/admin/market-making" || req.url?.startsWith("/admin/market-making?")) {
            req.url = `/admin/market-making.html${req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}`;
          }
          next();
        });
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url || "/", "http://127.0.0.1");
          const handled = await dispatchApiRoute(req, res, url.pathname);
          if (!handled) next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve("index.html"),
        walletManager: path.resolve("wallet-manager.html"),
        marketMaking: path.resolve("admin/market-making.html"),
        login: path.resolve("login.html"),
      },
    },
  },
});
