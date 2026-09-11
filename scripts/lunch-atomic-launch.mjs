import { Contract, JsonRpcProvider, Wallet, ethers } from "ethers";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DEFAULT_RPC = "https://rpc.mainnet.chain.robinhood.com";
const LUNCH_LAUNCHER = "0xf5Ac14e7691EF44b15b59FcC6a756e41A3E5EFd6";
const CHAIN_ID = 4663n;
const EXPLORER = "https://robinhoodchain.blockscout.com";

const EXECUTOR_ABI = [
  "function owner() view returns (address)",
  "function launchAndBuy((string name,string symbol,uint256 totalSupply,uint24 fee,(string image,string banner,string description,string website,string twitter,string telegram) meta,bytes32 userSalt,uint256 deadline) params,(address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96)[] buys) payable returns (address token,uint256 tokenId,uint256[] amountsOut)",
  "event AtomicLaunch(address indexed token,uint256 indexed tokenId,address indexed controller,uint256 buyCount)",
  "event AtomicBuy(address indexed token,address indexed recipient,uint256 amountIn,uint256 amountOut)",
];
const LAUNCHER_ABI = [
  "function launchFeeWei() view returns (uint256)",
  "function enforcedSupply() view returns (uint256)",
  "function predictTokenAddress(string name,string symbol,uint256 totalSupply,address creator,bytes32 userSalt) view returns (address)",
];

await loadEnvFile(".env");
await loadEnvFile(".env.local");

const privateKey = required("LUNCH_LAUNCHER_PRIVATE_KEY");
const executorAddress = required("LUNCH_ATOMIC_EXECUTOR");
if (!ethers.isAddress(executorAddress)) throw new Error("Invalid LUNCH_ATOMIC_EXECUTOR.");

const provider = new JsonRpcProvider(env("LUNCH_RPC_URL", env("RPC_URL", DEFAULT_RPC)));
const network = await provider.getNetwork();
if (network.chainId !== CHAIN_ID) throw new Error(`Wrong chain ${network.chainId}; expected ${CHAIN_ID}.`);

const wallet = new Wallet(privateKey, provider);
const executor = new Contract(executorAddress, EXECUTOR_ABI, wallet);
const launcher = new Contract(LUNCH_LAUNCHER, LAUNCHER_ABI, provider);
const owner = await executor.owner();
if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
  throw new Error(`Executor owner is ${owner}, not configured wallet ${wallet.address}.`);
}

const launchFee = await launcher.launchFeeWei();
const enforcedSupply = await launcher.enforcedSupply();
const totalSupply = parseSupply(env("LUNCH_TOTAL_SUPPLY", enforcedSupply > 0n ? ethers.formatUnits(enforcedSupply, 18) : ""));
if (enforcedSupply > 0n && totalSupply !== enforcedSupply) throw new Error("LUNCH_TOTAL_SUPPLY does not match enforced supply.");

const recipients = list(required("LUNCH_RECIPIENTS"));
const amounts = list(required("LUNCH_BUY_AMOUNTS_ETH"));
const minimums = list(required("LUNCH_MIN_OUT_TOKENS"));
if (recipients.length !== amounts.length || recipients.length !== minimums.length) {
  throw new Error("LUNCH_RECIPIENTS, LUNCH_BUY_AMOUNTS_ETH, and LUNCH_MIN_OUT_TOKENS must have equal row counts.");
}
if (recipients.length === 0) throw new Error("Configure at least one atomic buy.");

const salt = normalizeSalt(env("LUNCH_USER_SALT", ""));
const params = {
  name: required("LUNCH_TOKEN_NAME"),
  symbol: required("LUNCH_TOKEN_SYMBOL"),
  totalSupply,
  fee: 10000,
  meta: {
    image: env("LUNCH_META_IMAGE"), banner: env("LUNCH_META_BANNER"), description: env("LUNCH_META_DESCRIPTION"),
    website: env("LUNCH_META_WEBSITE"), twitter: env("LUNCH_META_TWITTER"), telegram: env("LUNCH_META_TELEGRAM"),
  },
  userSalt: salt,
  deadline: BigInt(Math.floor(Date.now() / 1000) + Number(env("LUNCH_DEADLINE_SECONDS", "300"))),
};

const buys = recipients.map((recipient, index) => {
  if (!ethers.isAddress(recipient)) throw new Error(`Invalid recipient row ${index + 1}.`);
  const amountOutMinimum = ethers.parseUnits(minimums[index], 18);
  if (amountOutMinimum === 0n) throw new Error(`Minimum output row ${index + 1} must be greater than zero.`);
  return {
    recipient,
    amountIn: ethers.parseEther(amounts[index]),
    amountOutMinimum,
    sqrtPriceLimitX96: 0n,
  };
});
const buyValue = buys.reduce((sum, buy) => sum + buy.amountIn, 0n);
const value = launchFee + buyValue;
const predictedToken = await launcher.predictTokenAddress(params.name, params.symbol, totalSupply, executorAddress, salt);

console.log(`Executor: ${executorAddress}`);
console.log(`Predicted token: ${EXPLORER}/address/${predictedToken}`);
console.log(`Atomic buys: ${buys.length}`);
console.log(`Total value: ${ethers.formatEther(value)} ETH`);

await executor.launchAndBuy.staticCall(params, buys, { value });
const gas = await executor.launchAndBuy.estimateGas(params, buys, { value });
console.log(`Full atomic simulation passed. Estimated gas: ${gas}`);

const tx = await executor.launchAndBuy(params, buys, { value, gasLimit: (gas * 125n) / 100n });
console.log(`Submitted: ${EXPLORER}/tx/${tx.hash}`);
const receipt = await tx.wait();
if (receipt.status !== 1) throw new Error("Atomic launch transaction reverted.");
console.log(`Confirmed in block ${receipt.blockNumber}. No transaction can occur between its internal launch and buys.`);

async function loadEnvFile(filename) {
  const absolute = path.resolve(filename);
  if (!existsSync(absolute)) return;
  for (const line of (await readFile(absolute, "utf8")).split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] != null) continue;
    process.env[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
}
function env(key, fallback = "") { return process.env[key] ?? fallback; }
function required(key) { const value = env(key); if (!value) throw new Error(`Set ${key} in .env.local.`); return value; }
function list(value) { return value.split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean); }
function normalizeSalt(value) { return !value ? ethers.hexlify(ethers.randomBytes(32)) : /^0x[0-9a-fA-F]{64}$/.test(value) ? value : ethers.id(value); }
function parseSupply(value) {
  if (!value) throw new Error("Set LUNCH_TOTAL_SUPPLY in .env.local.");
  return /^\d+$/.test(value) && BigInt(value) > 10n ** 24n ? BigInt(value) : ethers.parseUnits(value, 18);
}
