/**
 * Single shared MongoDB connection for the whole server process.
 * Reads MONGODB_URI from the environment — set it in .env.local; both
 * `vite.config.js` (dev, via `node --env-file=.env.local`) and
 * `server.mjs` (prod, via its own manual .env.local loader) populate
 * process.env before this module's functions are ever called. The reads
 * below are deliberately lazy (inside the functions, not at module top
 * level) — a top-level `const MONGODB_URI = process.env.MONGODB_URI`
 * would evaluate at import time, which for server.mjs happens before its
 * own env-loading code runs (ESM imports are hoisted above the importing
 * module's body), silently capturing `undefined` even when the value is
 * genuinely set a moment later.
 */
import { MongoClient } from "mongodb";

let clientPromise = null;

export function getMongoClient() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");
  }
  if (!clientPromise) {
    const client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect().then(() => client);
  }
  return clientPromise;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB_NAME || "rh_launch_token_interface");
}

export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}
