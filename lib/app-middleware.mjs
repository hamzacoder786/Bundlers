/**
 * All backend routes (auth, RPC proxy, wallet vault, managed wallets) as
 * framework-agnostic (req, res) handlers, shared between:
 *   - vite.config.js's dev-server plugins (via server.middlewares.use)
 *   - server.mjs, the standalone production server that runs against the
 *     built dist/ folder (plain Node http, no Vite involved)
 *
 * This file used to be inlined directly in vite.config.js. It was pulled
 * out because that inlining meant every one of these routes only existed
 * while Vite's own dev server process was running `vite dev` — the exact
 * same `configureServer` hook is never invoked for `vite build` output or
 * `vite preview`, so a `dist/` folder served by a plain static file server
 * (nginx, `serve`, etc.) had a login page and app that called into these
 * routes and got nothing back — real backend routes, purely dev-only.
 */

import { Contract, JsonRpcProvider, Wallet, ethers } from "ethers";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseMarketMakingLabel, walletEligibility } from "./market-making-service.mjs";
import {
  login as authLogin,
  logout as authLogout,
  register as authRegister,
  getSessionFromRequest,
  getTokenFromRequest,
  sessionCookieHeader,
} from "./auth.mjs";
import {
  generateAndSaveWallets,
  generateAndSaveSolanaWallets,
  listWallets,
  deleteWallet,
  savePrivateKeys,
  savePrivateKeysSolana,
} from "./wallet-vault.mjs";
import {
  TABS,
  ACTIONS,
  SUPER_ADMIN_ROLE,
  listRoles,
  saveRole,
  deleteRole,
  permissionsForRole,
} from "./roles.mjs";
import {
  listUsers,
  createUser,
  setUserRole,
  resetUserPassword,
  deleteUser,
} from "./users.mjs";
import {
  createProject,
  updateProjectConfig,
  deleteProject,
  listProjectsForUser,
  getProjectForUser,
  listAccessForProject,
  grantAccess,
  revokeAccess,
} from "./projects.mjs";

// Routes servable without a session — the login page itself, its assets,
// and the auth API.
//
// - "/src/login." covers dev mode, where Vite serves login.js straight
//   from source.
// - "/assets/login-" and "/assets/modulepreload-polyfill-" cover the
//   production build (server.mjs): `vite build` bundles login.html's JS
//   and CSS into content-hashed files under dist/assets/ (e.g.
//   assets/login-Cjz__YG7.js, assets/login-DAbpdZGM.css) named after the
//   Vite rollup entry ("login" — see vite.config.js's build.rollupOptions
//   .input), plus a small shared modulepreload-polyfill chunk every page
//   references. Missing this in the initial version of server.mjs is what
//   caused login.html to load with a 200 but render nothing: the page's
//   own script/stylesheet tags all 401'd, so the browser never ran any
//   login code at all.
// (The dev-only Vite infra prefixes, e.g. /@vite/, /node_modules/, are
// added on top of this list by vite.config.js itself, since server.mjs
// never serves any of that.)
export const PUBLIC_PATH_PREFIXES = [
  "/login.html",
  "/src/login.",
  "/api/auth/",
  "/assets/login-",
  "/assets/modulepreload-polyfill-",
];

export function isPublicPath(pathname, extraPrefixes = []) {
  return [...PUBLIC_PATH_PREFIXES, ...extraPrefixes].some((prefix) => pathname.startsWith(prefix));
}

// Reads from .env.local (loaded via `node --env-file=.env.local`, see
// package.json's dev/build/preview/serve scripts). Falls back to the
// placeholder only if LUNCH_RPC_URL is unset, so /rpc fails loudly instead
// of silently forwarding to a dead endpoint.
const ROBINHOOD_RPC = process.env.LUNCH_RPC_URL || "https://robinhood-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY";
// Same reasoning as ROBINHOOD_RPC below: falls back to the public,
// rate-limited endpoint only if SOLANA_RPC_URL is unset in .env.local, so a
// missing key is loud (visible rate-limit/403 behavior) rather than silently
// wrong. Proxied through /api/solana-rpc for the same reason ROBINHOOD_RPC
// is proxied through /rpc — a private RPC key must never be shipped into
// client-side JS where anyone with devtools could read it out.
const SOLANA_RPC = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const ROBINHOOD_CHAIN_ID = 4663n;
const LUNCH_ROUTER = "0xCaf681a66D020601342297493863E78C959E5cb2";
const LUNCH_X_TOKEN = "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73";
const LUNCH_POOL_FEE = 10000;
const ENV_FILE = path.resolve(".env");
const MANAGED_WALLETS_KEY = "MANAGED_WALLETS_JSON";
const TOKEN_ABI = [
  "function allowance(address owner,address spender) view returns(uint256)",
  "function approve(address spender,uint256 amount) returns(bool)",
  "function balanceOf(address account) view returns(uint256)",
  "function decimals() view returns(uint8)",
  "function symbol() view returns(string)",
  "function totalSupply() view returns(uint256)",
];
const LUNCH_ROUTER_ABI = [
  "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)",
];
const WRAPPED_NATIVE_ABI = [
  "function balanceOf(address account) view returns(uint256)",
  "function withdraw(uint256 amount)",
];

// --- Auth routes -----------------------------------------------------------

export async function handleLogin(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST only." });
  try {
    const body = await readJsonBody(req);
    const result = await authLogin(body.username, body.password);
    if (!result.ok) return sendJson(res, 401, { error: result.error });
    res.setHeader("set-cookie", sessionCookieHeader(result.token));
    sendJson(res, 200, { ok: true, username: result.username, role: result.role });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Login failed." });
  }
}

export async function handleRegister(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST only." });
  try {
    const body = await readJsonBody(req);
    const result = await authRegister(body.username, body.password);
    if (!result.ok) return sendJson(res, 400, { error: result.error });
    const loginResult = await authLogin(body.username, body.password);
    if (loginResult.ok) res.setHeader("set-cookie", sessionCookieHeader(loginResult.token));
    sendJson(res, 201, { ok: true, username: result.username, role: result.role });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Registration failed." });
  }
}

export async function handleLogout(req, res) {
  await authLogout(getTokenFromRequest(req));
  res.setHeader("set-cookie", sessionCookieHeader("", { clear: true }));
  sendJson(res, 200, { ok: true });
}

export async function handleSession(req, res) {
  const session = await getSessionFromRequest(req);
  if (!session) return sendJson(res, 200, { authenticated: false });
  // Permissions are resolved live from the roles collection rather than read
  // off the session document, so an admin revoking access takes effect on the
  // user's very next request instead of waiting for them to log out.
  const permissions = await permissionsForRole(session.role);
  sendJson(res, 200, {
    authenticated: true,
    username: session.username,
    role: session.role,
    isSuperAdmin: session.role === SUPER_ADMIN_ROLE,
    permissions: [...permissions],
  });
}

/**
 * Returns the session augmented with a live permission set, or null. Every
 * admin route goes through this rather than trusting session.role directly.
 */
export async function getAuthorizedSession(req) {
  const session = await getSessionFromRequest(req);
  if (!session) return null;
  const permissions = await permissionsForRole(session.role);
  return { ...session, permissions, isSuperAdmin: session.role === SUPER_ADMIN_ROLE };
}

async function requirePermission(req, res, permission) {
  const session = await getAuthorizedSession(req);
  if (!session) {
    sendJson(res, 401, { error: "Sign in required." });
    return null;
  }
  if (!session.permissions.has(permission)) {
    sendJson(res, 403, { error: `You do not have permission to do this (${permission}).` });
    return null;
  }
  return session;
}

/**
 * Resolves and validates the active project for a wallet-vault request. The
 * client sends its selected project as the X-Project-Id header, but that
 * header is never trusted on its own — getProjectForUser re-checks real
 * access on every single call, so a forged/stale header just gets rejected
 * rather than leaking another project's wallets.
 */
async function requireProjectAccess(req, res, session) {
  // Normally the header; the export route is a plain <a>/window.open
  // navigation (no way to attach a custom header to that), so it falls back
  // to a query param instead.
  const projectId = req.headers["x-project-id"] || new URL(req.url || "/", "http://127.0.0.1").searchParams.get("projectId");
  if (!projectId) {
    sendJson(res, 400, { error: "No project selected. Pick a project first." });
    return null;
  }
  try {
    return await getProjectForUser(session, String(projectId));
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Project access check failed." });
    return null;
  }
}

// --- Admin: projects -------------------------------------------------------

export async function handleProjectsRoute(req, res) {
  try {
    const session = await getAuthorizedSession(req);
    if (!session) return sendJson(res, 401, { error: "Sign in required." });

    if (req.method === "GET") {
      sendJson(res, 200, { projects: await listProjectsForUser(session) });
      return;
    }
    // Creating/editing/deleting projects is an admin action, not something
    // every project member can do — otherwise anyone with mere access to a
    // project could repoint its token address or delete it outright.
    if (req.method === "POST") {
      if (!session.permissions.has("projects.manage")) {
        return sendJson(res, 403, { error: "You do not have permission to do this (projects.manage)." });
      }
      const body = await readJsonBody(req);
      if (body.id) {
        sendJson(res, 200, { project: await updateProjectConfig(session, body.id, body) });
      } else {
        sendJson(res, 201, { project: await createProject(session, body) });
      }
      return;
    }
    if (req.method === "DELETE") {
      if (!session.permissions.has("projects.manage")) {
        return sendJson(res, 403, { error: "You do not have permission to do this (projects.manage)." });
      }
      const id = new URL(req.url || "/", "http://127.0.0.1").searchParams.get("id");
      sendJson(res, 200, { removed: await deleteProject(session, id) });
      return;
    }
    sendJson(res, 405, { error: "GET, POST or DELETE only." });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Project request failed." });
  }
}

export async function handleProjectAccessRoute(req, res) {
  try {
    const session = await getAuthorizedSession(req);
    if (!session || !session.permissions.has("projects.manage")) {
      return sendJson(res, session ? 403 : 401, { error: session ? "You do not have permission to do this (projects.manage)." : "Sign in required." });
    }
    const projectId = new URL(req.url || "/", "http://127.0.0.1").searchParams.get("projectId");
    if (!projectId) return sendJson(res, 400, { error: "projectId is required." });

    if (req.method === "GET") {
      sendJson(res, 200, { access: await listAccessForProject(projectId) });
      return;
    }
    if (req.method === "POST") {
      const body = await readJsonBody(req);
      sendJson(res, 200, { granted: await grantAccess(session, projectId, body.username) });
      return;
    }
    if (req.method === "DELETE") {
      const username = new URL(req.url || "/", "http://127.0.0.1").searchParams.get("username");
      const removed = await revokeAccess(projectId, username);
      sendJson(res, removed ? 200 : 404, removed ? { removed: username } : { error: "That user did not have access." });
      return;
    }
    sendJson(res, 405, { error: "GET, POST or DELETE only." });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Project access request failed." });
  }
}

// --- Admin: roles ---------------------------------------------------------

export async function handleRolesRoute(req, res) {
  try {
    if (req.method === "GET") {
      // The catalogue (TABS/ACTIONS) is needed by any user to render their own
      // sidebar, so a plain session is enough to read it; the role list itself
      // still requires roles.manage.
      const session = await getAuthorizedSession(req);
      if (!session) return sendJson(res, 401, { error: "Sign in required." });
      const canManage = session.permissions.has("roles.manage");
      sendJson(res, 200, {
        tabs: TABS,
        actions: ACTIONS,
        roles: canManage ? await listRoles() : [],
        canManage,
      });
      return;
    }
    if (req.method === "POST") {
      const session = await requirePermission(req, res, "roles.manage");
      if (!session) return;
      const body = await readJsonBody(req);
      // A non-super_admin must not create a role more powerful than itself,
      // or they could assign it to a new account and escalate that way.
      if (!session.isSuperAdmin) {
        const escalating = (body.permissions || []).filter((p) => !session.permissions.has(p));
        if (escalating.length > 0) {
          return sendJson(res, 403, { error: `You cannot grant permissions you do not have yourself: ${escalating.join(", ")}` });
        }
      }
      const role = await saveRole(body.name, { description: body.description, permissions: body.permissions || [] });
      sendJson(res, 200, { role });
      return;
    }
    if (req.method === "DELETE") {
      const session = await requirePermission(req, res, "roles.manage");
      if (!session) return;
      const name = new URL(req.url || "/", "http://127.0.0.1").searchParams.get("name");
      const removed = await deleteRole(name);
      sendJson(res, removed ? 200 : 404, removed ? { removed: name } : { error: "Role not found." });
      return;
    }
    sendJson(res, 405, { error: "GET, POST or DELETE only." });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Role request failed." });
  }
}

// --- Admin: users ---------------------------------------------------------

export async function handleUsersRoute(req, res) {
  try {
    const session = await requirePermission(req, res, "users.manage");
    if (!session) return;

    if (req.method === "GET") {
      sendJson(res, 200, { users: await listUsers(), actingAs: session.username });
      return;
    }
    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const created = await createUser(session, body);
      sendJson(res, 201, { user: created });
      return;
    }
    if (req.method === "PATCH") {
      const body = await readJsonBody(req);
      if (body.role !== undefined) {
        sendJson(res, 200, { user: await setUserRole(session, body.username, body.role) });
        return;
      }
      if (body.password !== undefined) {
        sendJson(res, 200, { user: await resetUserPassword(session, body.username, body.password) });
        return;
      }
      sendJson(res, 400, { error: "Provide either a new role or a new password." });
      return;
    }
    if (req.method === "DELETE") {
      const username = new URL(req.url || "/", "http://127.0.0.1").searchParams.get("username");
      sendJson(res, 200, { user: await deleteUser(session, username) });
      return;
    }
    sendJson(res, 405, { error: "GET, POST, PATCH or DELETE only." });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "User request failed." });
  }
}

// The real gate: every route not explicitly public requires a valid
// session, checked on every single request — not just the first page
// load. An HTML navigation without a session is redirected to the login
// page; anything else (JS modules, /rpc, /api/*) gets a plain 401 so the
// app's own fetch calls fail loudly instead of silently receiving a login
// page as if it were data.
export async function authGate(req, res, pathname, extraPublicPrefixes = []) {
  if (isPublicPath(pathname, extraPublicPrefixes)) return true;
  try {
    if (await getSessionFromRequest(req)) return true;
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Auth check failed." });
    return false;
  }

  const acceptsHtml = (req.headers.accept || "").includes("text/html");
  if (req.method === "GET" && acceptsHtml) {
    res.statusCode = 302;
    res.setHeader("location", `/login.html?next=${encodeURIComponent(pathname)}`);
    res.end();
    return false;
  }
  sendJson(res, 401, { error: "Sign in required." });
  return false;
}

// --- RPC proxy ---------------------------------------------------------

export async function handleRpc(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("RPC proxy only accepts POST requests.");
    return;
  }

  try {
    const body = await readRequestBody(req);
    const upstream = await fetch(ROBINHOOD_RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    const text = await upstream.text();

    res.statusCode = upstream.status;
    res.setHeader("content-type", upstream.headers.get("content-type") || "application/json");
    res.end(text);
  } catch (error) {
    res.statusCode = 502;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: error.message || "RPC proxy failed" }));
  }
}

// Same shape as handleRpc above, pointed at Solana instead of Robinhood
// Chain — used by Wallet Wash's cross-chain relay (the Connection object in
// src/cross-chain-relay.js hits this instead of a hardcoded/typed-in Solana
// RPC URL, so the real Helius key stays server-side).
export async function handleSolanaRpc(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Solana RPC proxy only accepts POST requests.");
    return;
  }
  try {
    const body = await readRequestBody(req);
    const upstream = await fetch(SOLANA_RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    const text = await upstream.text();
    res.statusCode = upstream.status;
    res.setHeader("content-type", upstream.headers.get("content-type") || "application/json");
    res.end(text);
  } catch (error) {
    res.statusCode = 502;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: error.message || "Solana RPC proxy failed" }));
  }
}

// --- Relay Protocol proxy (cross-chain bridge, used by Wallet Wash's
// optional Solana relay hop) ---------------------------------------------
//
// RELAY_API_KEY must never reach the browser — the Relay SDK running in
// src/cross-chain-relay.js is configured with baseApiUrl pointed at this
// proxy (not at api.relay.link directly), so every quote/status/execute
// call the SDK makes lands here first. This handler attaches the real key
// server-side before forwarding to the real Relay API, exactly the same
// pattern as the /rpc proxy above for the chain RPC URL/key.
const RELAY_API_BASE = "https://api.relay.link";

export async function handleRelayProxy(req, res, pathname) {
  const apiKey = process.env.RELAY_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, { error: "RELAY_API_KEY is not set. Add it to .env.local (see .env.example) to use the cross-chain relay." });
    return;
  }
  try {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const targetPath = pathname.replace(/^\/api\/relay/, "");
    const upstreamUrl = `${RELAY_API_BASE}${targetPath}${url.search}`;
    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const body = hasBody ? await readRequestBody(req) : undefined;
    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body,
    });
    const text = await upstream.text();
    res.statusCode = upstream.status;
    res.setHeader("content-type", upstream.headers.get("content-type") || "application/json");
    res.end(text);
  } catch (error) {
    res.statusCode = 502;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: error.message || "Relay proxy failed" }));
  }
}

// --- Wallet vault routes -------------------------------------------------

export async function handleWalletsGenerate(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST only." });
  try {
    const session = await requirePermission(req, res, "wallets.generate");
    if (!session) return;
    const project = await requireProjectAccess(req, res, session);
    if (!project) return;
    const body = await readJsonBody(req);
    const opts = { label: body.label, createdBy: session.username, projectId: project.id, category: body.category };
    const created = body.chain === "solana"
      ? await generateAndSaveSolanaWallets(body.count, opts)
      : await generateAndSaveWallets(body.count, opts);
    sendJson(res, 201, { wallets: created });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Wallet generation failed." });
  }
}

// Saves wallets that already exist (private keys generated client-side,
// e.g. Wallet Wash's per-run relay wallets) rather than generating new
// ones — same encrypted vault as /api/wallets/generate, listable/
// revealable/deletable from the Disperse tab the same way. Used so relay
// dust is recoverable later instead of only appearing once in a run's log.
// body.chain: "solana" saves base58 Solana secret keys; anything else
// (default) saves EVM private keys.
export async function handleWalletsSave(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST only." });
  try {
    const session = await getAuthorizedSession(req);
    if (!session) return sendJson(res, 401, { error: "Sign in required." });
    const project = await requireProjectAccess(req, res, session);
    if (!project) return;
    const body = await readJsonBody(req);
    const privateKeys = Array.isArray(body.privateKeys) ? body.privateKeys : [];
    const opts = { label: body.label, createdBy: session.username, projectId: project.id, category: body.category };
    const saved = body.chain === "solana"
      ? await savePrivateKeysSolana(privateKeys, opts)
      : await savePrivateKeys(privateKeys, opts);
    sendJson(res, 201, { wallets: saved });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Wallet save failed." });
  }
}

export async function handleWalletsExport(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "GET only." });
  try {
    // Exporting dumps every private key to a file — gate it, otherwise the
    // role system is cosmetic and any signed-in user could just hit this URL.
    const session = await requirePermission(req, res, "wallets.export");
    if (!session) return;
    const project = await requireProjectAccess(req, res, session);
    if (!project) return;
    const wallets = await listWallets({ includePrivateKeys: true, projectId: project.id });
    const format = new URL(req.url || "/", "http://127.0.0.1").searchParams.get("format") || "json";
    if (format === "csv") {
      const header = "address,privateKey,label,createdAt\n";
      const rows = wallets.map((w) => `${w.address},${w.privateKey},${w.label || ""},${new Date(w.createdAt).toISOString()}`).join("\n");
      res.statusCode = 200;
      res.setHeader("content-type", "text/csv");
      res.setHeader("content-disposition", `attachment; filename="wallets-${Date.now()}.csv"`);
      res.end(header + rows);
      return;
    }
    res.statusCode = 200;
    res.setHeader("content-type", "application/json");
    res.setHeader("content-disposition", `attachment; filename="wallets-${Date.now()}.json"`);
    res.end(JSON.stringify({ exportedAt: new Date().toISOString(), wallets }, null, 2));
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Wallet export failed." });
  }
}

export async function handleWallets(req, res) {
  try {
    const session = await getAuthorizedSession(req);
    if (!session) return sendJson(res, 401, { error: "Sign in required." });

    if (req.method === "GET") {
      const params = new URL(req.url || "/", "http://127.0.0.1").searchParams;
      const includePrivateKeys = params.get("reveal") === "1";
      // Listing addresses is harmless; revealing keys is not, so only the
      // reveal path requires the permission.
      if (includePrivateKeys && !session.permissions.has("wallets.reveal")) {
        return sendJson(res, 403, { error: "You do not have permission to do this (wallets.reveal)." });
      }
      const project = await requireProjectAccess(req, res, session);
      if (!project) return;
      const chain = params.get("chain") || undefined; // "evm" | "solana" | unset (all)
      const category = params.get("category") || undefined;
      const wallets = await listWallets({ includePrivateKeys, chain, category, projectId: project.id });
      sendJson(res, 200, { wallets });
      return;
    }
    if (req.method === "DELETE") {
      if (!session.permissions.has("wallets.delete")) {
        return sendJson(res, 403, { error: "You do not have permission to do this (wallets.delete)." });
      }
      const project = await requireProjectAccess(req, res, session);
      if (!project) return;
      const address = new URL(req.url || "/", "http://127.0.0.1").searchParams.get("address");
      // Accept either an EVM address (0x...) or a Solana base58 address —
      // deleteWallet matches on the stored addressLower either way, so no
      // format-specific validation is needed beyond "non-empty string".
      if (!address) throw httpError(400, "Invalid wallet address.");
      const removed = await deleteWallet(project.id, address);
      sendJson(res, removed ? 200 : 404, removed ? { removed: address } : { error: "Wallet not found." });
      return;
    }
    sendJson(res, 405, { error: "GET or DELETE only." });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Wallet request failed." });
  }
}

export async function handleCommandCenterWallets(req, res) {
  try {
    const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
    const labelPrefix = requestUrl.searchParams.get("labelPrefix");
    if (!["MM", "MN"].includes(labelPrefix)) throw httpError(400, "labelPrefix must be MM or MN.");
    const wallets = await loadManagedWallets();
    sendJson(res, 200, {
      wallets: wallets.map(publicWallet).filter((wallet) => parseMarketMakingLabel(wallet.label)?.prefix === labelPrefix)
        .map((wallet) => ({ ...wallet, eligibility: walletEligibility(wallet, { projectId: "local", chainId: 4663, labelPrefix }) })),
    });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message });
  }
}

export async function handleManagedWalletRequest(req, res) {
  try {
    const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
    const segments = requestUrl.pathname.split("/").filter(Boolean).slice(2); // drop "api","managed-wallets"

    if (req.method === "GET" && segments.length === 0) {
      const wallets = await loadManagedWallets();
      sendJson(res, 200, { wallets: wallets.map(publicWallet) });
      return;
    }

    if (req.method === "POST" && segments.length === 0) {
      const body = await readJsonBody(req);
      const label = String(body.label || "").trim();
      const privateKey = normalizePrivateKey(body.privateKey);
      if (!label || label.length > 48) throw httpError(400, "Wallet label must be between 1 and 48 characters.");
      const wallet = new Wallet(privateKey);
      const wallets = await loadManagedWallets();
      if (wallets.some((item) => new Wallet(item.privateKey).address.toLowerCase() === wallet.address.toLowerCase())) {
        throw httpError(409, `Wallet ${wallet.address} is already saved.`);
      }
      wallets.push({
        id: `wallet_${wallet.address.toLowerCase()}`,
        label, privateKey, projectId: "local", chainId: 4663,
        enabled: true, archived: false, watchOnly: false, signerAvailable: true,
        emergencyPaused: false, reservedBalance: "0", pendingTransaction: false,
        lastExecutionTime: null, strategyAssignments: {},
      });
      await saveManagedWallets(wallets);
      sendJson(res, 201, { wallet: publicWallet(wallets.at(-1)) });
      return;
    }

    if (req.method === "DELETE" && segments.length === 1) {
      const address = segments[0];
      if (!ethers.isAddress(address)) throw httpError(400, "Invalid wallet address.");
      const wallets = await loadManagedWallets();
      const filtered = wallets.filter((item) => new Wallet(item.privateKey).address.toLowerCase() !== address.toLowerCase());
      if (filtered.length === wallets.length) throw httpError(404, "Managed wallet not found.");
      await saveManagedWallets(filtered);
      sendJson(res, 200, { removed: address });
      return;
    }

    if (req.method === "POST" && segments[0] === "trade" && segments.length === 1) {
      const body = await readJsonBody(req);
      const result = await executeManagedTrade(body);
      sendJson(res, 200, result);
      return;
    }

    sendJson(res, 404, { error: "Wallet manager endpoint not found." });
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Wallet manager request failed." });
  }
}

async function executeManagedTrade(body) {
  const address = String(body.address || "");
  const tokenAddress = String(body.tokenAddress || "");
  const side = String(body.side || "").toLowerCase();
  if (!ethers.isAddress(address)) throw httpError(400, "Invalid managed wallet address.");
  if (!ethers.isAddress(tokenAddress)) throw httpError(400, "Invalid token address.");
  if (side !== "buy" && side !== "sell") throw httpError(400, "Trade side must be buy or sell.");

  const wallets = await loadManagedWallets();
  const saved = wallets.find((item) => new Wallet(item.privateKey).address.toLowerCase() === address.toLowerCase());
  if (!saved) throw httpError(404, "Managed wallet not found.");

  const provider = new JsonRpcProvider(ROBINHOOD_RPC, { chainId: Number(ROBINHOOD_CHAIN_ID), name: "robinhood" }, { staticNetwork: true });
  const wallet = new Wallet(saved.privateKey, provider);
  const token = new Contract(tokenAddress, TOKEN_ABI, wallet);
  const router = new Contract(LUNCH_ROUTER, LUNCH_ROUTER_ABI, wallet);
  const decimals = await token.decimals();

  if (side === "buy") {
    const amountIn = parsePositiveEther(body.amount, "Buy amount");
    const minOut = parseNonnegativeUnits(body.minimumOutput, decimals, "Minimum token output");
    const params = {
      tokenIn: LUNCH_X_TOKEN,
      tokenOut: tokenAddress,
      fee: LUNCH_POOL_FEE,
      recipient: wallet.address,
      amountIn,
      amountOutMinimum: minOut,
      sqrtPriceLimitX96: 0n,
    };
    const quote = await router.exactInputSingle.staticCall(params, { value: amountIn });
    const gas = await router.exactInputSingle.estimateGas(params, { value: amountIn });
    const tx = await router.exactInputSingle(params, { value: amountIn, gasLimit: (gas * 125n) / 100n });
    const receipt = await tx.wait();
    if (receipt.status !== 1) throw new Error("Buy transaction reverted.");
    return {
      side,
      hash: tx.hash,
      blockNumber: receipt.blockNumber,
      quotedOutput: ethers.formatUnits(quote, decimals),
    };
  }

  const tokenBalance = await token.balanceOf(wallet.address);
  const amountIn = String(body.amount || "").trim().toLowerCase() === "all"
    ? tokenBalance
    : parsePositiveUnits(body.amount, decimals, "Sell amount");
  if (amountIn <= 0n || amountIn > tokenBalance) throw httpError(400, "Sell amount exceeds the wallet token balance.");
  const minOut = parseNonnegativeUnits(body.minimumOutput, 18, "Minimum ETH output");
  const allowance = await token.allowance(wallet.address, LUNCH_ROUTER);
  let approvalHash = "";
  if (allowance < amountIn) {
    const approval = await token.approve(LUNCH_ROUTER, amountIn);
    approvalHash = approval.hash;
    const approvalReceipt = await approval.wait();
    if (approvalReceipt.status !== 1) throw new Error("Token approval reverted.");
  }
  const params = {
    tokenIn: tokenAddress,
    tokenOut: LUNCH_X_TOKEN,
    fee: LUNCH_POOL_FEE,
    recipient: wallet.address,
    amountIn,
    amountOutMinimum: minOut,
    sqrtPriceLimitX96: 0n,
  };
  const wrapped = new Contract(LUNCH_X_TOKEN, WRAPPED_NATIVE_ABI, wallet);
  const wrappedBefore = await wrapped.balanceOf(wallet.address);
  const quote = await router.exactInputSingle.staticCall(params);
  const gas = await router.exactInputSingle.estimateGas(params);
  const tx = await router.exactInputSingle(params, { gasLimit: (gas * 125n) / 100n });
  const receipt = await tx.wait();
  if (receipt.status !== 1) throw new Error("Sell transaction reverted.");

  const wrappedAfter = await wrapped.balanceOf(wallet.address);
  const wrappedBalance = wrappedAfter - wrappedBefore;
  let unwrapHash = "";
  if (wrappedBalance > 0n) {
    const unwrapTx = await wrapped.withdraw(wrappedBalance);
    unwrapHash = unwrapTx.hash;
    const unwrapReceipt = await unwrapTx.wait();
    if (unwrapReceipt.status !== 1) throw new Error("WETH-to-ETH unwrap reverted.");
  }
  return {
    side,
    hash: tx.hash,
    approvalHash,
    unwrapHash,
    blockNumber: receipt.blockNumber,
    quotedOutput: ethers.formatEther(quote),
  };
}

async function loadManagedWallets() {
  if (!existsSync(ENV_FILE)) return [];
  const text = await readFile(ENV_FILE, "utf8");
  const line = text.split(/\r?\n/).find((item) => item.startsWith(`${MANAGED_WALLETS_KEY}=`));
  if (!line) return [];
  try {
    const parsed = JSON.parse(line.slice(MANAGED_WALLETS_KEY.length + 1));
    if (!Array.isArray(parsed)) throw new Error("not an array");
    return parsed.map((item) => ({
      id: item.id || `wallet_${new Wallet(normalizePrivateKey(item.privateKey)).address.toLowerCase()}`,
      label: String(item.label || "").trim(),
      privateKey: normalizePrivateKey(item.privateKey),
      projectId: item.projectId || "local",
      chainId: Number(item.chainId || 4663),
      enabled: item.enabled !== false,
      archived: Boolean(item.archived),
      watchOnly: Boolean(item.watchOnly),
      signerAvailable: item.signerAvailable !== false,
      emergencyPaused: Boolean(item.emergencyPaused),
      reservedBalance: String(item.reservedBalance || "0"),
      pendingTransaction: Boolean(item.pendingTransaction),
      lastExecutionTime: item.lastExecutionTime || null,
      strategyAssignments: item.strategyAssignments || {},
    }));
  } catch {
    throw new Error(`${MANAGED_WALLETS_KEY} in .env is invalid.`);
  }
}

function publicWallet(wallet) {
  const address = new Wallet(wallet.privateKey).address;
  return {
    id: wallet.id || `wallet_${address.toLowerCase()}`,
    label: wallet.label,
    address,
    projectId: wallet.projectId || "local",
    chainId: Number(wallet.chainId || 4663),
    chain: "Robinhood Chain",
    enabled: wallet.enabled !== false,
    archived: Boolean(wallet.archived),
    watchOnly: Boolean(wallet.watchOnly),
    signerAvailable: wallet.signerAvailable !== false,
    signerStatus: wallet.signerAvailable === false ? "Unavailable" : "Available",
    emergencyPaused: Boolean(wallet.emergencyPaused),
    reservedBalance: String(wallet.reservedBalance || "0"),
    pendingTransaction: Boolean(wallet.pendingTransaction),
    lastExecutionTime: wallet.lastExecutionTime || null,
    strategyAssignments: wallet.strategyAssignments || {},
    marketMakingLabel: parseMarketMakingLabel(wallet.label),
  };
}

async function saveManagedWallets(wallets) {
  const current = existsSync(ENV_FILE) ? await readFile(ENV_FILE, "utf8") : "";
  const lines = current.split(/\r?\n/).filter((line) => line && !line.startsWith(`${MANAGED_WALLETS_KEY}=`));
  lines.push(`${MANAGED_WALLETS_KEY}=${JSON.stringify(wallets)}`);
  await writeFile(ENV_FILE, `${lines.join("\n")}\n`, { mode: 0o600 });
}

function normalizePrivateKey(value) {
  const key = String(value || "").trim();
  const normalized = key.startsWith("0x") ? key : `0x${key}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) throw httpError(400, "Private key must contain exactly 64 hexadecimal characters.");
  return normalized;
}

function parsePositiveEther(value, label) {
  return parsePositiveUnits(value, 18, label);
}

function parsePositiveUnits(value, decimals, label) {
  try {
    const parsed = ethers.parseUnits(String(value || "").trim(), decimals);
    if (parsed <= 0n) throw new Error("zero");
    return parsed;
  } catch {
    throw httpError(400, `${label} must be greater than zero.`);
  }
}

function parseNonnegativeUnits(value, decimals, label) {
  try {
    const text = String(value ?? "0").trim() || "0";
    const parsed = ethers.parseUnits(text, decimals);
    if (parsed < 0n) throw new Error("negative");
    return parsed;
  } catch {
    throw httpError(400, `${label} must be zero or greater.`);
  }
}

export function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJsonBody(req) {
  const body = await readRequestBody(req);
  try {
    return JSON.parse(body.toString("utf8") || "{}");
  } catch {
    throw httpError(400, "Request body must be valid JSON.");
  }
}

export function sendJson(res, statusCode, value) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(value));
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Dispatches one request to the matching API/auth/rpc handler above, or
 * returns false if the path doesn't match any of them (caller should then
 * fall through to static file serving / Vite's own transform pipeline).
 * Shared verbatim between vite.config.js (dev) and server.mjs (prod).
 */
export async function dispatchApiRoute(req, res, pathname) {
  if (pathname === "/api/auth/login") return handleLogin(req, res), true;
  if (pathname === "/api/auth/register") return handleRegister(req, res), true;
  if (pathname === "/api/auth/logout") return handleLogout(req, res), true;
  if (pathname === "/api/auth/session") return handleSession(req, res), true;
  if (pathname === "/rpc") return handleRpc(req, res), true;
  if (pathname === "/api/solana-rpc") return handleSolanaRpc(req, res), true;
  if (pathname.startsWith("/api/relay/")) return handleRelayProxy(req, res, pathname), true;
  if (pathname === "/api/wallets/generate") return handleWalletsGenerate(req, res), true;
  if (pathname === "/api/wallets/save") return handleWalletsSave(req, res), true;
  if (pathname === "/api/wallets/export") return handleWalletsExport(req, res), true;
  if (pathname === "/api/wallets") return handleWallets(req, res), true;
  if (pathname === "/api/admin/roles") return handleRolesRoute(req, res), true;
  if (pathname === "/api/admin/users") return handleUsersRoute(req, res), true;
  if (pathname === "/api/admin/projects") return handleProjectsRoute(req, res), true;
  if (pathname === "/api/admin/project-access") return handleProjectAccessRoute(req, res), true;
  if (pathname === "/api/command-center/wallets") return handleCommandCenterWallets(req, res), true;
  if (pathname.startsWith("/api/managed-wallets")) return handleManagedWalletRequest(req, res), true;
  return false;
}
