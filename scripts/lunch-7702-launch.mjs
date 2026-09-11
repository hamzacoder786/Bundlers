import { Contract, Interface, JsonRpcProvider, Wallet, ethers } from "ethers";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const CHAIN_ID = 4663n;
const LAUNCHER = "0xf5Ac14e7691EF44b15b59FcC6a756e41A3E5EFd6";
const COORDINATOR_ABI = [
  "function owner() view returns(address)",
  "function delegateImplementation() view returns(address)",
  "function launchAndBuy((string name,string symbol,uint256 totalSupply,uint24 fee,(string image,string banner,string description,string website,string twitter,string telegram) meta,bytes32 userSalt,uint256 deadline) params,(address account,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96,uint256 nonce,bytes signature)[] buyers) payable returns(address,uint256,uint256[])",
];
const LAUNCHER_ABI = ["function launchFeeWei() view returns(uint256)", "function enforcedSupply() view returns(uint256)", "function predictTokenAddress(string,string,uint256,address,bytes32) view returns(address)"];
const DELEGATE_ABI = ["function executionNonce() view returns(uint256)"];

await loadEnv(".env"); await loadEnv(".env.local");
const provider = new JsonRpcProvider(required("LUNCH_RPC_URL"), { chainId: 4663, name: "robinhood" }, { staticNetwork: true });
const owner = new Wallet(required("LUNCH_LAUNCHER_PRIVATE_KEY"), provider);
const coordinatorAddress = required("LUNCH_7702_COORDINATOR");
const delegateAddress = required("LUNCH_7702_DELEGATE");
const coordinator = new Contract(coordinatorAddress, COORDINATOR_ABI, owner);
const launcher = new Contract(LAUNCHER, LAUNCHER_ABI, provider);
if ((await coordinator.owner()).toLowerCase() !== owner.address.toLowerCase()) throw new Error("Configured wallet is not coordinator owner.");
if ((await coordinator.delegateImplementation()).toLowerCase() !== delegateAddress.toLowerCase()) throw new Error("Delegate address mismatch.");

const keys = list(required("LUNCH_BUYER_PRIVATE_KEYS"));
const amounts = list(required("LUNCH_BUY_AMOUNTS_ETH"));
const minimums = list(required("LUNCH_MIN_OUT_TOKENS"));
if (!keys.length || keys.length !== amounts.length || keys.length !== minimums.length) throw new Error("Buyer key, amount, and minimum lists must have equal nonzero lengths.");
const wallets = keys.map((key) => new Wallet(normalizeKey(key), provider));
if (new Set(wallets.map((wallet) => wallet.address.toLowerCase())).size !== wallets.length) throw new Error("Duplicate buyer wallet.");

const authorizations = [];
for (const wallet of wallets) {
  const nonce = await provider.getTransactionCount(wallet.address, "pending");
  authorizations.push(await wallet.authorize({ address: delegateAddress, chainId: CHAIN_ID, nonce }));
}
const unsignedBuyers = wallets.map((wallet, index) => ({
  account: wallet.address,
  amountIn: ethers.parseEther(amounts[index]),
  amountOutMinimum: ethers.parseUnits(minimums[index], 18),
  sqrtPriceLimitX96: 0n,
}));
for (const [index, buyer] of unsignedBuyers.entries()) {
  if (buyer.amountIn === 0n || buyer.amountOutMinimum === 0n) throw new Error(`Buyer ${index + 1} amount and minimum must be nonzero.`);
  const balance = await provider.getBalance(buyer.account);
  if (balance < buyer.amountIn) throw new Error(`Buyer ${index + 1} ${buyer.account} lacks ETH for its purchase.`);
}

const enforcedSupply = await launcher.enforcedSupply();
const totalSupply = ethers.parseUnits(required("LUNCH_TOTAL_SUPPLY"), 18);
if (enforcedSupply && totalSupply !== enforcedSupply) throw new Error("Supply does not match launcher-enforced supply.");
const params = {
  name: required("LUNCH_TOKEN_NAME"), symbol: required("LUNCH_TOKEN_SYMBOL"), totalSupply, fee: 10000,
  meta: { image: env("LUNCH_META_IMAGE"), banner: env("LUNCH_META_BANNER"), description: env("LUNCH_META_DESCRIPTION"), website: env("LUNCH_META_WEBSITE"), twitter: env("LUNCH_META_TWITTER"), telegram: env("LUNCH_META_TELEGRAM") },
  userSalt: normalizeSalt(env("LUNCH_USER_SALT")),
  deadline: BigInt(Math.floor(Date.now() / 1000) + Number(env("LUNCH_DEADLINE_SECONDS", "300"))),
};
const predictedToken = await launcher.predictTokenAddress(params.name, params.symbol, totalSupply, coordinatorAddress, params.userSalt);
const buyers = [];
for (const buyer of unsignedBuyers) {
  const code = (await provider.getCode(buyer.account)).toLowerCase();
  const expectedCode = `0xef0100${delegateAddress.slice(2).toLowerCase()}`;
  if (code !== "0x" && code !== expectedCode) throw new Error(`Buyer ${buyer.account} is delegated to unexpected code.`);
  const executionNonce = code === expectedCode ? await new Contract(buyer.account, DELEGATE_ABI, provider).executionNonce() : 0n;
  const wallet = wallets.find((item) => item.address.toLowerCase() === buyer.account.toLowerCase());
  const signature = await wallet.signTypedData(
    { name: "Lunch7702Buyer", version: "1", chainId: CHAIN_ID, verifyingContract: buyer.account },
    { AuthorizedBuy: [
      { name: "token", type: "address" }, { name: "fee", type: "uint24" }, { name: "amountIn", type: "uint256" },
      { name: "amountOutMinimum", type: "uint256" }, { name: "sqrtPriceLimitX96", type: "uint160" },
      { name: "deadline", type: "uint256" }, { name: "nonce", type: "uint256" },
    ] },
    { token: predictedToken, fee: params.fee, amountIn: buyer.amountIn, amountOutMinimum: buyer.amountOutMinimum, sqrtPriceLimitX96: buyer.sqrtPriceLimitX96, deadline: params.deadline, nonce: executionNonce },
  );
  buyers.push({ ...buyer, nonce: executionNonce, signature });
}
const launchFee = await launcher.launchFeeWei();
const data = new Interface(COORDINATOR_ABI).encodeFunctionData("launchAndBuy", [params, buyers]);
const request = { to: coordinatorAddress, data, value: launchFee, authorizationList: authorizations };
await provider.call({ from: owner.address, ...request });
const gasLimit = await provider.estimateGas({ from: owner.address, ...request });
console.log(`Buyer EOAs: ${wallets.map((wallet) => wallet.address).join(", ")}`);
console.log(`Predicted token: ${predictedToken}`);
console.log(`Atomic type-4 simulation passed. Estimated gas ${gasLimit}.`);
const tx = await owner.sendTransaction({ ...request, gasLimit: gasLimit * 125n / 100n });
console.log(`Submitted: https://robinhoodchain.blockscout.com/tx/${tx.hash}`);
const receipt = await tx.wait();
if (receipt.status !== 1) throw new Error("Atomic EIP-7702 transaction reverted.");
console.log(`Confirmed in block ${receipt.blockNumber}. Revoke delegations with npm run lunch:7702:revoke.`);

async function loadEnv(file) { if (!existsSync(file)) return; for (const line of (await readFile(file, "utf8")).split(/\r?\n/)) { const m=line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/); if(m&&process.env[m[1]]==null) process.env[m[1]]=m[2].trim().replace(/^(['"])(.*)\1$/, "$2"); } }
function env(key, fallback="") { return process.env[key] ?? fallback; }
function required(key) { const value=env(key); if(!value) throw new Error(`Set ${key}.`); return value; }
function list(value) { return value.split(/[,;\n]+/).map((v)=>v.trim()).filter(Boolean); }
function normalizeKey(key) { return key.startsWith("0x") ? key : `0x${key}`; }
function normalizeSalt(value) { return !value ? ethers.hexlify(ethers.randomBytes(32)) : /^0x[0-9a-fA-F]{64}$/.test(value) ? value : ethers.id(value); }
