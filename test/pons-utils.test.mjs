import test from "node:test";
import assert from "node:assert/strict";
import { Interface, parseEther, parseUnits } from "ethers";
import {
  PONS_FACTORY_EVENTS,
  calculateLaunchValue,
  calculateMinOut,
  decodeTokenLaunched,
  parseTokenAmount,
  tokenOrdering,
  validateBuyerOrder,
} from "../lib/pons-utils.mjs";

test("amount conversion uses bigint units", () => {
  assert.equal(parseTokenAmount("1.5", 18), 1_500_000_000_000_000_000n);
});

test("slippage calculation applies bps without floating point", () => {
  assert.equal(calculateMinOut(1_000_000n, 500n), 950_000n);
});

test("token ordering is deterministic by address value", () => {
  const result = tokenOrdering(
    "0x0000000000000000000000000000000000000002",
    "0x0000000000000000000000000000000000000001",
  );
  assert.equal(result.isToken0, false);
  assert.equal(result.token0, "0x0000000000000000000000000000000000000001");
});

test("TokenLaunched event decoding returns token and pool", () => {
  const factory = "0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB";
  const iface = new Interface(PONS_FACTORY_EVENTS);
  const log = iface.encodeEventLog(iface.getEvent("TokenLaunched"), [
    "0x0000000000000000000000000000000000000010",
    "0x0000000000000000000000000000000000000020",
    "0x0000000000000000000000000000000000000030",
    "0x0000000000000000000000000000000000000040",
    "0x0000000000000000000000000000000000000050",
    0n,
    0n,
    123n,
    456n,
    parseEther("0.1"),
  ]);
  const decoded = decodeTokenLaunched([{ address: factory, topics: log.topics, data: log.data }], factory);
  assert.equal(decoded.token, "0x0000000000000000000000000000000000000010");
  assert.equal(decoded.pool, "0x0000000000000000000000000000000000000050");
  assert.equal(decoded.restrictionsEndBlock, 456n);
});

test("launch value adds fee and primary initial buy", () => {
  assert.equal(calculateLaunchValue("0.0005", "0.25"), parseEther("0.2505"));
});

test("buyer ordering preserves enabled order", () => {
  const order = validateBuyerOrder([
    { index: 0, enabled: true, recipient: "0x0000000000000000000000000000000000000001" },
    { index: 1, enabled: false, recipient: "" },
    { index: 2, enabled: true, recipient: "0x0000000000000000000000000000000000000002" },
  ]);
  assert.deepEqual(order, [0, 2]);
});

test("duplicate-wallet validation rejects duplicates", () => {
  assert.throws(
    () => validateBuyerOrder([
      { index: 0, enabled: true, recipient: "0x0000000000000000000000000000000000000001" },
      { index: 1, enabled: true, recipient: "0x0000000000000000000000000000000000000001" },
    ]),
    /Duplicate buyer recipient/,
  );
});

test("Pons atomic-launch buyer row has no secret-entry control", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
  // The single atomic-launch buyer row (renderPonsBuyerRows) must never ask
  // for a private key or seed phrase — the primary wallet signs the launch
  // via the connected signer, not a pasted secret. (Fast Lane / Burst rows
  // deliberately DO take per-wallet keys — those are separate wallets
  // spending their own ETH — so this check is scoped to renderPonsBuyerRows.)
  const start = source.indexOf("function renderPonsBuyerRows(");
  const end = source.indexOf("\n}", start);
  const rowSource = source.slice(start, end);
  assert.equal(/type="password"|0x_private_key|seed phrase|BuyerKey/i.test(rowSource), false);
});

test("Lunch 7702 tab includes local password fields without seed-phrase controls", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
  assert.equal(/lunchBuyerKey.*"password"|idFor\("Key".*"password"/.test(source), true);
  assert.equal(/seed phrase/i.test(source), false);
});

test("trader role exposes wallet and project management tabs", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("../lib/roles.mjs", import.meta.url), "utf8");
  assert.match(source, /name:\s*"trader"[\s\S]*permissions:\s*\[[\s\S]*"tab\.wallets"[\s\S]*"tab\.projectMgmt"/);
});
