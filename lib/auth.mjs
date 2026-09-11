/**
 * MongoDB-backed auth: accounts and sessions both persist in the database,
 * so restarting the server no longer logs everyone out or forgets accounts.
 *
 * Security model:
 * - Passwords are bcrypt-hashed before ever reaching the database; the
 *   plaintext password is never stored or logged.
 * - A session is an opaque random id whose HMAC-signed token is handed to
 *   the browser as an httpOnly cookie — the id alone (without a valid
 *   signature) can't be used to look up a session, and the cookie can't be
 *   read or forged from client-side JS.
 * - Every request for the app's HTML/JS/API routes is gated (see
 *   vite.config.js's auth-gate plugin): no valid session, no content.
 *
 * Scope note: this gates *access to the app*, not each individual action
 * inside it. Both roles (super_admin, admin) can use every tab today —
 * role is recorded but not yet used to restrict specific features.
 */

import { randomBytes, timingSafeEqual, createHmac } from "node:crypto";
import bcrypt from "bcryptjs";
import { getCollection } from "./db.mjs";

const SESSION_COOKIE = "rh_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,32}$/;
export const DEFAULT_USER_ROLE = "trader";

// Falls back to a per-process random secret if unset — sessions signed with
// that fallback stop validating on restart even though they're stored in
// Mongo, so set SESSION_SECRET in .env.local for sessions to truly survive
// restarts end to end.
const SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(32).toString("hex");

const SEED_ACCOUNTS = [
  { username: "superadmin", password: process.env.SUPERADMIN_PASSWORD || "superadmin123", role: "super_admin" },
  { username: "admin", password: process.env.ADMIN_PASSWORD || "admin123", role: "admin" },
];

let seeded = false;

async function accountsCollection() {
  const collection = await getCollection("accounts");
  await collection.createIndex({ usernameLower: 1 }, { unique: true });
  if (!seeded) {
    seeded = true;
    await seedDefaultAccounts(collection);
  }
  return collection;
}

async function sessionsCollection() {
  const collection = await getCollection("sessions");
  await collection.createIndex({ sessionId: 1 }, { unique: true });
  // TTL index: Mongo automatically deletes sessions once expiresAt passes,
  // so expired sessions don't need manual cleanup.
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  return collection;
}

async function seedDefaultAccounts(collection) {
  for (const { username, password, role } of SEED_ACCOUNTS) {
    const usernameLower = username.toLowerCase();
    const exists = await collection.findOne({ usernameLower });
    if (exists) continue;
    const passwordHash = await bcrypt.hash(password, 10);
    await collection.insertOne({ username, usernameLower, passwordHash, role, createdAt: new Date(), seeded: true });
  }
}

function sign(value) {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function makeToken() {
  const id = randomBytes(24).toString("hex");
  return { token: `${id}.${sign(id)}`, id };
}

function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [id, mac] = token.split(".");
  const expected = sign(id);
  const a = Buffer.from(mac || "", "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return id;
}

export function validateRegistration(username, password) {
  const trimmedUsername = String(username || "").trim();
  if (!USERNAME_RE.test(trimmedUsername)) {
    return "Username must be 3-32 characters: letters, numbers, underscore, dot, or hyphen.";
  }
  if (String(password || "").length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null;
}

export async function register(username, password) {
  const trimmedUsername = String(username || "").trim();
  const validationError = validateRegistration(trimmedUsername, password);
  if (validationError) return { ok: false, error: validationError };

  const collection = await accountsCollection();
  const usernameLower = trimmedUsername.toLowerCase();
  const existing = await collection.findOne({ usernameLower });
  if (existing) return { ok: false, error: "That username is already taken." };

  const passwordHash = await bcrypt.hash(password, 10);
  await collection.insertOne({
    username: trimmedUsername,
    usernameLower,
    passwordHash,
    role: DEFAULT_USER_ROLE,
    createdAt: new Date(),
    seeded: false,
  });
  return { ok: true, username: trimmedUsername, role: DEFAULT_USER_ROLE };
}

export async function login(username, password) {
  const collection = await accountsCollection();
  const account = await collection.findOne({ usernameLower: String(username || "").trim().toLowerCase() });
  if (!account) return { ok: false, error: "Invalid username or password." };
  const matches = await bcrypt.compare(String(password || ""), account.passwordHash);
  if (!matches) return { ok: false, error: "Invalid username or password." };

  const { token, id } = makeToken();
  const sessions = await sessionsCollection();
  await sessions.insertOne({
    sessionId: id,
    username: account.username,
    role: account.role,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });
  return { ok: true, token, username: account.username, role: account.role };
}

export async function logout(token) {
  const id = verifyToken(token);
  if (!id) return;
  const sessions = await sessionsCollection();
  await sessions.deleteOne({ sessionId: id });
}

export async function getSession(token) {
  const id = verifyToken(token);
  if (!id) return null;
  const sessions = await sessionsCollection();
  const session = await sessions.findOne({ sessionId: id });
  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await sessions.deleteOne({ sessionId: id });
    return null;
  }
  return { username: session.username, role: session.role };
}

export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export function sessionCookieHeader(token, { clear = false } = {}) {
  const maxAge = clear ? 0 : Math.floor(SESSION_TTL_MS / 1000);
  const value = clear ? "" : token;
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function getTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[SESSION_COOKIE];
}

export async function getSessionFromRequest(req) {
  return getSession(getTokenFromRequest(req));
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
