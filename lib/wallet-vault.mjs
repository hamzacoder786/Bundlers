/**
 * Server-side wallet generation + storage. Private keys are encrypted at
 * rest (AES-256-GCM) before being written to MongoDB — a database leak or
 * a stolen connection string does not hand over usable private keys on its
 * own, only ciphertext. The server still holds the decryption key
 * (WALLET_ENCRYPTION_KEY, from env), so anyone with real access to this
 * running server/its env can still decrypt — this protects against a
 * database-only compromise, not a full server compromise.
 */
import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import { Wallet } from "ethers";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { getCollection } from "./db.mjs";

const ENCRYPTION_KEY_HEX = process.env.WALLET_ENCRYPTION_KEY;

function getKey() {
  if (!ENCRYPTION_KEY_HEX) {
    throw new Error("WALLET_ENCRYPTION_KEY is not set. Add a 64-char hex string (32 bytes) to .env.local — see .env.example.");
  }
  const key = Buffer.from(ENCRYPTION_KEY_HEX, "hex");
  if (key.length !== 32) {
    throw new Error("WALLET_ENCRYPTION_KEY must decode to exactly 32 bytes (64 hex characters).");
  }
  return key;
}

// Every wallet document belongs to exactly one project — there is no
// "global" vault anymore. Failing loudly here beats silently writing
// projectId: undefined, which Mongo would happily store and which would
// then make that wallet invisible to every project's own listWallets query.
function requireProjectId(projectId) {
  if (!projectId) throw httpError(400, "A project must be selected before saving wallets.");
}

// Purely organizational — which UI group a wallet belongs to (the Wallets
// tab's Dev/Bundle/Wash-Sell/Wash-Buy sections). Not enforced anywhere
// downstream (Buy/Sell/Pons/etc. still take pasted keys regardless of
// category), so an unrecognized value is just normalized to null rather
// than rejected — this list is expected to grow.
// "wash-sell" was merged into "bundle" — Bundle wallets now double as
// Wallet Wash's sell side, so there is no separate sell category anymore.
// Kept accepting the old value here would let a stale client keep writing
// orphaned wash-sell wallets nothing in the UI shows anymore.
const WALLET_CATEGORIES = ["dev", "bundle", "wash-buy"];
function normalizeCategory(category) {
  const value = String(category || "").trim().toLowerCase();
  return WALLET_CATEGORIES.includes(value) ? value : null;
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function encrypt(plaintext) {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

function decrypt(payload) {
  const key = getKey();
  const [ivHex, authTagHex, dataHex] = String(payload || "").split(":");
  if (!ivHex || !authTagHex || !dataHex) throw new Error("Malformed encrypted payload.");
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);
  return decrypted.toString("utf8");
}

async function walletsCollection() {
  const collection = await getCollection("wallets");
  // Compound + unique on (projectId, addressLower): the same address must
  // not be saved twice within one project, but the same key material CAN
  // legitimately appear in two different projects' vaults (a wallet reused
  // across engagements) — a plain unique index on addressLower alone would
  // wrongly forbid that.
  await collection.createIndex({ projectId: 1, addressLower: 1 }, { unique: true });
  await collection.createIndex({ projectId: 1, createdAt: 1 });
  return collection;
}

export async function generateAndSaveWallets(count, { label, createdBy, projectId, category } = {}) {
  requireProjectId(projectId);
  const n = Math.max(1, Math.min(200, Math.trunc(Number(count) || 0)));
  const collection = await walletsCollection();
  const normalizedCategory = normalizeCategory(category);
  const docs = [];
  for (let i = 0; i < n; i += 1) {
    const wallet = Wallet.createRandom();
    docs.push({
      projectId,
      chain: "evm",
      category: normalizedCategory,
      address: wallet.address,
      addressLower: wallet.address.toLowerCase(),
      encryptedPrivateKey: encrypt(wallet.privateKey),
      label: label || null,
      createdAt: new Date(),
      createdBy: createdBy || null,
    });
  }
  await collection.insertMany(docs);
  return docs.map((doc) => ({ address: doc.address, label: doc.label, createdAt: doc.createdAt }));
}

// Creates and saves a brand-new Solana keypair, same shape/purpose as
// generateAndSaveWallets but for the Solana side of a cross-chain relay
// (see savePrivateKeysSolana below for the equivalent of savePrivateKeys).
export async function generateAndSaveSolanaWallets(count, { label, createdBy, projectId } = {}) {
  requireProjectId(projectId);
  const n = Math.max(1, Math.min(200, Math.trunc(Number(count) || 0)));
  const collection = await walletsCollection();
  const docs = [];
  for (let i = 0; i < n; i += 1) {
    const keypair = Keypair.generate();
    docs.push({
      projectId,
      chain: "solana",
      address: keypair.publicKey.toBase58(),
      addressLower: keypair.publicKey.toBase58(), // Solana addresses are case-sensitive; kept only for the unique index's sake, never lowercased for actual use
      encryptedPrivateKey: encrypt(bs58.encode(keypair.secretKey)),
      label: label || null,
      createdAt: new Date(),
      createdBy: createdBy || null,
    });
  }
  await collection.insertMany(docs);
  return docs.map((doc) => ({ address: doc.address, label: doc.label, createdAt: doc.createdAt }));
}

// Persists wallets that already exist (e.g. Wallet Wash's per-run relay
// wallets, generated client-side and only otherwise visible once in that
// run's log) rather than generating new ones — same encryption/collection
// as generateAndSaveWallets, just given the private keys instead of
// creating them. Silently skips any key already saved (duplicate address)
// so re-saving the same run's relays twice doesn't throw.
export async function savePrivateKeys(privateKeys, { label, createdBy, projectId, category } = {}) {
  requireProjectId(projectId);
  const collection = await walletsCollection();
  const normalizedCategory = normalizeCategory(category);
  const saved = [];
  for (const rawKey of privateKeys) {
    const key = String(rawKey || "").trim();
    if (!key) continue;
    let wallet;
    try {
      wallet = new Wallet(key.startsWith("0x") ? key : `0x${key}`);
    } catch {
      continue; // not a valid private key — skip rather than fail the whole batch
    }
    const doc = {
      projectId,
      chain: "evm",
      category: normalizedCategory,
      address: wallet.address,
      addressLower: wallet.address.toLowerCase(),
      encryptedPrivateKey: encrypt(wallet.privateKey),
      label: label || null,
      createdAt: new Date(),
      createdBy: createdBy || null,
    };
    try {
      await collection.insertOne(doc);
      saved.push({ address: doc.address, label: doc.label, createdAt: doc.createdAt });
    } catch (error) {
      if (error?.code !== 11000) throw error; // 11000 = duplicate address, already saved
    }
  }
  return saved;
}

// Same as savePrivateKeys but for Solana secret keys (base58-encoded
// 64-byte secret key, the format @solana/web3.js Keypair.secretKey /
// most Solana wallet exports use).
export async function savePrivateKeysSolana(secretKeysBase58, { label, createdBy, projectId } = {}) {
  requireProjectId(projectId);
  const collection = await walletsCollection();
  const saved = [];
  for (const rawKey of secretKeysBase58) {
    const key = String(rawKey || "").trim();
    if (!key) continue;
    let keypair;
    try {
      keypair = Keypair.fromSecretKey(bs58.decode(key));
    } catch {
      continue; // not a valid Solana secret key — skip rather than fail the whole batch
    }
    const address = keypair.publicKey.toBase58();
    const doc = {
      projectId,
      chain: "solana",
      address,
      addressLower: address,
      encryptedPrivateKey: encrypt(bs58.encode(keypair.secretKey)),
      label: label || null,
      createdAt: new Date(),
      createdBy: createdBy || null,
    };
    try {
      await collection.insertOne(doc);
      saved.push({ address: doc.address, label: doc.label, createdAt: doc.createdAt });
    } catch (error) {
      if (error?.code !== 11000) throw error; // 11000 = duplicate address, already saved
    }
  }
  return saved;
}

export async function listWallets({ includePrivateKeys = false, chain, category, projectId } = {}) {
  requireProjectId(projectId);
  const collection = await walletsCollection();
  const query = { projectId };
  if (chain) query.chain = chain;
  if (category) query.category = normalizeCategory(category);
  const docs = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map((doc) => ({
    id: String(doc._id),
    chain: doc.chain || "evm", // wallets saved before this field existed are all EVM
    category: doc.category || null, // wallets saved before categories existed are uncategorized
    address: doc.address,
    label: doc.label,
    createdAt: doc.createdAt,
    ...(includePrivateKeys ? { privateKey: decrypt(doc.encryptedPrivateKey) } : {}),
  }));
}

export async function deleteWallet(projectId, address) {
  requireProjectId(projectId);
  const collection = await walletsCollection();
  const raw = String(address || "");
  // EVM addresses are case-insensitive (matched via addressLower); Solana
  // base58 addresses ARE case-sensitive, so addressLower holds their exact
  // case as saved (see generateAndSaveSolanaWallets/savePrivateKeysSolana)
  // — match on either the lowercased form or the exact string given. Scoped
  // by projectId so a wallet address that (rarely) exists in two projects
  // can't be deleted from the wrong one by mistake.
  const result = await collection.deleteOne({ projectId, addressLower: { $in: [raw.toLowerCase(), raw] } });
  return result.deletedCount > 0;
}

export async function walletCount(projectId) {
  requireProjectId(projectId);
  const collection = await walletsCollection();
  return collection.countDocuments({ projectId });
}
