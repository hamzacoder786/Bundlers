import { Contract, JsonRpcProvider, Wallet, ethers } from "ethers";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DEFAULT_RPC = "https://robinhood-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY";
const LUNCH_LAUNCHER = "0xf5Ac14e7691EF44b15b59FcC6a756e41A3E5EFd6";
const DEFAULT_ROUTER = "0xCaf681a66D020601342297493863E78C959E5cb2";
const DEFAULT_X_TOKEN = "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73";
const CHAIN_ID = 4663n;
const EXPLORER = "https://robinhoodchain.blockscout.com/";

const LAUNCHER_ABI = [
  "function launchFeeWei() view returns (uint256)",
  "function enforcedSupply() view returns (uint256)",
  "function predictTokenAddress(string name,string symbol,uint256 totalSupply,address creator,bytes32 userSalt) view returns (address)",
  "function launchWithMetaSalt(string name,string symbol,uint256 totalSupply,uint24 fee,uint256 initialBuyMaxTokens,(string image,string banner,string description,string website,string twitter,string telegram) meta,bytes32 userSalt) payable returns (address token,uint256 tokenId)",
  "event V3TokenLaunched(address indexed token,uint256 indexed tokenId,address indexed creator,address pool,uint24 fee)",
];
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
const routerAddress = args.router || env("LUNCH_ROUTER", DEFAULT_ROUTER);
const xTokenAddress = args.xToken || env("LUNCH_X_TOKEN", DEFAULT_X_TOKEN);
const poolFee = Number(args.fee || env("LUNCH_POOL_FEE", "10000"));
const launcherKey = env("LUNCH_LAUNCHER_PRIVATE_KEY");
const buyerKeys = splitList(env("LUNCH_BUYER_PRIVATE_KEYS"));
const buyerAmounts = splitList(env("LUNCH_BUY_AMOUNTS_ETH"));
const buyerMinOuts = splitList(env("LUNCH_MIN_OUT_TOKENS"));
const buyerRecipients = splitList(env("LUNCH_RECIPIENTS"));

if (!launcherKey) throw new Error("Set LUNCH_LAUNCHER_PRIVATE_KEY in .env.local.");
if (!ethers.isAddress(routerAddress)) throw new Error("Invalid LUNCH_ROUTER.");
if (!ethers.isAddress(xTokenAddress)) throw new Error("Invalid LUNCH_X_TOKEN.");
if (poolFee !== 10000) throw new Error("Lunch.fun launches require pool fee 10000.");
if (buyerKeys.length > 6) throw new Error("Lunch.fun launch script supports up to 6 additional buyer keys.");
if (buyerAmounts.length !== buyerKeys.length) throw new Error("LUNCH_BUY_AMOUNTS_ETH must have one amount per buyer key.");
if (buyerMinOuts.length !== buyerKeys.length) throw new Error("LUNCH_MIN_OUT_TOKENS must have one min output per buyer key.");
if (buyerRecipients.length > 0 && buyerRecipients.length !== buyerKeys.length) {
  throw new Error("LUNCH_RECIPIENTS must be empty or have one recipient per buyer key.");
}

const provider = new JsonRpcProvider(rpcUrl);
const network = await provider.getNetwork();
if (network.chainId !== CHAIN_ID) throw new Error(`Wrong chain ${network.chainId}. Expected ${CHAIN_ID}.`);

const launcherWallet = new Wallet(launcherKey, provider);
const launcher = new Contract(LUNCH_LAUNCHER, LAUNCHER_ABI, launcherWallet);
const launchFee = await launcher.launchFeeWei();
const enforcedSupply = await launcher.enforcedSupply();

const name = requireEnv("LUNCH_TOKEN_NAME");
const symbol = requireEnv("LUNCH_TOKEN_SYMBOL");
const totalSupply = parseSupply(env("LUNCH_TOTAL_SUPPLY", enforcedSupply > 0n ? ethers.formatUnits(enforcedSupply, 18) : ""));
if (enforcedSupply > 0n && totalSupply !== enforcedSupply) {
  throw new Error(`LUNCH_TOTAL_SUPPLY must equal enforced supply ${ethers.formatUnits(enforcedSupply, 18)}.`);
}
const devBuyEth = env("LUNCH_DEV_BUY_ETH", "0");
const devBuy = ethers.parseEther(devBuyEth);
const initialBuyFlag = devBuy > 0n ? 1n : 0n;
const userSalt = normalizeSalt(env("LUNCH_USER_SALT", ""));
const meta = {
  image: env("LUNCH_META_IMAGE", ""),
  banner: env("LUNCH_META_BANNER", ""),
  description: env("LUNCH_META_DESCRIPTION", ""),
  website: env("LUNCH_META_WEBSITE", ""),
  twitter: env("LUNCH_META_TWITTER", ""),
  telegram: env("LUNCH_META_TELEGRAM", ""),
};
const launchValue = launchFee + devBuy;
const predictedToken = await launcher.predictTokenAddress(name, symbol, totalSupply, launcherWallet.address, userSalt);

console.log(`Lunch launch-and-buy on Robinhood Chain ${network.chainId}`);
console.log(`Launcher wallet: ${launcherWallet.address}`);
console.log(`Predicted token: ${EXPLORER}address/${predictedToken}`);
console.log(`Launch salt: ${userSalt}`);
console.log(`Launch fee: ${ethers.formatEther(launchFee)} ETH`);
console.log(`Dev buy: ${ethers.formatEther(devBuy)} ETH`);
console.log(`Buyer wallets: ${buyerKeys.length}`);

await launcher.launchWithMetaSalt.staticCall(name, symbol, totalSupply, poolFee, initialBuyFlag, meta, userSalt, { value: launchValue });
const launchGas = await launcher.launchWithMetaSalt.estimateGas(name, symbol, totalSupply, poolFee, initialBuyFlag, meta, userSalt, { value: launchValue });
console.log(`Launch simulation OK. Estimated gas ${launchGas}.`);

const launchTx = await launcher.launchWithMetaSalt(name, symbol, totalSupply, poolFee, initialBuyFlag, meta, userSalt, {
  value: launchValue,
  gasLimit: (launchGas * 125n) / 100n,
});
console.log(`Launch submitted: ${EXPLORER}tx/${launchTx.hash}`);
const launchReceipt = await launchTx.wait();
if (launchReceipt.status !== 1) throw new Error(`Launch failed in block ${launchReceipt.blockNumber}.`);

const launched = decodeLaunch(launchReceipt.logs);
if (!launched) throw new Error("V3TokenLaunched event not found.");
console.log(`Launch confirmed block ${launchReceipt.blockNumber}`);
console.log(`Token: ${EXPLORER}address/${launched.token}`);
console.log(`Pool: ${EXPLORER}address/${launched.pool}`);

const token = new Contract(launched.token, TOKEN_ABI, provider);
const [decimals, tokenSymbol] = await Promise.all([token.decimals(), token.symbol().catch(() => symbol)]);
const buyerRows = buyerKeys.map((key, index) => {
  const wallet = new Wallet(key, provider);
  const recipient = buyerRecipients[index] || wallet.address;
  if (!ethers.isAddress(recipient)) throw new Error(`Invalid recipient row ${index + 1}.`);
  return {
    index,
    wallet,
    recipient,
    amountIn: ethers.parseEther(buyerAmounts[index]),
    minOut: ethers.parseUnits(buyerMinOuts[index], decimals),
  };
});
validateRows(buyerRows, launcherWallet.address);

for (const row of buyerRows) {
  const label = `${row.index + 1}/${buyerRows.length}`;
  const router = new Contract(routerAddress, ROUTER_ABI, row.wallet);
  const balance = await provider.getBalance(row.wallet.address);
  if (balance <= row.amountIn) {
    throw new Error(`Buyer ${label} ${row.wallet.address} has ${ethers.formatEther(balance)} ETH, below buy amount ${ethers.formatEther(row.amountIn)} ETH.`);
  }
  const params = {
    tokenIn: xTokenAddress,
    tokenOut: launched.token,
    fee: poolFee,
    recipient: row.recipient,
    amountIn: row.amountIn,
    amountOutMinimum: row.minOut,
    sqrtPriceLimitX96: 0n,
  };
  const before = await token.balanceOf(row.recipient);
  const quote = await router.exactInputSingle.staticCall(params, { value: row.amountIn });
  console.log(`Buyer ${label}: simulated ${ethers.formatUnits(quote, decimals)} ${tokenSymbol}`);
  const gas = await router.exactInputSingle.estimateGas(params, { value: row.amountIn });
  const tx = await router.exactInputSingle(params, { value: row.amountIn, gasLimit: (gas * 125n) / 100n });
  console.log(`Buyer ${label}: submitted ${EXPLORER}tx/${tx.hash}`);
  const receipt = await tx.wait();
  if (receipt.status !== 1) throw new Error(`Buyer ${label} failed in block ${receipt.blockNumber}. Stopping.`);
  const after = await token.balanceOf(row.recipient);
  console.log(`Buyer ${label}: confirmed block ${receipt.blockNumber}, received ${ethers.formatUnits(after - before, decimals)} ${tokenSymbol}`);
}

console.log("Lunch launch + buyer sequence completed.");

function decodeLaunch(logs) {
  const iface = new ethers.Interface(LAUNCHER_ABI);
  for (const item of logs) {
    if (item.address.toLowerCase() !== LUNCH_LAUNCHER.toLowerCase()) continue;
    try {
      const parsed = iface.parseLog(item);
      if (parsed?.name === "V3TokenLaunched") {
        return {
          token: parsed.args.token,
          tokenId: parsed.args.tokenId,
          pool: parsed.args.pool,
          fee: parsed.args.fee,
        };
      }
    } catch {
      // Not the launch event.
    }
  }
  return null;
}

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
    parsed[item.slice(2)] = values[i + 1];
    i++;
  }
  return parsed;
}

function env(key, fallback = "") {
  return process.env[key] ?? fallback;
}

function requireEnv(key) {
  const value = env(key);
  if (!value) throw new Error(`Set ${key} in .env.local.`);
  return value;
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

function normalizeSalt(value) {
  if (!value) return ethers.hexlify(ethers.randomBytes(32));
  if (/^0x[0-9a-fA-F]{64}$/.test(value)) return value;
  return ethers.id(value);
}

function parseSupply(value) {
  if (!value) throw new Error("Set LUNCH_TOTAL_SUPPLY or rely on nonzero enforcedSupply.");
  return ethers.parseUnits(value, 18);
}

function validateRows(rows, launcherAddress) {
  const seenWallets = new Set([launcherAddress.toLowerCase()]);
  for (const row of rows) {
    const walletKey = row.wallet.address.toLowerCase();
    if (seenWallets.has(walletKey)) throw new Error(`Duplicate or launcher buyer wallet: ${row.wallet.address}`);
    seenWallets.add(walletKey);
    if (row.amountIn <= 0n) throw new Error(`Buyer ${row.index + 1} amount must be greater than zero.`);
    if (row.minOut <= 0n) throw new Error(`Buyer ${row.index + 1} minimum output must be greater than zero.`);
  }
}
