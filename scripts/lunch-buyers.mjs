import { Contract, JsonRpcProvider, Wallet, ethers } from "ethers";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DEFAULT_RPC = "https://robinhood-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY";
const DEFAULT_ROUTER = "0xCaf681a66D020601342297493863E78C959E5cb2";
const DEFAULT_X_TOKEN = "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73";
const DEFAULT_POOL_FEE = 10000;
const CHAIN_ID = 4663n;
const EXPLORER = "https://robinhoodchain.blockscout.com/";

const ROUTER_ABI = [
  "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)",
];
const TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

await loadEnvFile(".env");
await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const rpcUrl = args.rpc || env("LUNCH_RPC_URL", env("RPC_URL", DEFAULT_RPC));
const tokenAddress = args.token || env("LUNCH_TOKEN_ADDRESS");
const routerAddress = args.router || env("LUNCH_ROUTER", DEFAULT_ROUTER);
const xTokenAddress = args.xToken || env("LUNCH_X_TOKEN", DEFAULT_X_TOKEN);
const poolFee = Number(args.fee || env("LUNCH_POOL_FEE", String(DEFAULT_POOL_FEE)));
const keyList = splitList(env("LUNCH_BUYER_PRIVATE_KEYS"));
const amountList = splitList(env("LUNCH_BUY_AMOUNTS_ETH"));
const minOutList = splitList(env("LUNCH_MIN_OUT_TOKENS"));
const recipientList = splitList(env("LUNCH_RECIPIENTS"));

if (!ethers.isAddress(tokenAddress || "")) {
  throw new Error("Set LUNCH_TOKEN_ADDRESS in .env.local or pass --token 0x...");
}
if (!ethers.isAddress(routerAddress)) throw new Error("Invalid LUNCH_ROUTER.");
if (!ethers.isAddress(xTokenAddress)) throw new Error("Invalid LUNCH_X_TOKEN.");
if (poolFee !== 10000) throw new Error("Lunch.fun launches use pool fee 10000.");
if (keyList.length === 0) throw new Error("Set LUNCH_BUYER_PRIVATE_KEYS in .env.local.");
if (amountList.length !== keyList.length) throw new Error("LUNCH_BUY_AMOUNTS_ETH must have one amount per private key.");
if (minOutList.length !== keyList.length) throw new Error("LUNCH_MIN_OUT_TOKENS must have one minimum token output per private key.");
if (recipientList.length > 0 && recipientList.length !== keyList.length) {
  throw new Error("LUNCH_RECIPIENTS must be empty or have one recipient per private key.");
}

const provider = new JsonRpcProvider(rpcUrl);
const network = await provider.getNetwork();
if (network.chainId !== CHAIN_ID) {
  throw new Error(`Wrong chain ${network.chainId}. Expected Robinhood Chain ${CHAIN_ID}.`);
}

const token = new Contract(tokenAddress, TOKEN_ABI, provider);
const [decimals, symbol] = await Promise.all([token.decimals(), token.symbol().catch(() => "TOKEN")]);
const rows = keyList.map((privateKey, index) => {
  const wallet = new Wallet(privateKey, provider);
  const recipient = recipientList[index] || wallet.address;
  if (!ethers.isAddress(recipient)) throw new Error(`Invalid recipient at row ${index + 1}.`);
  return {
    index,
    wallet,
    recipient,
    amountIn: ethers.parseEther(amountList[index]),
    minOut: ethers.parseUnits(minOutList[index], decimals),
  };
});

validateRows(rows);

console.log(`Lunch buyer script on Robinhood Chain ${network.chainId}`);
console.log(`Token: ${tokenAddress}`);
console.log(`Router: ${routerAddress}`);
console.log(`X token: ${xTokenAddress}`);
console.log(`Rows: ${rows.length}`);

for (const row of rows) {
  const label = `${row.index + 1}/${rows.length}`;
  const router = new Contract(routerAddress, ROUTER_ABI, row.wallet);
  const balance = await provider.getBalance(row.wallet.address);
  if (balance <= row.amountIn) {
    throw new Error(`Buyer ${label} ${row.wallet.address} balance ${ethers.formatEther(balance)} ETH is below buy amount ${ethers.formatEther(row.amountIn)} ETH.`);
  }

  const params = {
    tokenIn: xTokenAddress,
    tokenOut: tokenAddress,
    fee: poolFee,
    recipient: row.recipient,
    amountIn: row.amountIn,
    amountOutMinimum: row.minOut,
    sqrtPriceLimitX96: 0n,
  };

  console.log(`Buyer ${label}: ${row.wallet.address} buying ${ethers.formatEther(row.amountIn)} ETH for recipient ${row.recipient}`);
  const before = await token.balanceOf(row.recipient);
  const quotedOut = await router.exactInputSingle.staticCall(params, { value: row.amountIn });
  console.log(`Buyer ${label}: simulated output ${ethers.formatUnits(quotedOut, decimals)} ${symbol}`);

  const gas = await router.exactInputSingle.estimateGas(params, { value: row.amountIn });
  console.log(`Buyer ${label}: estimated gas ${gas}`);

  const tx = await router.exactInputSingle(params, { value: row.amountIn, gasLimit: (gas * 125n) / 100n });
  console.log(`Buyer ${label}: submitted ${EXPLORER}tx/${tx.hash}`);
  const receipt = await tx.wait();
  if (receipt.status !== 1) {
    throw new Error(`Buyer ${label}: transaction failed in block ${receipt.blockNumber}. Stopping.`);
  }
  const after = await token.balanceOf(row.recipient);
  console.log(`Buyer ${label}: confirmed block ${receipt.blockNumber}, received ${ethers.formatUnits(after - before, decimals)} ${symbol}`);
}

console.log("All Lunch buyer transactions completed.");

async function loadEnvFile(file) {
  const absolute = path.resolve(file);
  if (!existsSync(absolute)) return;
  const text = await readFile(absolute, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] != null) continue;
    process.env[key] = unquote(rawValue.trim());
  }
}

function parseArgs(values) {
  const parsed = {};
  for (let i = 0; i < values.length; i++) {
    const item = values[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    parsed[key] = values[i + 1];
    i++;
  }
  return parsed;
}

function env(key, fallback = "") {
  return process.env[key] ?? fallback;
}

function splitList(value) {
  return String(value || "")
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unquote(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function validateRows(rows) {
  const seenWallets = new Set();
  for (const row of rows) {
    const walletKey = row.wallet.address.toLowerCase();
    if (seenWallets.has(walletKey)) throw new Error(`Duplicate buyer wallet: ${row.wallet.address}`);
    seenWallets.add(walletKey);
    if (row.amountIn <= 0n) throw new Error(`Buyer ${row.index + 1} amount must be greater than zero.`);
    if (row.minOut <= 0n) throw new Error(`Buyer ${row.index + 1} minimum output must be greater than zero.`);
  }
}
