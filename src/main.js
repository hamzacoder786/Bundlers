import { BrowserProvider, Contract, ContractFactory, JsonRpcProvider, Wallet, ethers } from "ethers";
import artifact from "./HRD.artifact.json";
import verification from "./HRD.verification.json";
import "./styles.css";

const app = document.querySelector("#app");
const ROBINHOOD_CHAIN = {
  chainId: 4663,
  chainIdHex: "0x1237",
  chainName: "Robinhood Chain",
  // Never embed the real Alchemy URL/key here — this file ships to the
  // browser as-is, so anything hardcoded here is visible to anyone who
  // opens devtools. MetaMask's wallet_addEthereumChain needs an absolute
  // URL it can hit directly (it can't use a relative path the way our own
  // fetch calls can), so this points back at our own app's /rpc proxy —
  // same one every other RPC call in this app already goes through — which
  // is the only place that reads the real LUNCH_RPC_URL, from .env.local,
  // server-side only.
  get rpcUrl() {
    return `${window.location.origin}/rpc`;
  },
  router: "0x89e5db8b5aa49aa85ac63f691524311aeb649eba",
  currencySymbol: "ETH",
  blockExplorerUrl: "https://robinhoodchain.blockscout.com/",
  blockscoutApiUrl: "https://robinhoodchain.blockscout.com/api",
};
const state = {
  provider: null,
  signer: null,
  contract: null,
  address: "",
  walletMode: "",
  activeFunctionTab: "wallets",
  generatedWallets: [],
  lastDeployTxHash: "",
};

const mmBot = {
  running: false,
  config: null,
  provider: null,
  wallets: [],           // ethers.Wallet[] parsed from pasted keys
  reactiveWallets: [],   // ethers.Wallet[] parsed from pasted reactive keys
  balances: {},           // address -> { eth, token, tokenDecimals }
  stats: {
    startedAt: null,
    totalBuys: 0,
    totalSells: 0,
    reactiveSells: 0,
    totalBuyVolumeEth: 0,
    successfulTrades: 0,
    failedTrades: 0,
    cyclesCompleted: 0,
    lastTradeAt: null,
    lastError: null,
  },
  trades: [],             // { time, action, wallet, amount, unit, hash, status, error }
  loopTimeout: null,
  reactiveFilter: null,
};

const disperse = {
  wallets: [],          // [{ id, address, label, createdAt, privateKey? }] loaded from the server vault
  revealed: false,       // whether private keys are currently shown/loaded
  loading: false,
  log: [],               // { time, message }
};

const inputs = {};
const writeFunctions = artifact.abi.filter((item) => item.type === "function" && item.stateMutability !== "view" && item.stateMutability !== "pure");
const readFunctions = artifact.abi.filter((item) => item.type === "function" && (item.stateMutability === "view" || item.stateMutability === "pure"));

const sidebarTabs = [
  // { id: "write", label: "Write Functions", icon: "✍️" },
  // { id: "read", label: "Read Functions", icon: "📖" },
  // { id: "buy", label: "Buy", icon: "🛒" },
  // { id: "sell", label: "Sell", icon: "💱" },
  // { id: "lp", label: "LP", icon: "💧" },
  // { id: "burn", label: "Burn", icon: "🔥" },
  { id: "accounts", label: "Accounts", icon: "👥" },
  { id: "multisend", label: "Multisend", icon: "📤" },
  { id: "sweep", label: "Collect ETH", icon: "🧹" },
  { id: "mmBot", label: "Market Maker Bot", icon: "🤖" },
  { id: "wallets", label: "Wallets", icon: "🗂️" },
  { id: "projectMgmt", label: "Project Management", icon: "📁" },
  { id: "disperse", label: "Disperse", icon: "🌐" },
  { id: "walletWash", label: "Wallet Wash", icon: "🔄" },
  { id: "walletReport", label: "Check Balance", icon: "📋" },
  { id: "launch", label: "Launch Planner", icon: "🧮" },
  { id: "pons", label: "Pons Launch", icon: "🚀" },
  { id: "ponsWash", label: "Pons + Wash", icon: "🔁" },
  { id: "multiBuys", label: "Multiple Buys", icon: "🛒" },
  { id: "lunch", label: "Lunch.fun Launch", icon: "🍽️" },
  { id: "lunchBurst", label: "Lunch Burst", icon: "💥" },
  { id: "lunchCombo", label: "Lunch + Burst", icon: "⚡" },
  { id: "doppler", label: "Feel Cash", icon: "🌀" },
  { id: "verify", label: "Verify", icon: "✅" },
];
const ROUTER_ABI = [
  "function WETH() external pure returns (address)",
  "function factory() external pure returns (address)",
  "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external payable",
  "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external",
  "function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)",
  "function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) external returns (uint256 amountETH)",
  "function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)",
];
const FACTORY_ABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
];
const PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
];
const LP_ABI = [
  "function approve(address spender, uint256 value) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
];
const PONS_CHAIN = {
  name: "Robinhood Chain",
  id: 4663,
  explorerUrl: "https://robinhoodchain.blockscout.com/",
  // Live, open Family Launchpad proxy (launchEnabled = true). The earlier
  // 0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB factory is a separate,
  // closed instance (launchEnabled = false) that requires owner whitelisting
  // and is not the one used by successful on-chain launches.
  launchContract: "0xF4fC0CD27fC8EcF17E55eE4c3f7201897dF3eb75",
};
const PONS_FACTORY_ABI = [
  "function dexConfigCount() view returns (uint256)",
  "function launchConfigCount() view returns (uint256)",
  "function getDexConfig(uint256 id) view returns (tuple(string name,address factory,address positionManager,address swapRouter,uint24 poolFee,int24 tickSpacing,bool enabled))",
  "function getLaunchConfig(uint256 id) view returns (tuple(address pairToken,uint256 graduationThreshold,int24 initialTick,uint256 supply,uint16 maxWalletBps,uint16 maxTxBps,uint32 restrictionBlocks,uint24 reservedFee,bool enabled,bool routerRequiresDeadline))",
  "function getLaunchedToken(address token) view returns (tuple(address token,address deployer,address pairedToken,address positionManager,uint256 positionId,uint256 dexId,uint256 launchConfigId,uint256 restrictionsEndBlock,uint256 supply,bool isToken0,uint24 poolFee,bool exists,uint256 initialBuyAmount))",
  "function launchEnabled() view returns (bool)",
  "function launchFee() view returns (uint256)",
  "function locker() view returns (address)",
  "function predictTokenAddress((string name,string symbol,string logo,string description,(string twitter,string telegram,string discord,string website,string farcaster) socials,address feeWallet) params,uint256 launchConfigId,uint256 dexId,bytes32 salt,address tokenDeployer) view returns (address)",
  "function launchToken((string name,string symbol,string logo,string description,(string twitter,string telegram,string discord,string website,string farcaster) socials,address feeWallet) params,uint256 launchConfigId,uint256 dexId,bytes32 salt) payable returns (address token)",
  "event TokenLaunched(address indexed token,address indexed deployer,address indexed dexFactory,address pairToken,address pool,uint256 dexId,uint256 launchConfigId,uint256 positionId,uint256 restrictionsEndBlock,uint256 initialBuyAmount)",
  "function owner() view returns (address)",
  "function whitelistedLaunchers(address launcher) view returns (bool)",
  "function setLaunchEnabled(bool enabled) external",
  "function setWhitelistedLauncher(address launcher, bool enabled) external",
];
const V3_FACTORY_ABI = [
  "function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)",
];
const V3_POOL_ABI = [
  "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16,uint16,uint16,uint8,bool)",
  "function liquidity() view returns (uint128)",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
];
// Uniswap V3 pools can't hold native ETH — a token->WETH swap only ever
// lands the wallet WETH, never native ETH. This standard WETH9 interface
// unwraps it afterward so V3 sells actually leave spendable ETH behind.
const WRAPPED_NATIVE_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function withdraw(uint256 amount)",
];
const PONS_ROUTER_ABI = [
  "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)",
  "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 deadline,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)",
];
const PONS_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function liquidityPool() view returns (address)",
  "function restrictionEndBlock() view returns (uint256)",
  "function maxWalletLimit() view returns (uint256)",
  "function maxTxLimit() view returns (uint256)",
];
function makePonsState() {
  return {
    factory: null,
    dexConfig: null,
    launchConfig: null,
    launchFee: 0n,
    launchEnabled: false,
    locker: "",
    predictedToken: "",
    launchedToken: "",
    launchedPool: "",
    restrictionsEndBlock: 0n,
    owner: "",
    isOwner: false,
  };
}
const ponsState = makePonsState();
// The "Pons + Wash" tab runs a second, fully independent Pons launch form
// (id-namespaced with "pw"). Its launch/pool/restriction state must not
// clobber the standalone Pons tab's, so each namespace gets its own state
// object. ns "" -> the standalone tab's module-level ponsState above.
const ponsStatesByNs = { "": ponsState };
function ponsStateFor(ns = "") {
  if (!ponsStatesByNs[ns]) ponsStatesByNs[ns] = makePonsState();
  return ponsStatesByNs[ns];
}
const LUNCH_CHAIN = {
  name: "Robinhood Chain",
  id: 4663,
  explorerUrl: "https://robinhoodchain.blockscout.com/",
  launchContract: "0xf5Ac14e7691EF44b15b59FcC6a756e41A3E5EFd6",
  implementation: "0xc419ba7b9c32103ab8b1a04de4ea2ed518e03749",
  router: "0xCaf681a66D020601342297493863E78C959E5cb2",
  atomicExecutor: "0xCE5D2591C5601c639813c84c169F15c24c3DAe31",
  delegate7702: "0xeC3982E8fB11FA941F73a98Ec7E37d103989C8D6",
  coordinator7702: "0x25373dEf200d9db41ee3691F8534B8133685ED9d",
};
const LUNCH_FACTORY_ABI = [
  "function factory() view returns (address)",
  "function npm() view returns (address)",
  "function xToken() view returns (address)",
  "function feeLocker() view returns (address)",
  "function launchFeeWei() view returns (uint256)",
  "function enforcedSupply() view returns (uint256)",
  "function launchTickMagnitude() view returns (int24)",
  "function midBandTicks() view returns (int24)",
  "function band1DepthWei() view returns (uint256)",
  "function allTokensLength() view returns (uint256)",
  "function predictTokenAddress(string name,string symbol,uint256 totalSupply,address creator,bytes32 userSalt) view returns (address)",
  "function launchWithMetaSalt(string name,string symbol,uint256 totalSupply,uint24 fee,uint256 initialBuyMaxTokens,(string image,string banner,string description,string website,string twitter,string telegram) meta,bytes32 userSalt) payable returns (address token,uint256 tokenId)",
  "event V3TokenLaunched(address indexed token,uint256 indexed tokenId,address indexed creator,address pool,uint24 fee)",
  "event V3BandsLaunched(address indexed token,uint256 curveTokenId,uint256 tailTokenId,int24 launchTick,int24 midTick,uint256 band1Tokens,uint256 band2Tokens)",
  "event V3SaltedLaunch(address indexed token,bytes32 userSalt)",
  "event V3TokenMeta(address indexed token,address indexed creator,string image,string banner,string description,string website,string twitter,string telegram)",
];
const LUNCH_ATOMIC_ABI = [
  "function owner() view returns (address)",
  "function launcher() view returns (address)",
  "function router() view returns (address)",
  "function xToken() view returns (address)",
  "function launchAndBuy((string name,string symbol,uint256 totalSupply,uint24 fee,(string image,string banner,string description,string website,string twitter,string telegram) meta,bytes32 userSalt,uint256 deadline) params,(address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96)[] buys) payable returns (address token,uint256 tokenId,uint256[] amountsOut)",
  "event AtomicLaunch(address indexed token,uint256 indexed tokenId,address indexed controller,uint256 buyCount)",
  "event AtomicBuy(address indexed token,address indexed recipient,uint256 amountIn,uint256 amountOut)",
];
const LUNCH_7702_COORDINATOR_ABI = [
  "function owner() view returns(address)",
  "function launcher() view returns(address)",
  "function delegateImplementation() view returns(address)",
  "function launchAndBuy((string name,string symbol,uint256 totalSupply,uint24 fee,(string image,string banner,string description,string website,string twitter,string telegram) meta,bytes32 userSalt,uint256 deadline) params,(address account,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96,uint256 nonce,bytes signature)[] buyers) payable returns(address,uint256,uint256[])",
];
const LUNCH_7702_DELEGATE_ABI = [
  "function coordinator() view returns(address)", "function router() view returns(address)", "function xToken() view returns(address)",
  "function executionNonce() view returns(uint256)",
];
const LUNCH_7702_BASE_GAS = 600000n;
const LUNCH_7702_GAS_PER_BUYER = 550000n;
const LUNCH_SEQUENCER_RPC = "https://sequencer.mainnet.chain.robinhood.com";
const LUNCH_PRESIGNED_BURST_GAS_LIMIT = 1000000n;
const LUNCH_PRESIGNED_FEE_BUFFER_BPS = 15000n;
const lunchState = {
  factory: null,
  factoryAddress: "",
  npm: "",
  xToken: "",
  feeLocker: "",
  launchFee: 0n,
  enforcedSupply: 0n,
  predictedToken: "",
  launchedToken: "",
  launchedPool: "",
};

// Doppler (Airlock) launch + bundled Uniswap V4 buy tab. Every address below
// was confirmed by decoding a real create() transaction and its logs on
// Robinhood Chain (tx 0x03104945f944e0ff29691185b5f42b99ae156b1359099405b2150078c3787323),
// not guessed. hooks/tickSpacing/dynamicFee are fixed to this deployment's
// poolInitializer and are not caller-editable, matching the deployed
// DopplerAtomicExecutor contract.
const DOPPLER_CHAIN = {
  name: "Robinhood Chain",
  id: 4663,
  explorerUrl: "https://robinhoodchain.blockscout.com/",
  airlock: "0xeb7C034704eF8Dcd2D32324c1545f62fB4aD0862",
  tokenFactory: "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73",
  governanceFactory: "0x1B37D3a72082029c44B35B604Ea473617580b69a",
  poolInitializer: "0x4e3468951D49f2EEa976eD0D6e75fFCb44a9a544",
  liquidityMigrator: "0x4035f7cce90d78307420a987a9e084bfbdc83e2b",
  numeraire: "0xba2F330EDb16cD8056f5988d8CE19BbC63475A0e",
  universalRouter: "0x8876789976dEcBfCbBbe364623C63652db8C0904",
  poolManager: "0x8366a39CC670B4001A1121B8F6A443A643e40951",
  hooks: "0x4e3468951D49f2EEa976eD0D6e75fFCb44a9a544",
  tickSpacing: 200,
  dynamicFeeFlag: 0x800000,
  // Filled in from .env / deploy output once DopplerAtomicExecutor is deployed.
  atomicExecutor: "",
};
const DOPPLER_AIRLOCK_ABI = [
  "function getModuleState(address module) view returns (uint8)",
  "function getAssetData(address asset) view returns (address numeraire,address timelock,address governance,address liquidityMigrator,address poolInitializer,address pool,address migrationPool,uint256 numTokensToSell,uint256 totalSupply,address integrator)",
  "function create((uint256 initialSupply,uint256 numTokensToSell,address numeraire,address tokenFactory,bytes tokenFactoryData,address governanceFactory,bytes governanceFactoryData,address poolInitializer,bytes poolInitializerData,address liquidityMigrator,bytes liquidityMigratorData,address integrator,bytes32 salt) createData) returns (address asset,address pool,address governance,address timelock,address migrationPool)",
  "event Create(address asset,address indexed numeraire,address initializer,address poolOrHook)",
];
const DOPPLER_UNIVERSAL_ROUTER_ABI = [
  "function execute(bytes commands, bytes[] inputs, uint256 deadline) payable",
];
// Universal Router V4_SWAP command and inner action ids, confirmed from a real
// swap transaction against this deployment's Universal Router.
const DOPPLER_CMD_V4_SWAP = "0x10";
const DOPPLER_ACTION_SWAP_EXACT_IN_SINGLE = 0x06;
const DOPPLER_ACTION_SETTLE_ALL = 0x0b;
const DOPPLER_ACTION_TAKE_ALL = 0x0e;
const POOL_KEY_TUPLE = "tuple(address currency0,address currency1,uint24 fee,int24 tickSpacing,address hooks)";
const DOPPLER_ATOMIC_ABI = [
  "function owner() view returns (address)",
  "function airlock() view returns (address)",
  "function router() view returns (address)",
  "function hooks() view returns (address)",
  "function tickSpacing() view returns (int24)",
  "function launchAndBuy((uint256 initialSupply,uint256 numTokensToSell,address numeraire,address tokenFactory,bytes tokenFactoryData,address governanceFactory,bytes governanceFactoryData,address poolInitializer,bytes poolInitializerData,address liquidityMigrator,bytes liquidityMigratorData,address integrator,bytes32 salt) createData,(address recipient,uint256 amountIn,uint256 amountOutMinimum)[] buys,bool numeraireIsNative,uint256 deadline) payable returns (address asset,address pool)",
  "event AtomicLaunch(address indexed asset,address indexed pool,address indexed controller,uint256 buyCount)",
  "event AtomicBuy(address indexed asset,address indexed recipient,uint256 amountIn,uint256 amountOutMinimum)",
];
const dopplerState = {
  predictedAsset: "",
  launchedAsset: "",
  launchedPool: "",
};

function short(value) {
  if (!value) return "";
  return value.length > 18 ? `${value.slice(0, 10)}...${value.slice(-6)}` : value;
}

function parseArray(value) {
  if (!value.trim()) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseArg(input, value) {
  if (input.type.endsWith("[]")) return parseArray(value);
  if (input.type === "bool") return value === true || value === "true";
  return value.trim();
}

function cleanAmount(value, fieldName) {
  const cleaned = String(value ?? "").trim().split(/\s+/)[0];
  if (!cleaned) throw new Error(`${fieldName} is required.`);
  if (!/^\d+(\.\d+)?$/.test(cleaned)) throw new Error(`${fieldName} must be a plain number, for example 1000 or 0.25.`);
  return cleaned;
}

function parseTokenInput(value, decimals, fieldName) {
  return ethers.parseUnits(cleanAmount(value, fieldName), decimals);
}

// Parse a plain ETH (native, 18-decimal) amount string to wei, with the
// same sanitization parseTokenInput uses. "0" is valid and returns 0n
// (callers pass "0" for optional minimums / disabled buyer rows).
function parseEthInput(value, fieldName) {
  return ethers.parseEther(cleanAmount(value, fieldName));
}

function renderInput(id, placeholder = "", type = "text") {
  return `<input id="${escapeHtml(id)}" type="${escapeHtml(type)}" placeholder="${escapeHtml(placeholder)}" autocomplete="off" />`;
}

function renderTextarea(id, placeholder = "") {
  return `<textarea id="${escapeHtml(id)}" placeholder="${escapeHtml(placeholder)}"></textarea>`;
}

function renderTokenImageDrop(id, label) {
  return `
    <div class="token-image-drop" data-token-image-drop="${escapeHtml(id)}">
      <span>${escapeHtml(label)}</span>
      <div class="token-image-drop-box">
        <span class="token-image-drop-icon">^</span>
        <span class="token-image-drop-caption">Paste an image URL</span>
        <span class="token-image-drop-value" data-token-image-drop-value="${escapeHtml(id)}"></span>
        <input id="${escapeHtml(id)}" type="text" placeholder="https://..." autocomplete="off" />
      </div>
    </div>
  `;
}

// An image upload dropzone (see .token-image-drop CSS) — no file picker,
// still a text field you paste a URL into. The value/has-value bookkeeping
// is refreshed by rebindTokenImageDropzones() after every render, since
// render() replaces the relevant DOM nodes.
function rebindTokenImageDropzones() {
  for (const wrapper of document.querySelectorAll("[data-token-image-drop]")) {
    const id = wrapper.dataset.tokenImageDrop;
    const input = document.querySelector(`#${id}`);
    const box = wrapper.querySelector(".token-image-drop-box");
    const valueEl = wrapper.querySelector(`[data-token-image-drop-value="${id}"]`);
    if (!input || !box || !valueEl) continue;
    const sync = () => {
      const hasValue = input.value.trim().length > 0;
      box.classList.toggle("has-value", hasValue);
      valueEl.textContent = hasValue ? input.value.trim() : "";
    };
    sync();
    input.addEventListener("input", sync);
  }
}

// The full Pons Launch tab body, minus the standalone "Multiple Burst Buy"
// section (which is only useful on the dedicated tab). `ns` is prepended to
// every element id so a second, independent copy can live on the
// "Pons + Wash" tab without colliding with the standalone Pons tab. Pass
// "" (the default) to reproduce the standalone tab's exact ids and markup.
function renderPonsBody(ns = "") {
  return `
          <h2>Pons Launch</h2>
          <p class="hint">Mode B: the deployed Pons factory can launch and perform one atomic initial buy only. Additional wallets buy after the launch restriction window lifts, via the Fast Lane (5 wallets) and 3 Burst sections (15 wallets each, 45 total) below; same-block inclusion is not guaranteed and launch-block extra buys are blocked by the token regardless of caller.</p>

          <!-- Hidden, not removed: Network/Contract/Owner Controls still
          populate and function normally under the hood (ponsSwitchNetwork,
          ponsLoadStatus, the owner-control buttons, etc. all still run) —
          just not shown by default in this tab's UI. -->
          <div class="hidden">
          <h2 class="section-gap">Network</h2>
          <div class="grid two">
            <label>Expected chain <input readonly value="${PONS_CHAIN.name} (${PONS_CHAIN.id})" /></label>
            <label>Current block <input id="${ns}ponsCurrentBlock" readonly placeholder="Load status" /></label>
            <label>Primary wallet <input id="${ns}ponsPrimaryWallet" readonly placeholder="Connect MetaMask" /></label>
            <label>Native balance <input id="${ns}ponsPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="${ns}ponsSwitchNetwork" type="button">Switch Network</button>
            <button id="${ns}ponsLoadStatus" type="button">Load Contract Status</button>
          </div>

          <h2 class="section-gap">Contract</h2>
          <div class="grid two">
            <label>Launch contract <input id="${ns}ponsLaunchContract" readonly value="${PONS_CHAIN.launchContract}" /></label>
            <label>Launch fee <input id="${ns}ponsLaunchFee" readonly placeholder="-" /></label>
            <label>Router <input id="${ns}ponsRouter" readonly placeholder="-" /></label>
            <label>Factory <input id="${ns}ponsFactory" readonly placeholder="-" /></label>
            <label>Position manager <input id="${ns}ponsPositionManager" readonly placeholder="-" /></label>
            <label>Wrapped native / pair token <input id="${ns}ponsPairToken" readonly placeholder="-" /></label>
            <label>Launch config ID ${renderInput(`${ns}ponsLaunchConfigId`, "0")}</label>
            <label>DEX config ID ${renderInput(`${ns}ponsDexId`, "0")}</label>
          </div>
          <div class="result" id="${ns}ponsContractResult"></div>

          <h2 class="section-gap">Owner Controls</h2>
          <p class="hint">launchToken() reverts with NotWhitelisted() unless public launching is enabled or the caller is a whitelisted launcher. Only the factory owner can change either setting. Click "Load Contract Status" above first to populate this.</p>
          <div class="grid two">
            <label>Factory owner <input id="${ns}ponsOwner" readonly placeholder="Load contract status" /></label>
            <label>Public launching (launchEnabled) <input id="${ns}ponsLaunchEnabledStatus" readonly placeholder="-" /></label>
            <label>Connected wallet is owner <input id="${ns}ponsIsOwner" readonly placeholder="-" /></label>
            <label>Address to check/whitelist ${renderInput(`${ns}ponsWhitelistAddress`, "blank = connected wallet")}</label>
            <label>Is that address whitelisted <input id="${ns}ponsIsWhitelisted" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="${ns}ponsCheckWhitelist" type="button">Check Whitelist Status</button>
            <button id="${ns}ponsEnableLaunch" type="button">Enable Public Launching</button>
            <button id="${ns}ponsDisableLaunch" type="button">Disable Public Launching</button>
            <button id="${ns}ponsWhitelistAdd" type="button">Whitelist This Address</button>
            <button id="${ns}ponsWhitelistRemove" type="button">Remove From Whitelist</button>
          </div>
          <p class="hint">These calls only succeed if the connected wallet is the factory owner shown above; otherwise the contract itself reverts the transaction.</p>
          <div class="result" id="${ns}ponsOwnerResult"></div>
          </div>

          <div class="function-card section-gap">
            <div class="function-head"><strong>Use Wallets Tab</strong><span>pull Dev/Bundle wallets from the active project's vault</span></div>
            <p class="hint">Connects the project's saved Dev wallet as the signer for this launch, and fills the project's saved Bundle wallets into the Fast Lane/Burst rows below — instead of connecting MetaMask or pasting keys by hand. Requires wallets.reveal permission and a Dev/Bundle wallet already generated in the Wallets tab for this project.</p>
            <div class="button-row">
              <select id="${ns}ponsDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
              <button id="${ns}ponsUseDevWallet" type="button">Connect Dev Wallet</button>
              <button id="${ns}ponsFillBundleWallets" type="button">Fill Bundle Wallets Into Buyer Rows</button>
            </div>
            <div class="result" id="${ns}ponsWalletsTabResult"></div>
          </div>

          <div class="token-info-card">
          <h2 class="section-gap">Token Info</h2>
          ${renderTokenImageDrop(`${ns}ponsLogo`, "Token Image")}
          <div class="grid two">
            <label class="required">Token name ${renderInput(`${ns}ponsTokenName`, "e.g. PepeCoin")}</label>
            <label class="required">Token symbol ${renderInput(`${ns}ponsTokenSymbol`, "PEPE")}</label>
          </div>
          <div class="token-info-description">
            <label>Description ${renderTextarea(`${ns}ponsDescription`, "Describe your token...")}</label>
          </div>
          <div class="grid two">
            <label>Twitter / X (optional) ${renderInput(`${ns}ponsTwitter`, "https://x.com/...")}</label>
            <label>Telegram (optional) ${renderInput(`${ns}ponsTelegram`, "https://t.me/...")}</label>
            <label>Discord (optional) ${renderInput(`${ns}ponsDiscord`, "optional")}</label>
            <label>Website (optional) ${renderInput(`${ns}ponsWebsite`, "https://...")}</label>
            <label>Farcaster (optional) ${renderInput(`${ns}ponsFarcaster`, "optional")}</label>
            <label>Fee wallet / initial buy recipient ${renderInput(`${ns}ponsFeeWallet`, "blank = primary wallet")}</label>
            <label>Salt ${renderInput(`${ns}ponsSalt`, "blank = random bytes32")}</label>
            <label>Slippage % for later buys ${renderInput(`${ns}ponsSlippage`, "5")}</label>
          </div>
          </div>

          <h2 class="section-gap">Atomic Launch Buy (1 wallet)</h2>
          <p class="hint">Row 1 is the only truly atomic buy Pons allows: the primary wallet's initial buy inside launchToken itself. PonsLauncherToken enforces maxWalletLimit/maxTxLimit and blocks all other buys until restrictionEndBlock passes, regardless of who calls the router or whether the caller is a contract — so no additional wallet can be bundled into this same transaction.</p>
          <div id="${ns}ponsBuyerRows" class="buyer-rows">
            ${renderPonsBuyerRows(ns)}
          </div>

          <h2 class="section-gap">Review</h2>
          <p class="hint">Validate All / Execute All at the bottom of this tab run this launch step — there's no standalone button here anymore.</p>
          <div class="result" id="${ns}ponsReviewResult"></div>

          <h2 class="section-gap">Execution</h2>
          <div class="result" id="${ns}ponsExecutionResult"></div>

          <h2 class="section-gap">Fast Lane (5 wallets, fires the instant restrictions lift)</h2>
          <p class="hint">These 5 wallets are prepared before launch and race to submit their own router buys the moment restrictionEndBlock passes — the closest timing Pons allows to a bundle, but not atomic with the launch transaction and not guaranteed to land in the same block as each other. Each wallet spends its own ETH using its own private key, used locally in this page and never stored or transmitted. Validate All / Execute All at the bottom of this tab run this leg — there's no standalone button here anymore.</p>
          <div id="${ns}ponsFastLaneRows" class="buyer-rows">
            ${renderPonsFastLaneRows(ns)}
          </div>
          <div class="result" id="${ns}ponsFastLaneReviewResult"></div>
          <div class="result" id="${ns}ponsFastLaneExecutionResult"></div>

          ${PONS_BURST_SECTIONS.map(({ prefix, label }) => `
          <h2 class="section-gap">${label} (${PONS_BURST_SECTION_SIZE} wallets, not atomic)</h2>
          <p class="hint">Standard burst leg: after restrictions lift, each enabled wallet signs and broadcasts its own router buy in parallel using its own private key and ETH balance. Same-block inclusion is not guaranteed. Validate All / Execute All at the bottom of this tab run this leg — there's no standalone button here anymore.</p>
          <div id="${ns}${prefix}BuyerRows" class="buyer-rows">
            ${renderPonsBurstBuyerRows(prefix, ns)}
          </div>
          <div class="result" id="${ns}${prefix}ReviewResult"></div>
          <div class="result" id="${ns}${prefix}ExecutionResult"></div>
          `).join("")}

          <h2 class="section-gap">Run Everything</h2>
          <div class="function-card pons-all-card">
            <div class="function-head">
              <strong>Run Everything</strong>
              <span>Atomic launch → Fast Lane → Burst 1 → Burst 2 → Burst 3</span>
            </div>
            <p class="hint">Validates and, on a single confirm, executes the launch plus all four wallet legs in sequence: launch fires first, then this waits for restrictionsEndBlock to pass on-chain, then Fast Lane and all three Burst sections broadcast automatically, one after another. Same underlying steps as the individual sections above, just chained from one click, with one combined log below.</p>
            ${ns === "" ? `
            <label class="checkbox-row"><input id="ponsAllThenWash" type="checkbox" checked /> When the bundle finishes, automatically run Wallet Wash: every bundle wallet (Fast Lane + Burst) sells its whole balance through relay wallets into a matched Wash&nbsp;Buy wallet from this project's vault.</label>
            <div class="grid two">
              <label>Wait after bundle before wash starts, seconds ${renderInput("ponsAllWashStartDelay", "30")}</label>
              <label>Slippage % for the wash ${renderInput("ponsAllWashSlippage", "25")}</label>
            </div>
            <div class="grid two">
              <label>Relay wallets per pair ${renderInput("ponsAllWashRelayCount", "2")}</label>
              <label>Delay between hops and pairs, seconds (min-max) ${renderInput("ponsAllWashDelayRange", "20-90")}</label>
            </div>
            <div class="grid two">
              <label>Amount variance % ${renderInput("ponsAllWashVariancePct", "10")}</label>
              <label>Reserve per wallet for its own gas ${renderInput("ponsAllWashGasReserve", "0.0005")}</label>
            </div>
            <label class="checkbox-row"><input id="ponsAllWashUseCrossChain" type="checkbox" /> Route every pair through a disposable Solana wallet instead of same-chain relay wallets</label>
            <div class="grid two">
              <label>Reserve on Solana leg, SOL ${renderInput("ponsAllWashSolanaGasReserve", "0.002")}</label>
            </div>
            <p class="hint">The Solana RPC endpoint is taken from the server's <code>SOLANA_RPC_URL</code> — it is never entered here or exposed to the browser.</p>
            <input id="washTokenAddress" type="hidden" />
            <input id="washSlippage" type="hidden" />
            ` : ""}
            <div class="button-row">
              <button id="${ns}ponsValidateAll" type="button">Validate All</button>
              <button id="${ns}ponsExecuteAll" type="button">Execute All</button>
            </div>
            <div class="result" id="${ns}ponsAllResult"></div>
            ${ns === "" ? `<div class="result" id="ponsAllWashResult"></div>` : ""}
          </div>
  `;
}

function renderPonsBuyerRows(ns = "") {
  const names = ["Primary wallet"];
  return names.map((name, index) => `
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${index + 1}. ${name}</strong>
        <span>atomic launch buy</span>
      </div>
      <label class="checkbox-row"><input id="${ns}ponsBuyerEnabled${index}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Primary wallet / initial buy recipient ${renderInput(`${ns}ponsBuyerAddress${index}`, "blank = connected wallet")}</label>
        <label>Native amount to spend ${renderInput(`${ns}ponsBuyerAmount${index}`, "0.01")}</label>
        <label>Minimum token output <input id="${ns}ponsBuyerMinOut${index}" readonly placeholder="factory uses 0 internally" /></label>
        <label>Available native balance <input id="${ns}ponsBuyerBalance${index}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${ns}ponsBuyerGas${index}" readonly placeholder="-" /></label>
        <label>Signature / tx status <input id="${ns}ponsBuyerStatus${index}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${ns}ponsBuyerHash${index}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${ns}ponsBuyerReceived${index}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("");
}

function renderPonsFastLaneRows(ns = "") {
  const idFor = (field, index) => `${ns}ponsFastLaneBuyer${field}${index}`;
  const names = Array.from({ length: 5 }, (_, i) => `Fast lane wallet ${i + 1}`);
  return names.map((name, index) => `
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${index + 1}. ${name}</strong>
        <span>fast lane order ${index + 1}</span>
      </div>
      <label class="checkbox-row"><input id="${idFor("Enabled", index)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${renderInput(idFor("Key", index), "used locally; never stored", "password")}</label>
        <label>Recipient address ${renderInput(idFor("Address", index), "blank = buyer wallet")}</label>
        <label>Native amount to spend ${renderInput(idFor("Amount", index), "0.01")}</label>
        <label>Minimum token output ${renderInput(idFor("MinOut", index), "required and greater than zero")}</label>
        <label>Available native balance <input id="${idFor("Balance", index)}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${idFor("Gas", index)}" readonly placeholder="-" /></label>
        <label>Transaction status <input id="${idFor("Status", index)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${idFor("Hash", index)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${idFor("Received", index)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("");
}

// Post-launch buy retry tuning — see the comment at its call site in
// executePonsPrivateKeyLegCore. A fixed delay right after the restriction
// wait, plus up to 3 submit attempts per wallet, absorbs the brief window
// where the launch tx's writes are still settling on the RPC node even
// though restrictionsEndBlock has already numerically passed.
const PONS_POST_RESTRICTION_SETTLE_MS = 4_000;
const PONS_BUY_SUBMIT_ATTEMPTS = 3;
const PONS_BUY_RETRY_DELAY_MS = 3_000;

// Burst is split into 3 independently-run sections of 15 wallets each
// (ponsBurst1/2/3, PONS_BURST_SECTIONS below) rather than one 45-wallet
// section — same underlying getPonsPrivateKeyBuyerRows/
// reviewPonsPrivateKeyLeg/executePonsPrivateKeyLeg machinery, just wired
// with 3 different prefixes so each section validates/executes on its own.
const PONS_BURST_SECTION_SIZE = 15;
const PONS_BURST_SECTIONS = [
  { prefix: "ponsBurst1", label: "Burst 1" },
  { prefix: "ponsBurst2", label: "Burst 2" },
  { prefix: "ponsBurst3", label: "Burst 3" },
];

function renderPonsBurstBuyerRows(prefix, ns = "") {
  const idFor = (field, index) => `${ns}${prefix}Buyer${field}${index}`;
  const names = Array.from({ length: PONS_BURST_SECTION_SIZE }, (_, i) => `Buyer wallet ${i + 1}`);
  return names.map((name, index) => `
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${index + 1}. ${name}</strong>
        <span>burst order ${index + 1}</span>
      </div>
      <label class="checkbox-row"><input id="${idFor("Enabled", index)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${renderInput(idFor("Key", index), "used locally; never stored", "password")}</label>
        <label>Recipient address ${renderInput(idFor("Address", index), "blank = buyer wallet")}</label>
        <label>Native amount to spend ${renderInput(idFor("Amount", index), "0.01")}</label>
        <label>Minimum token output ${renderInput(idFor("MinOut", index), "required and greater than zero")}</label>
        <label>Available native balance <input id="${idFor("Balance", index)}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${idFor("Gas", index)}" readonly placeholder="-" /></label>
        <label>Transaction status <input id="${idFor("Status", index)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${idFor("Hash", index)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${idFor("Received", index)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("");
}

function renderMultiBurstRows() {
  const idFor = (field, index) => `multiBurstBuyer${field}${index}`;
  const names = Array.from({ length: 25 }, (_, i) => `Buyer wallet ${i + 1}`);
  return names.map((name, index) => `
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${index + 1}. ${name}</strong>
        <span>burst order ${index + 1}</span>
      </div>
      <label class="checkbox-row"><input id="${idFor("Enabled", index)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${renderInput(idFor("Key", index), "used locally; never stored", "password")}</label>
        <label>Recipient address ${renderInput(idFor("Address", index), "blank = buyer wallet")}</label>
        <label>Native amount to spend ${renderInput(idFor("Amount", index), "0.01")}</label>
        <label>Available native balance <input id="${idFor("Balance", index)}" readonly placeholder="-" /></label>
        <label>Transaction status <input id="${idFor("Status", index)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${idFor("Hash", index)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${idFor("Received", index)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("");
}

function renderLunchBuyerRows(prefix = "lunch") {
  const idFor = (field, index) => (prefix === "lunch" ? `lunchBuyer${field}${index}` : `${prefix}Buyer${field}${index}`);
  const names = ["Primary wallet", "Buyer wallet 1", "Buyer wallet 2", "Buyer wallet 3", "Buyer wallet 4"];
  return names.map((name, index) => `
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${index + 1}. ${name}</strong>
        <span>order ${index + 1}</span>
      </div>
      <label class="checkbox-row"><input id="${idFor("Enabled", index)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${renderInput(idFor("Key", index), "used locally; never stored", "password")}</label>
        <label>${index === 0 ? "Creator / first-buy recipient" : "Recipient address"} ${renderInput(idFor("Address", index), index === 0 ? "blank = connected wallet" : "0x recipient")}</label>
        <label>Native amount to spend ${renderInput(idFor("Amount", index), index === 0 ? "0.01" : "0")}</label>
        <label>Minimum token output ${renderInput(idFor("MinOut", index), "required and greater than zero")}</label>
        <label>Available native balance <input id="${idFor("Balance", index)}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${idFor("Gas", index)}" readonly placeholder="-" /></label>
        <label>Signature / tx status <input id="${idFor("Status", index)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${idFor("Hash", index)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${idFor("Received", index)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("");
}

function renderDopplerBuyerRows() {
  const idFor = (field, index) => `dopplerBuyer${field}${index}`;
  const names = ["Creator / first-buy recipient", "Buyer wallet 2", "Buyer wallet 3", "Buyer wallet 4", "Buyer wallet 5"];
  return names.map((name, index) => `
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${index + 1}. ${name}</strong>
        <span>order ${index + 1}</span>
      </div>
      <label class="checkbox-row"><input id="${idFor("Enabled", index)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Recipient address ${renderInput(idFor("Address", index), index === 0 ? "blank = connected wallet" : "0x recipient")}</label>
        <label>Native amount to spend ${renderInput(idFor("Amount", index), index === 0 ? "0.01" : "0")}</label>
        <label>Minimum token output ${renderInput(idFor("MinOut", index), "required and greater than zero")}</label>
        <label>Estimated gas <input id="${idFor("Gas", index)}" readonly placeholder="-" /></label>
        <label>Status <input id="${idFor("Status", index)}" readonly placeholder="Not started" /></label>
        <label>Token amount received <input id="${idFor("Received", index)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("");
}

function renderDopplerBurstBuyerRows() {
  const idFor = (field, index) => `dopplerBurstBuyer${field}${index}`;
  const names = Array.from({ length: 25 }, (_, i) => `Buyer wallet ${i + 1}`);
  return names.map((name, index) => `
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${index + 1}. ${name}</strong>
        <span>burst order ${index + 1}</span>
      </div>
      <label class="checkbox-row"><input id="${idFor("Enabled", index)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${renderInput(idFor("Key", index), "used locally; never stored", "password")}</label>
        <label>Recipient address ${renderInput(idFor("Address", index), "blank = buyer wallet")}</label>
        <label>Native amount to spend ${renderInput(idFor("Amount", index), "0.01")}</label>
        <label>Minimum token output ${renderInput(idFor("MinOut", index), "required and greater than zero")}</label>
        <label>Available native balance <input id="${idFor("Balance", index)}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${idFor("Gas", index)}" readonly placeholder="-" /></label>
        <label>Transaction status <input id="${idFor("Status", index)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${idFor("Hash", index)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${idFor("Received", index)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("");
}

function renderLunchBurstBuyerRows(prefix = "lunchBurst") {
  const idFor = (field, index) => (prefix === "lunchBurst" ? `lunchBurstBuyer${field}${index}` : `${prefix}BurstBuyer${field}${index}`);
  const names = Array.from({ length: 25 }, (_, i) => `Buyer wallet ${i + 1}`);
  return names.map((name, index) => `
    <article class="function-card buyer-row">
      <div class="function-head">
        <strong>${index + 1}. ${name}</strong>
        <span>burst order ${index + 1}</span>
      </div>
      <label class="checkbox-row"><input id="${idFor("Enabled", index)}" type="checkbox" /> Enabled</label>
      <div class="grid two">
        <label>Buyer wallet private key ${renderInput(idFor("Key", index), "used locally; never stored", "password")}</label>
        <label>Recipient address ${renderInput(idFor("Address", index), "blank = buyer wallet")}</label>
        <label>Native amount to spend ${renderInput(idFor("Amount", index), "0.01")}</label>
        <label>Minimum token output ${renderInput(idFor("MinOut", index), "required and greater than zero")}</label>
        <label>Available native balance <input id="${idFor("Balance", index)}" readonly placeholder="-" /></label>
        <label>Estimated gas <input id="${idFor("Gas", index)}" readonly placeholder="-" /></label>
        <label>Transaction status <input id="${idFor("Status", index)}" readonly placeholder="Not started" /></label>
        <label>Transaction hash <input id="${idFor("Hash", index)}" readonly placeholder="-" /></label>
        <label>Token amount received <input id="${idFor("Received", index)}" readonly placeholder="-" /></label>
      </div>
    </article>
  `).join("");
}

function renderWalletWash(ns = "") {
  return `
    <div class="function-card">
      <h2>Wallet Wash</h2>
    <p class="hint">Sell with Wallet A, route the resulting ETH through disposable relay wallets, then buy with Wallet B using whatever lands there — a direct A→B transfer is a textbook two-node bubble-map edge (same two wallets, same token, back to back), so this deliberately avoids that. It raises the bar against casual clustering; it does not make the flow untraceable — a determined trace can still follow value through the relay hop. Detects the token's pool automatically (V2 or V3) and applies real slippage protection to both sides. Keys are used locally in this page and never stored or transmitted.</p>

      <div class="result" id="${ns}washCrossChainResult"></div>
    </div>

    <div class="function-card section-gap">
      <div class="function-head"><strong>Batch Wash (up to 33 pairs)</strong><span>two groups, paired by position</span></div>
      <p class="hint">Two separate lists of private keys, one per line. Sell wallet on line N funds buy wallet on line N through its own relay hop — sell[1]→relay→buy[1], sell[2]→relay→buy[2], and so on, up to 33 pairs. Each pair's relay hop runs independently with its own randomized amount/timing, and pairs run one after another (not simultaneously) with a delay between them, so it doesn't read as 33 identical actions firing at once.</p>
      <div class="wash-columns">
        <div class="wash-column">
          <h3>Sell Wallets</h3>
          <label class="stacked">Private keys, one per line ${renderTextarea(`${ns}washBatchSellKeys`, "0x_private_key\n0x_private_key\n0x_private_key")}</label>
        </div>
        <div class="wash-column">
          <h3>Buy Wallets</h3>
          <label class="stacked">Private keys, one per line, same order as Sell Wallets ${renderTextarea(`${ns}washBatchBuyKeys`, "0x_private_key\n0x_private_key\n0x_private_key")}</label>
        </div>
      </div>
      <div class="grid two">
        <label>Relay wallets per pair ${renderInput(`${ns}washBatchRelayCount`, "2")}</label>
        <label>Delay between hops and between pairs, seconds (min-max) ${renderInput(`${ns}washBatchDelayRange`, "20-90")}</label>
      </div>
      <div class="grid two">
        <label>Amount variance % ${renderInput(`${ns}washBatchVariancePct`, "10")}</label>
        <label>Reserve per wallet for its own gas ${renderInput(`${ns}washBatchGasReserve`, "0.0005")}</label>
      </div>
      <p class="hint">Each sell wallet always sells its exact, real on-chain balance — read fresh right before selling, no amount to type or get wrong.</p>
      <label><input type="checkbox" id="${ns}washBatchUseCrossChain" /> Route every pair through a disposable Solana wallet instead of same-chain relay wallets (real bridge fees + time per pair — see the Cross-Chain Relay card above for what this does and does not achieve)</label>
      <div class="grid two section-gap">
        <label>Solana RPC URL ${renderInput(`${ns}washBatchSolanaRpcUrl`, "blank = server's SOLANA_RPC_URL")}</label>
        <label>Reserve on Solana leg for fees, SOL ${renderInput(`${ns}washBatchSolanaGasReserve`, "0.002")}</label>
      </div>
      <button id="${ns}washBatchRun" type="button">Run Batch Wash</button>
      <div class="result" id="${ns}washBatchResult"></div>
    </div>
  `;
}

const walletReport = {
  rows: [],   // { address, eth, token, pctSupply }
  tokenAddress: "",
  tokenSymbol: "",
  totalSupply: 0,
};

function renderWalletReport() {
  const rows = walletReport.rows;
  const totalEth = rows.reduce((sum, r) => sum + r.eth, 0);
  const totalTokens = rows.reduce((sum, r) => sum + r.token, 0);
  const totalPct = rows.reduce((sum, r) => sum + r.pctSupply, 0);
  const activeProject = auth.projects.find((p) => p.id === auth.activeProjectId);

  return `
    <h2>Check Balance</h2>
    <p class="hint">Checks every wallet saved in the active project's vault, plus anything freshly pasted below. Reads each wallet's ETH balance, token balance, and % of total supply — no transactions, read-only.</p>

    <div class="function-card">
      <div class="function-head"><strong>Check Balances</strong></div>
      <p class="hint">
        Token: <strong>${activeProject ? (escapeHtml(activeProject.config.tokenAddress) || "not set for this project") : "select a project first"}</strong>
        ${activeProject ? `<span class="hint-secondary"> &mdash; set in Users &amp; Roles &rarr; Projects</span>` : ""}
      </p>
      <p class="hint">Saved wallets in this project: <strong id="balanceCheckSavedCount">${walletReport.savedCount ?? "…"}</strong></p>
      <label class="stacked">Add more wallets by private key, one per line (saved to this project's vault, then checked alongside the rest)
        ${renderTextarea("balanceCheckKeys", "0x_private_key\n0x_private_key\n0x_private_key")}
      </label>
      <p class="hint">Pasted keys are saved (encrypted) to the active project's vault before checking, so you never have to paste them again — leave this blank to just re-check everything already saved.</p>
      <button id="balanceCheckRun" type="button">Run</button>
      <div class="result" id="balanceCheckStatus"></div>
    </div>

    ${rows.length > 0 ? `
    <div class="function-card section-gap">
      <div class="function-head">
        <strong>${esc(walletReport.tokenSymbol || "Token")} — ${short(walletReport.tokenAddress)}</strong>
        <span>${rows.length} wallet(s)</span>
      </div>
      <div class="table-wrap-scroll">
        <table class="disperse-table">
          <thead>
            <tr><th>#</th><th>Address</th><th>ETH</th><th>Token Balance</th><th>% of Supply</th></tr>
          </thead>
          <tbody>
            ${rows.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td class="mono">${r.address}</td>
                <td>${trimNumber(r.eth)}</td>
                <td>${trimNumber(r.token)}</td>
                <td>${r.pctSupply.toFixed(4)}%</td>
              </tr>
            `).join("")}
            <tr>
              <td></td>
              <td><strong>Total</strong></td>
              <td><strong>${trimNumber(totalEth)}</strong></td>
              <td><strong>${trimNumber(totalTokens)}</strong></td>
              <td><strong>${totalPct.toFixed(4)}%</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    ` : ""}
  `;
}

// --- Wallets tab: categorized wallet generation/import/reveal/delete ------
//
// A thin, project-scoped view over the same encrypted vault Disperse uses
// (lib/wallet-vault.mjs) — the only difference is every wallet here carries
// a `category` tag (dev / bundle / wash-buy) so the groups stay visually
// and functionally separate, even though they all live in the same
// "wallets" collection under the hood. Deliberately NOT wired into
// Buy/Sell/Pons/Wallet Wash's own key-paste fields — this tab is a
// generate-and-store convenience, you copy a revealed key into wherever you
// need it, same workflow Disperse already has.
//
// Bundle doubles as Wallet Wash's sell side — there is no separate
// wash-sell category. A Bundle wallet that bought into the launch is
// exactly the wallet that later needs to sell during Wallet Wash, so
// keeping one pool avoids generating/importing the same wallets twice.
const WALLET_CATEGORIES = [
  { id: "dev", label: "Dev Wallets", hint: "Deploys/launches the token. Usually just one — a fresh one per launch, since analysts track creator addresses across launches." },
  { id: "bundle", label: "Bundle Wallets", hint: "Buys in the launch bundle, and doubles as Wallet Wash's sell side later — paired by position with Wash — Buy Wallets below." },
  { id: "wash-buy", label: "Wallet Wash — Buy Wallets", hint: "Buy side of Wallet Wash's Batch Wash — Bundle[N] (selling) funds Wash-Buy[N], matched by the order both lists were saved in." },
];

const walletsTab = {
  wallets: {}, // category id -> array of {id, address, label, createdAt, privateKey?, balanceEth?}
  revealed: {}, // category id -> bool, whether privateKey is currently loaded for that category
  selected: {}, // category id -> Set<address>, checkbox selection for Fund/Collect
};

function walletsTabSelected(categoryId) {
  if (!walletsTab.selected[categoryId]) walletsTab.selected[categoryId] = new Set();
  return walletsTab.selected[categoryId];
}

// The 4 launchpad tabs a project can target — kept in sync with
// lib/projects.mjs's PROJECT_PLATFORMS (server is the source of truth for
// validation; this is just the same 4 for rendering the pills without an
// extra round trip). lunchBurst is deliberately excluded — only these 4
// were asked for as "platforms".
const WALLET_TAB_PLATFORMS = [
  { id: "pons", label: "Pons Launch" },
  { id: "lunch", label: "Lunch.fun Launch" },
  { id: "lunchCombo", label: "Lunch.fun + Burst" },
  { id: "doppler", label: "Feel Cash" },
];

// --- Project Management tab: every accessible project, wallets grouped by
// category, expandable per project. View/reveal/delete only — Fund/Collect
// stay in the Wallets tab, which always operates on whichever project is
// currently active app-wide (see projectFetch). This tab exists specifically
// so you can see wallet counts and detail across ALL your projects without
// switching the active one back and forth.
const projectMgmtTab = {
  expanded: new Set(), // project ids currently expanded
  wallets: {}, // projectId -> { categoryId -> array of wallet rows }
  revealed: {}, // projectId -> { categoryId -> bool }
  counts: {}, // projectId -> { categoryId -> count }, loaded for every project up front (cheap, address-only)
};

// Same shape as projectFetch, but for an explicitly-named project rather
// than always auth.activeProjectId — this tab shows wallets for projects
// that are NOT necessarily the active one.
function projectFetchFor(projectId, url, options = {}) {
  const headers = { ...(options.headers || {}), "X-Project-Id": projectId };
  return fetch(url, { ...options, headers, credentials: "same-origin" });
}

function renderProjectManagementTab() {
  if (auth.projects.length === 0) {
    return `
      <h2>Project Management</h2>
      <p class="hint">No projects yet. Create one in Users &amp; Roles &rarr; Projects.</p>
    `;
  }
  return `
    <h2>Project Management</h2>
    <p class="hint">Every project you have access to, with its wallets grouped by category. Expand a project to see addresses, balances, and reveal/delete individual wallets. To move funds (Fund/Collect), switch to that project and use the Wallets tab.</p>
    ${auth.projects.map((project) => renderProjectMgmtCard(project)).join("")}
  `;
}

function renderLaunchPlanner() {
  return `
    <div class="launch-planner">
      <div class="function-head"><strong>Launch Planner</strong><span>calculation only</span></div>
      <p class="hint">Answer two questions. The total budget is split evenly across the requested wallets, then each wallet's token amount and supply percentage are calculated as the price rises sequentially. A wallet may buy any percentage up to the 5% limit.</p>
      <div class="grid two launch-planner-inputs">
        <label>How many dollars will you spend? ${renderInput("launchPlanBudget", "6900")}</label>
        <label>How many bundle wallets will you use? ${renderInput("launchPlanWalletCount", "100")}</label>
      </div>
      <div class="button-row launch-planner-actions">
        <button id="launchPlanCalculate" type="button">Calculate Launch Plan</button>
        <button id="launchPlanReset" type="button">Reset</button>
      </div>
      <div class="launch-planner-results" id="launchPlanResults" aria-live="polite">
        <p class="hint">Enter your launch assumptions and calculate the bundle plan.</p>
      </div>
    </div>
  `;
}

function calculateLaunchPlan() {
  const resultEl = document.querySelector("#launchPlanResults");
  const budget = Number(inputs.launchPlanBudget.value);
  const walletCount = Number(inputs.launchPlanWalletCount.value);
  const reserve = 0;
  const supply = 1_000_000_000;
  const initialMarketCap = 3_450;
  const finalMarketCapAtSupply = 93_400;
  const maxWalletPct = 5;
  const curve = 3;

  if (![budget, reserve, walletCount, supply, initialMarketCap, finalMarketCapAtSupply, maxWalletPct, curve].every(Number.isFinite)) {
    resultEl.innerHTML = `<p class="result error">Enter numbers in every planning field.</p>`;
    return;
  }
  if (budget <= 0 || reserve < 0 || reserve >= budget || !Number.isInteger(walletCount) || walletCount <= 0 || supply <= 0 || initialMarketCap <= 0 || finalMarketCapAtSupply < initialMarketCap || maxWalletPct <= 0 || curve <= 0) {
    resultEl.innerHTML = `<p class="result error">Check the values: budget must exceed reserve, wallet count must be positive, market caps must be positive, and the wallet limit must be greater than zero.</p>`;
    return;
  }

  const bundleFunds = budget - reserve;
  const fundsPerWallet = bundleFunds / walletCount;
  const maxWalletFraction = maxWalletPct / 100;
  const priceAtSupplyFraction = (fraction) => initialMarketCap + (finalMarketCapAtSupply - initialMarketCap) * (fraction ** curve);
  const rows = [];
  let cumulativeFunds = 0;
  let cumulativeFraction = 0;
  for (let index = 0; index < walletCount && cumulativeFraction < 1 - Number.EPSILON; index += 1) {
    const startFraction = cumulativeFraction;
    const maxFraction = Math.min(1, startFraction + maxWalletFraction);
    const costForFraction = (endFraction) => ((priceAtSupplyFraction(startFraction) + priceAtSupplyFraction(endFraction)) / 2) * (endFraction - startFraction);
    let low = startFraction;
    let high = maxFraction;
    for (let step = 0; step < 60; step += 1) {
      const middle = (low + high) / 2;
      if (costForFraction(middle) <= fundsPerWallet) low = middle;
      else high = middle;
    }
    const nextFraction = low;
    const walletCost = costForFraction(nextFraction);
    if (nextFraction <= startFraction + Number.EPSILON) break;
    cumulativeFunds += walletCost;
    cumulativeFraction = nextFraction;
    rows.push({ index: index + 1, walletCost, walletPct: (nextFraction - startFraction) * 100, cumulativeFunds, marketCap: priceAtSupplyFraction(nextFraction), cumulativePct: cumulativeFraction * 100 });
  }
  const tokensBought = supply * cumulativeFraction;
  const remainingSupply = supply - tokensBought;
  const finalMarketCap = priceAtSupplyFraction(cumulativeFraction);
  const firstPrice = initialMarketCap / supply;
  const finalPrice = finalMarketCap / supply;
  const nextWalletCost = fundsPerWallet;
  const format = (value, maximumFractionDigits = 2) => value.toLocaleString(undefined, { maximumFractionDigits });
  const formatPrice = (value) => `$${value.toFixed(8)}`;
  const budgetStopped = rows.length < walletCount && cumulativeFraction < 1;

  resultEl.innerHTML = `
    <div class="launch-planner-summary">
      <div><span>Requested wallets</span><strong>${format(walletCount, 0)}</strong></div>
      <div><span>Wallets funded</span><strong>${format(rows.length, 0)}</strong></div>
      <div><span>USD spent</span><strong>$${format(cumulativeFunds, 2)}</strong></div>
      <div><span>Supply bought</span><strong>${format(cumulativeFraction * 100, 2)}%</strong></div>
    </div>
    <div class="launch-planner-details">
      <div><span>Tokens bought</span><strong>${format(tokensBought, 0)}</strong></div>
      <div><span>Average per-wallet spend</span><strong>$${format(rows.length ? cumulativeFunds / rows.length : 0, 2)}</strong></div>
      <div><span>Remaining supply</span><strong>${format(remainingSupply, 2)}</strong></div>
      <div><span>Initial price</span><strong>${formatPrice(firstPrice)}</strong></div>
      <div><span>Final price</span><strong>${formatPrice(finalPrice)}</strong></div>
      <div><span>Final market cap</span><strong>$${format(finalMarketCap, 2)}</strong></div>
      <div><span>Budget per wallet</span><strong>$${format(fundsPerWallet, 2)}</strong></div>
    </div>
    <div class="launch-planner-table-wrap"><table class="launch-planner-table"><thead><tr><th>Wallet</th><th>USD this wallet</th><th>Supply this wallet</th><th>Cumulative USD</th><th>Cumulative supply</th><th>Market cap</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row.index}</td><td>$${format(row.walletCost, 2)}</td><td>${format(row.walletPct, 4)}%</td><td>$${format(row.cumulativeFunds, 2)}</td><td>${format(row.cumulativePct, 2)}%</td><td>$${format(row.marketCap, 2)}</td></tr>`).join("")}</tbody></table></div>
    <p class="hint ${budgetStopped ? "launch-planner-warning" : ""}">${budgetStopped ? `The requested budget cannot be distributed across all ${format(walletCount, 0)} wallets without exceeding the ${format(maxWalletPct, 2)}% wallet limit. ${format(rows.length, 0)} wallets were funded; the remaining budget is $${format(bundleFunds - cumulativeFunds, 2)}.` : `The full $${format(bundleFunds, 2)} buy budget is distributed across ${format(walletCount, 0)} wallets. Each wallet's supply percentage is calculated independently and may be different as the price rises.`}</p>
  `;
}

function resetLaunchPlan() {
  inputs.launchPlanBudget.value = "6900";
  inputs.launchPlanWalletCount.value = "100";
  calculateLaunchPlan();
}

function renderProjectMgmtCard(project) {
  const isExpanded = projectMgmtTab.expanded.has(project.id);
  const counts = projectMgmtTab.counts[project.id];
  const countsSummary = counts
    ? WALLET_CATEGORIES.map((cat) => `${counts[cat.id] ?? 0} ${cat.label.replace(" Wallets", "").replace("Wallet Wash — ", "")}`).join(" · ")
    : "Loading counts...";
  const isActive = project.id === auth.activeProjectId;

  // Editable inline — this is normally filled in automatically the moment
  // a launch confirms (see saveLaunchedTokenToProject), but a manual override
  // is still needed for a token launched before that existed, or launched
  // outside this app entirely and just being tracked here.
  const tokenAddressField = auth.canManageProjects
    ? `<div class="project-mgmt-token-row">
        <input type="text" class="mono" data-project-mgmt-token-input="${project.id}" placeholder="0x token address" value="${escapeHtml(project.config?.tokenAddress || "")}" />
        <button type="button" data-project-mgmt-save-token="${project.id}">Save</button>
      </div>
      <div class="result" id="projectMgmtTokenResult_${project.id}"></div>`
    : `<p class="hint mono">${escapeHtml(project.config?.tokenAddress || "no token address set")}</p>`;

  return `
    <div class="function-card section-gap" data-project-mgmt-card="${project.id}">
      <div class="function-head">
        <strong>${escapeHtml(project.name)}${isActive ? ` <span class="active-project-badge">active</span>` : ""}</strong>
        <span>${countsSummary}</span>
      </div>
      ${tokenAddressField}
      <div class="button-row">
        <button type="button" data-project-mgmt-toggle="${project.id}">${isExpanded ? "Collapse" : "Expand"}</button>
        ${isActive ? "" : `<button type="button" data-project-mgmt-switch="${project.id}">Switch To This Project</button>`}
      </div>
      ${isExpanded ? `<div class="project-mgmt-detail section-gap">${renderProjectMgmtDetail(project)}</div>` : ""}
    </div>
  `;
}

function renderProjectMgmtDetail(project) {
  const wallets = projectMgmtTab.wallets[project.id] || {};
  const revealed = projectMgmtTab.revealed[project.id] || {};
  return WALLET_CATEGORIES.map((cat) => {
    const rows = wallets[cat.id];
    const isRevealed = Boolean(revealed[cat.id]);
    if (rows === undefined) {
      return `<div class="project-mgmt-category"><strong>${escapeHtml(cat.label)}</strong> <span class="hint">loading...</span></div>`;
    }
    return `
      <div class="project-mgmt-category">
        <div class="function-head">
          <strong>${escapeHtml(cat.label)}</strong>
          <span>${rows.length} wallet(s)</span>
        </div>
        <div class="button-row">
          <button type="button" data-project-mgmt-reveal="${project.id}:${cat.id}">${isRevealed ? "Hide Keys" : "Reveal Keys"}</button>
        </div>
        ${rows.length > 0 ? `
        <div class="table-wrap-scroll">
          <table class="disperse-table">
            <thead><tr><th>#</th><th>Address</th>${isRevealed ? "<th>Private Key</th>" : ""}<th>Label</th><th></th></tr></thead>
            <tbody>
              ${rows.map((w, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td class="mono">${w.address}</td>
                  ${isRevealed ? `<td class="mono">${escapeHtml(w.privateKey || "")}</td>` : ""}
                  <td>${escapeHtml(w.label || "")}</td>
                  <td><button type="button" class="project-mgmt-delete" data-project="${project.id}" data-category="${cat.id}" data-address="${w.address}">Delete</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>` : ""}
      </div>
    `;
  }).join("");
}

// Loads address-only counts for every category of every accessible project
// — cheap (no key decryption), used to populate the summary line on every
// card without requiring the user to expand each one first.
async function projectMgmtLoadAllCounts() {
  let loadedAny = false;
  for (const project of auth.projects) {
    if (projectMgmtTab.counts[project.id]) continue; // already loaded this session
    const counts = {};
    for (const cat of WALLET_CATEGORIES) {
      try {
        const response = await projectFetchFor(project.id, `/api/wallets?chain=evm&category=${cat.id}`);
        const data = await response.json();
        counts[cat.id] = response.ok ? data.wallets.length : 0;
      } catch {
        counts[cat.id] = 0;
      }
    }
    projectMgmtTab.counts[project.id] = counts;
    loadedAny = true;
  }
  // Only re-render (which re-binds, which calls back into this function) when
  // counts actually changed — otherwise projectMgmtBindEvents ->
  // projectMgmtLoadAllCounts -> projectMgmtRerender -> projectMgmtBindEvents
  // recurses forever the moment every project's counts are already cached.
  if (loadedAny) projectMgmtRerender();
}

async function projectMgmtToggle(projectId) {
  if (projectMgmtTab.expanded.has(projectId)) {
    projectMgmtTab.expanded.delete(projectId);
    projectMgmtRerender();
    return;
  }
  projectMgmtTab.expanded.add(projectId);
  projectMgmtRerender();
  for (const cat of WALLET_CATEGORIES) {
    await projectMgmtLoadCategory(projectId, cat.id, false);
  }
}

async function projectMgmtLoadCategory(projectId, categoryId, reveal) {
  try {
    const response = await projectFetchFor(projectId, `/api/wallets?chain=evm&category=${categoryId}${reveal ? "&reveal=1" : ""}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load wallets.");
    if (!projectMgmtTab.wallets[projectId]) projectMgmtTab.wallets[projectId] = {};
    if (!projectMgmtTab.revealed[projectId]) projectMgmtTab.revealed[projectId] = {};
    projectMgmtTab.wallets[projectId][categoryId] = data.wallets;
    projectMgmtTab.revealed[projectId][categoryId] = reveal;
    if (!projectMgmtTab.counts[projectId]) projectMgmtTab.counts[projectId] = {};
    projectMgmtTab.counts[projectId][categoryId] = data.wallets.length;
    projectMgmtRerenderCard(projectId);
  } catch (error) {
    log(`Project Management: failed to load ${categoryId} wallets for project ${projectId} — ${error.message}`);
  }
}

async function projectMgmtDelete(projectId, categoryId, address) {
  if (!window.confirm(`Remove ${short(address)} from this project's ${categoryId} wallets? This cannot be undone.`)) return;
  try {
    const response = await projectFetchFor(projectId, `/api/wallets?address=${encodeURIComponent(address)}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to remove wallet.");
    log(`Project Management: removed ${short(address)} from project ${projectId}.`);
    const wasRevealed = projectMgmtTab.revealed[projectId]?.[categoryId] || false;
    await projectMgmtLoadCategory(projectId, categoryId, wasRevealed);
  } catch (error) {
    log(`Project Management: delete failed — ${error.message}`);
  }
}

function projectMgmtSwitchTo(projectId) {
  switchActiveProject(projectId);
  const select = document.querySelector("#activeProjectSelect");
  if (select) select.value = projectId;
  projectMgmtRerender();
}

function projectMgmtRerender() {
  const panel = document.querySelector('[data-tab-panel="projectMgmt"]');
  if (!panel) return;
  panel.innerHTML = renderProjectManagementTab();
  projectMgmtBindEvents();
}

function projectMgmtRerenderCard(projectId) {
  const project = auth.projects.find((p) => p.id === projectId);
  const card = document.querySelector(`[data-project-mgmt-card="${projectId}"]`);
  if (!project || !card) return;
  card.outerHTML = renderProjectMgmtCard(project);
  projectMgmtBindCard(projectId);
}

function projectMgmtBindCard(projectId) {
  const card = document.querySelector(`[data-project-mgmt-card="${projectId}"]`);
  if (!card) return;
  card.querySelector(`[data-project-mgmt-toggle="${projectId}"]`)?.addEventListener("click", () => projectMgmtToggle(projectId));
  card.querySelector(`[data-project-mgmt-switch="${projectId}"]`)?.addEventListener("click", () => projectMgmtSwitchTo(projectId));
  card.querySelector(`[data-project-mgmt-save-token="${projectId}"]`)?.addEventListener("click", () => projectMgmtSaveTokenAddress(projectId));
  for (const button of card.querySelectorAll("[data-project-mgmt-reveal]")) {
    const [pid, catId] = button.dataset.projectMgmtReveal.split(":");
    button.addEventListener("click", () => {
      const currentlyRevealed = projectMgmtTab.revealed[pid]?.[catId] || false;
      projectMgmtLoadCategory(pid, catId, !currentlyRevealed);
    });
  }
  for (const button of card.querySelectorAll(".project-mgmt-delete")) {
    button.addEventListener("click", () => projectMgmtDelete(button.dataset.project, button.dataset.category, button.dataset.address));
  }
}

// Manually saves a project's token address from the Project Management tab
// — the second of the two ways a token address ends up on a project
// (the first being automatic, right after a launch confirms — see
// saveLaunchedTokenToProject). Needed for a token launched before that
// existed, or launched outside this app and just being tracked here.
async function projectMgmtSaveTokenAddress(projectId) {
  const input = document.querySelector(`[data-project-mgmt-token-input="${projectId}"]`);
  const resultEl = document.querySelector(`#projectMgmtTokenResult_${projectId}`);
  const tokenAddress = input?.value.trim() || "";
  try {
    if (resultEl) resultEl.textContent = "Saving...";
    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ id: projectId, tokenAddress }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to save token address.");
    const project = auth.projects.find((p) => p.id === projectId);
    if (project) project.config.tokenAddress = tokenAddress;
    if (resultEl) resultEl.textContent = tokenAddress ? "Saved." : "Cleared.";
    log(`Project Management: saved token address for project ${projectId}.`);
  } catch (error) {
    if (resultEl) resultEl.textContent = error.message;
  }
}

function projectMgmtBindEvents() {
  for (const project of auth.projects) projectMgmtBindCard(project.id);
  if (auth.projects.length > 0) projectMgmtLoadAllCounts();
}

function renderWalletsTab() {
  if (!auth.activeProjectId) {
    return `
      <h2>Wallets</h2>
      ${renderWalletsCreateProjectCard()}
      <p class="hint section-gap">Select or create a project (top of the page, or above) to generate or manage its wallets.</p>
    `;
  }
  return `
    <h2>Wallets</h2>
    ${renderWalletsCreateProjectCard()}
    <p class="hint">Generate or import wallets for this project, grouped by what they're used for. Keys are encrypted at rest and only decrypted when you click Reveal.</p>
    ${WALLET_CATEGORIES.map((cat) => renderWalletCategoryCard(cat)).join("")}
    ${renderWalletPlatformCard()}
  `;
}

// A project has to exist before it has wallets — this card was previously
// only reachable from Users & Roles -> Projects, which is easy to miss
// entirely if you land on the Wallets tab first (confirmed live: a real
// account ended up with every wallet crammed into one project because
// nothing on this tab pointed at where "create a project" actually lives).
// Only rendered for users who can actually create projects (projects.manage)
// — same permission the Admin tab's own Projects card already requires.
function renderWalletsCreateProjectCard() {
  if (!auth.canManageProjects) return "";
  return `
    <div class="function-card section-gap">
      <div class="function-head"><strong>Create Project</strong><span>a project is where a token's wallets, config, and launchpad live</span></div>
      <label>Project name ${renderInput("walletsNewProjectName", "e.g. Stoxi")}</label>
      <p class="hint">No token address needed yet — it doesn't exist until you actually launch. Once a launch confirms on any launchpad tab, its token address is saved to this project automatically.</p>
      <button id="walletsCreateProject" type="button">Create Project</button>
      <div class="result" id="walletsCreateProjectResult"></div>
    </div>
  `;
}

function renderWalletPlatformCard() {
  const activeProject = auth.projects.find((p) => p.id === auth.activeProjectId);
  const selected = activeProject?.config?.platform || "";
  return `
    <div class="function-card section-gap" data-wallet-platform-card>
      <div class="function-head"><strong>Platform</strong></div>
      <div class="platform-pill-row">
        ${WALLET_TAB_PLATFORMS.map((p) => `
          <button type="button" class="platform-pill${p.id === selected ? " active" : ""}" data-platform-pill="${p.id}">${escapeHtml(p.label)}</button>
        `).join("")}
      </div>
      <p class="hint">Saves this project's target launchpad and switches you to that tab. Change it any time — it just decides where "Launch" takes you, it does not restrict which tabs you can otherwise open.</p>
      <div class="result" id="walletPlatformResult"></div>
    </div>
  `;
}

function renderWalletCategoryCard(cat) {
  const rows = walletsTab.wallets[cat.id] || [];
  const revealed = walletsTab.revealed[cat.id];
  const selected = walletsTabSelected(cat.id);
  const selectedCount = rows.filter((w) => selected.has(w.address)).length;
  const totalBalance = rows.reduce((sum, w) => sum + (w.balanceEth || 0), 0);

  // Every OTHER category's wallets are valid funding sources (e.g. fund
  // Bundle from Dev) — not this category itself, since funding a wallet
  // from within its own selected set makes no sense (it would need to send
  // to itself or split against itself).
  const otherCategoryOptions = WALLET_CATEGORIES.filter((c) => c.id !== cat.id)
    .flatMap((c) => (walletsTab.wallets[c.id] || []).map((w) => ({ ...w, categoryLabel: c.label })));

  return `
    <div class="function-card section-gap" data-wallet-category="${cat.id}">
      <div class="function-head"><strong>${escapeHtml(cat.label)}</strong><span>${rows.length} saved &middot; ${trimNumber(totalBalance)} ETH total</span></div>
      <p class="hint">${escapeHtml(cat.hint)}</p>
      <div class="grid two">
        <label>Generate count ${renderInput(`walletsGenCount_${cat.id}`, "1")}</label>
        <label>Label, optional ${renderInput(`walletsGenLabel_${cat.id}`, "optional note")}</label>
      </div>
      <div class="button-row">
        <button type="button" data-wallets-generate="${cat.id}">Generate New</button>
        <button type="button" data-wallets-reveal="${cat.id}">${revealed ? "Hide Keys" : "Reveal Keys"}</button>
        <button type="button" data-wallets-balances="${cat.id}">Load Balances</button>
        <button type="button" data-wallets-refresh="${cat.id}">Refresh</button>
      </div>
      <label class="stacked">Import by private key, one per line
        ${renderTextarea(`walletsImportKeys_${cat.id}`, "0x_private_key\n0x_private_key")}
      </label>
      <button type="button" data-wallets-import="${'0x'+cat.id}">Import</button>
      <div class="result" data-wallets-status="${cat.id}"></div>

      ${rows.length > 0 ? `
      <div class="wallets-fund-row section-gap">
        <label>Fund from
          <select id="walletsFundSource_${cat.id}">
            <option value="">Use a pasted key instead...</option>
            ${otherCategoryOptions.map((w) => `<option value="${w.address}">${escapeHtml(w.categoryLabel)} — ${short(w.address)}</option>`).join("")}
          </select>
        </label>
        <label>Or source private key ${renderInput(`walletsFundSourceKey_${cat.id}`, "0x... (used instead of the dropdown)", "password")}</label>
        <label>ETH per wallet ${renderInput(`walletsFundAmount_${cat.id}`, "0.01")}</label>
        <button type="button" data-wallets-fund="${cat.id}">Fund Selected (${selectedCount})</button>
        <label>Collect to ${renderInput(`walletsCollectTo_${cat.id}`, "0x destination")}</label>
        <button type="button" data-wallets-collect="${cat.id}">Collect Selected (${selectedCount}) ETH</button>
      </div>
      <p class="hint">Fund sends the source wallet's key locally in this browser only — never stored or transmitted. Collect sweeps each selected wallet's ETH minus gas back to the destination; a wallet with too little balance to cover gas is skipped, not failed.</p>

      <div class="table-wrap-scroll section-gap">
        <table class="disperse-table">
          <thead><tr>
            <th><input type="checkbox" data-wallets-select-all="${cat.id}" ${rows.length > 0 && selectedCount === rows.length ? "checked" : ""} /></th>
            <th>#</th><th>Address</th><th>ETH</th>${revealed ? "<th>Private Key</th>" : ""}<th>Label</th><th></th>
          </tr></thead>
          <tbody>
            ${rows.map((w, i) => `
              <tr>
                <td><input type="checkbox" class="wallets-select" data-category="${cat.id}" data-address="${w.address}" ${selected.has(w.address) ? "checked" : ""} /></td>
                <td>${i + 1}</td>
                <td class="mono">${w.address}</td>
                <td>${w.balanceEth != null ? trimNumber(w.balanceEth) : "—"}</td>
                ${revealed ? `<td class="mono">${escapeHtml(w.privateKey || "")}</td>` : ""}
                <td>${escapeHtml(w.label || "")}</td>
                <td><button type="button" class="wallets-delete" data-address="${w.address}" data-category="${cat.id}">Delete</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>` : ""}
    </div>
  `;
}

function walletsTabRerender() {
  const panel = document.querySelector('[data-tab-panel="wallets"]');
  if (!panel) return;
  panel.innerHTML = renderWalletsTab();
  walletsTabBindEvents();
}

function walletsTabBindEvents() {
  for (const button of document.querySelectorAll("[data-wallets-generate]")) {
    button.addEventListener("click", () => walletsTabGenerate(button.dataset.walletsGenerate));
  }
  for (const button of document.querySelectorAll("[data-wallets-import]")) {
    button.addEventListener("click", () => walletsTabImport(button.dataset.walletsImport));
  }
  for (const button of document.querySelectorAll("[data-wallets-reveal]")) {
    button.addEventListener("click", () => walletsTabToggleReveal(button.dataset.walletsReveal));
  }
  for (const button of document.querySelectorAll("[data-wallets-balances]")) {
    button.addEventListener("click", () => walletsTabLoadBalances(button.dataset.walletsBalances));
  }
  for (const button of document.querySelectorAll("[data-wallets-refresh]")) {
    button.addEventListener("click", () => walletsTabLoad(button.dataset.walletsRefresh, walletsTab.revealed[button.dataset.walletsRefresh]));
  }
  for (const button of document.querySelectorAll("[data-wallets-fund]")) {
    button.addEventListener("click", () => walletsTabFund(button.dataset.walletsFund));
  }
  for (const button of document.querySelectorAll("[data-wallets-collect]")) {
    button.addEventListener("click", () => walletsTabCollect(button.dataset.walletsCollect));
  }
  for (const checkbox of document.querySelectorAll(".wallets-select")) {
    checkbox.addEventListener("change", () => walletsTabToggleSelect(checkbox.dataset.category, checkbox.dataset.address, checkbox.checked));
  }
  for (const checkbox of document.querySelectorAll("[data-wallets-select-all]")) {
    checkbox.addEventListener("change", () => walletsTabToggleSelectAll(checkbox.dataset.walletsSelectAll, checkbox.checked));
  }
  for (const button of document.querySelectorAll(".wallets-delete")) {
    button.addEventListener("click", () => walletsTabDelete(button.dataset.category, button.dataset.address));
  }
  for (const button of document.querySelectorAll("[data-platform-pill]")) {
    button.addEventListener("click", () => walletsTabSelectPlatform(button.dataset.platformPill));
  }
  document.querySelector("#walletsCreateProject")?.addEventListener("click", walletsTabCreateProject);
  if (auth.activeProjectId) {
    for (const cat of WALLET_CATEGORIES) walletsTabLoad(cat.id, false);
  }
}

// Creates a project directly from the Wallets tab (same /api/admin/projects
// route the Admin tab's own Create Project uses) and immediately switches
// to it, so a brand-new project is ready to receive wallets in one flow
// instead of round-tripping through Users & Roles first.
async function walletsTabCreateProject() {
  const resultEl = document.querySelector("#walletsCreateProjectResult");
  const nameInput = document.querySelector("#walletsNewProjectName");
  const name = nameInput?.value.trim();
  if (!name) {
    if (resultEl) resultEl.textContent = "Enter a project name.";
    return;
  }
  try {
    if (resultEl) resultEl.textContent = "Creating...";
    // No tokenAddress here — it's filled in automatically by
    // saveLaunchedTokenToProject once a launch on any launchpad tab
    // actually confirms, not asked for up front since it doesn't exist yet.
    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to create project.");
    if (resultEl) resultEl.textContent = `Created "${data.project.name}". Switching to it...`;
    await loadProjects();
    await switchActiveProject(data.project.id);
    const select = document.querySelector("#activeProjectSelect");
    if (select) select.value = data.project.id;
    log(`Wallets: created project "${data.project.name}" and switched to it.`);
    walletsTabRerender();
  } catch (error) {
    if (resultEl) resultEl.textContent = error.message;
  }
}

// Saves the active project's target launchpad (shared, persisted config —
// same permission-gated /api/admin/projects route the Admin tab's own
// Projects card uses) and then switches straight to that tab. Requires
// projects.manage, same as editing any other project config — a plain
// project member without that permission gets a clear error here instead
// of silently failing to save while still navigating, which would make the
// pill look "selected" without the change actually having stuck.
// Saves a just-launched token's address to the active project's config —
// called right after every launch flow (Pons, Lunch.fun, Lunch Burst,
// Lunch + Burst, Doppler atomic, Doppler burst) confirms and decodes its
// launch event, not asked for up front at project-creation time. The
// address genuinely doesn't exist until the launch transaction actually
// lands, so there was never a real value to type into "Token contract
// address" when creating a project — this fills it in automatically the
// moment one exists. Deliberately does not throw or block the launch flow
// on failure (e.g. no active project, or a transient save error) — a
// successful on-chain launch should never be reported as failed just
// because a metadata save afterward didn't go through.
async function saveLaunchedTokenToProject(tokenAddress, logPrefix) {
  if (!auth.activeProjectId || !tokenAddress) return;
  try {
    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ id: auth.activeProjectId, tokenAddress }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to save token address.");
    const project = auth.projects.find((p) => p.id === auth.activeProjectId);
    if (project) project.config.tokenAddress = tokenAddress;
    log(`${logPrefix}: saved launched token ${tokenAddress} to the active project's config.`);
  } catch (error) {
    log(`${logPrefix}: could not save the launched token address to the project (${error.message}) — the launch itself still succeeded.`);
  }
}

async function walletsTabSelectPlatform(platformId) {
  const resultEl = document.querySelector("#walletPlatformResult");
  if (!auth.activeProjectId) return;
  try {
    if (resultEl) resultEl.textContent = "Saving...";
    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ id: auth.activeProjectId, platform: platformId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to save platform.");
    const project = auth.projects.find((p) => p.id === auth.activeProjectId);
    if (project) project.config.platform = platformId;
    if (resultEl) resultEl.textContent = `Saved. Switching to ${WALLET_TAB_PLATFORMS.find((p) => p.id === platformId)?.label || platformId}...`;
    state.activeFunctionTab = platformId;
    switchFunctionTabByName(platformId);
    document.querySelector(`[data-tab="${platformId}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    walletsTabRerenderPlatformCard();
  } catch (error) {
    if (resultEl) resultEl.textContent = formatError(error);
  }
}

function walletsTabRerenderPlatformCard() {
  const card = document.querySelector("[data-wallet-platform-card]");
  if (!card) return;
  card.outerHTML = renderWalletPlatformCard();
  for (const button of document.querySelectorAll("[data-platform-pill]")) {
    button.addEventListener("click", () => walletsTabSelectPlatform(button.dataset.platformPill));
  }
}

function walletsTabToggleSelect(categoryId, address, checked) {
  const set = walletsTabSelected(categoryId);
  if (checked) set.add(address); else set.delete(address);
  walletsTabRerenderCategory(categoryId);
}

function walletsTabToggleSelectAll(categoryId, checked) {
  const set = walletsTabSelected(categoryId);
  const rows = walletsTab.wallets[categoryId] || [];
  if (checked) rows.forEach((w) => set.add(w.address));
  else set.clear();
  walletsTabRerenderCategory(categoryId);
}

function walletsTabSay(categoryId, message) {
  const el = document.querySelector(`[data-wallets-status="${categoryId}"]`);
  if (el) el.textContent = message;
}

async function walletsTabLoad(categoryId, reveal) {
  if (!auth.activeProjectId) return;
  try {
    const response = await projectFetch(`/api/wallets?chain=evm&category=${categoryId}${reveal ? "&reveal=1" : ""}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load wallets.");
    walletsTab.wallets[categoryId] = data.wallets;
    walletsTab.revealed[categoryId] = reveal;
    walletsTabRerenderCategory(categoryId);
  } catch (error) {
    walletsTabSay(categoryId, error.message);
  }
}

// Re-renders just the one category card in place, so revealing/refreshing
// one group doesn't blow away the other three groups' own generate-count/
// label/import-textarea inputs the user may be mid-typing into.
function walletsTabRerenderCategory(categoryId) {
  const cat = WALLET_CATEGORIES.find((c) => c.id === categoryId);
  const card = document.querySelector(`[data-wallet-category="${categoryId}"]`);
  if (!cat || !card) return;
  card.outerHTML = renderWalletCategoryCard(cat);
  const newCard = document.querySelector(`[data-wallet-category="${categoryId}"]`);
  newCard.querySelector(`[data-wallets-generate="${categoryId}"]`)?.addEventListener("click", () => walletsTabGenerate(categoryId));
  newCard.querySelector(`[data-wallets-import="${categoryId}"]`)?.addEventListener("click", () => walletsTabImport(categoryId));
  newCard.querySelector(`[data-wallets-reveal="${categoryId}"]`)?.addEventListener("click", () => walletsTabToggleReveal(categoryId));
  newCard.querySelector(`[data-wallets-balances="${categoryId}"]`)?.addEventListener("click", () => walletsTabLoadBalances(categoryId));
  newCard.querySelector(`[data-wallets-refresh="${categoryId}"]`)?.addEventListener("click", () => walletsTabLoad(categoryId, walletsTab.revealed[categoryId]));
  newCard.querySelector(`[data-wallets-fund="${categoryId}"]`)?.addEventListener("click", () => walletsTabFund(categoryId));
  newCard.querySelector(`[data-wallets-collect="${categoryId}"]`)?.addEventListener("click", () => walletsTabCollect(categoryId));
  newCard.querySelector(`[data-wallets-select-all="${categoryId}"]`)?.addEventListener("change", (event) => walletsTabToggleSelectAll(categoryId, event.target.checked));
  for (const checkbox of newCard.querySelectorAll(".wallets-select")) {
    checkbox.addEventListener("change", () => walletsTabToggleSelect(categoryId, checkbox.dataset.address, checkbox.checked));
  }
  for (const button of newCard.querySelectorAll(".wallets-delete")) {
    button.addEventListener("click", () => walletsTabDelete(categoryId, button.dataset.address));
  }
}

function walletsTabToggleReveal(categoryId) {
  walletsTabLoad(categoryId, !walletsTab.revealed[categoryId]);
}

async function walletsTabGenerate(categoryId) {
  if (!auth.activeProjectId) return walletsTabSay(categoryId, "Select a project first.");
  const countInput = document.querySelector(`#walletsGenCount_${categoryId}`);
  const labelInput = document.querySelector(`#walletsGenLabel_${categoryId}`);
  const count = Math.max(1, Math.min(200, parseInt(countInput?.value) || 1));
  const label = labelInput?.value.trim() || "";
  walletsTabSay(categoryId, `Generating ${count} wallet(s)...`);
  try {
    const response = await projectFetch("/api/wallets/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ count, label, category: categoryId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Wallet generation failed.");
    walletsTabSay(categoryId, `Generated ${data.wallets.length} wallet(s).`);
    log(`Wallets (${categoryId}): generated ${data.wallets.length} wallet(s).`);
    await walletsTabLoad(categoryId, walletsTab.revealed[categoryId]);
    if (categoryId === "dev") refreshDevWalletSelects();
  } catch (error) {
    walletsTabSay(categoryId, error.message);
  }
}

async function walletsTabImport(categoryId) {
  if (!auth.activeProjectId) return walletsTabSay(categoryId, "Select a project first.");
  const keysInput = document.querySelector(`#walletsImportKeys_${categoryId}`);
  const keys = mmParseKeys(keysInput?.value || "");
  if (keys.length === 0) return walletsTabSay(categoryId, "Paste at least one private key.");
  walletsTabSay(categoryId, `Importing ${keys.length} wallet(s)...`);
  try {
    const response = await projectFetch("/api/wallets/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ privateKeys: keys, label: "imported", category: categoryId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Wallet import failed.");
    walletsTabSay(categoryId, `Imported ${data.wallets.length} wallet(s). ${keys.length - data.wallets.length > 0 ? `${keys.length - data.wallets.length} skipped (invalid or already saved).` : ""}`);
    log(`Wallets (${categoryId}): imported ${data.wallets.length} wallet(s).`);
    if (keysInput) keysInput.value = "";
    await walletsTabLoad(categoryId, walletsTab.revealed[categoryId]);
    if (categoryId === "dev") refreshDevWalletSelects();
  } catch (error) {
    walletsTabSay(categoryId, error.message);
  }
}

async function walletsTabDelete(categoryId, address) {
  if (!window.confirm(`Remove ${short(address)} from ${categoryId}? This cannot be undone.`)) return;
  try {
    const response = await projectFetch(`/api/wallets?address=${encodeURIComponent(address)}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to remove wallet.");
    walletsTabSay(categoryId, `Removed ${short(address)}.`);
    log(`Wallets (${categoryId}): removed ${short(address)}.`);
    await walletsTabLoad(categoryId, walletsTab.revealed[categoryId]);
    if (categoryId === "dev") refreshDevWalletSelects();
  } catch (error) {
    walletsTabSay(categoryId, error.message);
  }
}

async function walletsTabLoadBalances(categoryId) {
  const rows = walletsTab.wallets[categoryId] || [];
  if (rows.length === 0) return;
  walletsTabSay(categoryId, `Loading ${rows.length} balance(s)...`);
  try {
    const provider = getRpcProvider();
    const balances = await Promise.all(rows.map((w) => provider.getBalance(w.address)));
    rows.forEach((w, i) => { w.balanceEth = Number(ethers.formatEther(balances[i])); });
    walletsTabSay(categoryId, `Loaded ${rows.length} balance(s).`);
    walletsTabRerenderCategory(categoryId);
  } catch (error) {
    walletsTabSay(categoryId, formatError(error));
  }
}

// Fetches decrypted private keys for a specific set of addresses in one
// category, just for the duration of a fund/collect run — the vault's
// reveal endpoint returns every wallet in the category, so this filters
// down to only what's needed rather than holding the whole category's
// decrypted keys in page state any longer than the single operation.
async function walletsTabRevealAddresses(categoryId, addresses) {
  const response = await projectFetch(`/api/wallets?chain=evm&category=${categoryId}&reveal=1`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to reveal wallets.");
  const wanted = new Set(addresses.map((a) => a.toLowerCase()));
  return data.wallets.filter((w) => wanted.has(w.address.toLowerCase()));
}

// Sends ETH from one source wallet to every selected wallet in this
// category, split evenly if "ETH per wallet" is left blank against a fixed
// total... actually kept simple and explicit: the amount field IS the
// per-wallet amount, same convention as Disperse's "split" being the only
// mode exposed here (no separate total-vs-per-wallet toggle, so there's no
// ambiguity about which one a blank field means).
async function walletsTabFund(categoryId) {
  const rows = walletsTab.wallets[categoryId] || [];
  const selected = walletsTabSelected(categoryId);
  const recipients = rows.filter((w) => selected.has(w.address)).map((w) => w.address);
  if (recipients.length === 0) return walletsTabSay(categoryId, "Select at least one wallet to fund.");

  const amountInput = document.querySelector(`#walletsFundAmount_${categoryId}`);
  const amountEth = parseFloat(amountInput?.value);
  if (!amountEth || amountEth <= 0) return walletsTabSay(categoryId, "Enter an ETH amount per wallet greater than zero.");

  const sourceSelect = document.querySelector(`#walletsFundSource_${categoryId}`);
  const sourceKeyInput = document.querySelector(`#walletsFundSourceKey_${categoryId}`);
  const pastedKey = sourceKeyInput?.value.trim();

  const provider = getRpcProvider();
  let source;
  try {
    if (pastedKey) {
      source = new Wallet(pastedKey, provider);
    } else if (sourceSelect?.value) {
      // The dropdown only shows addresses, never keys — resolve the actual
      // key server-side, on demand, right before signing.
      const sourceCategoryId = WALLET_CATEGORIES.find((c) => c.id !== categoryId && (walletsTab.wallets[c.id] || []).some((w) => w.address === sourceSelect.value))?.id;
      if (!sourceCategoryId) throw new Error("Could not find the selected source wallet's category.");
      const [revealedSource] = await walletsTabRevealAddresses(sourceCategoryId, [sourceSelect.value]);
      if (!revealedSource) throw new Error("Could not reveal the selected source wallet's key.");
      source = new Wallet(revealedSource.privateKey, provider);
    } else {
      throw new Error("Pick a source wallet or paste a source private key.");
    }
  } catch (error) {
    walletsTabSay(categoryId, error.message);
    return;
  }

  walletsTabSay(categoryId, `Funding ${recipients.length} wallet(s) with ${trimNumber(amountEth)} ETH each from ${short(source.address)}...`);
  log(`Wallets (${categoryId}): funding ${recipients.length} wallet(s) with ${trimNumber(amountEth)} ETH each from ${short(source.address)}.`);
  let succeeded = 0;
  for (const [index, to] of recipients.entries()) {
    try {
      const tx = await source.sendTransaction({ to, value: ethers.parseEther(trimNumber(amountEth)) });
      await tx.wait();
      log(`Fund ${index + 1}/${recipients.length} to ${short(to)}: ${tx.hash}`);
      succeeded++;
    } catch (error) {
      log(`Fund ${index + 1}/${recipients.length} to ${short(to)} failed: ${formatError(error)}`);
    }
  }
  walletsTabSay(categoryId, `Funded ${succeeded}/${recipients.length} wallet(s). Check log for hashes and failures.`);
  await walletsTabLoadBalances(categoryId);
}

// Sweeps each selected wallet's ETH (minus estimated gas) to a destination
// address — same "leave gas behind, skip if too low" logic as the Collect
// ETH tab's sweepSignerEth, reimplemented here scoped to one category's
// selection instead of a pasted key list, and using this tab's own status
// line instead of the Collect ETH tab's.
async function walletsTabCollect(categoryId) {
  const rows = walletsTab.wallets[categoryId] || [];
  const selected = walletsTabSelected(categoryId);
  const targets = rows.filter((w) => selected.has(w.address)).map((w) => w.address);
  if (targets.length === 0) return walletsTabSay(categoryId, "Select at least one wallet to collect from.");

  const destInput = document.querySelector(`#walletsCollectTo_${categoryId}`);
  const destination = destInput?.value.trim();
  if (!ethers.isAddress(destination || "")) return walletsTabSay(categoryId, "Enter a valid destination address.");

  walletsTabSay(categoryId, `Revealing ${targets.length} wallet key(s)...`);
  let revealedWallets;
  try {
    revealedWallets = await walletsTabRevealAddresses(categoryId, targets);
  } catch (error) {
    walletsTabSay(categoryId, error.message);
    return;
  }

  const provider = getRpcProvider();
  walletsTabSay(categoryId, `Collecting from ${revealedWallets.length} wallet(s) to ${short(destination)}...`);
  log(`Wallets (${categoryId}): collecting from ${revealedWallets.length} wallet(s) to ${short(destination)}.`);
  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const [index, w] of revealedWallets.entries()) {
    try {
      const signer = new Wallet(w.privateKey, provider);
      const balance = await provider.getBalance(w.address);
      const feeData = await provider.getFeeData();
      const estimatedGas = await signer.estimateGas({ to: destination, value: balance > 1n ? 1n : 0n });
      const gasLimit = (estimatedGas * 130n) / 100n;
      const feePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;
      if (feePerGas == null) throw new Error("Could not read gas price from RPC.");
      const gasCost = gasLimit * ((feePerGas * 130n) / 100n);
      const sendValue = balance - gasCost;
      if (sendValue <= 0n) {
        log(`Collect ${index + 1}/${revealedWallets.length}: ${short(w.address)} balance too low (${ethers.formatEther(balance)} ETH, needs ${ethers.formatEther(gasCost)} ETH for gas). Skipped.`);
        skipped++;
        continue;
      }
      const txRequest = { to: destination, value: sendValue, gasLimit };
      if (feeData.maxFeePerGas != null) {
        txRequest.maxFeePerGas = (feeData.maxFeePerGas * 130n) / 100n;
        txRequest.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas != null ? (feeData.maxPriorityFeePerGas * 130n) / 100n : undefined;
      } else {
        txRequest.gasPrice = (feeData.gasPrice * 130n) / 100n;
      }
      const tx = await signer.sendTransaction(txRequest);
      await tx.wait();
      log(`Collect ${index + 1}/${revealedWallets.length} from ${short(w.address)}: ${tx.hash}`);
      sent++;
    } catch (error) {
      failed++;
      log(`Collect ${index + 1}/${revealedWallets.length} from ${short(w.address)} failed: ${formatError(error)}`);
    }
  }
  walletsTabSay(categoryId, `Collected from ${sent}/${revealedWallets.length}. Skipped (too low): ${skipped}. Failed: ${failed}. Check log for hashes.`);
  await walletsTabLoadBalances(categoryId);
}

function renderDisperse() {
  const rows = disperse.wallets;
  return `
    <h2>Disperse</h2>
    <p class="hint">Generate wallets on the server, saved (encrypted) in the database so they persist across sessions — then send ETH or a token from one source wallet to every saved wallet in one flow.</p>

    <div class="function-card">
      <div class="function-head"><strong>Generate Wallets</strong><span>${rows.length} saved</span></div>
      <div class="grid two">
        <label>Wallets to generate ${renderInput("disperseGenerateCount", "10")}</label>
        <label>Label, optional ${renderInput("disperseGenerateLabel", "e.g. batch-1")}</label>
      </div>
      <div class="button-row">
        <button id="disperseGenerate" type="button">Generate &amp; Save</button>
        <button id="disperseLoadWallets" type="button">Load Saved Wallets</button>
        <button id="disperseRevealKeys" type="button">Reveal Private Keys</button>
        <button id="disperseExportJson" type="button">Export JSON</button>
        <button id="disperseExportCsv" type="button">Export CSV</button>
      </div>
      <div class="result" id="disperseWalletResult"></div>
    </div>

    <div class="function-card section-gap">
      <div class="function-head"><strong>Saved Wallets</strong></div>
      <p class="hint">${disperse.revealed ? "Private keys are visible below — treat this screen like a wallet backup. Close it when done." : "Private keys are hidden. Click \"Reveal Private Keys\" to load and display them."}</p>
      <div class="table-wrap-scroll">
        <table class="disperse-table">
          <thead>
            <tr><th>#</th><th>Address</th><th>Label</th>${disperse.revealed ? "<th>Private Key</th>" : ""}<th>Created</th><th></th></tr>
          </thead>
          <tbody id="disperseWalletRows">
            ${rows.length === 0
              ? `<tr><td colspan="6" class="disperse-empty">No wallets loaded yet. Click "Load Saved Wallets".</td></tr>`
              : rows.map((w, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td class="mono">${w.address}</td>
                  <td>${esc(w.label || "-")}</td>
                  ${disperse.revealed ? `<td class="mono">${esc(w.privateKey || "-")}</td>` : ""}
                  <td>${w.createdAt ? new Date(w.createdAt).toLocaleString() : "-"}</td>
                  <td><button type="button" class="disperse-delete" data-address="${w.address}">Remove</button></td>
                </tr>
              `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="function-card section-gap">
      <div class="function-head"><strong>Disperse Transfer</strong></div>
      <p class="hint">Sends from one source wallet's private key to every saved wallet's address above (loads the list automatically if not already loaded).</p>
      <label>Source wallet private key ${renderInput("disperseSourceKey", "0x_private_key", "password")}</label>
      <div class="grid two">
        <label>Asset
          <select id="disperseAsset">
            <option value="eth" selected>ETH</option>
            <option value="token">Token</option>
          </select>
        </label>
        <label>Token address, required for Token ${renderInput("disperseTokenAddress", "blank = current contract")}</label>
      </div>
      <div class="grid two">
        <label>Distribution
          <select id="disperseMode">
            <option value="split" selected>Split total evenly</option>
            <option value="each">Fixed amount per wallet</option>
          </select>
        </label>
        <label>Amount ${renderInput("disperseAmount", "1 total, or per-wallet amount")}</label>
      </div>
      <div class="button-row">
        <button id="disperseRun" type="button">Disperse To Saved Wallets</button>
      </div>
      <div class="result" id="disperseRunResult"></div>
    </div>

    <div class="function-card section-gap">
      <div class="function-head"><strong>Multi-Hop Fund</strong><span>break up the single-source star pattern</span></div>
      <p class="hint">A direct source → many-wallets transfer (Disperse Transfer above) is a textbook star cluster on a bubble map: one bright hub, every spoke funded from the same address, all created together. This routes the same ETH through a middle layer of disposable relay wallets first — source → 2-3 relays → your saved wallets — with a randomized amount and delay on every hop, so no single address is the obvious funder of every wallet. This raises the bar against casual clustering; it does not make the funds untraceable — a determined trace can still follow value through the relays.</p>
      <div class="grid two">
        <label>Source wallet private key ${renderInput("hopSourceKey", "0x_private_key", "password")}</label>
        <label>Relay wallets ${renderInput("hopRelayCount", "3")}</label>
      </div>
      <div class="grid two">
        <label>Total ETH to distribute ${renderInput("hopTotalAmount", "1.0")}</label>
        <label>Delay between hops, seconds (min-max) ${renderInput("hopDelayRange", "20-90")}</label>
      </div>
      <div class="grid two">
        <label>Amount variance % (randomizes each send ± this much) ${renderInput("hopVariancePct", "15")}</label>
        <label>Reserve per relay for its own gas ${renderInput("hopGasReserve", "0.0005")}</label>
      </div>
      <div class="button-row">
        <button id="hopFundRun" type="button">Run Multi-Hop Fund</button>
      </div>
      <div class="result" id="hopFundResult"></div>
    </div>
  `;
}

function renderMarketMakerBot() {
  const s = mmBot.stats;
  const uptimeMs = s.startedAt ? Date.now() - s.startedAt : 0;
  const successRate = s.successfulTrades + s.failedTrades > 0
    ? `${Math.round((s.successfulTrades / (s.successfulTrades + s.failedTrades)) * 100)}%`
    : "--";
  const totals = Object.values(mmBot.balances).reduce((acc, b) => ({ eth: acc.eth + (b.eth || 0), token: acc.token + (b.token || 0) }), { eth: 0, token: 0 });
  const walletCount = mmBot.wallets.length;

  return `
    <div class="mmbot-grid">
      <div class="mmbot-col">
        <div class="function-card mmbot-card">
          <div class="function-head">
            <strong>Market Maker Bot</strong>
            <span class="mmbot-badge ${mmBot.running ? "running" : "stopped"}">${mmBot.running ? "RUNNING" : "STOPPED"}</span>
          </div>
          <label>Token Mint Address ${renderInput("mmTokenAddress", "Enter token contract address")}</label>
          <p class="hint">Trades route through the pool for the Router address set in the Deploy section above — no separate router or pool address needed here.</p>
          <label class="stacked">Wallet private keys, one per line ${renderTextarea("mmWalletKeys", "0x_private_key\n0x_private_key\n0x_private_key")}</label>
          <p class="hint">These wallets place the buy/sell orders. Keys are only used locally in this browser and are never stored or sent anywhere.</p>
          <div class="grid two">
            <label>Wallets to generate ${renderInput("mmGenerateCount", "5")}</label>
            <label>Import wallets.json <input id="mmImportFile" type="file" accept="application/json" /></label>
          </div>
          <div class="button-row mmbot-wallet-actions">
            <button id="mmGenerateWallets" type="button">Generate Wallets</button>
            <button id="mmDownloadWallets" type="button" title="Download market-making-wallets.json">Download Wallets JSON</button>
          </div>
          <div class="result" id="mmWalletResult"></div>
        </div>

        <div class="function-card mmbot-card section-gap">
          <div class="function-head"><strong>Fund Wallets</strong></div>
          <p class="hint">Multisends ETH or tokens from one funding wallet to every bot wallet listed above, split evenly (or a fixed amount each). Runs before the bot starts so wallets have gas/inventory to trade with immediately.</p>
          <label>Funding wallet private key ${renderInput("mmFundingKey", "0x_private_key", "password")}</label>
          <div class="grid two">
            <label>Asset to send
              <select id="mmFundAsset">
                <option value="eth" selected>ETH</option>
                <option value="token">Token</option>
              </select>
            </label>
            <label>Distribution
              <select id="mmFundMode">
                <option value="split" selected>Split total evenly</option>
                <option value="each">Fixed amount per wallet</option>
              </select>
            </label>
          </div>
          <label>Amount ${renderInput("mmFundAmount", "0.5 total, or per-wallet amount")}</label>
          <div class="button-row">
            <button id="mmFundWallets" type="button">Fund Wallets</button>
            <button id="mmFundAndStart" type="button">Fund Wallets &amp; Start Bot</button>
          </div>
          <div class="result" id="mmFundResult"></div>
        </div>

        <div class="function-card mmbot-card section-gap">
          <div class="function-head"><strong>Trade Settings</strong></div>
          <div class="grid two">
            <label>Min Buy (ETH) ${renderInput("mmMinBuy", "0.001")}</label>
            <label>Max Buy (ETH) ${renderInput("mmMaxBuy", "0.01")}</label>
            <label>Min Sell (%) ${renderInput("mmMinSellPct", "10")}</label>
            <label>Max Sell (%) ${renderInput("mmMaxSellPct", "50")}</label>
          </div>
          <label>Sell Hardcap (tokens, 0 = off) ${renderInput("mmSellHardcap", "0")}</label>
          <label class="stacked">Buy Weight
            <input id="mmBuyWeight" type="range" min="0" max="100" value="50" />
          </label>
          <p class="hint" id="mmBuyWeightLabel">Buy: 50% / Sell: 50%</p>
          <div class="grid two">
            <label>Interval
              <select id="mmIntervalUnit">
                <option value="per_minute" selected>Per Minute</option>
                <option value="per_second">Per Second</option>
              </select>
            </label>
            <label class="stacked">Txns: <span id="mmTxnsLabel">2</span>
              <input id="mmTxnsPerUnit" type="range" min="1" max="30" value="2" />
            </label>
          </div>
          <div class="grid two">
            <label>Slippage (%) ${renderInput("mmSlippage", "25")}</label>
            <label>Gas Price, gwei, optional ${renderInput("mmGasPrice", "blank = network suggested")}</label>
            <label>Min ETH Reserve ${renderInput("mmMinReserve", "0.005")}</label>
          </div>
        </div>

        <div class="function-card mmbot-card section-gap">
          <div class="function-head"><strong>Reactive Sell</strong></div>
          <label class="checkbox-row"><input id="mmReactiveEnabled" type="checkbox" /> Enable</label>
          <div class="grid two">
            <label>Reactive sell (%) ${renderInput("mmReactivePct", "50")}</label>
            <label>Reactive sell max tokens, 0 = off ${renderInput("mmReactiveMaxTokens", "0")}</label>
          </div>
          <label class="stacked">Reactive wallet keys, one per line, optional ${renderTextarea("mmReactiveKeys", "blank = use the wallets above")}</label>
          <p class="hint">When enabled, an external buy on this token triggers an automatic sell from the wallets above (or the dedicated reactive wallets), sized as a percentage of the detected buy.</p>
        </div>

        <button id="mmStartStop" class="mmbot-start-btn">${mmBot.running ? "Stop Bot" : "Start Bot"}</button>
      </div>

      <div class="mmbot-col">
        <div class="function-card mmbot-card">
          <div class="function-head"><strong>Live Stats</strong></div>
          <div class="mmbot-stats-grid">
            ${mmStatTile("Uptime", mmBot.running || uptimeMs > 0 ? formatDuration(uptimeMs) : "--", "", "data-mm-uptime")}
            ${mmStatTile("Cycles", s.cyclesCompleted)}
            ${mmStatTile("Total Buys", s.totalBuys, "good")}
            ${mmStatTile("Total Sells", s.totalSells, "bad")}
            ${mmStatTile("Reactive Sells", s.reactiveSells, "accent")}
            ${mmStatTile("Buy Vol (ETH)", trimNumber(s.totalBuyVolumeEth))}
            ${mmStatTile("Success Rate", successRate)}
            ${mmStatTile("Wallets", walletCount)}
            ${mmStatTile("ETH Balance", walletCount ? trimNumber(totals.eth) : "--")}
            ${mmStatTile("Token Balance", walletCount ? trimNumber(totals.token) : "--")}
          </div>
          <div class="mmbot-error-tile">
            <span>Pool</span>
            <strong>${mmPoolLabel()}</strong>
          </div>
          <div class="mmbot-error-tile">
            <span>Last Error</span>
            <strong>${s.lastError ? esc(s.lastError) : "--"}</strong>
          </div>
        </div>

        <div class="function-card mmbot-card section-gap">
          <div class="function-head">
            <strong>Trade Log</strong>
            <span class="mmbot-badge accent">${mmBot.trades.length}</span>
          </div>
          <div class="mmbot-log" id="mmTradeLog">
            ${mmBot.trades.length === 0
              ? `<p class="hint">Bot not started</p>`
              : mmBot.trades.map(mmTradeRow).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function mmStatTile(label, value, tone = "", attr = "") {
  return `<div class="mmbot-stat"><span>${label}</span><strong class="${tone}" ${attr}>${value}</strong></div>`;
}

function mmPoolLabel() {
  const config = mmBot.config;
  if (!config) return "Checked at start";
  if (config.poolVersion === "v3") return `${short(config.v3PoolAddress)} (V3)`;
  if (config.pairAddress) return `${short(config.pairAddress)} (V2)`;
  return "Checked at start";
}

function mmTradeRow(t) {
  const time = new Date(t.time).toLocaleTimeString();
  const tone = t.status === "success" ? "good" : t.status === "skipped" ? "" : "bad";
  const detail = t.status === "success"
    ? `${trimNumber(t.amount)} ${t.unit}${t.hash ? ` · ${short(t.hash)}` : ""}`
    : (t.error || t.status);
  return `<div class="mmbot-log-row ${tone}">
    <span class="mmbot-log-time">${time}</span>
    <span class="mmbot-log-action">${t.action}</span>
    <span class="mmbot-log-wallet">${t.wallet ? short(t.wallet) : "-"}</span>
    <span class="mmbot-log-detail">${esc(detail)}</span>
  </div>`;
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const sec = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function trimNumber(value) {
  const n = Number(value || 0);
  return Number(n.toFixed(6)).toString();
}

function esc(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// ======================== MARKET MAKER BOT ========================

function mmUpdateRangeFill(el) {
  const min = Number(el.min) || 0;
  const max = Number(el.max) || 100;
  const pct = ((Number(el.value) - min) / (max - min)) * 100;
  el.style.setProperty("--range-fill", `${pct}%`);
}

function updateMmBuyWeightLabel(event) {
  const weight = Number(inputs.mmBuyWeight.value);
  document.querySelector("#mmBuyWeightLabel").textContent = `Buy: ${weight}% / Sell: ${100 - weight}%`;
  mmUpdateRangeFill(event ? event.currentTarget : inputs.mmBuyWeight);
}

function updateMmTxnsLabel(event) {
  document.querySelector("#mmTxnsLabel").textContent = inputs.mmTxnsPerUnit.value;
  mmUpdateRangeFill(event ? event.currentTarget : inputs.mmTxnsPerUnit);
}

const MM_INPUT_IDS = [
  "mmTokenAddress", "mmWalletKeys", "mmGenerateCount", "mmImportFile",
  "mmFundingKey", "mmFundAsset", "mmFundMode", "mmFundAmount",
  "mmMinBuy", "mmMaxBuy", "mmMinSellPct", "mmMaxSellPct", "mmSellHardcap", "mmBuyWeight",
  "mmIntervalUnit", "mmTxnsPerUnit", "mmSlippage", "mmGasPrice", "mmMinReserve",
  "mmReactiveEnabled", "mmReactivePct", "mmReactiveMaxTokens", "mmReactiveKeys",
];

// ======================== DISPERSE ========================

function disperseRerender() {
  const panel = document.querySelector('[data-tab-panel="disperse"]');
  if (!panel) return;
  panel.innerHTML = renderDisperse();
  disperseBindEvents();
}

const DISPERSE_INPUT_IDS = [
  "disperseGenerateCount", "disperseGenerateLabel", "disperseSourceKey",
  "disperseAsset", "disperseTokenAddress", "disperseMode", "disperseAmount",
  "hopSourceKey", "hopRelayCount", "hopTotalAmount", "hopDelayRange", "hopVariancePct", "hopGasReserve",
];

function disperseRebindInputs() {
  for (const id of DISPERSE_INPUT_IDS) {
    inputs[id] = document.querySelector(`#${id}`);
  }
}

function disperseBindEvents() {
  disperseRebindInputs();
  document.querySelector("#disperseGenerate").addEventListener("click", disperseGenerateWallets);
  document.querySelector("#disperseLoadWallets").addEventListener("click", () => disperseLoadWallets(false));
  document.querySelector("#disperseRevealKeys").addEventListener("click", () => disperseLoadWallets(true));
  document.querySelector("#disperseExportJson").addEventListener("click", () => disperseExport("json"));
  document.querySelector("#disperseExportCsv").addEventListener("click", () => disperseExport("csv"));
  document.querySelector("#disperseRun").addEventListener("click", disperseRun);
  document.querySelector("#hopFundRun").addEventListener("click", hopFundRun);
  for (const button of document.querySelectorAll(".disperse-delete")) {
    button.addEventListener("click", () => disperseDeleteWallet(button.dataset.address));
  }
}

function sleepMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Splits `total` across `count` shares that individually vary by up to
// ±variancePct%, but always sum to exactly `total` — the last share
// absorbs whatever rounding remainder is left so nothing is lost or
// double-counted.
function randomizedShares(total, count, variancePct) {
  const shares = [];
  let remaining = total;
  for (let i = 0; i < count; i += 1) {
    if (i === count - 1) {
      shares.push(Math.max(0, remaining));
      break;
    }
    const base = remaining / (count - i);
    const variance = base * (variancePct / 100);
    const share = Math.max(0, base + (Math.random() * 2 - 1) * variance);
    shares.push(share);
    remaining -= share;
  }
  return shares;
}

function randomDelayMs(rangeText) {
  const [minStr, maxStr] = rangeText.split("-").map((s) => s.trim());
  const min = Math.max(0, parseFloat(minStr) || 0);
  const max = Math.max(min, parseFloat(maxStr) || min);
  return Math.floor((min + Math.random() * (max - min)) * 1000);
}

// Routes ETH through a middle layer of disposable relay wallets instead of
// sending directly from one source to every saved wallet — breaks up the
// single-hub star pattern a direct disperse creates on a bubble map. This
// raises the bar against casual/basic clustering; it does not make the
// funds untraceable, since a determined trace can still follow value
// through the relay hop. Relay wallets are generated locally, used only for
// this run, and never saved to the vault (their keys are shown at the end
// in case any dust is left stranded and needs sweeping back).
async function hopFundRun() {
  const resultEl = document.querySelector("#hopFundResult");
  const steps = [];
  const push = (line) => {
    steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    resultEl.textContent = steps.join("\n");
    log(`Multi-Hop Fund: ${line}`);
  };

  try {
    const sourceKeyRaw = inputs.hopSourceKey.value.trim();
    if (!sourceKeyRaw) throw new Error("Enter the source wallet's private key.");
    const relayCount = Math.max(2, Math.min(6, parseInt(inputs.hopRelayCount.value) || 3));
    const totalAmount = parseFloat(inputs.hopTotalAmount.value);
    if (!totalAmount || totalAmount <= 0) throw new Error("Enter a total ETH amount greater than zero.");
    const variancePct = Math.max(0, Math.min(90, parseFloat(inputs.hopVariancePct.value) || 15));
    const gasReserve = Math.max(0, parseFloat(inputs.hopGasReserve.value) || 0.0005);
    const delayRangeText = inputs.hopDelayRange.value.trim() || "20-90";

    if (disperse.wallets.length === 0) {
      push("Loading saved wallets first...");
      await disperseLoadWallets(false);
    }
    if (disperse.wallets.length === 0) throw new Error("No saved wallets found. Generate some in the Saved Wallets section first.");

    const provider = getRpcProvider();
    const source = new Wallet(sourceKeyRaw, provider);
    const relays = Array.from({ length: relayCount }, () => Wallet.createRandom().connect(provider));

    push(`Generated ${relayCount} disposable relay wallet(s): ${relays.map((r) => short(r.address)).join(", ")}`);
    push(`Hop 1/2: source ${short(source.address)} → ${relayCount} relay(s), total ${trimNumber(totalAmount)} ETH, randomized ±${variancePct}% per send, ${delayRangeText}s delay between sends.`);

    const relayShares = randomizedShares(totalAmount, relayCount, variancePct);
    for (const [i, relay] of relays.entries()) {
      const amount = relayShares[i];
      if (amount <= 0) continue;
      const tx = await source.sendTransaction({ to: relay.address, value: ethers.parseEther(trimNumber(amount)) });
      push(`  → relay ${i + 1} (${short(relay.address)}): ${trimNumber(amount)} ETH — ${tx.hash}`);
      await tx.wait();
      if (i < relays.length - 1) {
        const delay = randomDelayMs(delayRangeText);
        push(`  waiting ${(delay / 1000).toFixed(1)}s before next hop-1 send...`);
        await sleepMs(delay);
      }
    }

    push(`Hop 2/2: each relay → a shuffled share of the ${disperse.wallets.length} saved wallet(s), reserving ${gasReserve} ETH per relay for its own gas.`);

    const targets = [...disperse.wallets].sort(() => Math.random() - 0.5);
    const perRelayTargets = [];
    for (let i = 0; i < relayCount; i += 1) perRelayTargets.push([]);
    targets.forEach((target, i) => perRelayTargets[i % relayCount].push(target));

    let sentCount = 0;
    for (const [relayIndex, relay] of relays.entries()) {
      const relayTargets = perRelayTargets[relayIndex];
      if (relayTargets.length === 0) continue;
      const relayBalance = Number(ethers.formatEther(await provider.getBalance(relay.address)));
      const spendable = Math.max(0, relayBalance - gasReserve);
      if (spendable <= 0) {
        push(`  relay ${relayIndex + 1} (${short(relay.address)}) has no spendable balance after gas reserve — skipping its ${relayTargets.length} target(s).`);
        continue;
      }
      const shares = randomizedShares(spendable, relayTargets.length, variancePct);
      for (const [i, target] of relayTargets.entries()) {
        const amount = shares[i];
        if (amount <= 0) continue;
        try {
          const tx = await relay.sendTransaction({ to: target.address, value: ethers.parseEther(trimNumber(amount)) });
          push(`  relay ${relayIndex + 1} → ${short(target.address)}: ${trimNumber(amount)} ETH — ${tx.hash}`);
          await tx.wait();
          sentCount++;
        } catch (error) {
          push(`  relay ${relayIndex + 1} → ${short(target.address)} failed: ${error.shortMessage || error.message}`);
        }
        const delay = randomDelayMs(delayRangeText);
        await sleepMs(delay);
      }
    }

    push(`Done: funded ${sentCount}/${disperse.wallets.length} saved wallet(s) via ${relayCount} relay hop(s).`);
    push(`Relay private keys (for sweeping any leftover dust — these were never saved anywhere): ${relays.map((r) => `${short(r.address)}=${r.privateKey}`).join(" | ")}`);
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Multi-Hop Fund failed: ${formatError(error)}`);
  }
}

// ======================== CHECK BALANCE ========================

const BALANCE_CHECK_INPUT_IDS = ["balanceCheckKeys"];

function balanceCheckRebindInputs() {
  for (const id of BALANCE_CHECK_INPUT_IDS) {
    inputs[id] = document.querySelector(`#${id}`);
  }
}

function balanceCheckRerender() {
  const panel = document.querySelector('[data-tab-panel="walletReport"]');
  if (!panel) return;
  panel.innerHTML = renderWalletReport();
  balanceCheckBindEvents();
}

function balanceCheckBindEvents() {
  balanceCheckRebindInputs();
  document.querySelector("#balanceCheckRun").addEventListener("click", balanceCheckRun);
  balanceCheckLoadSavedCount();
}

// Populates the "Saved wallets in this project" count on tab load, without
// requiring a click first — otherwise the field just sits on "…" until Run
// is pressed, which reads as broken rather than merely lazy.
async function balanceCheckLoadSavedCount() {
  const countEl = document.querySelector("#balanceCheckSavedCount");
  if (!countEl || !auth.activeProjectId) return;
  try {
    const response = await projectFetch("/api/wallets?chain=evm");
    const data = await response.json();
    if (response.ok) {
      walletReport.savedCount = data.wallets.length;
      countEl.textContent = String(data.wallets.length);
    }
  } catch { /* leave the placeholder — Run will surface any real error */ }
}

// Read-only report: reads every wallet already saved in the active
// project's vault (by address only — never needs to reveal/decrypt private
// keys just to check a balance), plus any freshly pasted keys, which are
// saved to that same vault first so this list only grows, never needs
// re-pasting. Sends no transactions.
async function balanceCheckRun() {
  const statusEl = document.querySelector("#balanceCheckStatus");
  if (!auth.activeProjectId) {
    statusEl.textContent = "Select a project first (top of the page).";
    return;
  }
  const activeProject = auth.projects.find((p) => p.id === auth.activeProjectId);
  const tokenAddress = activeProject?.config.tokenAddress?.trim();
  if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
    statusEl.textContent = "This project has no valid token address set — add one in Users & Roles → Projects.";
    return;
  }

  const pastedKeys = mmParseKeys(inputs.balanceCheckKeys.value);

  statusEl.textContent = "Loading saved wallets for this project...";
  let addresses;
  try {
    if (pastedKeys.length > 0) {
      statusEl.textContent = `Saving ${pastedKeys.length} new wallet(s) to the project vault...`;
      const saveResponse = await projectFetch("/api/wallets/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ privateKeys: pastedKeys, label: "balance-check" }),
      });
      const saveData = await saveResponse.json();
      if (!saveResponse.ok) throw new Error(saveData.error || "Failed to save pasted wallets.");
      log(`Check Balance: saved ${saveData.wallets.length} new wallet(s) to the project vault.`);
      inputs.balanceCheckKeys.value = "";
    }

    // Addresses only — no wallets.reveal permission required for this.
    const listResponse = await projectFetch("/api/wallets?chain=evm");
    const listData = await listResponse.json();
    if (!listResponse.ok) throw new Error(listData.error || "Failed to load saved wallets.");
    addresses = listData.wallets.map((w) => w.address);
    walletReport.savedCount = addresses.length;
  } catch (error) {
    statusEl.textContent = formatError(error);
    log(`Check Balance failed: ${formatError(error)}`);
    return;
  }

  if (addresses.length === 0) {
    statusEl.textContent = "No wallets saved in this project yet — paste some private keys above to add them.";
    balanceCheckRerender();
    return;
  }

  const provider = getRpcProvider();
  statusEl.textContent = `Checking ${addresses.length} wallet(s)...`;
  try {
    const token = new Contract(tokenAddress, artifact.abi, provider);
    let decimals = 18;
    let symbol = "TOKEN";
    let totalSupplyRaw = 0n;
    try { decimals = Number(await token.decimals()); } catch {}
    try { symbol = await token.symbol(); } catch {}
    try { totalSupplyRaw = await token.totalSupply(); } catch {}
    const totalSupply = Number(ethers.formatUnits(totalSupplyRaw, decimals));

    const rows = await Promise.all(addresses.map(async (address) => {
      const [ethBalRaw, tokenBalRaw] = await Promise.all([
        provider.getBalance(address),
        token.balanceOf(address).catch(() => 0n),
      ]);
      const eth = Number(ethers.formatEther(ethBalRaw));
      const tokenBal = Number(ethers.formatUnits(tokenBalRaw, decimals));
      const pctSupply = totalSupply > 0 ? (tokenBal / totalSupply) * 100 : 0;
      return { address, eth, token: tokenBal, pctSupply };
    }));

    walletReport.rows = rows;
    walletReport.tokenAddress = tokenAddress;
    walletReport.tokenSymbol = symbol;
    walletReport.totalSupply = totalSupply;

    const totalEth = rows.reduce((sum, r) => sum + r.eth, 0);
    const totalPct = rows.reduce((sum, r) => sum + r.pctSupply, 0);
    statusEl.textContent = `Checked ${rows.length} wallet(s). Total ${trimNumber(totalEth)} ETH, ${totalPct.toFixed(4)}% of ${symbol} supply.`;
    log(`Check Balance: ${rows.length} wallet(s) — total ${trimNumber(totalEth)} ETH, ${totalPct.toFixed(4)}% of supply.`);
    balanceCheckRerender();
  } catch (error) {
    statusEl.textContent = formatError(error);
    log(`Check Balance failed: ${formatError(error)}`);
  }
}

async function disperseGenerateWallets() {
  const resultEl = document.querySelector("#disperseWalletResult");
  if (!auth.activeProjectId) { resultEl.textContent = "Select a project first."; return; }
  const count = Math.max(1, Math.min(200, parseInt(inputs.disperseGenerateCount.value) || 10));
  const label = inputs.disperseGenerateLabel.value.trim();
  resultEl.textContent = `Generating ${count} wallet(s) on the server...`;
  try {
    const response = await projectFetch("/api/wallets/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ count, label }),
      credentials: "same-origin",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Wallet generation failed.");
    resultEl.textContent = `Generated and saved ${data.wallets.length} wallet(s). Click "Load Saved Wallets" to see addresses, or "Reveal Private Keys" to see keys.`;
    log(`Disperse: generated ${data.wallets.length} wallet(s).`);
    await disperseLoadWallets(false);
  } catch (error) {
    resultEl.textContent = error.message;
    log(`Disperse generate failed: ${error.message}`);
  }
}

async function disperseLoadWallets(reveal) {
  const resultEl = document.querySelector("#disperseWalletResult");
  if (!auth.activeProjectId) { resultEl.textContent = "Select a project first."; return; }
  resultEl.textContent = reveal ? "Loading wallets with private keys..." : "Loading saved wallets...";
  try {
    const response = await projectFetch(`/api/wallets${reveal ? "?reveal=1" : ""}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load wallets.");
    disperse.wallets = data.wallets;
    disperse.revealed = reveal;
    resultEl.textContent = `Loaded ${data.wallets.length} saved wallet(s).`;
    log(`Disperse: loaded ${data.wallets.length} wallet(s)${reveal ? " with private keys" : ""}.`);
    disperseRerender();
  } catch (error) {
    resultEl.textContent = error.message;
    log(`Disperse load failed: ${error.message}`);
  }
}

async function disperseDeleteWallet(address) {
  if (!window.confirm(`Remove ${short(address)} from the saved wallet vault? This cannot be undone.`)) return;
  const resultEl = document.querySelector("#disperseWalletResult");
  try {
    const response = await projectFetch(`/api/wallets?address=${encodeURIComponent(address)}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to remove wallet.");
    disperse.wallets = disperse.wallets.filter((w) => w.address.toLowerCase() !== address.toLowerCase());
    resultEl.textContent = `Removed ${short(address)}.`;
    log(`Disperse: removed wallet ${short(address)}.`);
    disperseRerender();
  } catch (error) {
    resultEl.textContent = error.message;
  }
}

function disperseExport(format) {
  if (!auth.activeProjectId) { log("Disperse export failed: select a project first."); return; }
  window.open(`/api/wallets/export?format=${format}&projectId=${encodeURIComponent(auth.activeProjectId)}`, "_blank");
  log(`Disperse: exported wallets as ${format.toUpperCase()}.`);
}

async function disperseRun() {
  const resultEl = document.querySelector("#disperseRunResult");
  const sourceKey = inputs.disperseSourceKey.value.trim();
  if (!sourceKey) {
    resultEl.textContent = "Enter the source wallet's private key.";
    return;
  }

  if (disperse.wallets.length === 0) {
    resultEl.textContent = "Loading saved wallets first...";
    await disperseLoadWallets(false);
    if (disperse.wallets.length === 0) {
      resultEl.textContent = "No saved wallets found. Generate some first.";
      return;
    }
  }

  const asset = inputs.disperseAsset.value;
  const tokenAddress = inputs.disperseTokenAddress.value.trim() || state.contract?.target;
  if (asset === "token" && !ethers.isAddress(tokenAddress || "")) {
    resultEl.textContent = "Enter a valid token address (or attach a contract first).";
    return;
  }

  const amountValue = parseFloat(inputs.disperseAmount.value);
  if (!amountValue || amountValue <= 0) {
    resultEl.textContent = "Enter an amount greater than zero.";
    return;
  }

  const mode = inputs.disperseMode.value;
  const recipients = disperse.wallets.map((w) => w.address);
  const perWalletAmount = mode === "split" ? amountValue / recipients.length : amountValue;

  const provider = getRpcProvider();
  let source;
  try {
    source = new Wallet(sourceKey, provider);
  } catch (error) {
    resultEl.textContent = `Invalid source private key — ${error.message}`;
    return;
  }

  resultEl.textContent = `Sending ${trimNumber(perWalletAmount)} ${asset === "eth" ? "ETH" : "token"} to ${recipients.length} saved wallet(s)...`;
  log(`Disperse: sending ${trimNumber(perWalletAmount)} ${asset === "eth" ? "ETH" : "token"} each to ${recipients.length} wallet(s) from ${short(source.address)}.`);

  let token = null;
  let decimals = 18;
  if (asset === "token") {
    token = new Contract(tokenAddress, artifact.abi, source);
    try { decimals = Number(await token.decimals()); } catch {}
  }

  let succeeded = 0;
  for (const [index, to] of recipients.entries()) {
    try {
      const tx = asset === "eth"
        ? await source.sendTransaction({ to, value: ethers.parseEther(trimNumber(perWalletAmount)) })
        : await token.transfer(to, ethers.parseUnits(trimNumber(perWalletAmount), decimals));
      await tx.wait();
      log(`Disperse ${index + 1}/${recipients.length} to ${short(to)}: ${tx.hash}`);
      succeeded++;
    } catch (error) {
      log(`Disperse ${index + 1}/${recipients.length} to ${short(to)} failed: ${error.shortMessage || error.message}`);
    }
  }

  resultEl.textContent = `Dispersed to ${succeeded}/${recipients.length} wallet(s). Check log for hashes and failures.`;
}

function mmRender() {
  const panel = document.querySelector('[data-tab-panel="mmBot"]');
  if (!panel) return;
  panel.innerHTML = renderMarketMakerBot();
  mmRebindInputs();
  mmBindEvents();
}

// mmRender() replaces this panel's innerHTML on every trade cycle, which
// detaches the DOM nodes `inputs.mm*` pointed at — re-query them each time
// or config reads (mmMinBuy, mmSlippage, etc.) go stale/undefined.
function mmRebindInputs() {
  for (const id of MM_INPUT_IDS) {
    inputs[id] = document.querySelector(`#${id}`);
  }
}

function mmBindEvents() {
  document.querySelector("#mmStartStop").addEventListener("click", toggleMarketMakerBot);
  document.querySelector("#mmBuyWeight").addEventListener("input", updateMmBuyWeightLabel);
  document.querySelector("#mmTxnsPerUnit").addEventListener("input", updateMmTxnsLabel);
  mmUpdateRangeFill(inputs.mmBuyWeight);
  mmUpdateRangeFill(inputs.mmTxnsPerUnit);
  document.querySelector("#mmGenerateWallets").addEventListener("click", mmGenerateWallets);
  document.querySelector("#mmDownloadWallets").addEventListener("click", mmDownloadWallets);
  document.querySelector("#mmImportFile").addEventListener("change", mmImportWalletsFile);
  document.querySelector("#mmFundWallets").addEventListener("click", () => mmFundWallets(false));
  document.querySelector("#mmFundAndStart").addEventListener("click", () => mmFundWallets(true));
}

// Multisends ETH or the project token from one funding wallet to every bot
// wallet in the "Wallet private keys" textarea, so they have gas/inventory
// before the bot starts trading. `startAfter` chains straight into the bot.
async function mmFundWallets(startAfter) {
  const resultEl = document.querySelector("#mmFundResult");
  const fundingKey = inputs.mmFundingKey.value.trim();
  if (!fundingKey) {
    resultEl.textContent = "Enter the funding wallet's private key.";
    return;
  }

  const walletKeys = mmParseKeys(inputs.mmWalletKeys.value);
  if (walletKeys.length === 0) {
    resultEl.textContent = "Add bot wallets first (paste keys, generate, or import).";
    return;
  }

  const tokenAddress = inputs.mmTokenAddress.value.trim() || state.contract?.target;
  const asset = inputs.mmFundAsset.value;
  if (asset === "token" && !ethers.isAddress(tokenAddress || "")) {
    resultEl.textContent = "Enter a valid Token Mint Address first — required to send tokens.";
    return;
  }

  const amountValue = parseFloat(inputs.mmFundAmount.value);
  if (!amountValue || amountValue <= 0) {
    resultEl.textContent = "Enter an amount greater than zero.";
    return;
  }

  const mode = inputs.mmFundMode.value; // "split" total across wallets, or "each" fixed per wallet
  const perWalletAmount = mode === "split" ? amountValue / walletKeys.length : amountValue;

  const provider = getRpcProvider();
  let funder;
  try {
    funder = new Wallet(fundingKey, provider);
  } catch (error) {
    resultEl.textContent = `Invalid funding private key — ${error.message}`;
    return;
  }

  const recipients = walletKeys.map((key) => new Wallet(key).address);
  resultEl.textContent = `Sending ${trimNumber(perWalletAmount)} ${asset === "eth" ? "ETH" : "token"} to ${recipients.length} wallet(s)...`;
  log(`Market Maker Bot: funding ${recipients.length} wallet(s) with ${trimNumber(perWalletAmount)} ${asset === "eth" ? "ETH" : "token"} each from ${short(funder.address)}.`);

  let token = null;
  let decimals = 18;
  if (asset === "token") {
    token = new Contract(tokenAddress, artifact.abi, funder);
    try { decimals = Number(await token.decimals()); } catch {}
  }

  let succeeded = 0;
  for (const [index, to] of recipients.entries()) {
    try {
      const tx = asset === "eth"
        ? await funder.sendTransaction({ to, value: ethers.parseEther(trimNumber(perWalletAmount)) })
        : await token.transfer(to, ethers.parseUnits(trimNumber(perWalletAmount), decimals));
      await tx.wait();
      log(`Fund ${index + 1}/${recipients.length} to ${short(to)}: ${tx.hash}`);
      succeeded++;
    } catch (error) {
      log(`Fund ${index + 1}/${recipients.length} to ${short(to)} failed: ${error.shortMessage || error.message}`);
    }
  }

  resultEl.textContent = `Funded ${succeeded}/${recipients.length} wallet(s) with ${trimNumber(perWalletAmount)} ${asset === "eth" ? "ETH" : "token"} each. Check log for hashes and failures.`;

  if (startAfter && succeeded > 0) {
    await startMarketMakerBot();
  }
}

// Looks up a tradeable pool for tokenAddress/WETH, trying Uniswap V2 first
// (the router/factory this app's Buy/Sell/LP tabs already use) and falling
// back to the Uniswap V3 venue Pons-launched tokens use (no V2 pair exists
// for those — confirmed on-chain: BAGGS-style Pons launches are V3-only).
// Refuses to trade against a nonexistent or empty pool instead of blindly
// submitting swaps that revert.
async function mmCheckPool(provider, routerAddress, tokenAddress) {
  const v2 = await mmCheckPoolV2(provider, routerAddress, tokenAddress);
  if (v2.exists) return v2;

  const v3 = await mmCheckPoolV3(provider, tokenAddress);
  if (v3.exists) return v3;

  return {
    exists: false,
    error: `No V2 pool (${v2.error}) and no V3 pool (${v3.error}).`,
  };
}

async function mmCheckPoolV2(provider, routerAddress, tokenAddress) {
  try {
    const router = new Contract(routerAddress, ROUTER_ABI, provider);
    const [weth, factoryAddress] = await Promise.all([router.WETH(), router.factory()]);
    const factory = new Contract(factoryAddress, FACTORY_ABI, provider);
    const pairAddress = await factory.getPair(tokenAddress, weth);
    if (!pairAddress || pairAddress === ethers.ZeroAddress) {
      return { exists: false, error: "factory has no V2 pair for this token/WETH" };
    }
    const pair = new Contract(pairAddress, PAIR_ABI, provider);
    const [reserve0, reserve1] = await pair.getReserves();
    const token0 = await pair.token0();
    const isToken0 = token0.toLowerCase() === tokenAddress.toLowerCase();
    const tokenReserveRaw = isToken0 ? reserve0 : reserve1;
    const wethReserveRaw = isToken0 ? reserve1 : reserve0;
    if (tokenReserveRaw === 0n || wethReserveRaw === 0n) {
      return { exists: false, pairAddress, error: "V2 pair exists but has zero reserves" };
    }
    return {
      exists: true,
      version: "v2",
      pairAddress,
      wethReserve: Number(ethers.formatEther(wethReserveRaw)),
      tokenReserve: Number(ethers.formatUnits(tokenReserveRaw, 18)),
    };
  } catch (error) {
    return { exists: false, error: error.shortMessage || error.message };
  }
}

// Probes the Pons factory's configured Uniswap V3 venue (dexConfig 0) — the
// only V3 factory/router this app currently knows about. If a project uses a
// different V3 deployment, this won't find it; V2 stays the primary path.
async function mmCheckPoolV3(provider, tokenAddress) {
  try {
    const ponsFactory = getPonsFactory(provider);
    const dexConfig = await ponsFactory.getDexConfig(0);
    if (!dexConfig.enabled || !dexConfig.factory || dexConfig.factory === ethers.ZeroAddress) {
      return { exists: false, error: "no V3 DEX config available" };
    }
    const v3Factory = new Contract(dexConfig.factory, V3_FACTORY_ABI, provider);
    const wethAddress = ROBINHOOD_CHAIN.router
      ? await new Contract(ROBINHOOD_CHAIN.router, ROUTER_ABI, provider).WETH()
      : null;
    if (!wethAddress) return { exists: false, error: "could not resolve WETH address" };
    const poolAddress = await v3Factory.getPool(tokenAddress, wethAddress, dexConfig.poolFee);
    if (!poolAddress || poolAddress === ethers.ZeroAddress) {
      return { exists: false, error: "no V3 pool for this token/WETH at the known fee tier" };
    }
    const pool = new Contract(poolAddress, V3_POOL_ABI, provider);
    const [liquidity, token0] = await Promise.all([pool.liquidity(), pool.token0()]);
    if (liquidity === 0n) {
      return { exists: false, poolAddress, error: "V3 pool exists but has zero liquidity" };
    }
    return {
      exists: true,
      version: "v3",
      poolAddress,
      wethAddress,
      swapRouter: dexConfig.swapRouter,
      poolFee: dexConfig.poolFee,
      isToken0: token0.toLowerCase() === tokenAddress.toLowerCase(),
    };
  } catch (error) {
    return { exists: false, error: error.shortMessage || error.message };
  }
}

function mmParseKeys(value) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function mmGenerateWallets() {
  const count = Math.max(1, Math.min(200, parseInt(inputs.mmGenerateCount.value) || 5));
  const wallets = Array.from({ length: count }, () => Wallet.createRandom());
  inputs.mmWalletKeys.value = wallets.map((w) => w.privateKey).join("\n");
  mmBot.lastGenerated = wallets.map((w) => ({ address: w.address, privateKey: w.privateKey }));
  document.querySelector("#mmWalletResult").textContent = `Generated ${count} wallet(s) locally. Download the JSON to keep a copy, or start the bot with them now.`;
  log(`Market Maker Bot: generated ${count} fresh wallet(s) locally.`);
}

function mmDownloadWallets() {
  const keys = mmParseKeys(inputs.mmWalletKeys.value);
  if (keys.length === 0) {
    document.querySelector("#mmWalletResult").textContent = "Generate or paste wallet keys first.";
    return;
  }
  let wallets;
  try {
    wallets = keys.map((key) => {
      const wallet = new Wallet(key);
      return { address: wallet.address, privateKey: wallet.privateKey };
    });
  } catch (error) {
    document.querySelector("#mmWalletResult").textContent = `Invalid private key — ${error.message}`;
    return;
  }
  const blob = new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), wallets }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "market-making-wallets.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  document.querySelector("#mmWalletResult").textContent = `Downloaded market-making-wallets.json with ${wallets.length} wallet(s). Keep this file private — it contains raw private keys.`;
  log(`Market Maker Bot: downloaded market-making-wallets.json with ${wallets.length} wallet(s).`);
}

async function mmImportWalletsFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const wallets = Array.isArray(data) ? data : data.wallets;
    if (!Array.isArray(wallets) || wallets.length === 0) throw new Error("No wallets found in file.");
    const keys = wallets.map((w) => w.privateKey || w.secretKey || w.key).filter(Boolean);
    if (keys.length === 0) throw new Error("File has no privateKey fields.");
    inputs.mmWalletKeys.value = keys.join("\n");
    document.querySelector("#mmWalletResult").textContent = `Imported ${keys.length} wallet(s) from ${file.name}.`;
    log(`Market Maker Bot: imported ${keys.length} wallet(s) from ${file.name}.`);
  } catch (error) {
    document.querySelector("#mmWalletResult").textContent = `Import failed — ${error.message}`;
  } finally {
    event.target.value = "";
  }
}

function mmLogTrade(entry) {
  mmBot.trades.unshift({ time: Date.now(), ...entry });
  if (mmBot.trades.length > 200) mmBot.trades.length = 200;
}

async function toggleMarketMakerBot() {
  if (mmBot.running) {
    stopMarketMakerBot();
  } else {
    await startMarketMakerBot();
  }
}

async function startMarketMakerBot() {
  const tokenAddress = inputs.mmTokenAddress.value.trim() || state.contract?.target;
  if (!ethers.isAddress(tokenAddress || "")) {
    log("Market Maker Bot: enter a valid token contract address.");
    return;
  }

  const keys = mmParseKeys(inputs.mmWalletKeys.value);
  if (keys.length === 0) {
    log("Market Maker Bot: paste at least one wallet private key.");
    return;
  }

  const provider = getRpcProvider();
  let wallets;
  try {
    wallets = keys.map((key) => new Wallet(key, provider));
  } catch (error) {
    log(`Market Maker Bot: invalid private key — ${error.message}`);
    return;
  }

  const reactiveKeys = mmParseKeys(inputs.mmReactiveKeys.value);
  const reactiveWallets = reactiveKeys.length > 0
    ? reactiveKeys.map((key) => new Wallet(key, provider))
    : [];

  const routerAddress = getRouterAddress();
  const pool = await mmCheckPool(provider, routerAddress, tokenAddress);
  if (!pool.exists) {
    log(`Market Maker Bot: no ${short(tokenAddress)}/WETH pool found on router ${short(routerAddress)} — ${pool.error || "add liquidity first (LP tab)."}`);
    document.querySelector("#mmWalletResult").textContent = `No pool found for this token on the configured router. ${pool.error || "Add liquidity first (LP tab)."}`;
    return;
  }
  if (pool.version === "v3") {
    log(`Market Maker Bot: V3 pool found at ${short(pool.poolAddress)} (fee ${pool.poolFee}), no V2 pair exists — trading via V3 exactInputSingle.`);
  } else {
    log(`Market Maker Bot: V2 pool found at ${short(pool.pairAddress)} — ${trimNumber(pool.wethReserve)} WETH / ${trimNumber(pool.tokenReserve)} token reserves.`);
  }

  const txnsPerUnit = Math.max(1, parseInt(inputs.mmTxnsPerUnit.value) || 2);
  const intervalUnit = inputs.mmIntervalUnit.value;
  const perMs = intervalUnit === "per_second" ? 1000 : 60000;
  const baseMs = perMs / txnsPerUnit;

  mmBot.config = {
    tokenAddress,
    routerAddress,
    poolVersion: pool.version,
    pairAddress: pool.pairAddress,
    v3PoolAddress: pool.poolAddress,
    v3SwapRouter: pool.swapRouter,
    v3PoolFee: pool.poolFee,
    v3WethAddress: pool.wethAddress,
    v3IsToken0: pool.isToken0,
    minBuyEth: parseFloat(inputs.mmMinBuy.value) || 0.001,
    maxBuyEth: parseFloat(inputs.mmMaxBuy.value) || 0.01,
    minSellPct: parseFloat(inputs.mmMinSellPct.value) || 10,
    maxSellPct: parseFloat(inputs.mmMaxSellPct.value) || 50,
    sellHardcap: parseFloat(inputs.mmSellHardcap.value) || 0,
    buyWeight: Number(inputs.mmBuyWeight.value) || 50,
    minIntervalMs: Math.floor(baseMs * 0.7),
    maxIntervalMs: Math.floor(baseMs * 1.3),
    slippagePct: parseFloat(inputs.mmSlippage.value) || 25,
    gasPriceGwei: parseFloat(inputs.mmGasPrice.value) || 0,
    minReserveEth: parseFloat(inputs.mmMinReserve.value) || 0.005,
    reactiveEnabled: inputs.mmReactiveEnabled.checked,
    reactivePct: parseFloat(inputs.mmReactivePct.value) || 50,
    reactiveMaxTokens: parseFloat(inputs.mmReactiveMaxTokens.value) || 0,
  };

  mmBot.provider = provider;
  mmBot.wallets = wallets;
  mmBot.reactiveWallets = reactiveWallets;
  mmBot.balances = {};
  mmBot.trades = [];
  mmBot.stats = {
    startedAt: Date.now(),
    totalBuys: 0,
    totalSells: 0,
    reactiveSells: 0,
    totalBuyVolumeEth: 0,
    successfulTrades: 0,
    failedTrades: 0,
    cyclesCompleted: 0,
    lastTradeAt: null,
    lastError: null,
  };
  mmBot.running = true;

  log(`Market Maker Bot: started for ${short(tokenAddress)} with ${wallets.length} wallet(s).`);
  mmRender();

  await mmRefreshBalances();
  mmRunCycle();
  if (mmBot.config.reactiveEnabled) mmStartReactiveWatcher();

  mmBot.uptimeTicker = setInterval(() => {
    const tile = document.querySelector('[data-tab-panel="mmBot"] [data-mm-uptime]');
    if (tile) tile.textContent = formatDuration(Date.now() - mmBot.stats.startedAt);
  }, 1000);
}

function stopMarketMakerBot() {
  mmBot.running = false;
  if (mmBot.loopTimeout) {
    clearTimeout(mmBot.loopTimeout);
    mmBot.loopTimeout = null;
  }
  if (mmBot.uptimeTicker) {
    clearInterval(mmBot.uptimeTicker);
    mmBot.uptimeTicker = null;
  }
  mmStopReactiveWatcher();
  log(`Market Maker Bot: stopped after ${mmBot.stats.cyclesCompleted} cycle(s).`);
  mmRender();
}

async function mmRefreshBalances() {
  const config = mmBot.config;
  const token = new Contract(config.tokenAddress, artifact.abi, mmBot.provider);
  let decimals = 18;
  try { decimals = Number(await token.decimals()); } catch {}
  const balances = {};
  await Promise.allSettled(mmBot.wallets.map(async (wallet) => {
    try {
      const [eth, tokenBalRaw] = await Promise.all([
        mmBot.provider.getBalance(wallet.address),
        token.balanceOf(wallet.address),
      ]);
      balances[wallet.address] = {
        eth: Number(ethers.formatEther(eth)),
        token: Number(ethers.formatUnits(tokenBalRaw, decimals)),
        tokenDecimals: decimals,
      };
    } catch {
      balances[wallet.address] = { eth: 0, token: 0, tokenDecimals: decimals };
    }
  }));
  mmBot.balances = balances;
}

function mmDecideTrade() {
  const config = mmBot.config;
  const canBuy = [];
  const canSell = [];
  for (const wallet of mmBot.wallets) {
    const bal = mmBot.balances[wallet.address];
    if (!bal) continue;
    // Eligible to buy if the wallet can afford at least Min Buy plus the
    // reserve — it doesn't need to afford the full Max Buy. The actual spend
    // below is then clamped to what this specific wallet can afford, so a
    // lightly-funded wallet still makes a smaller buy instead of being
    // excluded from buying entirely (previously required maxBuyEth+reserve
    // from every wallet, which starved buys whenever wallets ran low on ETH
    // — a real cause of "only sells" bot runs).
    const minNeeded = config.minBuyEth + config.minReserveEth;
    if (bal.eth >= minNeeded) canBuy.push(wallet);
    if (bal.token > 0) canSell.push(wallet);
  }
  if (canBuy.length === 0 && canSell.length === 0) return null;

  const roll = Math.random() * 100;
  let action;
  if (canBuy.length === 0) action = "sell";
  else if (canSell.length === 0) action = "buy";
  else action = roll < config.buyWeight ? "buy" : "sell";

  if (action === "buy") {
    const wallet = canBuy[Math.floor(Math.random() * canBuy.length)];
    const bal = mmBot.balances[wallet.address];
    const affordableMax = Math.min(config.maxBuyEth, bal.eth - config.minReserveEth);
    const rolled = config.minBuyEth + Math.random() * (config.maxBuyEth - config.minBuyEth);
    const amount = Math.round(Math.min(rolled, affordableMax) * 1e6) / 1e6;
    if (amount < config.minBuyEth) return null;
    return { action: "buy", wallet, amount };
  }

  canSell.sort((a, b) => (mmBot.balances[b.address]?.token || 0) - (mmBot.balances[a.address]?.token || 0));
  const wallet = canSell[0];
  const bal = mmBot.balances[wallet.address];
  const sellPct = config.minSellPct + Math.random() * (config.maxSellPct - config.minSellPct);
  let tokenAmount = bal.token * (sellPct / 100);
  if (config.sellHardcap > 0) tokenAmount = Math.min(tokenAmount, config.sellHardcap);
  const rounded = Math.round(tokenAmount * (10 ** bal.tokenDecimals)) / (10 ** bal.tokenDecimals);
  if (rounded <= 0) return null;
  return { action: "sell", wallet, amount: rounded };
}

// Applies config.slippagePct to a quoted output, floored at 0. slippagePct
// is a whole-number percent (e.g. 25 = 25% tolerance), matching the UI field.
function mmApplySlippage(quotedOut, slippagePct) {
  const bps = BigInt(Math.max(0, Math.round((100 - (slippagePct || 0)) * 100))); // e.g. 25% -> 7500 bps of 10000
  const min = (quotedOut * bps) / 10000n;
  return min > 0n ? min : 0n;
}

async function mmQuoteV2(routerAddress, path, amountIn, provider) {
  const router = new Contract(routerAddress, ROUTER_ABI, provider);
  const amounts = await router.getAmountsOut(amountIn, path);
  return amounts[amounts.length - 1];
}

// Same single-tick-range V3 curve math as simulatePonsBuyCurve, collapsed to
// a single quote: given amountIn of tokenIn, how much tokenOut does the pool
// currently imply. Used only to size amountOutMinimum with slippage applied
// — the pool can still move between quote and execution, which slippage
// tolerance is exactly what covers.
async function mmQuoteV3(poolAddress, tokenInIsToken0, amountIn, provider) {
  const pool = new Contract(poolAddress, V3_POOL_ABI, provider);
  const [slot0, liquidityRaw] = await Promise.all([pool.slot0(), pool.liquidity()]);
  const Q96 = 2n ** 96n;
  const PRECISION = 10n ** 27n;
  const sqrtP = (slot0.sqrtPriceX96 * PRECISION) / Q96;
  const L = liquidityRaw;
  if (L === 0n) return 0n;

  if (tokenInIsToken0) {
    // in = token0, out = token1. new_sqrtP = 1/(1/sqrtP + amountIn/L); out = L*(sqrtP - new_sqrtP)
    const invSqrtP = (PRECISION * PRECISION) / sqrtP;
    const invSqrtPNew = invSqrtP + (amountIn * PRECISION) / L;
    const sqrtPNew = (PRECISION * PRECISION) / invSqrtPNew;
    return (L * (sqrtP - sqrtPNew)) / PRECISION;
  }
  // in = token1, out = token0. new_sqrtP = sqrtP + amountIn/L; out = L*(1/sqrtP - 1/new_sqrtP)
  const sqrtPNew = sqrtP + (amountIn * PRECISION) / L;
  const invSqrtP = (PRECISION * PRECISION) / sqrtP;
  const invSqrtPNew = (PRECISION * PRECISION) / sqrtPNew;
  return (L * (invSqrtP - invSqrtPNew)) / PRECISION;
}

async function mmExecuteBuy(wallet, ethAmount) {
  const config = mmBot.config;
  if (config.poolVersion === "v3") return mmExecuteBuyV3(wallet, ethAmount);

  const router = new Contract(config.routerAddress, ROUTER_ABI, wallet);
  const overrides = { value: ethers.parseEther(String(ethAmount)) };
  if (config.gasPriceGwei > 0) overrides.gasPrice = ethers.parseUnits(String(config.gasPriceGwei), "gwei");
  const weth = await router.WETH();
  const path = [weth, config.tokenAddress];
  const quoted = await mmQuoteV2(config.routerAddress, path, overrides.value, wallet.provider);
  const amountOutMin = mmApplySlippage(quoted, config.slippagePct);
  const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(amountOutMin, path, wallet.address, getDeadline("20"), overrides);
  await tx.wait();
  return tx.hash;
}

async function mmExecuteBuyV3(wallet, ethAmount) {
  const config = mmBot.config;
  const router = new Contract(config.v3SwapRouter, [PONS_ROUTER_ABI[0]], wallet);
  const overrides = { value: ethers.parseEther(String(ethAmount)) };
  if (config.gasPriceGwei > 0) overrides.gasPrice = ethers.parseUnits(String(config.gasPriceGwei), "gwei");
  // Buying token with WETH: tokenIn is WETH. If token IS token0, WETH is
  // token1, so tokenInIsToken0 for the quote is false; if token is token1,
  // WETH is token0, so tokenInIsToken0 is true. config.v3IsToken0 records
  // whether the *project token* is token0 — invert for the WETH-in quote.
  const quoted = await mmQuoteV3(config.v3PoolAddress, !config.v3IsToken0, overrides.value, wallet.provider);
  const amountOutMin = mmApplySlippage(quoted, config.slippagePct);
  const params = {
    tokenIn: config.v3WethAddress,
    tokenOut: config.tokenAddress,
    fee: config.v3PoolFee,
    recipient: wallet.address,
    amountIn: overrides.value,
    amountOutMinimum: amountOutMin,
    sqrtPriceLimitX96: 0n,
  };
  const tx = await router.exactInputSingle(params, overrides);
  await tx.wait();
  return tx.hash;
}

async function mmExecuteSell(wallet, tokenAmount, tokenDecimals) {
  const config = mmBot.config;
  if (config.poolVersion === "v3") return mmExecuteSellV3(wallet, tokenAmount, tokenDecimals);

  const token = new Contract(config.tokenAddress, artifact.abi, wallet);
  const router = new Contract(config.routerAddress, ROUTER_ABI, wallet);
  const rawAmount = ethers.parseUnits(trimNumber(tokenAmount), tokenDecimals);
  const allowance = await token.allowance(wallet.address, config.routerAddress);
  if (allowance < rawAmount) {
    const approveTx = await token.approve(config.routerAddress, rawAmount);
    await approveTx.wait();
  }
  const overrides = {};
  if (config.gasPriceGwei > 0) overrides.gasPrice = ethers.parseUnits(String(config.gasPriceGwei), "gwei");
  const weth = await router.WETH();
  const path = [config.tokenAddress, weth];
  const quoted = await mmQuoteV2(config.routerAddress, path, rawAmount, wallet.provider);
  const amountOutMin = mmApplySlippage(quoted, config.slippagePct);
  const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
    rawAmount, amountOutMin, path, wallet.address, getDeadline("20"), overrides,
  );
  await tx.wait();
  return tx.hash;
}

// Re-reads the wallet's live ETH balance after a sell confirms. Used instead
// of trying to parse the swap's ETH-out from logs (fee-on-transfer tokens
// and proxy routers make that fragile) — a direct balance read is exact and
// also naturally accounts for gas spent, so mmRunCycle can trust it as the
// wallet's real post-sell buying power without waiting for the next
// scheduled balance refresh.
async function mmReadEthBalance(wallet) {
  return Number(ethers.formatEther(await wallet.provider.getBalance(wallet.address)));
}

async function mmExecuteSellV3(wallet, tokenAmount, tokenDecimals) {
  const config = mmBot.config;
  const token = new Contract(config.tokenAddress, artifact.abi, wallet);
  const router = new Contract(config.v3SwapRouter, [PONS_ROUTER_ABI[0]], wallet);
  const rawAmount = ethers.parseUnits(trimNumber(tokenAmount), tokenDecimals);
  const allowance = await token.allowance(wallet.address, config.v3SwapRouter);
  if (allowance < rawAmount) {
    const approveTx = await token.approve(config.v3SwapRouter, rawAmount);
    await approveTx.wait();
  }
  const overrides = {};
  if (config.gasPriceGwei > 0) overrides.gasPrice = ethers.parseUnits(String(config.gasPriceGwei), "gwei");
  // Selling token for WETH: tokenIn is the project token itself, so
  // tokenInIsToken0 for the quote is config.v3IsToken0 directly.
  const quoted = await mmQuoteV3(config.v3PoolAddress, config.v3IsToken0, rawAmount, wallet.provider);
  const amountOutMin = mmApplySlippage(quoted, config.slippagePct);
  const params = {
    tokenIn: config.tokenAddress,
    tokenOut: config.v3WethAddress,
    fee: config.v3PoolFee,
    recipient: wallet.address,
    amountIn: rawAmount,
    amountOutMinimum: amountOutMin,
    sqrtPriceLimitX96: 0n,
  };
  const tx = await router.exactInputSingle(params, overrides);
  await tx.wait();

  // The swap above only ever lands WETH, not native ETH — unwrap it now so
  // the wallet's actual spendable ETH balance reflects the sell.
  const wrapped = new Contract(config.v3WethAddress, WRAPPED_NATIVE_ABI, wallet);
  const wrappedBalance = await wrapped.balanceOf(wallet.address);
  if (wrappedBalance > 0n) {
    const unwrapTx = await wrapped.withdraw(wrappedBalance);
    await unwrapTx.wait();
  }

  return tx.hash;
}

async function mmRunCycle() {
  if (!mmBot.running) return;

  try {
    if (mmBot.stats.cyclesCompleted % 5 === 0) await mmRefreshBalances();

    const trade = mmDecideTrade();
    if (!trade) {
      mmLogTrade({ action: "skip", wallet: null, amount: 0, unit: "", hash: null, status: "skipped", error: "No wallets with sufficient balance" });
      mmBot.stats.cyclesCompleted++;
      mmRender();
      mmScheduleNext();
      return;
    }

    let hash = null;
    let error = null;
    try {
      if (trade.action === "buy") {
        hash = await mmExecuteBuy(trade.wallet, trade.amount);
        mmBot.stats.totalBuys++;
        mmBot.stats.totalBuyVolumeEth += trade.amount;
        // Re-read the real balance (accounts for gas spent too) instead of
        // naively subtracting trade.amount, which under-tracks true cost.
        if (mmBot.balances[trade.wallet.address]) mmBot.balances[trade.wallet.address].eth = await mmReadEthBalance(trade.wallet);
      } else {
        const decimals = mmBot.balances[trade.wallet.address]?.tokenDecimals ?? 18;
        hash = await mmExecuteSell(trade.wallet, trade.amount, decimals);
        mmBot.stats.totalSells++;
        if (mmBot.balances[trade.wallet.address]) {
          mmBot.balances[trade.wallet.address].token -= trade.amount;
          // Sells add ETH proceeds to the wallet — without this the wallet
          // never re-qualifies to buy until the next scheduled refresh (every
          // 5th cycle), which was a real cause of "only sells, never buys".
          mmBot.balances[trade.wallet.address].eth = await mmReadEthBalance(trade.wallet);
        }
      }
      mmBot.stats.successfulTrades++;
    } catch (err) {
      error = err.shortMessage || err.message;
      mmBot.stats.failedTrades++;
      mmBot.stats.lastError = error;
    }

    mmLogTrade({
      action: trade.action,
      wallet: trade.wallet.address,
      amount: trade.amount,
      unit: trade.action === "buy" ? "ETH" : "tokens",
      hash,
      status: error ? "failed" : "success",
      error,
    });

    mmBot.stats.lastTradeAt = Date.now();
    mmBot.stats.cyclesCompleted++;
    mmRender();
  } catch (err) {
    mmBot.stats.lastError = err.message;
    mmBot.stats.failedTrades++;
    mmLogTrade({ action: "error", wallet: null, amount: 0, unit: "", hash: null, status: "error", error: err.message });
    mmRender();
  }

  mmScheduleNext();
}

function mmScheduleNext() {
  if (!mmBot.running) return;
  const config = mmBot.config;
  const delay = config.minIntervalMs + Math.random() * (config.maxIntervalMs - config.minIntervalMs);
  mmBot.loopTimeout = setTimeout(() => mmRunCycle(), delay);
}

function mmStartReactiveWatcher() {
  const config = mmBot.config;
  const token = new Contract(config.tokenAddress, artifact.abi, mmBot.provider);
  const ownAddresses = new Set([
    ...mmBot.wallets.map((w) => w.address.toLowerCase()),
    ...mmBot.reactiveWallets.map((w) => w.address.toLowerCase()),
  ]);

  const tradeRouterAddress = config.poolVersion === "v3" ? config.v3SwapRouter : config.routerAddress;
  mmBot.reactiveFilter = token.filters.Transfer();
  const handler = async (from, to, value) => {
    if (!mmBot.running || !mmBot.config.reactiveEnabled) return;
    if (from.toLowerCase() !== tradeRouterAddress.toLowerCase()) return; // only router-originated buys
    if (ownAddresses.has(to.toLowerCase())) return; // ignore our own buys

    const decimals = Object.values(mmBot.balances)[0]?.tokenDecimals ?? 18;
    const boughtTokens = Number(ethers.formatUnits(value, decimals));
    let target = boughtTokens * (config.reactivePct / 100);
    if (config.reactiveMaxTokens > 0) target = Math.min(target, config.reactiveMaxTokens);
    if (target <= 0) return;

    log(`Market Maker Bot: external buy detected (${trimNumber(boughtTokens)} tokens). Triggering reactive sell.`);

    const pool = mmBot.reactiveWallets.length > 0 ? mmBot.reactiveWallets : mmBot.wallets;
    const sorted = [...pool].sort((a, b) => (mmBot.balances[b.address]?.token || 0) - (mmBot.balances[a.address]?.token || 0));

    let remaining = target;
    for (const wallet of sorted) {
      if (remaining <= 0) break;
      const bal = mmBot.balances[wallet.address];
      if (!bal || bal.token <= 0) continue;
      const sellAmount = Math.min(bal.token, remaining);
      try {
        const hash = await mmExecuteSell(wallet, sellAmount, bal.tokenDecimals);
        bal.token -= sellAmount;
        mmBot.stats.reactiveSells++;
        mmBot.stats.successfulTrades++;
        mmLogTrade({ action: "reactive_sell", wallet: wallet.address, amount: sellAmount, unit: "tokens", hash, status: "success", error: null });
        remaining -= sellAmount;
      } catch (err) {
        mmBot.stats.failedTrades++;
        mmLogTrade({ action: "reactive_sell", wallet: wallet.address, amount: sellAmount, unit: "tokens", hash: null, status: "failed", error: err.shortMessage || err.message });
      }
    }
    mmRender();
  };

  mmBot._reactiveHandler = handler;
  token.on(mmBot.reactiveFilter, handler);
  mmBot._reactiveToken = token;
  log("Market Maker Bot: reactive sell watcher started.");
}

function mmStopReactiveWatcher() {
  if (mmBot._reactiveToken && mmBot.reactiveFilter && mmBot._reactiveHandler) {
    try { mmBot._reactiveToken.off(mmBot.reactiveFilter, mmBot._reactiveHandler); } catch {}
  }
  mmBot._reactiveToken = null;
  mmBot._reactiveHandler = null;
  mmBot.reactiveFilter = null;
}

// --- Roles & permissions (frontend half) ----------------------------------
//
// The server is the real gate — every sensitive route re-checks permissions
// itself (see requirePermission in lib/app-middleware.mjs). What happens here
// is purely presentational: hiding a tab the user cannot use is a courtesy,
// not a security control, and must never be the only thing standing between
// a user and an action.
const auth = {
  username: "",
  role: "",
  isSuperAdmin: false,
  permissions: new Set(),
  catalogue: { tabs: [], actions: [] },
  roles: [],
  users: [],
  canManageRoles: false,
  canManageUsers: false,
  projects: [],
  activeProjectId: "",
  canManageProjects: false,
};

function can(permission) {
  return auth.permissions.has(permission);
}

function canSeeTab(tabId) {
  return auth.permissions.has(`tab.${tabId}`);
}

async function loadSessionPermissions() {
  try {
    const response = await fetch("/api/auth/session", { credentials: "same-origin" });
    const data = await response.json();
    if (!data.authenticated) return false;
    auth.username = data.username || "";
    auth.role = data.role || "";
    auth.isSuperAdmin = Boolean(data.isSuperAdmin);
    auth.permissions = new Set(data.permissions || []);
    auth.canManageRoles = auth.permissions.has("roles.manage");
    auth.canManageUsers = auth.permissions.has("users.manage");
    return true;
  } catch {
    return false;
  }
}

// Wraps fetch to attach the active project as a header — used by every call
// into the wallet vault (Disperse/Wallet Wash) so the server knows which
// project's wallets to read or write. The server independently re-verifies
// this on every request (see requireProjectAccess in app-middleware.mjs), so
// this header is a convenience for routing, never the actual access check.
function projectFetch(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (auth.activeProjectId) headers["X-Project-Id"] = auth.activeProjectId;
  return fetch(url, { ...options, headers, credentials: "same-origin" });
}

async function loadProjects() {
  try {
    const response = await fetch("/api/admin/projects", { credentials: "same-origin" });
    const data = await response.json();
    auth.projects = data.projects || [];
    auth.canManageProjects = auth.permissions.has("projects.manage");
    // Keep whatever project was already active if it's still in the list
    // (e.g. after a re-render); otherwise default to the first one so the
    // app isn't left with no project selected when there's at least one
    // available.
    if (!auth.projects.some((p) => p.id === auth.activeProjectId)) {
      auth.activeProjectId = auth.projects[0]?.id || "";
    }
    applyActiveProjectConfig();
    refreshProjectSwitcher();
  } catch {
    auth.projects = [];
  }
}

// Fills the existing tokenAddress/rpcUrl/router fields from the active
// project's saved config, the same fields every tab already reads from —
// this is what makes switching projects actually change what the rest of
// the app operates on, not just a label in the header.
function applyActiveProjectConfig() {
  const project = auth.projects.find((p) => p.id === auth.activeProjectId);
  if (!project) return;
  if (inputs.contractAddress && project.config.tokenAddress) inputs.contractAddress.value = project.config.tokenAddress;
  if (inputs.rpcUrl && project.config.rpcUrl) inputs.rpcUrl.value = project.config.rpcUrl;
  if (inputs.router && project.config.router) inputs.router.value = project.config.router;
}

async function switchActiveProject(projectId) {
  auth.activeProjectId = projectId;
  applyActiveProjectConfig();
  // Wallet lists (Disperse) are keyed to whichever project was active when
  // they were last loaded — reload them so switching projects doesn't leave
  // stale wallets from the previous project on screen.
  if (typeof disperseLoadWallets === "function") {
    try { await disperseLoadWallets(false); } catch { /* Disperse tab may not be visible/initialized yet */ }
  }
  // Each launch tab's Dev-wallet dropdown is per-project — repopulate so it
  // shows the newly-selected project's Dev wallets, not the previous one's.
  refreshDevWalletSelects();
  // Keep the header <select> showing the right project.
  const headerSelect = document.querySelector("#activeProjectSelect");
  if (headerSelect && headerSelect.value !== auth.activeProjectId) headerSelect.value = auth.activeProjectId;
}

// --- Admin tab logic ------------------------------------------------------

async function adminFetch(url, options = {}) {
  const response = await fetch(url, { credentials: "same-origin", ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data;
}

async function adminLoadAll() {
  if (auth.canManageRoles || auth.canManageUsers) {
    const cat = await adminFetch("/api/admin/roles");
    auth.catalogue = { tabs: cat.tabs || [], actions: cat.actions || [] };
    auth.roles = cat.roles || [];
  }
  if (auth.canManageUsers) {
    const list = await adminFetch("/api/admin/users");
    auth.users = list.users || [];
  }
  if (auth.canManageProjects) {
    await loadProjects(); // re-list from the server, since this admin may see more projects than the switcher already had (e.g. as super_admin)
  }
  adminRenderUsers();
  adminRenderRoleOptions();
  adminRenderPermissionGrid();
  adminRenderProjects();
}

// --- Admin: projects -------------------------------------------------------

function adminRenderProjects() {
  const listEl = document.querySelector("#adminProjectsList");
  const accessSelect = document.querySelector("#adminAccessProject");
  if (!listEl && !accessSelect) return;

  if (listEl) {
    listEl.innerHTML = auth.projects.length === 0 ? "No projects yet." : auth.projects.map((project) => `
      <div class="admin-user-row">
        <strong>${escapeHtml(project.name)}</strong>
        <span class="admin-project-config">${escapeHtml(project.config.tokenAddress || "no token set")}</span>
        <button type="button" data-admin-delete-project="${project.id}">Delete</button>
      </div>`).join("");
    for (const button of listEl.querySelectorAll("[data-admin-delete-project]")) {
      button.addEventListener("click", async () => {
        const id = button.dataset.adminDeleteProject;
        const project = auth.projects.find((p) => p.id === id);
        if (!confirm(`Delete project "${project?.name || id}"? Its wallet vault must already be empty.`)) return;
        try {
          await adminFetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, { method: "DELETE" });
          adminSay("#adminProjectResult", `Deleted "${project?.name || id}".`);
          await adminLoadAll(); // loadProjects() inside refreshes the header switcher
          refreshDevWalletSelects();
        } catch (error) {
          adminSay("#adminProjectResult", error.message);
        }
      });
    }
  }

  if (accessSelect) {
    accessSelect.innerHTML = auth.projects.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("");
    adminRenderAccessList(accessSelect.value);
    accessSelect.addEventListener("change", () => adminRenderAccessList(accessSelect.value));
  }
}

async function adminRenderAccessList(projectId) {
  const el = document.querySelector("#adminAccessList");
  if (!el || !projectId) return;
  el.textContent = "Loading access list...";
  try {
    const data = await adminFetch(`/api/admin/project-access?projectId=${encodeURIComponent(projectId)}`);
    const grants = data.access || [];
    el.innerHTML = grants.length === 0 ? "No one has explicit access yet (super_admin always sees every project)." : grants.map((g) => `
      <div class="admin-user-row">
        <span>${escapeHtml(g.username)}</span>
        <button type="button" data-admin-revoke="${escapeHtml(g.username)}">Revoke</button>
      </div>`).join("");
    for (const button of el.querySelectorAll("[data-admin-revoke]")) {
      button.addEventListener("click", async () => {
        try {
          await adminFetch(`/api/admin/project-access?projectId=${encodeURIComponent(projectId)}&username=${encodeURIComponent(button.dataset.adminRevoke)}`, { method: "DELETE" });
          adminRenderAccessList(projectId);
        } catch (error) {
          adminSay("#adminProjectResult", error.message);
        }
      });
    }
  } catch (error) {
    el.textContent = error.message;
  }
}

function adminRenderUsers() {
  const el = document.querySelector("#adminUsersList");
  if (!el) return;
  if (auth.users.length === 0) {
    el.textContent = "No users found.";
    return;
  }
  el.innerHTML = auth.users.map((user) => {
    const isSelf = user.username.toLowerCase() === auth.username.toLowerCase();
    const roleOptions = [
      ...(auth.isSuperAdmin ? ["super_admin"] : []),
      ...auth.roles.map((r) => r.name),
    ];
    return `
      <div class="admin-user-row">
        <strong>${escapeHtml(user.username)}</strong>${isSelf ? " <em>(you)</em>" : ""}
        <select data-admin-role-for="${escapeHtml(user.username)}">
          ${roleOptions.map((r) => `<option value="${escapeHtml(r)}"${r === user.role ? " selected" : ""}>${escapeHtml(r)}</option>`).join("")}
          ${roleOptions.includes(user.role) ? "" : `<option value="${escapeHtml(user.role)}" selected>${escapeHtml(user.role)} (missing)</option>`}
        </select>
        <button type="button" data-admin-reset="${escapeHtml(user.username)}">Reset Password</button>
        ${isSelf ? "" : `<button type="button" data-admin-delete-user="${escapeHtml(user.username)}">Delete</button>`}
      </div>`;
  }).join("");

  for (const select of el.querySelectorAll("[data-admin-role-for]")) {
    select.addEventListener("change", async () => {
      const username = select.dataset.adminRoleFor;
      try {
        await adminFetch("/api/admin/users", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username, role: select.value }),
        });
        adminSay("#adminUserResult", `${username} is now "${select.value}".`);
        await adminLoadAll();
      } catch (error) {
        adminSay("#adminUserResult", error.message);
        await adminLoadAll();
      }
    });
  }
  for (const button of el.querySelectorAll("[data-admin-reset]")) {
    button.addEventListener("click", async () => {
      const username = button.dataset.adminReset;
      const password = prompt(`New password for ${username} (min 8 characters):`);
      if (!password) return;
      try {
        await adminFetch("/api/admin/users", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        adminSay("#adminUserResult", `Password reset for ${username}. Their existing sessions were signed out.`);
      } catch (error) {
        adminSay("#adminUserResult", error.message);
      }
    });
  }
  for (const button of el.querySelectorAll("[data-admin-delete-user]")) {
    button.addEventListener("click", async () => {
      const username = button.dataset.adminDeleteUser;
      if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
      try {
        await adminFetch(`/api/admin/users?username=${encodeURIComponent(username)}`, { method: "DELETE" });
        adminSay("#adminUserResult", `Deleted ${username}.`);
        await adminLoadAll();
      } catch (error) {
        adminSay("#adminUserResult", error.message);
      }
    });
  }
}

function adminRenderRoleOptions() {
  const newRole = document.querySelector("#adminNewRole");
  if (newRole) {
    const options = [...(auth.isSuperAdmin ? ["super_admin"] : []), ...auth.roles.map((r) => r.name)];
    newRole.innerHTML = options.map((r) => `<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join("");
  }
  const roleSelect = document.querySelector("#adminRoleSelect");
  if (roleSelect) {
    roleSelect.innerHTML = `<option value="">— new role —</option>` +
      auth.roles.map((r) => `<option value="${escapeHtml(r.name)}">${escapeHtml(r.name)}</option>`).join("");
  }
}

function adminRenderPermissionGrid(selectedPermissions = null) {
  const grid = document.querySelector("#adminPermissionGrid");
  if (!grid) return;
  const selected = new Set(selectedPermissions || []);
  const tabBoxes = auth.catalogue.tabs.map((tab) => {
    const id = `tab.${tab.id}`;
    // A manager cannot grant what it does not hold, so show those as disabled
    // rather than letting the user tick something the server will reject.
    const locked = !auth.isSuperAdmin && !can(id);
    return `<label class="admin-perm${locked ? " locked" : ""}">
      <input type="checkbox" value="${escapeHtml(id)}"${selected.has(id) ? " checked" : ""}${locked ? " disabled" : ""} />
      ${escapeHtml(tab.label)}
    </label>`;
  }).join("");
  const actionBoxes = auth.catalogue.actions.map((action) => {
    const locked = !auth.isSuperAdmin && !can(action.id);
    return `<label class="admin-perm${action.danger ? " danger" : ""}${locked ? " locked" : ""}">
      <input type="checkbox" value="${escapeHtml(action.id)}"${selected.has(action.id) ? " checked" : ""}${locked ? " disabled" : ""} />
      ${escapeHtml(action.label)}
    </label>`;
  }).join("");
  grid.innerHTML = `
    <p class="hint">Tabs this role can open</p>
    <div class="admin-perm-grid">${tabBoxes}</div>
    <p class="hint">Actions this role can perform</p>
    <div class="admin-perm-grid">${actionBoxes}</div>`;
}

function adminSelectedPermissions() {
  return [...document.querySelectorAll("#adminPermissionGrid input[type=checkbox]:checked")].map((box) => box.value);
}

function adminSay(selector, message) {
  const el = document.querySelector(selector);
  if (el) el.textContent = message;
}

function bindAdminHandlers() {
  const roleSelect = document.querySelector("#adminRoleSelect");
  if (roleSelect) {
    roleSelect.addEventListener("change", () => {
      const role = auth.roles.find((r) => r.name === roleSelect.value);
      inputs.adminRoleName.value = role ? role.name : "";
      inputs.adminRoleDescription.value = role ? role.description : "";
      adminRenderPermissionGrid(role ? role.permissions : []);
    });
  }

  document.querySelector("#adminSaveRole")?.addEventListener("click", async () => {
    try {
      await adminFetch("/api/admin/roles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: inputs.adminRoleName.value.trim(),
          description: inputs.adminRoleDescription.value.trim(),
          permissions: adminSelectedPermissions(),
        }),
      });
      adminSay("#adminRoleResult", `Saved role "${inputs.adminRoleName.value.trim()}".`);
      await adminLoadAll();
    } catch (error) {
      adminSay("#adminRoleResult", error.message);
    }
  });

  document.querySelector("#adminDeleteRole")?.addEventListener("click", async () => {
    const name = inputs.adminRoleName.value.trim();
    if (!name) return adminSay("#adminRoleResult", "Pick a role to delete.");
    if (!confirm(`Delete role "${name}"?`)) return;
    try {
      await adminFetch(`/api/admin/roles?name=${encodeURIComponent(name)}`, { method: "DELETE" });
      adminSay("#adminRoleResult", `Deleted role "${name}".`);
      await adminLoadAll();
    } catch (error) {
      adminSay("#adminRoleResult", error.message);
    }
  });

  document.querySelector("#adminCreateUser")?.addEventListener("click", async () => {
    try {
      await adminFetch("/api/admin/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: inputs.adminNewUsername.value.trim(),
          password: inputs.adminNewPassword.value,
          role: document.querySelector("#adminNewRole").value,
        }),
      });
      adminSay("#adminUserResult", `Created ${inputs.adminNewUsername.value.trim()}.`);
      inputs.adminNewUsername.value = "";
      inputs.adminNewPassword.value = "";
      await adminLoadAll();
    } catch (error) {
      adminSay("#adminUserResult", error.message);
    }
  });

  document.querySelector("#adminCreateProject")?.addEventListener("click", async () => {
    try {
      const created = await adminFetch("/api/admin/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: inputs.adminProjectName.value.trim(),
          tokenAddress: inputs.adminProjectTokenAddress.value.trim(),
          rpcUrl: inputs.adminProjectRpcUrl.value.trim(),
          router: inputs.adminProjectRouter.value.trim(),
        }),
      });
      adminSay("#adminProjectResult", `Created "${created.project.name}".`);
      inputs.adminProjectName.value = "";
      inputs.adminProjectTokenAddress.value = "";
      inputs.adminProjectRpcUrl.value = "";
      inputs.adminProjectRouter.value = "";
      await adminLoadAll(); // loadProjects() inside refreshes the header switcher
      refreshDevWalletSelects();
    } catch (error) {
      adminSay("#adminProjectResult", error.message);
    }
  });

  document.querySelector("#adminGrantAccess")?.addEventListener("click", async () => {
    const projectId = document.querySelector("#adminAccessProject")?.value;
    const username = inputs.adminAccessUsername.value.trim();
    if (!projectId || !username) return adminSay("#adminProjectResult", "Pick a project and enter a username.");
    try {
      await adminFetch(`/api/admin/project-access?projectId=${encodeURIComponent(projectId)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username }),
      });
      inputs.adminAccessUsername.value = "";
      adminRenderAccessList(projectId);
      adminSay("#adminProjectResult", `Granted ${username} access.`);
    } catch (error) {
      adminSay("#adminProjectResult", error.message);
    }
  });

  if (auth.canManageRoles || auth.canManageUsers || auth.canManageProjects) {
    adminLoadAll().catch((error) => {
      adminSay("#adminUserResult", error.message);
      adminSay("#adminRoleResult", error.message);
      adminSay("#adminProjectResult", error.message);
    });
  }
}

function visibleSidebarTabs() {
  const tabs = sidebarTabs.filter((tab) => canSeeTab(tab.id));
  if (auth.canManageUsers || auth.canManageRoles) {
    tabs.push({ id: "admin", label: "Users & Roles", icon: "🛡️" });
  }
  // A user whose role grants no tabs at all would otherwise land on a blank
  // dashboard with no way to navigate; pin them to whatever they can see.
  if (tabs.length > 0 && !tabs.some((tab) => tab.id === state.activeFunctionTab)) {
    state.activeFunctionTab = tabs[0].id;
  }
  return tabs;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

function renderAdminPanel() {
  return `
    <h2>Users, Roles &amp; Projects</h2>
    <p class="hint">
      Signed in as <strong>${escapeHtml(auth.username)}</strong> (${escapeHtml(auth.role)}).
      Permission changes apply immediately &mdash; affected users do not need to sign out and back in.
    </p>

    ${auth.canManageProjects ? `
    <div class="function-card section-gap">
      <div class="function-head"><strong>Projects</strong><span>isolated workspaces &mdash; token/RPC/router config + their own wallet vault</span></div>
      <div class="result" id="adminProjectsList">Loading projects...</div>
      <div class="grid two section-gap">
        <label>Project name ${renderInput("adminProjectName", "e.g. Client A launch")}</label>
        <label>Token contract address ${renderInput("adminProjectTokenAddress", "0x token")}</label>
        <label>RPC URL ${renderInput("adminProjectRpcUrl", "/rpc or https://...")}</label>
        <label>Router address ${renderInput("adminProjectRouter", "0x router")}</label>
      </div>
      <button id="adminCreateProject" type="button">Create Project</button>
      <div class="result" id="adminProjectResult"></div>

      <label class="stacked section-gap">Grant a user access to a project
        <div class="grid two">
          <select id="adminAccessProject"></select>
          <div class="inline-with-button">
            ${renderInput("adminAccessUsername", "username")}
            <button id="adminGrantAccess" type="button">Grant</button>
          </div>
        </div>
      </label>
      <div class="result" id="adminAccessList"></div>
    </div>` : ""}

    ${auth.canManageUsers ? `
    <div class="function-card section-gap">
      <div class="function-head"><strong>Users</strong><span>create, reassign, reset, remove</span></div>
      <div class="result" id="adminUsersList">Loading users...</div>
      <div class="grid two section-gap">
        <label>Username ${renderInput("adminNewUsername", "3-32 chars")}</label>
        <label>Password ${renderInput("adminNewPassword", "min 8 chars", "password")}</label>
      </div>
      <label class="stacked">Role <select id="adminNewRole"></select></label>
      <button id="adminCreateUser" type="button">Create User</button>
      <div class="result" id="adminUserResult"></div>
    </div>` : ""}

    ${auth.canManageRoles ? `
    <div class="function-card section-gap">
      <div class="function-head"><strong>Roles</strong><span>tick exactly what each role may do</span></div>
      <label class="stacked">Edit an existing role, or type a new name below
        <select id="adminRoleSelect"></select>
      </label>
      <div class="grid two">
        <label>Role name ${renderInput("adminRoleName", "e.g. trader")}</label>
        <label>Description ${renderInput("adminRoleDescription", "what this role is for")}</label>
      </div>
      <div id="adminPermissionGrid"></div>
      <div class="button-row">
        <button id="adminSaveRole" type="button">Save Role</button>
        <button id="adminDeleteRole" type="button">Delete Role</button>
      </div>
      <div class="result" id="adminRoleResult"></div>
    </div>` : ""}
  `;
}
//  <a class="manager-link" href="/wallet-manager.html" target="_blank" rel="noopener">Open Wallet Manager ↗</a>

// The header project switcher's inner markup. Split out of render() so it
// can be rebuilt in place (see refreshProjectSwitcher) when a project is
// created/deleted without a full re-render or a page refresh — otherwise
// the header kept showing "No projects yet" until the user reloaded.
function renderProjectSwitcherInner() {
  if (auth.projects.length === 0) {
    return `<span class="project-switcher project-switcher-empty">No projects yet</span>`;
  }
  return `<label class="project-switcher">
    Project
    <select id="activeProjectSelect">
      ${auth.projects.map((p) => `<option value="${p.id}"${p.id === auth.activeProjectId ? " selected" : ""}>${escapeHtml(p.name)}</option>`).join("")}
    </select>
  </label>`;
}

// Rebuilds the header project switcher from the current auth.projects and
// re-binds its change handler. Call after any change to auth.projects.
function refreshProjectSwitcher() {
  const slot = document.querySelector("#projectSwitcherSlot");
  if (!slot) return;
  slot.innerHTML = renderProjectSwitcherInner();
  document.querySelector("#activeProjectSelect")?.addEventListener("change", (event) => {
    switchActiveProject(event.target.value);
  });
}

function render() {
  app.innerHTML = `
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">Robinhood Chain Token Launcher</p>
          <h1>Deploy and manage Token</h1>
        </div>
        <div class="hero-actions">
          <span id="projectSwitcherSlot">${renderProjectSwitcherInner()}</span>

          <a class="manager-link" href="#" id="signOutLink">Sign Out</a>
          <div class="status" id="status">Not connected</div>
        </div>
      </section>

      <!-- Hidden, not removed: many tabs still depend on these fields
      (rpcUrl, privateKey, contractAddress) and functions (attach(),
      connect(), connectMetaMask()) under the hood — the panels are visually
      hidden via the "hidden" class rather than deleted, so all of that
      keeps working exactly as before, just without a visible UI. -->
      <section class="panel hidden">
        <h2>Wallet</h2>
        <div class="grid two">
          <label>RPC URL for private-key wallet ${renderInput("rpcUrl", "/rpc or https://...")}</label>
          <label>Private key ${renderInput("privateKey", "0x...", "password")}</label>
        </div>
        <div class="button-row">
          <button id="connectMetaMask">Connect MetaMask</button>
          <button id="addRobinhood">Add/Switch Robinhood Chain</button>
          <button id="connect">Connect RPC Wallet</button>
        </div>
      </section>

      <section class="panel hidden">
        <h2>Deploy</h2>
        <div class="grid two">
          <label>Name ${renderInput("tokenName", "Robin Dex")}</label>
          <label>Symbol ${renderInput("tokenSymbol", "RD")}</label>
          <label>Router ${renderInput("router", "0x router")}</label>
          <label>Tax wallet ${renderInput("taxWallet", "0x tax wallet")}</label>
          <label>Ecosystem wallet ${renderInput("ecosystemWallet", "0x ecosystem wallet")}</label>
          <label>Early buyer list, comma separated ${renderInput("bel", "0x..., 0x...")}</label>
          <label>Deploy gas limit, optional ${renderInput("deployGasLimit", "blank = estimated + 20%")}</label>
        </div>
        <div class="button-row">
          <button id="deploy">Deploy Contract</button>
          <button id="diagnoseDeploy" type="button">Diagnose Last Deploy</button>
          <button id="verifyLatestDeploy" type="button">Verify Latest Contract</button>
        </div>
      </section>

      <section class="panel hidden">
        <h2>Attach Existing Contract</h2>
        <div class="grid two">
          <label>Contract address ${renderInput("contractAddress", "0x token")}</label>
        </div>
        <button id="attach">Attach</button>
      </section>

      <section class="panel dashboard-panel">
        <div class="dashboard">
          <nav class="sidebar" id="functionSidebar">
            <p class="sidebar-label">Functions</p>
            ${visibleSidebarTabs().map((t) => `
            <button class="tab ${state.activeFunctionTab === t.id ? "active" : ""}" data-tab="${t.id}">
              <span class="tab-icon">${t.icon}</span>
              <span class="tab-text">${t.label}</span>
            </button>`).join("")}
          </nav>
          <div class="dashboard-content">
        <div class="tab-panel ${state.activeFunctionTab === "write" ? "active" : ""}" data-tab-panel="write">
          <div class="functions">${writeFunctions.map(renderFunction).join("")}</div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "read" ? "active" : ""}" data-tab-panel="read">
          <div class="functions">${readFunctions.map(renderFunction).join("")}</div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "buy" ? "active" : ""}" data-tab-panel="buy">
          <div class="grid two">
            <label>Token contract address ${renderInput("buyTokenAddress", "0x token to buy")}</label>
            <label>&nbsp;<button id="buyAttachToken" type="button">Load Token</button></label>
          </div>
          <p class="hint" id="buyTokenStatus">${state.contract ? `Loaded: ${state.contract.target}` : "No token loaded yet — paste an address and click Load Token."}</p>
          <div class="grid two">
            <label>ETH per buy ${renderInput("buyEthAmount", "0.01")}</label>
            <label>Minimum tokens out ${renderInput("buyMinTokens", "0")}</label>
            <label>Recipient override, optional ${renderInput("buyRecipient", "blank = buyer wallet")}</label>
            <label>Deadline minutes ${renderInput("buyDeadline", "20")}</label>
          </div>
          <button id="buyConnected">Buy With Connected Wallet</button>
          <label class="stacked">Buyer private keys, one per line ${renderTextarea("buyerPrivateKeys", "0x_private_key,0.01\n0x_private_key,0.025")}</label>
          <p class="hint">Use private_key,eth_amount per line. If the ETH amount is omitted, the global ETH per buy value above is used. Each wallet buys the token loaded above; batch buys are signed locally in this browser using the RPC URL/proxy.</p>
          <button id="buyBatch">Buy From All Pasted Wallets</button>
          <div class="result" id="buyResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "sell" ? "active" : ""}" data-tab-panel="sell">
          <div class="grid two">
            <label>Minimum ETH out per wallet ${renderInput("sellMinEth", "0")}</label>
            <label>ETH recipient override, optional ${renderInput("sellRecipient", "blank = seller wallet")}</label>
            <label>Deadline minutes ${renderInput("sellDeadline", "20")}</label>
          </div>
          <button id="sellConnected">Sell All From Connected Wallet</button>
          <label class="stacked">Seller private keys, one per line ${renderTextarea("sellerPrivateKeys", "0x_private_key\n0x_private_key")}</label>
          <p class="hint">Batch sell approves the router and sells the full token balance from each pasted wallet. ETH returns to each seller unless you set a recipient override.</p>
          <button id="sellBatch">Sell All From Pasted Wallets</button>
          <div class="result" id="sellResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "lp" ? "active" : ""}" data-tab-panel="lp">
          <h2>Launch Initial LP</h2>
          <p class="hint">Use this for first liquidity. It sends ETH to the token contract's launch() function, which pairs it with the 98% token supply held by the contract.</p>
          <div class="grid two">
            <label>ETH amount ${renderInput("launchEthAmount", "0.5")}</label>
            <label>LP recipient ${renderInput("launchLpRecipient", "blank = connected wallet")}</label>
          </div>
          <button id="launchInitialLp">Launch Initial LP</button>
          <h2>Add LP</h2>
          <p class="hint">Use this only after launch, when the connected wallet already holds the tokens it wants to add.</p>
          <div class="grid two">
            <label>Token amount ${renderInput("lpTokenAmount", "100000")}</label>
            <label>ETH amount ${renderInput("lpEthAmount", "1")}</label>
            <label>Minimum token amount ${renderInput("lpMinToken", "0")}</label>
            <label>Minimum ETH amount ${renderInput("lpMinEth", "0")}</label>
            <label>LP recipient ${renderInput("lpRecipient", "blank = connected wallet")}</label>
            <label>Deadline minutes ${renderInput("lpDeadline", "20")}</label>
          </div>
          <button id="addLp">Approve And Add LP</button>
          <h2 class="section-gap">Remove LP</h2>
          <div class="grid two">
            <label>Pair / LP token address ${renderInput("removePair", "blank = token pair()")}</label>
            <label>LP token amount ${renderInput("removeLpAmount", "1")}</label>
            <label>Minimum token amount ${renderInput("removeMinToken", "0")}</label>
            <label>Minimum ETH amount ${renderInput("removeMinEth", "0")}</label>
            <label>Remove recipient ${renderInput("removeRecipient", "blank = connected wallet")}</label>
            <label>Deadline minutes ${renderInput("removeDeadline", "20")}</label>
          </div>
          <button id="removeLp">Approve And Remove LP</button>
          <div class="result" id="lpResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "burn" ? "active" : ""}" data-tab-panel="burn">
          <p class="hint">Only the current tax wallet can call burn. Amount is entered in normal token units, not wei.</p>
          <div class="grid two">
            <label>Token amount to burn ${renderInput("burnAmount", "1000")}</label>
          </div>
          <button id="burnTokens">Burn Tokens</button>
          <div class="result" id="burnResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "accounts" ? "active" : ""}" data-tab-panel="accounts">
          <p class="hint">Generate 5 fresh wallets locally in this browser. Store the private keys immediately; they are not saved by the app.</p>
          <div class="button-row">
            <button id="generateAccounts">Create 5 Accounts</button>
            <button id="copyAccounts">Copy Accounts</button>
            <button id="loadAccountsToMultisend">Use Addresses In Multisend</button>
          </div>
          <textarea id="generatedAccounts" readonly placeholder="Generated wallets will appear here"></textarea>
          <div class="result" id="accountsResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "multisend" ? "active" : ""}" data-tab-panel="multisend">
          <p class="hint">Send ETH from the connected wallet to up to 5 recipients. Each row needs a recipient address and ETH amount.</p>
          ${Array.from({ length: 5 }, (_, index) => `
            <div class="grid two multisend-row">
              <label>Recipient ${index + 1} ${renderInput(`sendTo${index}`, "0x recipient")}</label>
              <label>ETH amount ${renderInput(`sendAmount${index}`, "0.01")}</label>
            </div>
          `).join("")}
          <button id="sendEthBatch">Send ETH To 5 Wallets</button>
          <div class="result" id="multisendResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "sweep" ? "active" : ""}" data-tab-panel="sweep">
          <h2>Collect ETH From Wallets</h2>
          <p class="hint">Paste private keys and send all available ETH from those wallets to one destination. The app estimates gas per wallet and leaves an optional extra buffer.</p>
          <div class="grid two">
            <label>Destination wallet ${renderInput("sweepRecipient", "0x destination")}</label>
            <label>Extra gas buffer ETH ${renderInput("sweepBuffer", "0.00001")}</label>
          </div>
          <label class="stacked">Private keys to collect from ${renderTextarea("sweepPrivateKeys", "0x_private_key\n0x_private_key\n0x_private_key")}</label>
          <p class="hint">You can paste one key per line, or separate keys with commas/spaces. Transactions are signed locally in this browser using the RPC URL above.</p>
          <div class="button-row">
            <button id="previewSweep">Preview Balances</button>
            <button id="sweepBatch">Send All ETH From Pasted Keys</button>
            <button id="sweepConnected">Send All ETH From Connected Wallet</button>
          </div>
          <div class="result" id="sweepResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "mmBot" ? "active" : ""}" data-tab-panel="mmBot">
          ${renderMarketMakerBot()}
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "wallets" ? "active" : ""}" data-tab-panel="wallets">
          ${renderWalletsTab()}
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "projectMgmt" ? "active" : ""}" data-tab-panel="projectMgmt">
          ${renderProjectManagementTab()}
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "disperse" ? "active" : ""}" data-tab-panel="disperse">
          ${renderDisperse()}
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "walletWash" ? "active" : ""}" data-tab-panel="walletWash">
          ${renderWalletWash()}
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "walletReport" ? "active" : ""}" data-tab-panel="walletReport">
          ${renderWalletReport()}
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "launch" ? "active" : ""}" data-tab-panel="launch">
          ${renderLaunchPlanner()}
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "pons" ? "active" : ""}" data-tab-panel="pons">
          ${renderPonsBody("")}
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "ponsWash" ? "active" : ""}" data-tab-panel="ponsWash">
          ${renderPonsWashCombo()}
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "multiBuys" ? "active" : ""}" data-tab-panel="multiBuys">
          <h2>Multiple Buys</h2>
          <h2 class="section-gap">Multiple Burst Buy</h2>
          <p class="hint">Buy an existing token — already live on-chain, launched anytime and by anyone, not tied to a launch you ran here — with multiple wallets at once. No launch or restriction-window wait: this just detects the token's pool (V2 or V3) and fires every enabled wallet's buy in parallel, right away.</p>
          <div class="grid two">
            <label>Token contract address ${renderInput("multiBurstTokenAddress", "0x token to buy")}</label>
            <label>Slippage % ${renderInput("multiBurstSlippage", "25")}</label>
          </div>
          <div id="multiBurstRows" class="buyer-rows">
            ${renderMultiBurstRows()}
          </div>
          <div class="button-row">
            <button id="multiBurstCheckPool" type="button">Check Pool</button>
            <button id="multiBurstExecute" type="button">Run Multiple Burst Buy</button>
          </div>
          <div class="result" id="multiBurstResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "lunch" ? "active" : ""}" data-tab-panel="lunch">
          <h2>Lunch.fun Launch</h2>
          <p class="hint">EIP-7702 atomic mode: each enabled buyer wallet spends its own ETH and appears as the router caller. The launch and every signed buy execute in one transaction; any failure reverts everything. Keys stay in this page's memory and delegations are revoked after confirmation.</p>

          <h2 class="section-gap">Network</h2>
          <div class="grid two">
            <label>Expected chain <input readonly value="${LUNCH_CHAIN.name} (${LUNCH_CHAIN.id})" /></label>
            <label>Current block <input id="lunchCurrentBlock" readonly placeholder="Load status" /></label>
            <label>Primary wallet <input id="lunchPrimaryWallet" readonly placeholder="Connect MetaMask" /></label>
            <label>Native balance <input id="lunchPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="lunchSwitchNetwork" type="button">Switch Network</button>
            <button id="lunchLoadStatus" type="button">Load Contract Status</button>
          </div>

          <h2 class="section-gap">Contract</h2>
          <div class="grid two">
            <label>Launch proxy <input id="lunchLaunchContract" readonly value="${LUNCH_CHAIN.launchContract}" /></label>
            <label>7702 coordinator <input id="lunch7702Coordinator" readonly value="${LUNCH_CHAIN.coordinator7702}" /></label>
            <label>7702 buyer delegate <input id="lunch7702Delegate" readonly value="${LUNCH_CHAIN.delegate7702}" /></label>
            <label>Coordinator owner <input id="lunchAtomicOwner" readonly placeholder="Load status" /></label>
            <label>Implementation <input id="lunchImplementation" readonly value="${LUNCH_CHAIN.implementation}" /></label>
            <label>Launch fee <input id="lunchLaunchFee" readonly placeholder="-" /></label>
            <label>Router for later buys ${renderInput("lunchRouter", LUNCH_CHAIN.router)}</label>
            <label>Factory <input id="lunchFactory" readonly placeholder="-" /></label>
            <label>Position manager <input id="lunchNpm" readonly placeholder="-" /></label>
            <label>Wrapped native / X token <input id="lunchXToken" readonly placeholder="-" /></label>
            <label>Fee locker <input id="lunchFeeLocker" readonly placeholder="-" /></label>
            <label>Enforced supply <input id="lunchEnforcedSupply" readonly placeholder="-" /></label>
            <label>Launch tick magnitude <input id="lunchTickMagnitude" readonly placeholder="-" /></label>
          </div>
          <div class="result" id="lunchContractResult"></div>

          <div class="function-card section-gap">
            <div class="function-head"><strong>Use Wallets Tab</strong><span>pull Dev/Bundle wallets from the active project's vault</span></div>
            <p class="hint">Connects the project's saved Dev wallet as the signer for this launch, and fills the project's saved Bundle wallets into the buyer rows below — instead of connecting MetaMask or pasting keys by hand. Requires wallets.reveal permission and a Dev/Bundle wallet already generated in the Wallets tab for this project.</p>
            <div class="button-row">
              <select id="lunchDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
              <button id="lunchUseDevWallet" type="button">Connect Dev Wallet</button>
              <button id="lunchFillBundleWallets" type="button">Fill Bundle Wallets Into Buyer Rows</button>
            </div>
            <div class="result" id="lunchWalletsTabResult"></div>
          </div>

          <div class="token-info-card">
          <h2 class="section-gap">Token Info</h2>
          ${renderTokenImageDrop("lunchImage", "Token Image")}
          <div class="grid two">
            <label class="required">Token name ${renderInput("lunchTokenName", "e.g. PepeCoin")}</label>
            <label class="required">Token symbol ${renderInput("lunchTokenSymbol", "PEPE")}</label>
          </div>
          <div class="token-info-description">
            <label>Description ${renderTextarea("lunchDescription", "Describe your token...")}</label>
          </div>
          <div class="grid two">
            <label>Total supply ${renderInput("lunchTotalSupply", "1000000000")}</label>
            <label>Fee tier ${renderInput("lunchFeeTier", "10000")}</label>
            <label>Banner URL ${renderInput("lunchBanner", "https://...")}</label>
            <label>Website (optional) ${renderInput("lunchWebsite", "https://...")}</label>
            <label>Twitter / X (optional) ${renderInput("lunchTwitter", "https://x.com/...")}</label>
            <label>Telegram (optional) ${renderInput("lunchTelegram", "https://t.me/...")}</label>
            <label>User salt ${renderInput("lunchSalt", "blank = random bytes32")}</label>
            <label>Transaction deadline, minutes ${renderInput("lunchDeadline", "5")}</label>
          </div>
          </div>

          <h2 class="section-gap">Buyer Configuration</h2>
          <p class="hint">Every enabled row requires its private key, own ETH balance, and nonzero minimum output. The derived wallet address is displayed automatically during review. Use this only on a trusted local machine.</p>
          <div id="lunchBuyerRows" class="buyer-rows">
            ${renderLunchBuyerRows()}
          </div>

          <h2 class="section-gap">Review</h2>
          <div class="button-row">
            <button id="lunchReview" type="button">Validate And Review</button>
            <button id="lunchExecute" type="button">Execute Atomic Launch</button>
          </div>
          <div class="result" id="lunchReviewResult"></div>

          <h2 class="section-gap">Execution</h2>
          <div class="result" id="lunchExecutionResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "lunchBurst" ? "active" : ""}" data-tab-panel="lunchBurst">
          <h2>Lunch.fun Burst Launch</h2>
          <p class="hint">Burst mode: the connected launcher creates the token and performs the optional dev buy in the launch transaction. After the receipt reveals the real token and pool, every enabled buyer wallet signs locally and broadcasts its own buy transaction in parallel. This is fast, but not atomic and same-block inclusion is not guaranteed.</p>

          <h2 class="section-gap">Network</h2>
          <div class="grid two">
            <label>Expected chain <input readonly value="${LUNCH_CHAIN.name} (${LUNCH_CHAIN.id})" /></label>
            <label>Current block <input id="lunchBurstCurrentBlock" readonly placeholder="Load status" /></label>
            <label>Launcher wallet <input id="lunchBurstPrimaryWallet" readonly placeholder="Connect MetaMask or RPC wallet" /></label>
            <label>Launcher native balance <input id="lunchBurstPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="lunchBurstSwitchNetwork" type="button">Switch Network</button>
            <button id="lunchBurstLoadStatus" type="button">Load Contract Status</button>
          </div>

          <h2 class="section-gap">Contract</h2>
          <div class="grid two">
            <label>Launch proxy <input id="lunchBurstLaunchContract" readonly value="${LUNCH_CHAIN.launchContract}" /></label>
            <label>Implementation <input id="lunchBurstImplementation" readonly value="${LUNCH_CHAIN.implementation}" /></label>
            <label>Launch fee <input id="lunchBurstLaunchFee" readonly placeholder="-" /></label>
            <label>Router ${renderInput("lunchBurstRouter", LUNCH_CHAIN.router)}</label>
            <label>Factory <input id="lunchBurstFactory" readonly placeholder="-" /></label>
            <label>Position manager <input id="lunchBurstNpm" readonly placeholder="-" /></label>
            <label>Wrapped native / X token <input id="lunchBurstXToken" readonly placeholder="-" /></label>
            <label>Enforced supply <input id="lunchBurstEnforcedSupply" readonly placeholder="-" /></label>
          </div>
          <div class="result" id="lunchBurstContractResult"></div>

          <div class="function-card section-gap">
            <div class="function-head"><strong>Use Wallets Tab</strong><span>pull Dev/Bundle wallets from the active project's vault</span></div>
            <p class="hint">Connects the project's saved Dev wallet as the signer for this launch, and fills the project's saved Bundle wallets into the buyer rows below — instead of connecting MetaMask or pasting keys by hand. Requires wallets.reveal permission and a Dev/Bundle wallet already generated in the Wallets tab for this project.</p>
            <div class="button-row">
              <select id="lunchBurstDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
              <button id="lunchBurstUseDevWallet" type="button">Connect Dev Wallet</button>
              <button id="lunchBurstFillBundleWallets" type="button">Fill Bundle Wallets Into Buyer Rows</button>
            </div>
            <div class="result" id="lunchBurstWalletsTabResult"></div>
          </div>

          <div class="token-info-card">
          <h2 class="section-gap">Token Info</h2>
          ${renderTokenImageDrop("lunchBurstImage", "Token Image")}
          <div class="grid two">
            <label class="required">Token name ${renderInput("lunchBurstTokenName", "e.g. PepeCoin")}</label>
            <label class="required">Token symbol ${renderInput("lunchBurstTokenSymbol", "PEPE")}</label>
          </div>
          <div class="token-info-description">
            <label>Description ${renderTextarea("lunchBurstDescription", "Describe your token...")}</label>
          </div>
          <div class="grid two">
            <label>Total supply ${renderInput("lunchBurstTotalSupply", "1000000000")}</label>
            <label>Fee tier ${renderInput("lunchBurstFeeTier", "10000")}</label>
            <label>Dev buy ETH in launch tx ${renderInput("lunchBurstDevBuyEth", "0.05")}</label>
            <label>User salt ${renderInput("lunchBurstSalt", "blank = random bytes32")}</label>
            <label>Banner URL ${renderInput("lunchBurstBanner", "https://...")}</label>
            <label>Website (optional) ${renderInput("lunchBurstWebsite", "https://...")}</label>
            <label>Twitter / X (optional) ${renderInput("lunchBurstTwitter", "https://x.com/...")}</label>
            <label>Telegram (optional) ${renderInput("lunchBurstTelegram", "https://t.me/...")}</label>
          </div>
          </div>

          <h2 class="section-gap">Burst Buyer Wallets</h2>
          <p class="hint">Each enabled buyer spends from its own ETH balance. The token address is not entered; it is decoded from the launch receipt immediately before broadcasting the burst buys.</p>
          <div id="lunchBurstBuyerRows" class="buyer-rows">
            ${renderLunchBurstBuyerRows()}
          </div>

          <h2 class="section-gap">Review</h2>
          <div class="button-row">
            <button id="lunchBurstReview" type="button">Validate Burst</button>
            <button id="lunchBurstExecute" type="button">Launch And Burst Buy</button>
          </div>
          <div class="result" id="lunchBurstReviewResult"></div>

          <h2 class="section-gap">Execution</h2>
          <div class="result" id="lunchBurstExecutionResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "lunchCombo" ? "active" : ""}" data-tab-panel="lunchCombo">
          <h2>Lunch + Burst</h2>
          <p class="hint">One token form for both execution modes. Atomic mode runs the existing EIP-7702 coordinator flow (one transaction, launch plus every buy, revert-all-or-nothing). Burst mode runs the existing separate-transaction flow (launch confirms first, then buyer wallets buy in parallel; not atomic). Switching the mode below only changes which buyer wallet rows and execute button are used; the token details are shared.</p>

          <h2 class="section-gap">Execution Mode</h2>
          <div class="button-row" id="lunchComboModeRow">
            <label class="checkbox-row"><input id="lunchComboModeAtomic" type="radio" name="lunchComboMode" value="atomic" checked /> Atomic (EIP-7702, one transaction)</label>
            <label class="checkbox-row"><input id="lunchComboModeBurst" type="radio" name="lunchComboMode" value="burst" /> Burst (parallel transactions)</label>
            <label class="checkbox-row"><input id="lunchComboModeChained" type="radio" name="lunchComboMode" value="chained" /> Atomic then Burst (chained)</label>
          </div>
          <p class="hint" id="lunchComboChainedHint" style="display:none">Chained mode: burst transactions are signed locally for the predicted token before the atomic EIP-7702 launch is submitted. As soon as the atomic receipt confirms, the signed burst transactions are sent in parallel directly to the Robinhood sequencer, with the configured RPC as fallback. Delegations are revoked after burst receipts settle. Only the atomic leg has guaranteed internal ordering.</p>

          <h2 class="section-gap">Network</h2>
          <div class="grid two">
            <label>Expected chain <input readonly value="${LUNCH_CHAIN.name} (${LUNCH_CHAIN.id})" /></label>
            <label>Current block <input id="lunchComboCurrentBlock" readonly placeholder="Load status" /></label>
            <label>Wallet <input id="lunchComboPrimaryWallet" readonly placeholder="Connect MetaMask or RPC wallet" /></label>
            <label>Native balance <input id="lunchComboPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="lunchComboSwitchNetwork" type="button">Switch Network</button>
            <button id="lunchComboLoadStatus" type="button">Load Contract Status</button>
          </div>
          <div class="result" id="lunchComboContractResult"></div>

          <div class="function-card section-gap">
            <div class="function-head"><strong>Use Wallets Tab</strong><span>pull Dev/Bundle wallets from the active project's vault</span></div>
            <p class="hint">Connects the project's saved Dev wallet as the signer for this launch, and fills the project's saved Bundle wallets into the buyer rows below — instead of connecting MetaMask or pasting keys by hand. Requires wallets.reveal permission and a Dev/Bundle wallet already generated in the Wallets tab for this project.</p>
            <div class="button-row">
              <select id="lunchComboDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
              <button id="lunchComboUseDevWallet" type="button">Connect Dev Wallet</button>
              <button id="lunchComboFillBundleWallets" type="button">Fill Bundle Wallets Into Buyer Rows</button>
            </div>
            <div class="result" id="lunchComboWalletsTabResult"></div>
          </div>

          <div class="token-info-card">
          <h2 class="section-gap">Token Info</h2>
          ${renderTokenImageDrop("lunchComboImage", "Token Image")}
          <div class="grid two">
            <label class="required">Token name ${renderInput("lunchComboTokenName", "e.g. PepeCoin")}</label>
            <label class="required">Token symbol ${renderInput("lunchComboTokenSymbol", "PEPE")}</label>
          </div>
          <div class="token-info-description">
            <label>Description ${renderTextarea("lunchComboDescription", "Describe your token...")}</label>
          </div>
          <div class="grid two">
            <label>Total supply ${renderInput("lunchComboTotalSupply", "1000000000")}</label>
            <label>Fee tier ${renderInput("lunchComboFeeTier", "10000")}</label>
            <label>Banner URL ${renderInput("lunchComboBanner", "https://...")}</label>
            <label>Website (optional) ${renderInput("lunchComboWebsite", "https://...")}</label>
            <label>Twitter / X (optional) ${renderInput("lunchComboTwitter", "https://x.com/...")}</label>
            <label>Telegram (optional) ${renderInput("lunchComboTelegram", "https://t.me/...")}</label>
            <label>User salt ${renderInput("lunchComboSalt", "blank = random bytes32")}</label>
            <label>Transaction deadline, minutes (atomic mode only) ${renderInput("lunchComboDeadline", "5")}</label>
            <label>Dev buy ETH in launch tx (burst mode only) ${renderInput("lunchComboDevBuyEth", "0")}</label>
          </div>
          </div>

          <div id="lunchComboAtomicSection">
            <h2 class="section-gap">Atomic Buyer Configuration</h2>
            <p class="hint">Row 1 is the coordinator owner's atomic initial buy. Rows 2-7 are separately funded buyer wallets; every enabled row requires its own private key and nonzero minimum output. Requires an RPC wallet connection.</p>
            <div id="lunchComboAtomicBuyerRows" class="buyer-rows">
              ${renderLunchBuyerRows("lunchCombo")}
            </div>
            <div class="button-row" id="lunchComboAtomicButtons">
              <button id="lunchComboAtomicReview" type="button">Validate And Review</button>
              <button id="lunchComboAtomicExecute" type="button">Execute Atomic Launch</button>
            </div>
          </div>

          <div id="lunchComboBurstSection" style="display:none">
            <h2 class="section-gap">Burst Buyer Wallets</h2>
            <p class="hint">Each enabled buyer spends from its own ETH balance. In Burst-only mode the token address is decoded from a launch this leg performs itself. In Chained mode this leg buys against the token launched by the atomic leg above; no separate launch happens here.</p>
            <div id="lunchComboBurstBuyerRows" class="buyer-rows">
              ${renderLunchBurstBuyerRows("lunchCombo")}
            </div>
            <div class="button-row" id="lunchComboBurstButtons">
              <button id="lunchComboBurstReview" type="button">Validate Burst</button>
              <button id="lunchComboBurstExecute" type="button">Launch And Burst Buy</button>
            </div>
          </div>

          <div class="button-row" id="lunchComboChainedButtons" style="display:none">
            <button id="lunchComboChainedReview" type="button">Validate Atomic Then Burst</button>
            <button id="lunchComboChainedExecute" type="button">Execute Atomic Then Burst</button>
          </div>

          <h2 class="section-gap">Review</h2>
          <div class="result" id="lunchComboReviewResult"></div>

          <h2 class="section-gap">Execution</h2>
          <div class="result" id="lunchComboExecutionResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "doppler" ? "active" : ""}" data-tab-panel="doppler">
          <h2>Feel Cash Launch + Bundle</h2>
          <p class="hint">Launches a token through Doppler's Airlock contract (module addresses, hooks, tick spacing and dynamic-fee flag are fixed to this Robinhood Chain deployment, confirmed from a real create() transaction) then bundles buys against the resulting Uniswap V4 pool via the Universal Router, all inside one atomic transaction executed by DopplerAtomicExecutor. Any failed buy reverts the entire launch.</p>

          <h2 class="section-gap">Network &amp; Contracts</h2>
          <div class="grid two">
            <label>Expected chain <input readonly value="${DOPPLER_CHAIN.name} (${DOPPLER_CHAIN.id})" /></label>
            <label>Atomic executor <input id="dopplerExecutorAddress" readonly value="${DOPPLER_CHAIN.atomicExecutor}" placeholder="Deploy DopplerAtomicExecutor and set the address" /></label>
            <label>Airlock <input readonly value="${DOPPLER_CHAIN.airlock}" /></label>
            <label>Universal Router <input readonly value="${DOPPLER_CHAIN.universalRouter}" /></label>
            <label>Token factory <input readonly value="${DOPPLER_CHAIN.tokenFactory}" /></label>
            <label>Governance factory <input readonly value="${DOPPLER_CHAIN.governanceFactory}" /></label>
            <label>Pool initializer / hooks <input readonly value="${DOPPLER_CHAIN.poolInitializer}" /></label>
            <label>Liquidity migrator <input readonly value="${DOPPLER_CHAIN.liquidityMigrator}" /></label>
            <label>Numeraire <input readonly value="${DOPPLER_CHAIN.numeraire}" /></label>
            <label>Wallet <input id="dopplerPrimaryWallet" readonly placeholder="Connect MetaMask or RPC wallet" /></label>
            <label>Native balance <input id="dopplerPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <div class="button-row">
            <button id="dopplerSwitchNetwork" type="button">Switch Network</button>
            <button id="dopplerLoadStatus" type="button">Load Contract Status</button>
          </div>
          <div class="result" id="dopplerContractResult"></div>

          <div class="function-card section-gap">
            <div class="function-head"><strong>Use Wallets Tab</strong><span>pull Dev/Bundle wallets from the active project's vault</span></div>
            <p class="hint">Connects the project's saved Dev wallet as the signer for this launch, and fills the project's saved Bundle wallets into the buyer rows below — instead of connecting MetaMask or pasting keys by hand. Requires wallets.reveal permission and a Dev/Bundle wallet already generated in the Wallets tab for this project.</p>
            <div class="button-row">
              <select id="dopplerDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
              <button id="dopplerUseDevWallet" type="button">Connect Dev Wallet</button>
              <button id="dopplerFillBundleWallets" type="button">Fill Bundle Wallets Into Buyer Rows</button>
            </div>
            <div class="result" id="dopplerWalletsTabResult"></div>
          </div>

          <div class="token-info-card">
          <h2 class="section-gap">Token Info</h2>
          <div class="grid two">
            <label class="required">Token name ${renderInput("dopplerTokenName", "e.g. PepeCoin")}</label>
            <label class="required">Token symbol ${renderInput("dopplerTokenSymbol", "PEPE")}</label>
            <label>Initial supply ${renderInput("dopplerInitialSupply", "1000000000")}</label>
            <label>Tokens to sell ${renderInput("dopplerNumTokensToSell", "800000000")}</label>
            <label>Integrator (blank = executor owner) ${renderInput("dopplerIntegrator", "optional 0x")}</label>
            <label>User salt ${renderInput("dopplerSalt", "blank = random bytes32")}</label>
            <label>Numeraire is native asset <input id="dopplerNumeraireIsNative" type="checkbox" /></label>
            <label>Transaction deadline, minutes ${renderInput("dopplerDeadline", "5")}</label>
          </div>
          </div>
          <p class="hint">tokenFactoryData / governanceFactoryData / poolInitializerData / liquidityMigratorData are opaque bytes defined by Doppler's own modules, not by this app. Provide each as raw 0x-prefixed ABI-encoded hex — export it from Doppler's SDK/UI for this deployment, or reuse the encoding from a known-good create() transaction. Leaving one blank sends empty bytes, which will revert unless the module accepts that.</p>
          <div class="grid two">
            <label>tokenFactoryData ${renderInput("dopplerTokenFactoryData", "0x...")}</label>
            <label>governanceFactoryData ${renderInput("dopplerGovernanceFactoryData", "0x...")}</label>
            <label>poolInitializerData ${renderInput("dopplerPoolInitializerData", "0x...")}</label>
            <label>liquidityMigratorData ${renderInput("dopplerLiquidityMigratorData", "0x...")}</label>
          </div>

          <h2 class="section-gap">Bundled Buyer Configuration (Atomic, 5 wallets)</h2>
          <p class="hint">Row 1 is the atomic creator/first buy. Rows 2-5 are additional recipients funded by the executor owner's connected wallet. Every enabled row requires its own nonzero minimum token output. Requires the connected wallet to be the DopplerAtomicExecutor owner.</p>
          <div id="dopplerBuyerRows" class="buyer-rows">
            ${renderDopplerBuyerRows()}
          </div>
          <div class="button-row">
            <button id="dopplerReview" type="button">Validate And Review</button>
            <button id="dopplerExecute" type="button">Execute Atomic Launch And Buy</button>
          </div>

          <h2 class="section-gap">Review</h2>
          <div class="result" id="dopplerReviewResult"></div>

          <h2 class="section-gap">Execution</h2>
          <div class="result" id="dopplerExecutionResult"></div>

          <h2 class="section-gap">Burst Buyer Wallets (25 wallets, not atomic)</h2>
          <p class="hint">Burst mode launches through Airlock.create() directly (no bundled buys in that transaction), decodes the created asset from the receipt, then each enabled buyer wallet signs and broadcasts its own V4 swap transaction in parallel using its own private key and ETH balance. Same-block inclusion is not guaranteed. Keys are used locally in this page and are never sent anywhere.</p>
          <div class="grid two">
            <label>Expected chain <input readonly value="${DOPPLER_CHAIN.name} (${DOPPLER_CHAIN.id})" /></label>
            <label>Wallet <input id="dopplerBurstPrimaryWallet" readonly placeholder="Connect MetaMask or RPC wallet" /></label>
            <label>Native balance <input id="dopplerBurstPrimaryBalance" readonly placeholder="-" /></label>
          </div>
          <h3 class="section-gap">Burst Token Launch Form</h3>
          <div class="grid two">
            <label>Token name ${renderInput("dopplerBurstTokenName", "Token name")}</label>
            <label>Token symbol ${renderInput("dopplerBurstTokenSymbol", "TICKER")}</label>
            <label>Initial supply ${renderInput("dopplerBurstInitialSupply", "1000000000")}</label>
            <label>Tokens to sell ${renderInput("dopplerBurstNumTokensToSell", "800000000")}</label>
            <label>Integrator (blank = launcher wallet) ${renderInput("dopplerBurstIntegrator", "optional 0x")}</label>
            <label>User salt ${renderInput("dopplerBurstSalt", "blank = random bytes32")}</label>
            <label>Numeraire is native asset <input id="dopplerBurstNumeraireIsNative" type="checkbox" /></label>
          </div>
          <div class="grid two">
            <label>tokenFactoryData ${renderInput("dopplerBurstTokenFactoryData", "0x...")}</label>
            <label>governanceFactoryData ${renderInput("dopplerBurstGovernanceFactoryData", "0x...")}</label>
            <label>poolInitializerData ${renderInput("dopplerBurstPoolInitializerData", "0x...")}</label>
            <label>liquidityMigratorData ${renderInput("dopplerBurstLiquidityMigratorData", "0x...")}</label>
          </div>
          <div class="button-row">
            <button id="dopplerBurstSwitchNetwork" type="button">Switch Network</button>
            <button id="dopplerBurstLoadStatus" type="button">Load Contract Status</button>
          </div>
          <div class="result" id="dopplerBurstContractResult"></div>
          <div id="dopplerBurstBuyerRows" class="buyer-rows">
            ${renderDopplerBurstBuyerRows()}
          </div>
          <div class="button-row">
            <button id="dopplerBurstReview" type="button">Validate Burst</button>
            <button id="dopplerBurstExecute" type="button">Launch And Burst Buy</button>
          </div>

          <h3 class="section-gap">Burst Review</h3>
          <div class="result" id="dopplerBurstReviewResult"></div>

          <h3 class="section-gap">Burst Execution</h3>
          <div class="result" id="dopplerBurstExecutionResult"></div>
        </div>
        <div class="tab-panel ${state.activeFunctionTab === "verify" ? "active" : ""}" data-tab-panel="verify">
          <p class="hint">Verify the deployed Token contract on Robinhood Blockscout using Hardhat Standard JSON input.</p>
          <div class="grid two">
            <label>Contract address ${renderInput("verifyAddress", "blank = deployed/attached contract")}</label>
            <label>Contract name ${renderInput("verifyContractName", "contracts/HRD.sol:HRD")}</label>
            <label>Compiler version ${renderInput("verifyCompiler", "v0.8.17+commit.8df45f5f")}</label>
            <label>Constructor args, optional override ${renderInput("verifyConstructorArgs", "blank = encode deploy form")}</label>
            <label>Verification GUID ${renderInput("verifyGuid", "returned after submit")}</label>
          </div>
          <div class="button-row">
            <button id="verifyContract">Verify On Blockscout</button>
            <button id="checkVerifyStatus">Check Verification Status</button>
            <button id="openBlockscout">Open In Blockscout</button>
          </div>
          <div class="result" id="verifyResult"></div>
        </div>
        ${(auth.canManageUsers || auth.canManageRoles) ? `
        <div class="tab-panel ${state.activeFunctionTab === "admin" ? "active" : ""}" data-tab-panel="admin">
          ${renderAdminPanel()}
        </div>` : ""}
          </div>
        </div>
      </section>

      <pre id="log"></pre>
    </main>
  `;

  for (const id of [
    "rpcUrl", "privateKey", "tokenName", "tokenSymbol", "router", "taxWallet", "ecosystemWallet", "bel", "contractAddress",
    "deployGasLimit",
    "buyTokenAddress",
    "buyEthAmount", "buyMinTokens", "buyRecipient", "buyDeadline", "buyerPrivateKeys",
    "sellMinEth", "sellRecipient", "sellDeadline", "sellerPrivateKeys",
    "launchEthAmount", "launchLpRecipient",
    "lpTokenAmount", "lpEthAmount", "lpMinToken", "lpMinEth", "lpRecipient", "lpDeadline",
    "removePair", "removeLpAmount", "removeMinToken", "removeMinEth", "removeRecipient", "removeDeadline",
    "burnAmount",
    "generatedAccounts",
    "sendTo0", "sendAmount0", "sendTo1", "sendAmount1", "sendTo2", "sendAmount2", "sendTo3", "sendAmount3", "sendTo4", "sendAmount4",
    "sweepRecipient", "sweepBuffer", "sweepPrivateKeys",
    "ponsCurrentBlock", "ponsPrimaryWallet", "ponsPrimaryBalance", "ponsLaunchContract", "ponsLaunchFee", "ponsRouter", "ponsFactory",
    "ponsPositionManager", "ponsPairToken", "ponsLaunchConfigId", "ponsDexId", "ponsTokenName", "ponsTokenSymbol", "ponsLogo",
    "ponsDescription", "ponsTwitter", "ponsTelegram", "ponsDiscord", "ponsWebsite", "ponsFarcaster", "ponsFeeWallet", "ponsSalt",
    "ponsSlippage",
    "ponsOwner", "ponsLaunchEnabledStatus", "ponsIsOwner", "ponsWhitelistAddress", "ponsIsWhitelisted",
    ...Array.from({ length: 1 }, (_, index) => [`ponsBuyerEnabled${index}`, `ponsBuyerAddress${index}`, `ponsBuyerAmount${index}`, `ponsBuyerMinOut${index}`, `ponsBuyerBalance${index}`, `ponsBuyerGas${index}`, `ponsBuyerStatus${index}`, `ponsBuyerHash${index}`, `ponsBuyerReceived${index}`]).flat(),
    ...Array.from({ length: 5 }, (_, index) => [`ponsFastLaneBuyerEnabled${index}`, `ponsFastLaneBuyerKey${index}`, `ponsFastLaneBuyerAddress${index}`, `ponsFastLaneBuyerAmount${index}`, `ponsFastLaneBuyerMinOut${index}`, `ponsFastLaneBuyerBalance${index}`, `ponsFastLaneBuyerGas${index}`, `ponsFastLaneBuyerStatus${index}`, `ponsFastLaneBuyerHash${index}`, `ponsFastLaneBuyerReceived${index}`]).flat(),
    ...PONS_BURST_SECTIONS.flatMap(({ prefix }) => Array.from({ length: PONS_BURST_SECTION_SIZE }, (_, index) => [`${prefix}BuyerEnabled${index}`, `${prefix}BuyerKey${index}`, `${prefix}BuyerAddress${index}`, `${prefix}BuyerAmount${index}`, `${prefix}BuyerMinOut${index}`, `${prefix}BuyerBalance${index}`, `${prefix}BuyerGas${index}`, `${prefix}BuyerStatus${index}`, `${prefix}BuyerHash${index}`, `${prefix}BuyerReceived${index}`]).flat()),
    "lunchCurrentBlock", "lunchPrimaryWallet", "lunchPrimaryBalance", "lunchLaunchContract", "lunch7702Coordinator", "lunch7702Delegate", "lunchAtomicOwner", "lunchImplementation", "lunchLaunchFee",
    "lunchRouter", "lunchFactory", "lunchNpm", "lunchXToken", "lunchFeeLocker", "lunchEnforcedSupply", "lunchTickMagnitude",
    "lunchTokenName", "lunchTokenSymbol", "lunchTotalSupply", "lunchFeeTier", "lunchImage", "lunchBanner", "lunchDescription",
    "lunchWebsite", "lunchTwitter", "lunchTelegram", "lunchSalt", "lunchDeadline",
    ...Array.from({ length: 5 }, (_, index) => [`lunchBuyerEnabled${index}`, `lunchBuyerKey${index}`, `lunchBuyerAddress${index}`, `lunchBuyerAmount${index}`, `lunchBuyerMinOut${index}`, `lunchBuyerBalance${index}`, `lunchBuyerGas${index}`, `lunchBuyerStatus${index}`, `lunchBuyerHash${index}`, `lunchBuyerReceived${index}`]).flat(),
    "lunchBurstCurrentBlock", "lunchBurstPrimaryWallet", "lunchBurstPrimaryBalance", "lunchBurstLaunchContract", "lunchBurstImplementation", "lunchBurstLaunchFee",
    "lunchBurstRouter", "lunchBurstFactory", "lunchBurstNpm", "lunchBurstXToken", "lunchBurstEnforcedSupply",
    "lunchBurstTokenName", "lunchBurstTokenSymbol", "lunchBurstTotalSupply", "lunchBurstFeeTier", "lunchBurstDevBuyEth", "lunchBurstSalt",
    "lunchBurstImage", "lunchBurstBanner", "lunchBurstDescription", "lunchBurstWebsite", "lunchBurstTwitter", "lunchBurstTelegram",
    ...Array.from({ length: 25 }, (_, index) => [`lunchBurstBuyerEnabled${index}`, `lunchBurstBuyerKey${index}`, `lunchBurstBuyerAddress${index}`, `lunchBurstBuyerAmount${index}`, `lunchBurstBuyerMinOut${index}`, `lunchBurstBuyerBalance${index}`, `lunchBurstBuyerGas${index}`, `lunchBurstBuyerStatus${index}`, `lunchBurstBuyerHash${index}`, `lunchBurstBuyerReceived${index}`]).flat(),
    "lunchComboCurrentBlock", "lunchComboPrimaryWallet", "lunchComboPrimaryBalance",
    "lunchComboTokenName", "lunchComboTokenSymbol", "lunchComboTotalSupply", "lunchComboFeeTier", "lunchComboImage", "lunchComboBanner",
    "lunchComboDescription", "lunchComboWebsite", "lunchComboTwitter", "lunchComboTelegram", "lunchComboSalt", "lunchComboDeadline", "lunchComboDevBuyEth",
    ...Array.from({ length: 5 }, (_, index) => [`lunchComboBuyerEnabled${index}`, `lunchComboBuyerKey${index}`, `lunchComboBuyerAddress${index}`, `lunchComboBuyerAmount${index}`, `lunchComboBuyerMinOut${index}`, `lunchComboBuyerBalance${index}`, `lunchComboBuyerGas${index}`, `lunchComboBuyerStatus${index}`, `lunchComboBuyerHash${index}`, `lunchComboBuyerReceived${index}`]).flat(),
    ...Array.from({ length: 25 }, (_, index) => [`lunchComboBurstBuyerEnabled${index}`, `lunchComboBurstBuyerKey${index}`, `lunchComboBurstBuyerAddress${index}`, `lunchComboBurstBuyerAmount${index}`, `lunchComboBurstBuyerMinOut${index}`, `lunchComboBurstBuyerBalance${index}`, `lunchComboBurstBuyerGas${index}`, `lunchComboBurstBuyerStatus${index}`, `lunchComboBurstBuyerHash${index}`, `lunchComboBurstBuyerReceived${index}`]).flat(),
    "dopplerPrimaryWallet", "dopplerPrimaryBalance",
    "dopplerTokenName", "dopplerTokenSymbol", "dopplerInitialSupply", "dopplerNumTokensToSell", "dopplerIntegrator", "dopplerSalt", "dopplerNumeraireIsNative", "dopplerDeadline",
    "dopplerTokenFactoryData", "dopplerGovernanceFactoryData", "dopplerPoolInitializerData", "dopplerLiquidityMigratorData",
    ...Array.from({ length: 5 }, (_, index) => [`dopplerBuyerEnabled${index}`, `dopplerBuyerAddress${index}`, `dopplerBuyerAmount${index}`, `dopplerBuyerMinOut${index}`, `dopplerBuyerGas${index}`, `dopplerBuyerStatus${index}`, `dopplerBuyerReceived${index}`]).flat(),
    "dopplerBurstPrimaryWallet", "dopplerBurstPrimaryBalance",
    "dopplerBurstTokenName", "dopplerBurstTokenSymbol", "dopplerBurstInitialSupply", "dopplerBurstNumTokensToSell", "dopplerBurstIntegrator", "dopplerBurstSalt", "dopplerBurstNumeraireIsNative",
    "dopplerBurstTokenFactoryData", "dopplerBurstGovernanceFactoryData", "dopplerBurstPoolInitializerData", "dopplerBurstLiquidityMigratorData",
    ...Array.from({ length: 25 }, (_, index) => [`dopplerBurstBuyerEnabled${index}`, `dopplerBurstBuyerKey${index}`, `dopplerBurstBuyerAddress${index}`, `dopplerBurstBuyerAmount${index}`, `dopplerBurstBuyerMinOut${index}`, `dopplerBurstBuyerBalance${index}`, `dopplerBurstBuyerGas${index}`, `dopplerBurstBuyerStatus${index}`, `dopplerBurstBuyerHash${index}`, `dopplerBurstBuyerReceived${index}`]).flat(),
    "verifyAddress", "verifyContractName", "verifyCompiler", "verifyConstructorArgs", "verifyGuid",
    ...MM_INPUT_IDS,
    ...DISPERSE_INPUT_IDS,
    ...BALANCE_CHECK_INPUT_IDS,
    "multiBurstTokenAddress", "multiBurstSlippage",
    ...Array.from({ length: 25 }, (_, index) => [`multiBurstBuyerEnabled${index}`, `multiBurstBuyerKey${index}`, `multiBurstBuyerAddress${index}`, `multiBurstBuyerAmount${index}`, `multiBurstBuyerBalance${index}`, `multiBurstBuyerStatus${index}`, `multiBurstBuyerHash${index}`, `multiBurstBuyerReceived${index}`]).flat(),
    "washTokenAddress", "washSlippage", "washSellKey", "washSellAmount", "washBuyKey",
    "washRelayCount", "washRelayDelayRange", "washRelayVariancePct", "washRelayGasReserve",
    "washUseCrossChain", "washSolanaRpcUrl", "washSolanaGasReserve",
    "washBatchSellKeys", "washBatchBuyKeys", "washBatchRelayCount", "washBatchDelayRange", "washBatchVariancePct", "washBatchGasReserve",
    "washBatchUseCrossChain", "washBatchSolanaRpcUrl", "washBatchSolanaGasReserve",
    // "Pons + Wash" combo tab: a full second copy of the Pons launch form
    // (pw-namespaced) plus a full copy of the Wallet Wash form.
    "pwponsCurrentBlock", "pwponsPrimaryWallet", "pwponsPrimaryBalance", "pwponsLaunchContract", "pwponsLaunchFee", "pwponsRouter", "pwponsFactory",
    "pwponsPositionManager", "pwponsPairToken", "pwponsLaunchConfigId", "pwponsDexId", "pwponsTokenName", "pwponsTokenSymbol", "pwponsLogo",
    "pwponsDescription", "pwponsTwitter", "pwponsTelegram", "pwponsDiscord", "pwponsWebsite", "pwponsFarcaster", "pwponsFeeWallet", "pwponsSalt",
    "pwponsSlippage",
    "pwponsOwner", "pwponsLaunchEnabledStatus", "pwponsIsOwner", "pwponsWhitelistAddress", "pwponsIsWhitelisted",
    ...Array.from({ length: 1 }, (_, index) => [`pwponsBuyerEnabled${index}`, `pwponsBuyerAddress${index}`, `pwponsBuyerAmount${index}`, `pwponsBuyerMinOut${index}`, `pwponsBuyerBalance${index}`, `pwponsBuyerGas${index}`, `pwponsBuyerStatus${index}`, `pwponsBuyerHash${index}`, `pwponsBuyerReceived${index}`]).flat(),
    ...Array.from({ length: 5 }, (_, index) => [`pwponsFastLaneBuyerEnabled${index}`, `pwponsFastLaneBuyerKey${index}`, `pwponsFastLaneBuyerAddress${index}`, `pwponsFastLaneBuyerAmount${index}`, `pwponsFastLaneBuyerMinOut${index}`, `pwponsFastLaneBuyerBalance${index}`, `pwponsFastLaneBuyerGas${index}`, `pwponsFastLaneBuyerStatus${index}`, `pwponsFastLaneBuyerHash${index}`, `pwponsFastLaneBuyerReceived${index}`]).flat(),
    ...PONS_BURST_SECTIONS.flatMap(({ prefix }) => Array.from({ length: PONS_BURST_SECTION_SIZE }, (_, index) => [`pw${prefix}BuyerEnabled${index}`, `pw${prefix}BuyerKey${index}`, `pw${prefix}BuyerAddress${index}`, `pw${prefix}BuyerAmount${index}`, `pw${prefix}BuyerMinOut${index}`, `pw${prefix}BuyerBalance${index}`, `pw${prefix}BuyerGas${index}`, `pw${prefix}BuyerStatus${index}`, `pw${prefix}BuyerHash${index}`, `pw${prefix}BuyerReceived${index}`]).flat()),
    "pwwashTokenAddress", "pwwashSlippage",
    "pwwashBatchSellKeys", "pwwashBatchBuyKeys", "pwwashBatchRelayCount", "pwwashBatchDelayRange", "pwwashBatchVariancePct", "pwwashBatchGasReserve",
    "pwwashBatchUseCrossChain", "pwwashBatchSolanaRpcUrl", "pwwashBatchSolanaGasReserve",
    "pwponsWashStartDelay",
    // Pons Launch tab: "Run Everything" auto-wash settings.
    "ponsAllThenWash", "ponsAllWashStartDelay", "ponsAllWashSlippage", "ponsAllWashRelayCount", "ponsAllWashDelayRange",
    "ponsAllWashVariancePct", "ponsAllWashGasReserve", "ponsAllWashUseCrossChain", "ponsAllWashSolanaGasReserve",
    "launchPlanBudget", "launchPlanWalletCount",
    "adminNewUsername", "adminNewPassword", "adminRoleName", "adminRoleDescription",
    "adminProjectName", "adminProjectTokenAddress", "adminProjectRpcUrl", "adminProjectRouter", "adminAccessUsername",
  ]) {
    inputs[id] = document.querySelector(`#${id}`);
  }
  inputs.tokenName.value = "Hood Research Departmen";
  inputs.tokenSymbol.value = "HRD";
  inputs.rpcUrl.value = "/rpc";
  inputs.router.value = ROBINHOOD_CHAIN.router;
  inputs.buyMinTokens.value = "0";
  inputs.buyDeadline.value = "20";
  inputs.sellMinEth.value = "0";
  inputs.sellDeadline.value = "20";
  inputs.lpMinToken.value = "0";
  inputs.lpMinEth.value = "0";
  inputs.lpDeadline.value = "20";
  inputs.removeMinToken.value = "0";
  inputs.removeMinEth.value = "0";
  inputs.removeDeadline.value = "20";
  inputs.sweepBuffer.value = "0.00001";
  inputs.ponsLaunchConfigId.value = "0";
  inputs.ponsDexId.value = "0";
  inputs.ponsSlippage.value = "5";
  inputs.ponsBuyerEnabled0.checked = true;
  inputs.pwponsLaunchConfigId.value = "0";
  inputs.pwponsDexId.value = "0";
  inputs.pwponsSlippage.value = "5";
  inputs.pwponsBuyerEnabled0.checked = true;
  inputs.lunchRouter.value = LUNCH_CHAIN.router;
  inputs.lunchTotalSupply.value = "1000000000";
  inputs.lunchFeeTier.value = "10000";
  inputs.lunchDeadline.value = "5";
  inputs.lunchBuyerEnabled0.checked = true;
  inputs.lunchBurstRouter.value = LUNCH_CHAIN.router;
  inputs.lunchBurstTotalSupply.value = "1000000000";
  inputs.lunchBurstFeeTier.value = "10000";
  inputs.lunchBurstDevBuyEth.value = "0";
  inputs.lunchComboTotalSupply.value = "1000000000";
  inputs.lunchComboFeeTier.value = "10000";
  inputs.lunchComboDeadline.value = "5";
  inputs.lunchComboDevBuyEth.value = "0";
  inputs.lunchComboBuyerEnabled0.checked = true;
  inputs.launchPlanBudget.value = "6900";
  inputs.launchPlanWalletCount.value = "100";
  inputs.verifyContractName.value = verification.contractName;
  inputs.verifyCompiler.value = verification.compilerVersion;

  document.querySelector("#signOutLink").addEventListener("click", signOut);
  bindAdminHandlers();
  document.querySelector("#activeProjectSelect")?.addEventListener("change", (event) => {
    switchActiveProject(event.target.value);
  });
  document.querySelector("#connectMetaMask").addEventListener("click", connectMetaMask);
  document.querySelector("#addRobinhood").addEventListener("click", addRobinhoodChain);
  document.querySelector("#connect").addEventListener("click", connect);
  for (const tab of document.querySelectorAll("[data-tab]")) {
    tab.addEventListener("click", switchFunctionTab);
  }
  document.querySelector("#deploy").addEventListener("click", deploy);
  document.querySelector("#diagnoseDeploy").addEventListener("click", diagnoseLastDeploy);
  document.querySelector("#verifyLatestDeploy").addEventListener("click", verifyContract);
  document.querySelector("#attach").addEventListener("click", attach);
  document.querySelector("#buyAttachToken").addEventListener("click", buyAttachToken);
  document.querySelector("#buyConnected").addEventListener("click", buyConnected);
  document.querySelector("#buyBatch").addEventListener("click", buyBatch);
  document.querySelector("#sellConnected").addEventListener("click", sellConnected);
  document.querySelector("#sellBatch").addEventListener("click", sellBatch);
  document.querySelector("#launchInitialLp").addEventListener("click", launchInitialLiquidity);
  document.querySelector("#addLp").addEventListener("click", addLiquidity);
  document.querySelector("#removeLp").addEventListener("click", removeLiquidity);
  document.querySelector("#burnTokens").addEventListener("click", burnTokens);
  document.querySelector("#generateAccounts").addEventListener("click", generateAccounts);
  document.querySelector("#copyAccounts").addEventListener("click", copyAccounts);
  document.querySelector("#loadAccountsToMultisend").addEventListener("click", loadAccountsToMultisend);
  document.querySelector("#sendEthBatch").addEventListener("click", sendEthBatch);
  document.querySelector("#previewSweep").addEventListener("click", previewSweep);
  document.querySelector("#sweepConnected").addEventListener("click", sweepConnected);
  document.querySelector("#sweepBatch").addEventListener("click", sweepBatch);
  document.querySelector("#ponsSwitchNetwork").addEventListener("click", addRobinhoodChain);
  document.querySelector("#ponsLoadStatus").addEventListener("click", () => loadPonsStatus(""));
  document.querySelector("#ponsValidateAll").addEventListener("click", () => validatePonsAll(""));
  document.querySelector("#ponsExecuteAll").addEventListener("click", () => executePonsAll(""));
  document.querySelector("#ponsCheckWhitelist").addEventListener("click", checkPonsWhitelist);
  document.querySelector("#ponsEnableLaunch").addEventListener("click", () => setPonsLaunchEnabled(true));
  document.querySelector("#ponsDisableLaunch").addEventListener("click", () => setPonsLaunchEnabled(false));
  document.querySelector("#ponsWhitelistAdd").addEventListener("click", () => setPonsWhitelist(true));
  document.querySelector("#ponsWhitelistRemove").addEventListener("click", () => setPonsWhitelist(false));
  document.querySelector("#multiBurstCheckPool").addEventListener("click", multiBurstCheckPool);
  document.querySelector("#multiBurstExecute").addEventListener("click", multiBurstExecute);
  document.querySelector("#washCheckPool")?.addEventListener("click", washCheckPool);
  document.querySelector("#washRunSequence")?.addEventListener("click", washRunSequence);
  document.querySelector("#washRunSequenceCrossChain")?.addEventListener("click", washRunSequenceCrossChain);
  document.querySelector("#washBatchRun")?.addEventListener("click", () => washBatchRun());
  document.querySelector("#lunchSwitchNetwork").addEventListener("click", addRobinhoodChain);
  document.querySelector("#lunchLoadStatus").addEventListener("click", loadLunchStatus);
  document.querySelector("#lunchReview").addEventListener("click", reviewLunch7702Launch);
  document.querySelector("#lunchExecute").addEventListener("click", executeLunch7702Launch);
  document.querySelector("#lunchBurstSwitchNetwork").addEventListener("click", addRobinhoodChain);
  document.querySelector("#lunchBurstLoadStatus").addEventListener("click", loadLunchBurstStatus);
  document.querySelector("#lunchBurstReview").addEventListener("click", reviewLunchBurstLaunch);
  document.querySelector("#lunchBurstExecute").addEventListener("click", executeLunchBurstLaunch);
  document.querySelector("#lunchComboModeAtomic").addEventListener("change", updateLunchComboMode);
  document.querySelector("#lunchComboModeBurst").addEventListener("change", updateLunchComboMode);
  document.querySelector("#lunchComboModeChained").addEventListener("change", updateLunchComboMode);
  document.querySelector("#lunchComboSwitchNetwork").addEventListener("click", addRobinhoodChain);
  document.querySelector("#lunchComboLoadStatus").addEventListener("click", loadLunchComboStatus);
  document.querySelector("#lunchComboAtomicReview").addEventListener("click", reviewLunchComboAtomic);
  document.querySelector("#lunchComboAtomicExecute").addEventListener("click", executeLunchComboAtomic);
  document.querySelector("#lunchComboBurstReview").addEventListener("click", reviewLunchComboBurst);
  document.querySelector("#lunchComboBurstExecute").addEventListener("click", executeLunchComboBurst);
  document.querySelector("#lunchComboChainedReview").addEventListener("click", reviewLunchComboChained);
  document.querySelector("#lunchComboChainedExecute").addEventListener("click", executeLunchComboChained);
  updateLunchComboMode();
  document.querySelector("#dopplerSwitchNetwork").addEventListener("click", addRobinhoodChain);
  document.querySelector("#dopplerLoadStatus").addEventListener("click", loadDopplerStatus);
  document.querySelector("#dopplerReview").addEventListener("click", reviewDopplerLaunch);
  document.querySelector("#dopplerExecute").addEventListener("click", executeDopplerLaunch);
  document.querySelector("#dopplerBurstSwitchNetwork").addEventListener("click", addRobinhoodChain);
  document.querySelector("#dopplerBurstLoadStatus").addEventListener("click", loadDopplerBurstStatus);
  document.querySelector("#dopplerBurstReview").addEventListener("click", reviewDopplerBurstLaunch);
  document.querySelector("#dopplerBurstExecute").addEventListener("click", executeDopplerBurstLaunch);
  document.querySelector("#verifyContract").addEventListener("click", verifyContract);
  document.querySelector("#checkVerifyStatus").addEventListener("click", checkVerificationStatus);
  document.querySelector("#openBlockscout").addEventListener("click", openBlockscout);
  document.querySelector("#launchPlanCalculate").addEventListener("click", calculateLaunchPlan);
  document.querySelector("#launchPlanReset").addEventListener("click", resetLaunchPlan);
  for (const button of document.querySelectorAll("[data-call]")) {
    button.addEventListener("click", callFunction);
  }
  mmBindEvents();
  walletsTabBindEvents();
  projectMgmtBindEvents();
  disperseBindEvents();
  balanceCheckBindEvents();
  rebindTokenImageDropzones();
  document.querySelector("#ponsUseDevWallet")?.addEventListener("click", ponsUseDevWallet);
  document.querySelector("#ponsFillBundleWallets")?.addEventListener("click", ponsFillBundleWallets);
  document.querySelector("#pwponsWashConnectDev")?.addEventListener("click", ponsWashConnectDev);
  document.querySelector("#pwponsWashFillBundle")?.addEventListener("click", ponsWashFillBundle);
  document.querySelector("#pwponsWashFillWashBuy")?.addEventListener("click", ponsWashFillWashBuy);
  document.querySelector("#pwponsWashValidate")?.addEventListener("click", ponsWashValidate);
  document.querySelector("#pwponsWashStart")?.addEventListener("click", executePonsWashCombo);
  // The "Pons + Wash" tab's own copy of the Pons-body + Wallet-Wash-body buttons.
  document.querySelector("#pwponsSwitchNetwork")?.addEventListener("click", addRobinhoodChain);
  document.querySelector("#pwponsLoadStatus")?.addEventListener("click", () => loadPonsStatus("pw"));
  document.querySelector("#pwponsValidateAll")?.addEventListener("click", () => validatePonsAll("pw"));
  document.querySelector("#pwponsExecuteAll")?.addEventListener("click", () => executePonsAll("pw"));
  document.querySelector("#pwponsUseDevWallet")?.addEventListener("click", () => useDevWalletAsSigner("pwponsWalletsTabResult", "Pons + Wash", "pwponsDevWalletSelect"));
  document.querySelector("#pwponsFillBundleWallets")?.addEventListener("click", ponsWashFillBundle);
  document.querySelector("#pwwashBatchRun")?.addEventListener("click", () => washBatchRun("#pwwashBatchResult"));
  document.querySelector("#lunchUseDevWallet")?.addEventListener("click", lunchUseDevWallet);
  document.querySelector("#lunchFillBundleWallets")?.addEventListener("click", lunchFillBundleWallets);
  document.querySelector("#lunchBurstUseDevWallet")?.addEventListener("click", lunchBurstUseDevWallet);
  document.querySelector("#lunchBurstFillBundleWallets")?.addEventListener("click", lunchBurstFillBundleWallets);
  document.querySelector("#lunchComboUseDevWallet")?.addEventListener("click", lunchComboUseDevWallet);
  document.querySelector("#lunchComboFillBundleWallets")?.addEventListener("click", lunchComboFillBundleWallets);
  document.querySelector("#dopplerUseDevWallet")?.addEventListener("click", dopplerUseDevWallet);
  document.querySelector("#dopplerFillBundleWallets")?.addEventListener("click", dopplerFillBundleWallets);
  refreshDevWalletSelects();
  updateStatus();
}

function renderFunction(fn) {
  const payable = fn.stateMutability === "payable";
  return `
    <article class="function-card">
      <div class="function-head">
        <strong>${fn.name}</strong>
        <span>${fn.stateMutability}</span>
      </div>
      <div class="grid ${fn.inputs.length + (payable ? 1 : 0) > 1 ? "two" : ""}">
        ${fn.inputs.map((input, index) => `<label>${input.name || `arg${index}`} <input data-input="${fn.name}-${index}" placeholder="${input.type}" /></label>`).join("")}
        ${payable ? `<label>Native value <input data-value="${fn.name}" placeholder="0.1" /></label>` : ""}
      </div>
      <button data-call="${fn.name}" data-mutability="${fn.stateMutability}">${fn.stateMutability === "view" || fn.stateMutability === "pure" ? "Read" : "Send"}</button>
      <div class="result" data-result="${fn.name}"></div>
    </article>
  `;
}

function log(message) {
  const el = document.querySelector("#log");
  el.textContent = `[${new Date().toLocaleTimeString()}] ${message}\n${el.textContent}`;
}

function updateStatus() {
  const status = document.querySelector("#status");
  status.textContent = state.signer
    ? `Connected ${short(state.address)}${state.walletMode ? ` via ${state.walletMode}` : ""}${state.contract ? ` | Contract ${short(state.contract.target)}` : ""}`
    : "Not connected";
}

async function signOut(event) {
  event.preventDefault();
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
  } catch {}
  window.location.href = "/login.html";
}

async function connectMetaMask() {
  if (!window.ethereum) {
    log("MetaMask was not detected in this browser.");
    return;
  }
  state.provider = new BrowserProvider(window.ethereum);
  await state.provider.send("eth_requestAccounts", []);
  state.signer = await state.provider.getSigner();
  state.address = await state.signer.getAddress();
  state.walletMode = "MetaMask";
  const network = await state.provider.getNetwork();
  log(`Connected MetaMask ${state.address} on chain ${network.chainId}`);
  if (network.chainId !== BigInt(ROBINHOOD_CHAIN.chainId)) {
    log(`MetaMask is not on Robinhood Chain. Click "Add/Switch Robinhood Chain" or deploy will switch before sending.`);
  }
  updateStatus();
}

async function addRobinhoodChain() {
  if (!window.ethereum) {
    log("MetaMask was not detected in this browser.");
    return;
  }
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ROBINHOOD_CHAIN.chainIdHex }],
    });
    log("MetaMask switched to Robinhood Chain.");
  } catch (error) {
    if (error.code !== 4902) {
      log(`Switch failed: ${error.message}`);
      return;
    }
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: ROBINHOOD_CHAIN.chainIdHex,
          chainName: ROBINHOOD_CHAIN.chainName,
          rpcUrls: [ROBINHOOD_CHAIN.rpcUrl],
          nativeCurrency: {
            name: ROBINHOOD_CHAIN.currencySymbol,
            symbol: ROBINHOOD_CHAIN.currencySymbol,
            decimals: 18,
          },
          blockExplorerUrls: [ROBINHOOD_CHAIN.blockExplorerUrl],
        },
      ],
    });
    log("Robinhood Chain was added to MetaMask.");
  }
}

async function connect() {
  state.provider = getRpcProvider();
  state.signer = new Wallet(inputs.privateKey.value.trim(), state.provider);
  state.address = await state.signer.getAddress();
  state.walletMode = "RPC";
  const balance = await state.provider.getBalance(state.address);
  log(`Connected ${state.address} with ${ethers.formatEther(balance)} native balance`);
  updateStatus();
}

// Reveals the active project's saved wallets of one Wallets-tab category
// (dev/bundle/wash-buy) and returns them with decrypted private keys — the
// same reveal endpoint the Wallets tab itself uses, just called from
// another tab. Never caches the decrypted result past the single operation
// that requested it.
async function fetchCategoryWalletsWithKeys(categoryId) {
  if (!auth.activeProjectId) throw new Error("Select a project first (top of the page).");
  const response = await projectFetch(`/api/wallets?chain=evm&category=${categoryId}&reveal=1`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to load wallets.");
  return data.wallets;
}

// Address-only listing (no reveal) — cheap enough to call just to populate a
// dropdown; the actual private key is only ever fetched once the user picks
// a specific wallet and clicks Connect (see useDevWalletAsSigner below).
async function fetchCategoryWalletAddresses(categoryId) {
  if (!auth.activeProjectId) return [];
  const response = await projectFetch(`/api/wallets?chain=evm&category=${categoryId}`);
  const data = await response.json();
  if (!response.ok) return [];
  return data.wallets;
}

// Fills a Dev-wallet <select> with every saved Dev wallet for the active
// project, keyed by address (labels only — never the key). Called once per
// launch tab on bind/render so the dropdown is ready before the user clicks
// Connect. Preserves the current selection across a refresh where possible.
async function populateDevWalletSelect(selectId) {
  const select = document.querySelector(`#${selectId}`);
  if (!select) return;
  const previous = select.value;
  const wallets = await fetchCategoryWalletAddresses("dev");
  if (wallets.length === 0) {
    select.innerHTML = `<option value="">No Dev wallets saved</option>`;
    return;
  }
  select.innerHTML = wallets.map((w, i) => `<option value="${w.address}">${short(w.address)}${w.label ? ` — ${escapeHtml(w.label)}` : ""}${i === 0 ? " (newest)" : ""}</option>`).join("");
  if (wallets.some((w) => w.address === previous)) select.value = previous;
}

// Connects the active project's saved Dev wallet as this tab's signer —
// same effect as pasting its key into the (now-hidden) Wallet panel's
// Private Key field and clicking Connect RPC Wallet, just sourced from the
// vault instead of typed in by hand. Shared by every launch tab (Pons,
// Lunch.fun, Lunch Burst, Lunch + Burst, Doppler) since state.signer is the
// one thing all of their launch transactions sign with, regardless of how
// different their buyer-row shapes are.
//
// `selectId` is the dropdown the user picked a specific Dev wallet from —
// with multiple Dev wallets saved, always using devWallets[0] (whichever
// happened to be created most recently) silently signed with the wrong
// wallet, so the picker is what makes "which Dev wallet" an explicit choice
// instead of an accident of generation order.
async function useDevWalletAsSigner(resultElId, logPrefix, selectId) {
  const resultEl = document.querySelector(`#${resultElId}`);
  try {
    const select = document.querySelector(`#${selectId}`);
    const chosenAddress = select?.value;
    if (!chosenAddress) throw new Error("No Dev wallet saved for this project yet — generate one in the Wallets tab first.");

    resultEl.textContent = `Loading Dev wallet ${short(chosenAddress)} from the vault...`;
    const devWallets = await fetchCategoryWalletsWithKeys("dev");
    const dev = devWallets.find((w) => w.address.toLowerCase() === chosenAddress.toLowerCase());
    if (!dev) throw new Error(`Selected Dev wallet ${short(chosenAddress)} was not found — it may have been deleted. Refresh the dropdown.`);

    state.provider = getRpcProvider();
    state.signer = new Wallet(dev.privateKey, state.provider);
    state.address = await state.signer.getAddress();
    state.walletMode = "RPC";
    const balance = await state.provider.getBalance(state.address);
    resultEl.textContent = `Connected Dev wallet ${short(state.address)} (${trimNumber(Number(ethers.formatEther(balance)))} ETH) as the launch signer.`;
    log(`${logPrefix}: connected Dev wallet ${state.address} from the vault as signer.`);
    updateStatus();
  } catch (error) {
    resultEl.textContent = formatError(error);
  }
}

// Fills the active project's saved Bundle wallets into a set of buyer-row
// private-key fields, checking Enabled on each filled row. `slots` is the
// ordered list of {prefix, index} row identifiers to fill, in fill order —
// each tab below builds its own list matching its actual buyer-row layout
// (Pons's Fast Lane + 3 Burst sections; Lunch's rows 1-4; the various
// *Burst forms' 25 rows; etc.). Only Key and Enabled are touched; amount/
// minOut are left as whatever the user already has there, since a
// per-wallet spend amount isn't something the vault has an opinion on.
async function fillBundleWalletsIntoSlots(slots, resultElId, logPrefix, slotsDescription) {
  const resultEl = document.querySelector(`#${resultElId}`);
  try {
    resultEl.textContent = "Loading Bundle wallets from the vault...";
    const bundleWallets = await fetchCategoryWalletsWithKeys("bundle");
    if (bundleWallets.length === 0) throw new Error("No Bundle wallets saved for this project yet — generate some in the Wallets tab first.");

    if (bundleWallets.length > slots.length) {
      resultEl.textContent = `${bundleWallets.length} Bundle wallets saved, but only ${slots.length} buyer-row slot(s) exist (${slotsDescription}) — using the first ${slots.length}.`;
    }

    let filled = 0;
    for (const wallet of bundleWallets) {
      if (filled >= slots.length) break;
      const { prefix, index } = slots[filled];
      const keyInput = document.querySelector(`#${prefix}BuyerKey${index}`);
      const enabledInput = document.querySelector(`#${prefix}BuyerEnabled${index}`);
      if (!keyInput || !enabledInput) continue;
      keyInput.value = wallet.privateKey;
      enabledInput.checked = true;
      filled++;
    }
    resultEl.textContent = `Filled ${filled} Bundle wallet(s) into buyer rows (${slotsDescription}). Set each row's ETH amount and minimum token output before validating/executing.`;
    log(`${logPrefix}: filled ${filled} Bundle wallet(s) from the vault into buyer rows.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
  }
}

// --- Per-tab wrappers: each just supplies its own result-panel id, log
// label, and buyer-row slot list — the actual reveal/connect/fill logic
// above is identical across every launch tab. ---

function ponsUseDevWallet() {
  return useDevWalletAsSigner("ponsWalletsTabResult", "Pons", "ponsDevWalletSelect");
}
function ponsFillBundleWallets() {
  const slots = [
    ...Array.from({ length: 5 }, (_, i) => ({ prefix: "ponsFastLane", index: i })),
    ...PONS_BURST_SECTIONS.flatMap(({ prefix }) => Array.from({ length: PONS_BURST_SECTION_SIZE }, (_, i) => ({ prefix, index: i }))),
  ];
  return fillBundleWalletsIntoSlots(slots, "ponsWalletsTabResult", "Pons", "Fast Lane first, then Burst 1/2/3");
}

// --- Pons + Wash combo tab -------------------------------------------------
//
// A self-contained tab with a FULL copy of the Pons Launch form AND a full
// copy of the Wallet Wash form, plus a "Start Combo" button that:
//   1. runs the Pons launch + Fast Lane + all 3 Burst sections, then
//   2. auto-fills the wash Sell list with the bundle wallets that just
//      bought, and the Buy list with the project's Wash Buy wallets, then
//   3. runs the Batch Wallet Wash across those pairs.
//
// Every element on this tab is id-namespaced with "pw" (renderPonsBody("pw")
// / renderWalletWash("pw")), so it is a genuinely independent second form —
// the standalone Pons Launch and Wallet Wash tabs are byte-for-byte
// unchanged and keep their own separate state.
const PONS_WASH_NS = "pw";

// The namespaced Pons private-key buyer-row prefixes for this tab, in fill
// order: Fast Lane (5) then Burst 1/2/3 (15 each).
function ponsWashComboBurstSlots() {
  const ns = PONS_WASH_NS;
  return [
    ...Array.from({ length: 5 }, (_, i) => ({ prefix: `${ns}ponsFastLane`, index: i })),
    ...PONS_BURST_SECTIONS.flatMap(({ prefix }) => Array.from({ length: PONS_BURST_SECTION_SIZE }, (_, i) => ({ prefix: `${ns}${prefix}`, index: i }))),
  ];
}

// Every private key currently entered + enabled across this tab's Pons burst
// rows, in row order — the wallets that will have bought into the launch,
// and therefore the ones that sell during the wash.
function ponsWashComboEnabledBundleKeys() {
  const keys = [];
  const seen = new Set();
  for (const { prefix, index } of ponsWashComboBurstSlots()) {
    if (!inputs[`${prefix}BuyerEnabled${index}`]?.checked) continue;
    const raw = (inputs[`${prefix}BuyerKey${index}`]?.value || "").trim();
    if (!raw) continue;
    const normalized = raw.startsWith("0x") ? raw : `0x${raw}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) continue;
    let address;
    try {
      address = new Wallet(normalized).address.toLowerCase();
    } catch {
      continue;
    }
    if (seen.has(address)) continue;
    seen.add(address);
    keys.push(normalized);
  }
  return keys;
}

function renderPonsWashCombo() {
  const ns = PONS_WASH_NS;
  return `
    <h2>Pons + Wash</h2>
    <p class="hint">A full Pons launch form and a full Wallet Wash form on one page. "Start Combo" launches the token, runs the Fast Lane + all three Burst sections, then automatically runs the Batch Wallet Wash: every bundle wallet sells its whole balance through disposable relay wallets into a matched Wash&nbsp;Buy wallet. The standalone <strong>Pons Launch</strong> and <strong>Wallet Wash</strong> tabs are separate and unaffected.</p>

    <div class="function-card section-gap">
      <div class="function-head"><strong>Wallet fetch</strong><span>from the active project's vault</span></div>
      <p class="hint">"Fill Bundle Wallets" fills this tab's Fast Lane + Burst rows with the project's saved Bundle wallets and lists them as the wash Sell side. "Fill Wash Buy Wallets" loads the project's saved Wash&nbsp;Buy wallets as the wash Buy side. They pair by position: Bundle[N] sells → relay → Wash&nbsp;Buy[N] buys. Both also run automatically when you press Start Combo.</p>
      <div class="button-row">
        <button id="${ns}ponsWashConnectDev" type="button">Connect Dev Wallet (launch signer)</button>
        <select id="${ns}ponsWashDevWalletSelect" class="dev-wallet-select"><option value="">Loading Dev wallets...</option></select>
      </div>
      <div class="button-row">
        <button id="${ns}ponsWashFillBundle" type="button">Fill Bundle Wallets</button>
        <button id="${ns}ponsWashFillWashBuy" type="button">Fill Wash Buy Wallets</button>
      </div>
      <div class="result" id="${ns}ponsWashFillResult"></div>
    </div>

    <h2 class="section-gap">Launch form</h2>
    ${renderPonsBody(ns)}

    <h2 class="section-gap">Wallet Wash form</h2>
    <div class="function-card section-gap">
      <div class="function-head"><strong>Token</strong><span>auto-set to the launched token after Start Combo</span></div>
      <div class="grid two">
        <label>Token contract address ${renderInput(`${ns}washTokenAddress`, "0x token (auto-filled on launch)")}</label>
        <label>Slippage % ${renderInput(`${ns}washSlippage`, "25")}</label>
      </div>
    </div>
    ${renderWalletWash(ns)}

    <div class="function-card section-gap pons-all-card">
      <div class="function-head"><strong>Run</strong><span>launch → Fast Lane → Burst → wait → Batch Wash</span></div>
      <p class="hint">On one confirm: launches the token, waits for restrictions to lift on-chain, fires Fast Lane and all three Burst sections, then waits the delay below and runs the Batch Wash across every filled pair, one after another. If the launch or a burst leg throws, the wash does not start. Long-running — keep this tab open.</p>
      <div class="grid two">
        <label>Wait after bundle before wash starts, seconds ${renderInput(`${ns}ponsWashStartDelay`, "30")}</label>
      </div>
      <div class="button-row">
        <button id="${ns}ponsWashValidate" type="button">Validate (launch + burst)</button>
        <button id="${ns}ponsWashStart" type="button">Start Combo</button>
      </div>
      <div class="result" id="${ns}ponsWashComboResult"></div>
    </div>
  `;
}

function ponsWashConnectDev() {
  const ns = PONS_WASH_NS;
  return useDevWalletAsSigner(`${ns}ponsWashFillResult`, "Pons + Wash", `${ns}ponsWashDevWalletSelect`);
}

async function ponsWashFillBundle() {
  const ns = PONS_WASH_NS;
  const resultEl = document.querySelector(`#${ns}ponsWashFillResult`);
  await fillBundleWalletsIntoSlots(ponsWashComboBurstSlots(), `${ns}ponsWashFillResult`, "Pons + Wash", "Fast Lane first, then Burst 1/2/3");
  const keys = ponsWashComboEnabledBundleKeys();
  if (keys.length > 0) {
    inputs[`${ns}washBatchSellKeys`].value = keys.join("\n");
    resultEl.textContent = `${resultEl.textContent}\nWash Sell side set to ${keys.length} bundle wallet(s).`.trim();
  }
}

async function ponsWashFillWashBuy() {
  const ns = PONS_WASH_NS;
  const resultEl = document.querySelector(`#${ns}ponsWashFillResult`);
  try {
    resultEl.textContent = "Loading Wash Buy wallets from the vault...";
    const washBuy = await fetchCategoryWalletsWithKeys("wash-buy");
    if (washBuy.length === 0) throw new Error("No Wash Buy wallets saved for this project yet — generate some in the Wallets tab (Wallet Wash — Buy Wallets).");
    inputs[`${ns}washBatchBuyKeys`].value = washBuy.map((w) => w.privateKey).join("\n");
    resultEl.textContent = `Loaded ${washBuy.length} Wash Buy wallet(s) as the wash Buy side.`;
    log(`Pons + Wash: loaded ${washBuy.length} Wash Buy wallet(s) from the vault.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
  }
}

async function ponsWashValidate() {
  const ns = PONS_WASH_NS;
  const resultEl = document.querySelector(`#${ns}ponsWashComboResult`);
  resultEl.textContent = "Validating this tab's launch + burst form...";
  await validatePonsAll(ns);
  const ponsAll = document.querySelector(`#${ns}ponsAllResult`)?.textContent || "";
  resultEl.textContent = `Launch + burst validation:\n\n${ponsAll}`;
}

async function executePonsWashCombo() {
  const ns = PONS_WASH_NS;
  const ponsState = ponsStateFor(ns);
  const resultEl = document.querySelector(`#${ns}ponsWashComboResult`);
  const lines = [];
  const push = (line) => {
    lines.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    resultEl.textContent = lines.join("\n");
    log(`Pons + Wash: ${line}`);
  };

  const startDelayMs = Math.max(0, (parseFloat(inputs[`${ns}ponsWashStartDelay`].value) || 0) * 1000);

  if (!window.confirm(`Start Combo will:\n1. Launch the token and run Fast Lane + all Burst sections (no further prompts).\n2. Auto-fill the wash Sell list from the bundle wallets and the Buy list from the project's Wash Buy wallets.\n3. Wait ${(startDelayMs / 1000).toFixed(0)}s, then run the Batch Wash.\n\nContinue?`)) {
    push("Combo cancelled before starting.");
    return;
  }

  try {
    push("Phase 1 — Pons launch...");
    await executePonsLaunchCore(push, ns);

    push("Phase 2 — Fast Lane...");
    const fastLane = await executePonsPrivateKeyLegCore(`${ns}ponsFastLane`, 5, push, ns);
    push(`Fast Lane done: ${fastLane.confirmed}/${fastLane.submitted} confirmed.`);

    push("Phase 3 — Burst sections...");
    let burstConfirmed = 0;
    let burstSubmitted = 0;
    for (const { prefix, label } of PONS_BURST_SECTIONS) {
      const result = await executePonsPrivateKeyLegCore(`${ns}${prefix}`, PONS_BURST_SECTION_SIZE, push, ns);
      push(`${label} done: ${result.confirmed}/${result.submitted} confirmed.`);
      burstConfirmed += result.confirmed;
      burstSubmitted += result.submitted;
    }
    push(`Bundle complete. Token ${ponsState.launchedToken}. Fast Lane ${fastLane.confirmed}/${fastLane.submitted}, Burst ${burstConfirmed}/${burstSubmitted} confirmed.`);

    if (!ponsState.launchedToken) throw new Error("No launched token detected — not starting the wash.");

    // Auto-fill the wash Sell side from the bundle wallets that just bought,
    // and the Buy side from the project's Wash Buy wallets (unless the user
    // already pasted their own lists into this tab's wash form).
    let sellKeys = mmParseKeys(inputs[`${ns}washBatchSellKeys`].value);
    if (sellKeys.length === 0) {
      sellKeys = ponsWashComboEnabledBundleKeys();
      inputs[`${ns}washBatchSellKeys`].value = sellKeys.join("\n");
      push(`Wash Sell side auto-filled with ${sellKeys.length} bundle wallet(s).`);
    }
    let buyKeys = mmParseKeys(inputs[`${ns}washBatchBuyKeys`].value);
    if (buyKeys.length === 0) {
      try {
        const washBuy = await fetchCategoryWalletsWithKeys("wash-buy");
        buyKeys = washBuy.map((w) => w.privateKey);
        inputs[`${ns}washBatchBuyKeys`].value = buyKeys.join("\n");
        push(`Wash Buy side auto-filled with ${buyKeys.length} Wash Buy wallet(s) from the vault.`);
      } catch (error) {
        throw new Error(`Could not auto-load Wash Buy wallets: ${formatError(error)}. Paste buy keys into the wash form and retry, or fill them first.`);
      }
    }
    if (sellKeys.length === 0 || buyKeys.length === 0) throw new Error("Need at least one Sell and one Buy wallet for the wash.");
    const pairCount = Math.min(sellKeys.length, buyKeys.length);

    if (startDelayMs > 0) {
      push(`Phase 4 — waiting ${(startDelayMs / 1000).toFixed(0)}s before the wash...`);
      await sleepMs(startDelayMs);
    }

    push(`Phase 5 — Batch Wash across ${pairCount} pair(s) (bundle sells → relay → wash buys)...`);
    // washBatchRun reads this tab's namespaced washBatch* fields directly
    // (via the result-panel selector); washSell/washBuy read the token
    // address and slippage as canonical globals, so mirror those two.
    inputs.washTokenAddress.value = ponsState.launchedToken;
    inputs.washSlippage.value = (inputs[`${ns}washSlippage`]?.value || "25").trim() || "25";
    inputs[`${ns}washBatchSellKeys`].value = sellKeys.join("\n");
    inputs[`${ns}washBatchBuyKeys`].value = buyKeys.join("\n");

    const washResultEl = document.querySelector(`#${ns}washBatchResult`);
    if (washResultEl) washResultEl.textContent = "";
    await washBatchRun(`#${ns}washBatchResult`);
    const washLog = washResultEl?.textContent || "";
    const lastWashLine = washLog.trim().split("\n").filter(Boolean).pop() || "Batch Wash finished.";
    push(`Batch Wash: ${lastWashLine.replace(/^\[[^\]]*\]\s*/, "")}`);
    push("Combo complete.");
  } catch (error) {
    push(`Combo stopped: ${formatError(error)}`);
  }
}

function lunchUseDevWallet() {
  return useDevWalletAsSigner("lunchWalletsTabResult", "Lunch.fun", "lunchDevWalletSelect");
}
function lunchFillBundleWallets() {
  // Row 0 is the primary/creator slot (state.signer-driven, not filled from
  // Bundle) — only rows 1-4 are real buyer slots here.
  const slots = Array.from({ length: 4 }, (_, i) => ({ prefix: "lunch", index: i + 1 }));
  return fillBundleWalletsIntoSlots(slots, "lunchWalletsTabResult", "Lunch.fun", "buyer rows 2-5");
}

function lunchBurstUseDevWallet() {
  return useDevWalletAsSigner("lunchBurstWalletsTabResult", "Lunch Burst", "lunchBurstDevWalletSelect");
}
function lunchBurstFillBundleWallets() {
  const slots = Array.from({ length: 25 }, (_, i) => ({ prefix: "lunchBurst", index: i }));
  return fillBundleWalletsIntoSlots(slots, "lunchBurstWalletsTabResult", "Lunch Burst", "all 25 burst buyer rows");
}

function lunchComboUseDevWallet() {
  return useDevWalletAsSigner("lunchComboWalletsTabResult", "Lunch + Burst", "lunchComboDevWalletSelect");
}
function lunchComboFillBundleWallets() {
  // Both the atomic leg's rows 1-4 (row 0 is primary) and the burst leg's
  // 25 rows exist in the DOM regardless of which mode is currently shown
  // (renderLunchComboBuyerRows/renderLunchBurstBuyerRows are always
  // rendered, just visually hidden by mode — see lunchComboAtomicSection/
  // lunchComboBurstSection's display toggling) — filling both means
  // whichever mode the user picks already has its wallets ready.
  const slots = [
    ...Array.from({ length: 4 }, (_, i) => ({ prefix: "lunchCombo", index: i + 1 })),
    ...Array.from({ length: 25 }, (_, i) => ({ prefix: "lunchComboBurst", index: i })),
  ];
  return fillBundleWalletsIntoSlots(slots, "lunchComboWalletsTabResult", "Lunch + Burst", "atomic rows 2-5, then all 25 burst rows");
}

function dopplerUseDevWallet() {
  return useDevWalletAsSigner("dopplerWalletsTabResult", "Doppler", "dopplerDevWalletSelect");
}
function dopplerFillBundleWallets() {
  // Doppler's own 5-row atomic buyer form (renderDopplerBuyerRows) has NO
  // private-key field at all — every row spends from the connected signer,
  // so there is nothing to fill there. Only the separate 25-row Burst
  // section (renderDopplerBurstBuyerRows) takes per-wallet keys.
  const slots = Array.from({ length: 25 }, (_, i) => ({ prefix: "dopplerBurst", index: i }));
  return fillBundleWalletsIntoSlots(slots, "dopplerWalletsTabResult", "Doppler", "all 25 Doppler Burst buyer rows — the 5-row atomic form has no key fields to fill, it always spends from the connected signer");
}

function switchFunctionTab(event) {
  state.activeFunctionTab = event.currentTarget.dataset.tab;
  switchFunctionTabByName(state.activeFunctionTab);
}

async function deploy() {
  try {
    requireSigner();
    const args = getDeployArgs();
    await assertRobinhoodReady(args[2]);
    const factory = new ContractFactory(artifact.abi, artifact.bytecode, state.signer);
    log("Estimating deployment...");
    const deployTx = await factory.getDeployTransaction(...args);
    const estimatedGas = await state.signer.estimateGas(deployTx);
    const gasLimit = getDeployGasLimit(estimatedGas);
    await logDeployFunding(gasLimit);
    log(`Deployment gas estimate: ${estimatedGas.toString()}. Using gas limit: ${gasLimit.toString()}`);
    log("Deploying contract...");
    const contract = await factory.deploy(...args, { gasLimit });
    const deploymentTx = contract.deploymentTransaction();
    state.lastDeployTxHash = deploymentTx.hash;
    log(`Deployment transaction: ${deploymentTx.hash}`);
    const receipt = await deploymentTx.wait();
    log(`Deployment receipt status: ${receipt.status === 1 ? "success" : "failed"} in block ${receipt.blockNumber}`);
    if (receipt.status !== 1) {
      throw new Error(`Deployment transaction failed. Blockscout: ${ROBINHOOD_CHAIN.blockExplorerUrl}tx/${deploymentTx.hash}`);
    }
    await contract.waitForDeployment();
    state.contract = contract;
    inputs.contractAddress.value = contract.target;
    inputs.verifyAddress.value = contract.target;
    log(`Deployed at ${contract.target}`);
    log(`Blockscout contract page: ${ROBINHOOD_CHAIN.blockExplorerUrl}address/${contract.target}`);
    updateStatus();
  } catch (error) {
    log(`Deploy failed: ${error.shortMessage || error.reason || error.message}`);
  }
}

function getDeployArgs() {
  return getConstructorArgs();
}

function getConstructorArgs() {
  const args = [
    inputs.tokenName.value.trim(),
    inputs.tokenSymbol.value.trim(),
    inputs.router.value.trim(),
    inputs.taxWallet.value.trim(),
    inputs.ecosystemWallet.value.trim(),
    parseArray(inputs.bel.value),
  ];
  const [name, symbol, router, taxWallet, ecosystemWallet, bel] = args;
  if (!name) throw new Error("Token name is required.");
  if (!symbol) throw new Error("Token symbol is required.");
  for (const [label, address] of [["router", router], ["tax wallet", taxWallet], ["ecosystem wallet", ecosystemWallet]]) {
    if (!ethers.isAddress(address)) throw new Error(`Invalid ${label} address.`);
  }
  for (const address of bel) {
    if (!ethers.isAddress(address)) throw new Error(`Invalid BEL address: ${address}`);
  }
  return args;
}

function getDeployGasLimit(estimatedGas) {
  const manual = inputs.deployGasLimit.value.trim();
  if (manual) return BigInt(manual);
  return (estimatedGas * 120n) / 100n;
}

async function logDeployFunding(gasLimit) {
  const deployer = await state.signer.getAddress();
  const balance = await state.provider.getBalance(deployer);
  const feeData = await state.provider.getFeeData();
  const feePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;
  if (feePerGas == null) {
    log(`Deploy funding check: deployer ${deployer}, balance ${ethers.formatEther(balance)} ETH, gas price unavailable.`);
    return;
  }
  const maxCost = gasLimit * feePerGas;
  log(`Deploy funding check: deployer ${deployer}`);
  log(`Deployer balance on connected chain: ${ethers.formatEther(balance)} ETH`);
  log(`Max deploy gas cost at current fee: ${ethers.formatEther(maxCost)} ETH`);
  if (balance < maxCost) {
    throw new Error(`Connected deployer balance is too low. Need about ${ethers.formatEther(maxCost)} ETH for gas.`);
  }
}

async function diagnoseLastDeploy() {
  try {
    requireSigner();
    const lines = [];
    const network = await state.provider.getNetwork();
    lines.push(`connected chain: ${network.chainId}`);
    lines.push(`expected chain: ${ROBINHOOD_CHAIN.chainId}`);

    const routerAddress = getRouterAddress();
    const routerCode = await state.provider.getCode(routerAddress);
    lines.push(`router: ${routerAddress}`);
    lines.push(`router code bytes: ${routerCode === "0x" ? 0 : (routerCode.length - 2) / 2}`);
    if (routerCode !== "0x") {
      const router = new Contract(routerAddress, ROUTER_ABI, state.provider);
      lines.push(`router WETH: ${await router.WETH()}`);
    }

    const address = inputs.contractAddress.value.trim() || state.contract?.target;
    if (address && ethers.isAddress(address)) {
      const code = await state.provider.getCode(address);
      lines.push(`contract: ${address}`);
      lines.push(`contract code bytes: ${code === "0x" ? 0 : (code.length - 2) / 2}`);
    } else {
      lines.push("contract: no valid contract address in the UI");
    }

    if (state.lastDeployTxHash) {
      const receipt = await state.provider.getTransactionReceipt(state.lastDeployTxHash);
      lines.push(`last deploy tx: ${state.lastDeployTxHash}`);
      lines.push(`last deploy receipt: ${receipt ? `status ${receipt.status}, block ${receipt.blockNumber}, gasUsed ${receipt.gasUsed}` : "not found yet"}`);
    } else {
      lines.push("last deploy tx: none recorded in this page session");
    }

    log(`Deploy diagnostics:\n${lines.join("\n")}`);
  } catch (error) {
    log(`Deploy diagnostics failed: ${error.shortMessage || error.message}`);
  }
}

async function attach() {
  const address = inputs.contractAddress.value.trim();
  if (!address) throw new Error("Paste a token contract address first");
  // Attach with the signer when one is connected (needed for the
  // "Buy/Sell With Connected Wallet" buttons), otherwise fall back to a
  // read-only provider — batch buy/sell from pasted private keys never
  // uses state.contract as a signer (each wallet gets its own Contract
  // instance), so requiring MetaMask here just to paste a token address
  // and run a pure private-key batch buy was an unnecessary blocker.
  state.contract = new Contract(address, artifact.abi, state.signer || getRpcProvider());
  inputs.verifyAddress.value = address;
  log(`Attached to ${address}`);
  updateStatus();
}

// Buy tab's own "Load Token" button — same as attach(), but reads the
// address from the Buy tab's own field so the user never has to scroll up
// to the separate "Attach Existing Contract" panel just to buy a token.
// Keeps both address fields and state.contract in sync either way.
async function buyAttachToken() {
  const statusEl = document.querySelector("#buyTokenStatus");
  try {
    const address = inputs.buyTokenAddress.value.trim();
    if (!address) throw new Error("Paste a token contract address first");
    inputs.contractAddress.value = address;
    await attach();
    if (statusEl) statusEl.textContent = `Loaded: ${address}`;
  } catch (error) {
    if (statusEl) statusEl.textContent = error.shortMessage || error.message;
    log(`Load token failed: ${error.shortMessage || error.message}`);
  }
}

async function assertRobinhoodReady(routerAddress = getRouterAddress()) {
  const network = await state.provider.getNetwork();
  if (network.chainId !== BigInt(ROBINHOOD_CHAIN.chainId)) {
    if (state.walletMode === "MetaMask" && window.ethereum) {
      log(`MetaMask is on chain ${network.chainId}. Switching to Robinhood Chain ${ROBINHOOD_CHAIN.chainId}...`);
      await addRobinhoodChain();
      state.provider = new BrowserProvider(window.ethereum);
      state.signer = await state.provider.getSigner();
      state.address = await state.signer.getAddress();
      const switchedNetwork = await state.provider.getNetwork();
      if (switchedNetwork.chainId !== BigInt(ROBINHOOD_CHAIN.chainId)) {
        throw new Error(`Wrong chain. Switch MetaMask to Robinhood Chain ${ROBINHOOD_CHAIN.chainId}.`);
      }
    } else {
      throw new Error(`Wrong RPC chain ${network.chainId}. Expected Robinhood Chain ${ROBINHOOD_CHAIN.chainId}.`);
    }
  }

  const code = await state.provider.getCode(routerAddress);
  if (code === "0x") {
    throw new Error(`Router has no contract code on the connected chain: ${routerAddress}`);
  }

  const router = new Contract(routerAddress, ROUTER_ABI, state.provider);
  const weth = await router.WETH();
  if (!ethers.isAddress(weth)) {
    throw new Error("Router WETH() returned an invalid address.");
  }
  log(`Preflight OK: Robinhood Chain ${ROBINHOOD_CHAIN.chainId}, router ${short(routerAddress)}, WETH ${short(weth)}.`);
}

async function callFunction(event) {
  requireContract();
  const name = event.currentTarget.dataset.call;
  const fn = artifact.abi.find((item) => item.type === "function" && item.name === name);
  const args = fn.inputs.map((input, index) => parseArg(input, document.querySelector(`[data-input="${name}-${index}"]`)?.value ?? ""));
  const resultEl = document.querySelector(`[data-result="${name}"]`);
  try {
    if (fn.stateMutability === "view" || fn.stateMutability === "pure") {
      const result = await state.contract[name](...args);
      resultEl.textContent = formatResult(result);
      return;
    }
    const overrides = {};
    if (fn.stateMutability === "payable") {
      const value = document.querySelector(`[data-value="${name}"]`)?.value.trim();
      if (value) overrides.value = ethers.parseEther(value);
    }
    const tx = await state.contract[name](...args, overrides);
    log(`${name} transaction: ${tx.hash}`);
    const receipt = await tx.wait();
    resultEl.textContent = `Mined in block ${receipt.blockNumber}`;
  } catch (error) {
    resultEl.textContent = error.shortMessage || error.message;
    log(`${name} failed: ${error.shortMessage || error.message}`);
  }
}

async function buyConnected() {
  const resultEl = document.querySelector("#buyResult");
  try {
    requireContract();
    const buyer = await state.signer.getAddress();
    const tx = await sendBuy(state.signer, buyer);
    log(`Buy transaction: ${tx.hash}`);
    const receipt = await tx.wait();
    resultEl.textContent = `Buy mined in block ${receipt.blockNumber}`;
  } catch (error) {
    resultEl.textContent = error.shortMessage || error.message;
    log(`Buy failed: ${error.shortMessage || error.message}`);
  }
}

async function buyBatch() {
  const resultEl = document.querySelector("#buyResult");
  try {
    requireContractLoaded();
  } catch (error) {
    resultEl.textContent = error.shortMessage || error.message;
    log(`Buy failed: ${error.shortMessage || error.message}`);
    return;
  }
  const buyers = parseBatchBuyers(inputs.buyerPrivateKeys.value);
  if (buyers.length === 0) {
    resultEl.textContent = "Paste at least one buyer private key.";
    return;
  }
  const provider = getRpcProvider();
  resultEl.textContent = `Starting ${buyers.length} buys...`;
  for (const [index, buyer] of buyers.entries()) {
    try {
      const wallet = new Wallet(buyer.privateKey, provider);
      const tx = await sendBuy(wallet, wallet.address, buyer.ethAmount);
      log(`Batch buy ${index + 1}/${buyers.length} from ${short(wallet.address)} for ${buyer.ethAmount} ETH: ${tx.hash}`);
      await tx.wait();
    } catch (error) {
      log(`Batch buy ${index + 1}/${buyers.length} failed: ${error.shortMessage || error.message}`);
    }
  }
  resultEl.textContent = `Batch buy finished for ${buyers.length} pasted wallets. Check log for transaction hashes and failures.`;
}

async function sellConnected() {
  const resultEl = document.querySelector("#sellResult");
  try {
    requireContract();
    const seller = await state.signer.getAddress();
    const receipt = await sellAllFromSigner(state.signer, seller);
    resultEl.textContent = `Sell mined in block ${receipt.blockNumber}`;
  } catch (error) {
    resultEl.textContent = error.shortMessage || error.message;
    log(`Sell failed: ${error.shortMessage || error.message}`);
  }
}

async function sellBatch() {
  const resultEl = document.querySelector("#sellResult");
  try {
    requireContractLoaded();
  } catch (error) {
    resultEl.textContent = error.shortMessage || error.message;
    log(`Sell failed: ${error.shortMessage || error.message}`);
    return;
  }
  const keys = inputs.sellerPrivateKeys.value.split(/\r?\n/).map((key) => key.trim()).filter(Boolean);
  if (keys.length === 0) {
    resultEl.textContent = "Paste at least one seller private key.";
    return;
  }
  const provider = getRpcProvider();
  resultEl.textContent = `Starting ${keys.length} full-balance sells...`;
  for (const [index, key] of keys.entries()) {
    try {
      const wallet = new Wallet(key, provider);
      await sellAllFromSigner(wallet, wallet.address, `${index + 1}/${keys.length}`);
    } catch (error) {
      log(`Batch sell ${index + 1}/${keys.length} failed: ${error.shortMessage || error.message}`);
    }
  }
  resultEl.textContent = `Batch sell finished for ${keys.length} pasted wallets. Check log for transaction hashes and skipped zero balances.`;
}

// Same V2/V3 auto-detection as sendBuy — see its comment for why this is
// necessary on this chain.
async function sellAllFromSigner(signer, sellerAddress, label = "connected") {
  const tokenAddress = state.contract.target;
  const token = getToken(signer);
  const provider = signer.provider;
  const routerAddress = getRouterAddress();
  const balance = await token.balanceOf(sellerAddress);
  if (balance === 0n) {
    log(`Sell ${label}: ${short(sellerAddress)} has zero token balance, skipped.`);
    return { blockNumber: "skipped" };
  }

  const pool = await mmCheckPool(provider, routerAddress, tokenAddress);
  if (!pool.exists) throw new Error(`No liquidity pool found for this token: ${pool.error}`);

  const recipient = inputs.sellRecipient.value.trim() || sellerAddress;
  const manualMinEth = inputs.sellMinEth.value.trim();

  if (pool.version === "v3") {
    const swapRouterAddress = pool.swapRouter;
    const allowance = await token.allowance(sellerAddress, swapRouterAddress);
    if (allowance < balance) {
      const approveTx = await token.approve(swapRouterAddress, balance);
      log(`Sell ${label} approval for ${short(sellerAddress)}: ${approveTx.hash}`);
      await approveTx.wait();
    }
    const router = new Contract(swapRouterAddress, [PONS_ROUTER_ABI[0]], signer);
    // Selling: tokenIn is the project token itself, so tokenInIsToken0 is
    // pool.isToken0 directly (same convention as mmExecuteSellV3).
    const quoted = await mmQuoteV3(pool.poolAddress, pool.isToken0, balance, provider);
    const minEth = manualMinEth && manualMinEth !== "0"
      ? parseEthInput(manualMinEth, "Minimum ETH out")
      : mmApplySlippage(quoted, 5); // default 5% slippage tolerance
    const params = {
      tokenIn: tokenAddress,
      tokenOut: pool.wethAddress,
      fee: pool.poolFee,
      recipient,
      amountIn: balance,
      amountOutMinimum: minEth,
      sqrtPriceLimitX96: 0n,
    };
    const tx = await router.exactInputSingle(params);
    log(`Sell ${label} from ${short(sellerAddress)}: ${tx.hash}`);
    const receipt = await tx.wait();

    // V3 pools can never hold native ETH — a token->WETH swap only ever
    // lands WETH, which must be separately unwrapped to spendable ETH.
    const wrapped = new Contract(pool.wethAddress, WRAPPED_NATIVE_ABI, signer);
    const wrappedBalance = await wrapped.balanceOf(sellerAddress);
    if (wrappedBalance > 0n) {
      const unwrapTx = await wrapped.withdraw(wrappedBalance);
      log(`Sell ${label} WETH-to-ETH unwrap for ${short(sellerAddress)}: ${unwrapTx.hash}`);
      await unwrapTx.wait();
    }
    return receipt;
  }

  const router = new Contract(routerAddress, ROUTER_ABI, signer);
  const allowance = await token.allowance(sellerAddress, routerAddress);
  if (allowance < balance) {
    const approveTx = await token.approve(routerAddress, balance);
    log(`Sell ${label} approval for ${short(sellerAddress)}: ${approveTx.hash}`);
    await approveTx.wait();
  }

  const weth = await router.WETH();
  const minEth = parseEthInput(manualMinEth || "0", "Minimum ETH out");
  const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
    balance,
    minEth,
    [tokenAddress, weth],
    recipient,
    getDeadline(inputs.sellDeadline.value),
  );
  log(`Sell ${label} from ${short(sellerAddress)}: ${tx.hash}`);
  return tx.wait();
}

async function launchInitialLiquidity() {
  requireContract();
  const resultEl = document.querySelector("#lpResult");
  try {
    const ethAmount = parseEthInput(inputs.launchEthAmount.value, "Launch ETH amount");
    const connectedWallet = await state.signer.getAddress();
    const recipient = inputs.launchLpRecipient.value.trim() || connectedWallet;
    if (!ethers.isAddress(recipient)) throw new Error("Invalid LP recipient address.");

    const tx = await state.contract.launch(recipient, { value: ethAmount });
    log(`Launch initial LP transaction: ${tx.hash}`);
    const receipt = await tx.wait();
    resultEl.textContent = `Initial LP launched in block ${receipt.blockNumber}`;
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Launch initial LP failed: ${formatError(error)}`);
  }
}

async function addLiquidity() {
  requireContract();
  const resultEl = document.querySelector("#lpResult");
  try {
    const routerAddress = getRouterAddress();
    const token = getToken(state.signer);
    const router = getRouter(state.signer);
    const tokenDecimals = await token.decimals();
    const tokenAmount = parseTokenInput(inputs.lpTokenAmount.value, tokenDecimals, "Token amount");
    const minToken = parseTokenInput(inputs.lpMinToken.value || "0", tokenDecimals, "Minimum token amount");
    const minEth = parseEthInput(inputs.lpMinEth.value || "0", "Minimum ETH amount");
    const ethAmount = parseEthInput(inputs.lpEthAmount.value, "ETH amount");
    const recipient = inputs.lpRecipient.value.trim() || await state.signer.getAddress();
    const deadline = getDeadline(inputs.lpDeadline.value);
    const connectedWallet = await state.signer.getAddress();
    const tokenBalance = await token.balanceOf(connectedWallet);
    if (tokenBalance < tokenAmount) {
      throw new Error(
        `Connected wallet has ${ethers.formatUnits(tokenBalance, tokenDecimals)} tokens, but Add LP needs ${ethers.formatUnits(tokenAmount, tokenDecimals)}. ` +
        "For first liquidity, use Launch Initial LP so the contract can pair its held token supply with your ETH."
      );
    }

    const approveTx = await token.approve(routerAddress, tokenAmount);
    log(`Token approval for LP: ${approveTx.hash}`);
    await approveTx.wait();

    const tx = await router.addLiquidityETH(state.contract.target, tokenAmount, minToken, minEth, recipient, deadline, { value: ethAmount });
    log(`Add LP transaction: ${tx.hash}`);
    const receipt = await tx.wait();
    resultEl.textContent = `LP added in block ${receipt.blockNumber}`;
  } catch (error) {
    resultEl.textContent = error.shortMessage || error.message;
    log(`Add LP failed: ${error.shortMessage || error.message}`);
  }
}

async function removeLiquidity() {
  requireContract();
  const resultEl = document.querySelector("#lpResult");
  try {
    const routerAddress = getRouterAddress();
    const token = getToken(state.signer);
    const router = getRouter(state.signer);
    const tokenDecimals = await token.decimals();
    const pairAddress = inputs.removePair.value.trim() || await state.contract.pair();
    if (!pairAddress || pairAddress === ethers.ZeroAddress) throw new Error("Pair address is empty. Launch first or enter pair address.");
    const pair = new Contract(pairAddress, LP_ABI, state.signer);
    const lpAmount = parseTokenInput(inputs.removeLpAmount.value, 18, "LP token amount");
    const minToken = parseTokenInput(inputs.removeMinToken.value || "0", tokenDecimals, "Minimum token amount");
    const minEth = parseEthInput(inputs.removeMinEth.value || "0", "Minimum ETH amount");
    const recipient = inputs.removeRecipient.value.trim() || await state.signer.getAddress();
    const deadline = getDeadline(inputs.removeDeadline.value);

    const approveTx = await pair.approve(routerAddress, lpAmount);
    log(`LP approval: ${approveTx.hash}`);
    await approveTx.wait();

    const tx = await router.removeLiquidityETHSupportingFeeOnTransferTokens(state.contract.target, lpAmount, minToken, minEth, recipient, deadline);
    log(`Remove LP transaction: ${tx.hash}`);
    const receipt = await tx.wait();
    resultEl.textContent = `LP removed in block ${receipt.blockNumber}`;
  } catch (error) {
    resultEl.textContent = error.shortMessage || error.message;
    log(`Remove LP failed: ${error.shortMessage || error.message}`);
  }
}

async function burnTokens() {
  requireContract();
  const resultEl = document.querySelector("#burnResult");
  try {
    const token = getToken(state.signer);
    const decimals = await token.decimals();
    const amount = parseTokenInput(inputs.burnAmount.value, decimals, "Burn amount");
    const tx = await state.contract.burn(amount);
    log(`Burn transaction: ${tx.hash}`);
    const receipt = await tx.wait();
    resultEl.textContent = `Burn mined in block ${receipt.blockNumber}`;
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Burn failed: ${formatError(error)}`);
  }
}

function generateAccounts() {
  state.generatedWallets = Array.from({ length: 5 }, () => Wallet.createRandom());
  inputs.generatedAccounts.value = formatGeneratedAccounts();
  document.querySelector("#accountsResult").textContent = "Created 5 accounts locally.";
  log("Created 5 fresh accounts locally.");
}

async function copyAccounts() {
  if (!inputs.generatedAccounts.value.trim()) {
    document.querySelector("#accountsResult").textContent = "Generate accounts first.";
    return;
  }
  await navigator.clipboard.writeText(inputs.generatedAccounts.value);
  document.querySelector("#accountsResult").textContent = "Copied generated accounts.";
}

function loadAccountsToMultisend() {
  if (state.generatedWallets.length === 0) {
    document.querySelector("#accountsResult").textContent = "Generate accounts first.";
    return;
  }
  for (const [index, wallet] of state.generatedWallets.entries()) {
    inputs[`sendTo${index}`].value = wallet.address;
  }
  state.activeFunctionTab = "multisend";
  switchFunctionTabByName("multisend");
  log("Loaded generated account addresses into Multisend.");
}

async function sendEthBatch() {
  requireSigner();
  const resultEl = document.querySelector("#multisendResult");
  const transfers = Array.from({ length: 5 }, (_, index) => ({
    to: inputs[`sendTo${index}`].value.trim(),
    amount: inputs[`sendAmount${index}`].value.trim(),
  })).filter((transfer) => transfer.to && transfer.amount);

  if (transfers.length === 0) {
    resultEl.textContent = "Enter at least one recipient and ETH amount.";
    return;
  }

  resultEl.textContent = `Sending ${transfers.length} ETH transfers...`;
  for (const [index, transfer] of transfers.entries()) {
    try {
      const tx = await state.signer.sendTransaction({
        to: transfer.to,
        value: parseEthInput(transfer.amount, `ETH amount for ${short(transfer.to)}`),
      });
      log(`ETH send ${index + 1}/${transfers.length} to ${short(transfer.to)} for ${transfer.amount} ETH: ${tx.hash}`);
      await tx.wait();
    } catch (error) {
      log(`ETH send ${index + 1}/${transfers.length} failed: ${error.shortMessage || error.message}`);
    }
  }
  resultEl.textContent = `Finished ${transfers.length} ETH transfer attempts. Check log for hashes and failures.`;
}

async function sweepConnected() {
  requireSigner();
  const resultEl = document.querySelector("#sweepResult");
  try {
    const from = await state.signer.getAddress();
    const receipt = await sweepSignerEth(state.signer, from);
    resultEl.textContent = receipt ? `Sweep mined in block ${receipt.blockNumber}` : "Nothing to sweep.";
  } catch (error) {
    resultEl.textContent = error.shortMessage || error.message;
    log(`Sweep failed: ${error.shortMessage || error.message}`);
  }
}

async function previewSweep() {
  const resultEl = document.querySelector("#sweepResult");
  try {
    getSweepRecipient();
    const keys = parsePrivateKeys(inputs.sweepPrivateKeys.value);
    if (keys.length === 0) {
      resultEl.textContent = "Paste at least one private key to preview.";
      return;
    }

    const provider = getRpcProvider();
    const rows = [];
    let total = 0n;
    for (const [index, key] of keys.entries()) {
      const wallet = new Wallet(key, provider);
      const balance = await provider.getBalance(wallet.address);
      total += balance;
      rows.push(`${index + 1}. ${wallet.address} | ${ethers.formatEther(balance)} ETH`);
    }
    resultEl.textContent = `Found ${keys.length} wallets. Total before gas: ${ethers.formatEther(total)} ETH\n\n${rows.join("\n")}`;
    log(`Previewed ${keys.length} sweep wallets. Total before gas: ${ethers.formatEther(total)} ETH.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Sweep preview failed: ${formatError(error)}`);
  }
}

async function sweepBatch() {
  const resultEl = document.querySelector("#sweepResult");
  try {
    const recipient = getSweepRecipient();
    const keys = parsePrivateKeys(inputs.sweepPrivateKeys.value);
    if (keys.length === 0) {
      resultEl.textContent = "Paste at least one private key to sweep.";
      return;
    }
    const provider = getRpcProvider();
    let sent = 0;
    let skipped = 0;
    let failed = 0;
    resultEl.textContent = `Sending all ETH from ${keys.length} wallets to ${short(recipient)}...`;
    for (const [index, key] of keys.entries()) {
      try {
        const wallet = new Wallet(key, provider);
        const receipt = await sweepSignerEth(wallet, wallet.address, `${index + 1}/${keys.length}`);
        if (receipt) {
          sent++;
        } else {
          skipped++;
        }
      } catch (error) {
        failed++;
        log(`Sweep ${index + 1}/${keys.length} failed: ${formatError(error)}`);
      }
    }
    resultEl.textContent = `Sweep finished. Sent: ${sent}. Skipped low-balance: ${skipped}. Failed: ${failed}. Check log for hashes and details.`;
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Sweep failed: ${formatError(error)}`);
  }
}

async function sweepSignerEth(signer, fromAddress, label = "connected") {
  const recipient = getSweepRecipient();
  const provider = signer.provider || state.provider;
  const balance = await provider.getBalance(fromAddress);
  const feeData = await provider.getFeeData();
  const estimatedGas = await signer.estimateGas({
    to: recipient,
    value: balance > 1n ? 1n : 0n,
  });
  const gasLimit = (estimatedGas * 130n) / 100n;
  const feePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;
  if (feePerGas == null) throw new Error("Could not read gas price from RPC.");
  const buffer = parseEthInput(inputs.sweepBuffer.value || "0", "Extra gas buffer ETH");
  const gasCost = gasLimit * ((feePerGas * 130n) / 100n);
  const sendValue = balance - gasCost - buffer;

  if (sendValue <= 0n) {
    log(`Sweep ${label}: ${short(fromAddress)} balance too low. Balance ${ethers.formatEther(balance)} ETH, gas+buffer ${ethers.formatEther(gasCost + buffer)} ETH.`);
    return null;
  }

  const txRequest = { to: recipient, value: sendValue, gasLimit };
  if (feeData.maxFeePerGas != null) {
    txRequest.maxFeePerGas = (feeData.maxFeePerGas * 130n) / 100n;
    txRequest.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? 0n;
  } else {
    txRequest.gasPrice = (feeData.gasPrice * 130n) / 100n;
  }
  const tx = await signer.sendTransaction(txRequest);
  log(`Sweep ${label} from ${short(fromAddress)} to ${short(recipient)} for ${ethers.formatEther(sendValue)} ETH: ${tx.hash}`);
  return tx.wait();
}

function getSweepRecipient() {
  const recipient = inputs.sweepRecipient.value.trim();
  if (!ethers.isAddress(recipient)) throw new Error("Valid sweep destination wallet is required.");
  return recipient;
}

function parsePrivateKeys(value) {
  return String(value ?? "")
    .split(/[\s,;]+/)
    .map((key) => key.trim())
    .filter(Boolean);
}

async function loadPonsStatus(ns = "") {
  const ponsState = ponsStateFor(ns);
  const resultEl = document.querySelector(`#${ns}ponsContractResult`);
  try {
    requireSigner();
    await ensurePonsChain();
    const primary = await state.signer.getAddress();
    const factory = getPonsFactory(state.signer);
    ponsState.factory = factory;

    const dexId = parseUintInput(inputs[`${ns}ponsDexId`].value || "0", "DEX config ID");
    const launchConfigId = parseUintInput(inputs[`${ns}ponsLaunchConfigId`].value || "0", "Launch config ID");
    const [block, balance, launchFee, launchEnabled, locker, dexConfig, launchConfig, dexCount, launchCount, owner] = await Promise.all([
      state.provider.getBlockNumber(),
      state.provider.getBalance(primary),
      factory.launchFee(),
      factory.launchEnabled(),
      factory.locker(),
      factory.getDexConfig(dexId),
      factory.getLaunchConfig(launchConfigId),
      factory.dexConfigCount(),
      factory.launchConfigCount(),
      factory.owner(),
    ]);

    ponsState.launchFee = launchFee;
    ponsState.launchEnabled = launchEnabled;
    ponsState.locker = locker;
    ponsState.dexConfig = dexConfig;
    ponsState.launchConfig = launchConfig;
    ponsState.owner = owner;
    ponsState.isOwner = owner.toLowerCase() === primary.toLowerCase();
    inputs[`${ns}ponsCurrentBlock`].value = String(block);
    inputs[`${ns}ponsPrimaryWallet`].value = primary;
    inputs[`${ns}ponsPrimaryBalance`].value = `${ethers.formatEther(balance)} ETH`;
    inputs[`${ns}ponsLaunchFee`].value = `${ethers.formatEther(launchFee)} ETH`;
    inputs[`${ns}ponsOwner`].value = owner;
    inputs[`${ns}ponsLaunchEnabledStatus`].value = launchEnabled ? "Open to everyone" : "Closed — whitelist only";
    inputs[`${ns}ponsIsOwner`].value = ponsState.isOwner ? `Yes (${short(primary)})` : `No — owner is ${short(owner)}`;
    inputs[`${ns}ponsRouter`].value = dexConfig.swapRouter;
    inputs[`${ns}ponsFactory`].value = dexConfig.factory;
    inputs[`${ns}ponsPositionManager`].value = dexConfig.positionManager;
    inputs[`${ns}ponsPairToken`].value = launchConfig.pairToken;
    inputs[`${ns}ponsBuyerAddress0`].value ||= primary;
    inputs[`${ns}ponsBuyerBalance0`].value = `${ethers.formatEther(balance)} ETH`;
    resultEl.textContent = [
      `Contract verified on Blockscout: yes`,
      `Required functions: launchToken, predictTokenAddress, getDexConfig, getLaunchConfig`,
      `DEX configs: ${dexCount}, launch configs: ${launchCount}`,
      `Launch enabled: ${launchEnabled}`,
      `Locker: ${locker}`,
      `Mode: B - launch plus sequential router buys after restricted blocks`,
    ].join("\n");
    log("Loaded Pons contract status.");
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Pons status failed: ${formatError(error)}`);
  }
}

function ponsWhitelistTarget() {
  const typed = inputs.ponsWhitelistAddress.value.trim();
  return typed || inputs.ponsPrimaryWallet.value.trim();
}

async function checkPonsWhitelist() {
  const resultEl = document.querySelector("#ponsOwnerResult");
  try {
    requireSigner();
    await ensurePonsChain();
    const target = ponsWhitelistTarget();
    if (!ethers.isAddress(target)) throw new Error("Enter a valid address, or load status first to default to the connected wallet.");
    const factory = getPonsFactory(state.provider);
    const whitelisted = await factory.whitelistedLaunchers(target);
    inputs.ponsIsWhitelisted.value = whitelisted ? "Yes" : "No";
    resultEl.textContent = `${short(target)} is ${whitelisted ? "" : "not "}whitelisted to launch.`;
    log(`Pons: checked whitelist for ${short(target)} — ${whitelisted}.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Pons whitelist check failed: ${formatError(error)}`);
  }
}

async function setPonsLaunchEnabled(enabled) {
  const resultEl = document.querySelector("#ponsOwnerResult");
  try {
    requireSigner();
    await ensurePonsChain();
    const factory = getPonsFactory(state.signer);
    resultEl.textContent = `${enabled ? "Enabling" : "Disabling"} public launching...`;
    const tx = await factory.setLaunchEnabled(enabled);
    log(`Pons: setLaunchEnabled(${enabled}) submitted: ${tx.hash}`);
    const receipt = await tx.wait();
    if (receipt.status !== 1) throw new Error("Transaction reverted.");
    inputs.ponsLaunchEnabledStatus.value = enabled ? "Open to everyone" : "Closed — whitelist only";
    resultEl.textContent = `Public launching is now ${enabled ? "enabled" : "disabled"}. Tx: ${tx.hash}`;
    log(`Pons: launchEnabled is now ${enabled}.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Pons setLaunchEnabled failed: ${formatError(error)}`);
  }
}

async function setPonsWhitelist(enabled) {
  const resultEl = document.querySelector("#ponsOwnerResult");
  try {
    requireSigner();
    await ensurePonsChain();
    const target = ponsWhitelistTarget();
    if (!ethers.isAddress(target)) throw new Error("Enter a valid address to whitelist, or connect a wallet first.");
    const factory = getPonsFactory(state.signer);
    resultEl.textContent = `${enabled ? "Whitelisting" : "Removing"} ${short(target)}...`;
    const tx = await factory.setWhitelistedLauncher(target, enabled);
    log(`Pons: setWhitelistedLauncher(${short(target)}, ${enabled}) submitted: ${tx.hash}`);
    const receipt = await tx.wait();
    if (receipt.status !== 1) throw new Error("Transaction reverted.");
    inputs.ponsIsWhitelisted.value = enabled ? "Yes" : "No";
    resultEl.textContent = `${short(target)} is ${enabled ? "now whitelisted" : "removed from the whitelist"}. Tx: ${tx.hash}`;
    log(`Pons: ${short(target)} whitelist set to ${enabled}.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Pons setWhitelistedLauncher failed: ${formatError(error)}`);
  }
}

async function reviewPonsLaunch(ns = "") {
  const ponsState = ponsStateFor(ns);
  const resultEl = document.querySelector(`#${ns}ponsReviewResult`);
  try {
    requireSigner();
    await ensurePonsChain();
    const ctx = await buildPonsContext(ns);
    const launchGas = await ctx.factory.launchToken.estimateGas(ctx.params, ctx.launchConfigId, ctx.dexId, ctx.salt, { value: ctx.launchValue });
    await ctx.factory.launchToken.staticCall(ctx.params, ctx.launchConfigId, ctx.dexId, ctx.salt, { value: ctx.launchValue });
    ponsState.predictedToken = ctx.predictedToken;

    const warnings = [
      "Atomic: only the primary initial buy inside launchToken.",
      "PonsLauncherToken blocks all other buys until restrictionEndBlock passes, regardless of caller.",
      "Primary initial buy amountOutMinimum: fixed to 0 inside existing factory.",
      "Use the Fast Lane / Burst sections below for additional wallets after restrictions lift.",
    ];

    inputs[`${ns}ponsBuyerStatus0`].value = "Ready for launch signature";
    inputs[`${ns}ponsBuyerGas0`].value = `${launchGas}`;

    resultEl.textContent = [
      `Predicted token: ${ctx.predictedToken}`,
      `Launch function: launchToken(TokenParams,uint256,uint256,bytes32)`,
      `DEX: ${ctx.dexConfig.name}, router ${ctx.dexConfig.swapRouter}, fee ${ctx.dexConfig.poolFee}`,
      `Supply: ${ethers.formatUnits(ctx.launchConfig.supply, 18)} tokens`,
      `Launch fee: ${ethers.formatEther(ctx.launchFee)} ETH`,
      `Primary initial buy: ${ethers.formatEther(ctx.primaryBuyAmount)} ETH`,
      `Total primary wallet ETH required before gas: ${ethers.formatEther(ctx.launchValue)} ETH`,
      `Restriction end block will be emitted by launch; configured restriction blocks: ${ctx.launchConfig.restrictionBlocks}`,
      `Warnings:\n- ${warnings.join("\n- ")}`,
    ].join("\n");
    log(`Pons review OK. Predicted token ${ctx.predictedToken}.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Pons review failed: ${formatError(error)}`);
  }
}

// Throws on failure so callers (the standalone button, or executePonsAll)
// can tell a real revert/error apart from success. pushStep is caller-owned
// so both call sites can log into their own result panel.
async function executePonsLaunchCore(pushStep, ns = "") {
  const ponsState = ponsStateFor(ns);
  requireSigner();
  await ensurePonsChain();

  pushStep("Validating contract and simulating launch...");
  const ctx = await buildPonsContext(ns);
  await ctx.factory.launchToken.staticCall(ctx.params, ctx.launchConfigId, ctx.dexId, ctx.salt, { value: ctx.launchValue });
  const launchGas = await ctx.factory.launchToken.estimateGas(ctx.params, ctx.launchConfigId, ctx.dexId, ctx.salt, { value: ctx.launchValue });
  inputs[`${ns}ponsBuyerGas0`].value = `${launchGas}`;

  pushStep("Awaiting primary-wallet signature for launch...");
  inputs[`${ns}ponsBuyerStatus0`].value = "Awaiting wallet confirmation";
  const launchTx = await ctx.factory.launchToken(ctx.params, ctx.launchConfigId, ctx.dexId, ctx.salt, { value: ctx.launchValue });
  inputs[`${ns}ponsBuyerHash0`].value = launchTx.hash;
  inputs[`${ns}ponsBuyerStatus0`].value = "Launch submitted";
  pushStep(`Launch submitted: ${explorerTx(launchTx.hash)}`);

  const launchReceipt = await launchTx.wait();
  if (launchReceipt.status !== 1) throw new Error("Launch transaction reverted.");
  inputs[`${ns}ponsBuyerStatus0`].value = `Launch confirmed block ${launchReceipt.blockNumber}`;
  pushStep(`Launch confirmed in block ${launchReceipt.blockNumber}.`);

  const launchEvent = decodePonsLaunchEvent(launchReceipt.logs);
  if (!launchEvent) throw new Error("TokenLaunched event was not found in the launch receipt.");
  ponsState.launchedToken = launchEvent.token;
  ponsState.launchedPool = launchEvent.pool;
  ponsState.restrictionsEndBlock = launchEvent.restrictionsEndBlock;
  await saveLaunchedTokenToProject(launchEvent.token, "Pons");
  pushStep(`Token address detected: ${explorerAddress(launchEvent.token)}`);
  pushStep(`Pool address detected: ${explorerAddress(launchEvent.pool)}`);

  const token = new Contract(launchEvent.token, PONS_TOKEN_ABI, state.signer);
  const decimals = await token.decimals();
  const primaryRecipient = ctx.buyers[0]?.recipient || ctx.primary;
  if (ctx.primaryBuyAmount > 0n) {
    const primaryBalance = await token.balanceOf(primaryRecipient);
    inputs[`${ns}ponsBuyerReceived0`].value = ethers.formatUnits(primaryBalance, decimals);
  }

  pushStep(`Launch complete. Token ${explorerAddress(launchEvent.token)} restricted until block ${launchEvent.restrictionsEndBlock}.`);
  return launchEvent;
}

async function executePonsLaunch() {
  const resultEl = document.querySelector("#ponsExecutionResult");
  const steps = [];
  const pushStep = (line) => {
    steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    resultEl.textContent = steps.join("\n");
    log(`Pons: ${line}`);
  };
  try {
    await executePonsLaunchCore(pushStep);
    pushStep("Use the Fast Lane and Burst sections below to buy with additional wallets once restrictions lift.");
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Pons execution failed: ${formatError(error)}`);
  }
}

async function buildPonsContext(ns = "") {
  const ponsState = ponsStateFor(ns);
  const primary = await state.signer.getAddress();
  const factory = getPonsFactory(state.signer);
  const dexId = parseUintInput(inputs[`${ns}ponsDexId`].value || "0", "DEX config ID");
  const launchConfigId = parseUintInput(inputs[`${ns}ponsLaunchConfigId`].value || "0", "Launch config ID");
  const [launchFee, dexConfig, launchConfig] = await Promise.all([
    factory.launchFee(),
    factory.getDexConfig(dexId),
    factory.getLaunchConfig(launchConfigId),
  ]);
  ponsState.factory = factory;
  ponsState.dexConfig = dexConfig;
  ponsState.launchConfig = launchConfig;
  ponsState.launchFee = launchFee;
  if (!dexConfig.enabled) throw new Error("Selected Pons DEX config is disabled.");
  if (!launchConfig.enabled) throw new Error("Selected Pons launch config is disabled.");
  if (!dexConfig.swapRouter || dexConfig.swapRouter === ethers.ZeroAddress) throw new Error("Selected Pons DEX config has no swap router.");
  const buyers = getPonsBuyerRows(primary, ns);
  validatePonsBuyers(buyers);
  const primaryBuyer = buyers[0];
  const primaryBuyAmount = primaryBuyer.enabled ? primaryBuyer.amount : 0n;
  const feeWalletOverride = inputs[`${ns}ponsFeeWallet`].value.trim();
  const initialRecipient = primaryBuyer.recipient || primary;
  const params = {
    name: inputs[`${ns}ponsTokenName`].value.trim(),
    symbol: inputs[`${ns}ponsTokenSymbol`].value.trim(),
    logo: inputs[`${ns}ponsLogo`].value.trim(),
    description: inputs[`${ns}ponsDescription`].value.trim(),
    socials: {
      twitter: inputs[`${ns}ponsTwitter`].value.trim(),
      telegram: inputs[`${ns}ponsTelegram`].value.trim(),
      discord: inputs[`${ns}ponsDiscord`].value.trim(),
      website: inputs[`${ns}ponsWebsite`].value.trim(),
      farcaster: inputs[`${ns}ponsFarcaster`].value.trim(),
    },
    feeWallet: feeWalletOverride || (initialRecipient.toLowerCase() === primary.toLowerCase() ? ethers.ZeroAddress : initialRecipient),
  };
  if (!params.name || !params.symbol) throw new Error("Pons token name and symbol are required.");
  if (params.feeWallet !== ethers.ZeroAddress && !ethers.isAddress(params.feeWallet)) throw new Error("Invalid Pons fee wallet / initial recipient.");
  const salt = normalizeSalt(inputs[`${ns}ponsSalt`].value.trim());
  if (!inputs[`${ns}ponsSalt`].value.trim()) inputs[`${ns}ponsSalt`].value = salt;
  const predictedToken = await factory.predictTokenAddress(params, launchConfigId, dexId, salt, primary);
  return {
    primary,
    factory,
    dexId,
    launchConfigId,
    launchFee,
    dexConfig,
    launchConfig,
    buyers,
    primaryBuyAmount,
    launchValue: launchFee + primaryBuyAmount,
    params,
    salt,
    predictedToken,
  };
}

function getPonsBuyerRows(primary, ns = "") {
  return Array.from({ length: 1 }, (_, index) => {
    const enabled = inputs[`${ns}ponsBuyerEnabled${index}`].checked;
    const fallbackRecipient = index === 0 ? primary : "";
    const recipient = inputs[`${ns}ponsBuyerAddress${index}`].value.trim() || fallbackRecipient;
    const amountText = inputs[`${ns}ponsBuyerAmount${index}`].value.trim() || "0";
    return {
      index,
      enabled,
      recipient,
      amount: enabled ? parseEthInput(amountText, `Buyer ${index + 1} amount`) : 0n,
      minOut: inputs[`${ns}ponsBuyerMinOut${index}`].value.trim(),
    };
  });
}

function validatePonsBuyers(buyers) {
  const seen = new Set();
  for (const buyer of buyers.filter((row) => row.enabled)) {
    if (!ethers.isAddress(buyer.recipient) || buyer.recipient === ethers.ZeroAddress) {
      throw new Error(`Buyer ${buyer.index + 1} has an invalid recipient address.`);
    }
    const key = buyer.recipient.toLowerCase();
    if (seen.has(key)) throw new Error(`Duplicate buyer recipient: ${buyer.recipient}`);
    seen.add(key);
    if (buyer.amount < 0n) throw new Error(`Buyer ${buyer.index + 1} amount is invalid.`);
    if (buyer.index > 0 && buyer.amount > 0n && !buyer.minOut) {
      throw new Error(`Buyer ${buyer.index + 1} needs a minimum token output. Do not use zero in production.`);
    }
  }
}

function getPonsSwapParams(ctx, buyer) {
  const base = {
    tokenIn: ctx.launchConfig.pairToken,
    tokenOut: ctx.launchedToken || ctx.predictedToken, // eslint-disable-line -- ctx carries both; see executePonsPrivateKeyLegCore
    fee: ctx.dexConfig.poolFee,
    recipient: buyer.recipient,
    amountIn: buyer.amount,
    amountOutMinimum: parseTokenUnits(buyer.minOut, 18, `Buyer ${buyer.index + 1} minimum token output`),
    sqrtPriceLimitX96: 0n,
  };
  if (ctx.launchConfig.routerRequiresDeadline) {
    return { ...base, deadline: BigInt(getDeadline("20")) };
  }
  return base;
}

function getPonsFactory(signerOrProvider) {
  return new Contract(PONS_CHAIN.launchContract, PONS_FACTORY_ABI, signerOrProvider);
}

function getPonsRouter(dexConfig, signerOrProvider, launchConfig) {
  const requiresDeadline = (launchConfig ?? ponsState.launchConfig)?.routerRequiresDeadline;
  const abi = requiresDeadline ? [PONS_ROUTER_ABI[1]] : [PONS_ROUTER_ABI[0]];
  return new Contract(dexConfig.swapRouter, abi, signerOrProvider);
}

async function ensurePonsChain() {
  if (!state.provider || !state.signer) throw new Error("Connect primary wallet first.");
  const network = await state.provider.getNetwork();
  if (network.chainId !== BigInt(PONS_CHAIN.id)) {
    throw new Error(`Wrong network. Expected ${PONS_CHAIN.name} chain ${PONS_CHAIN.id}, connected to ${network.chainId}.`);
  }
}

function decodePonsLaunchEvent(logs) {
  const iface = new ethers.Interface(PONS_FACTORY_ABI);
  for (const logEntry of logs) {
    if (logEntry.address.toLowerCase() !== PONS_CHAIN.launchContract.toLowerCase()) continue;
    try {
      const parsed = iface.parseLog(logEntry);
      if (parsed?.name === "TokenLaunched") {
        return {
          token: parsed.args.token,
          pool: parsed.args.pool,
          restrictionsEndBlock: parsed.args.restrictionsEndBlock,
          initialBuyAmount: parsed.args.initialBuyAmount,
        };
      }
    } catch {
      // Not a Pons factory event.
    }
  }
  return null;
}

async function waitPastPonsRestrictions(restrictionsEndBlock, pushStep, ns = "") {
  let current = BigInt(await state.provider.getBlockNumber());
  while (current <= restrictionsEndBlock) {
    pushStep(`Waiting for restricted launch window to pass. Current block ${current}, need > ${restrictionsEndBlock}.`);
    await delay(5_000);
    current = BigInt(await state.provider.getBlockNumber());
    inputs[`${ns}ponsCurrentBlock`].value = String(current);
  }
}

/// Shared by the Fast Lane and Burst sections: both are private-key-wallet
/// legs that buy through the Pons DEX router after restrictions lift, they
/// differ only in row count/prefix and how soon they're expected to fire.
async function getPonsPrivateKeyBuyerRows(prefix, count) {
  const wallets = [];
  const seen = new Set();
  const buyers = [];
  for (let index = 0; index < count; index += 1) {
    if (!inputs[`${prefix}BuyerEnabled${index}`]?.checked) continue;
    const rawKey = inputs[`${prefix}BuyerKey${index}`].value.trim();
    const normalizedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedKey)) throw new Error(`${prefix} buyer ${index + 1} private key must be a 64-character hex string.`);
    const wallet = new Wallet(normalizedKey, state.provider);
    if (seen.has(wallet.address.toLowerCase())) throw new Error(`Duplicate ${prefix} buyer wallet ${wallet.address}.`);
    seen.add(wallet.address.toLowerCase());
    wallets.push(wallet);
    const recipient = inputs[`${prefix}BuyerAddress${index}`].value.trim() || wallet.address;
    if (!ethers.isAddress(recipient)) throw new Error(`${prefix} buyer ${index + 1} recipient is invalid.`);
    const amount = parseEthInput(inputs[`${prefix}BuyerAmount${index}`].value, `${prefix} buyer ${index + 1} amount`);
    const minOut = inputs[`${prefix}BuyerMinOut${index}`].value.trim();
    if (amount === 0n || !minOut) throw new Error(`${prefix} buyer ${index + 1} amount and minimum output must be set.`);
    const balance = await state.provider.getBalance(wallet.address);
    inputs[`${prefix}BuyerBalance${index}`].value = `${ethers.formatEther(balance)} ETH`;
    if (balance < amount) throw new Error(`${prefix} buyer ${index + 1} lacks ETH for its own purchase.`);
    buyers.push({ index, wallet, recipient, amount, minOut });
  }
  return buyers;
}

// Reads the live Uniswap V3 pool for (token, pairToken) and walks a sequence
// of ETH-denominated buys through it (single active tick-range assumption —
// accurate for a handful of buys, increasingly optimistic for deep runs since
// real liquidity is usually narrower than the range this assumes), returning
// per-buyer token-out/%-of-supply/price-impact plus a projected market cap
// after all buys land. Does not execute anything — pure preview.
async function simulatePonsBuyCurve(provider, dexConfig, tokenAddress, pairToken, totalSupplyRaw, ethAmounts) {
  const factory = new Contract(dexConfig.factory, V3_FACTORY_ABI, provider);
  const poolAddress = await factory.getPool(tokenAddress, pairToken, dexConfig.poolFee);
  if (!poolAddress || poolAddress === ethers.ZeroAddress) {
    throw new Error("No Uniswap V3 pool found yet for this token/pair — it may not be launched, or has no liquidity.");
  }
  const pool = new Contract(poolAddress, V3_POOL_ABI, provider);
  const [slot0, liquidityRaw, token0] = await Promise.all([pool.slot0(), pool.liquidity(), pool.token0()]);
  const tokenIsToken0 = token0.toLowerCase() === tokenAddress.toLowerCase();

  const Q96 = 2n ** 96n;
  const PRECISION = 10n ** 27n; // fixed-point scale for the sqrtPrice walk
  let sqrtP = (slot0.sqrtPriceX96 * PRECISION) / Q96; // token1-per-token0 sqrt ratio, scaled
  const L = liquidityRaw;
  const totalSupply = Number(ethers.formatUnits(totalSupplyRaw, 18));

  const rows = [];
  for (const { label, ethIn } of ethAmounts) {
    // Buying "token" with "pairToken": if token is token1, pairToken (in) is
    // token0 — price of token1 (sqrtP) falls as token1 leaves the pool.
    // If token is token0, pairToken (in) is token1 — price of token1 rises,
    // i.e. sqrtP rises as token0 leaves the pool. Handle both orientations.
    // ethIn is raw wei (unscaled). Dividing by L and multiplying by PRECISION
    // once brings it to the same PRECISION^1 scale as sqrtP/invSqrtP below —
    // do not pre-scale ethIn itself, or the result is off by a factor of
    // PRECISION (was the bug here: previously scaled twice).
    let tokensOutRaw;
    if (!tokenIsToken0) {
      // token0 = pairToken (WETH-like), token1 = token. deltaX (token0) in.
      // new_sqrtP = 1 / (1/sqrtP + deltaX/L); deltaY (token1 out) = L*(sqrtP - new_sqrtP)
      const invSqrtP = (PRECISION * PRECISION) / sqrtP; // 1/sqrtP, scaled by PRECISION
      const invSqrtPNew = invSqrtP + (ethIn * PRECISION) / L;
      const sqrtPNew = (PRECISION * PRECISION) / invSqrtPNew;
      const deltaY = (L * (sqrtP - sqrtPNew)) / PRECISION;
      tokensOutRaw = deltaY;
      sqrtP = sqrtPNew;
    } else {
      // token0 = token, token1 = pairToken (WETH-like). deltaY (token1) in.
      // new_sqrtP = sqrtP + deltaY/L; deltaX (token0 out) = L*(1/sqrtP - 1/new_sqrtP)
      const sqrtPNew = sqrtP + (ethIn * PRECISION) / L;
      const invSqrtP = (PRECISION * PRECISION) / sqrtP;
      const invSqrtPNew = (PRECISION * PRECISION) / sqrtPNew;
      const deltaX = (L * (invSqrtP - invSqrtPNew)) / PRECISION;
      tokensOutRaw = deltaX;
      sqrtP = sqrtPNew;
    }
    const tokensOut = Number(tokensOutRaw) / 1e18;
    rows.push({
      label,
      ethIn: Number(ethers.formatEther(ethIn)),
      tokensOut,
      pctOfSupply: totalSupply > 0 ? (tokensOut / totalSupply) * 100 : 0,
    });
  }

  // Final price: token1-per-token0 human ratio, decimal-adjusted for market cap.
  const sqrtPHuman = Number(sqrtP) / Number(PRECISION);
  const priceToken1PerToken0 = sqrtPHuman * sqrtPHuman;
  const priceOfTokenInPairUnits = tokenIsToken0 ? priceToken1PerToken0 : 1 / priceToken1PerToken0;
  const marketCapInPairUnits = priceOfTokenInPairUnits * totalSupply;

  return { rows, marketCapInPairUnits, priceOfTokenInPairUnits, poolAddress };
}

async function reviewPonsPrivateKeyLeg(prefix, count, resultElId, ns = "") {
  const ponsState = ponsStateFor(ns);
  const resultEl = document.querySelector(`#${resultElId}`);
  try {
    requireSigner();
    await ensurePonsChain();
    const buyers = await getPonsPrivateKeyBuyerRows(prefix, count);
    for (const buyer of buyers) {
      inputs[`${prefix}BuyerAddress${buyer.index}`].value ||= buyer.wallet.address;
      inputs[`${prefix}BuyerStatus${buyer.index}`].value = "Ready, waiting on launch";
    }
    const lines = [
      `Enabled wallets: ${buyers.length}`,
      `Wallets: ${buyers.map((buyer) => short(buyer.wallet.address)).join(", ") || "none"}`,
      `Total spend: ${ethers.formatEther(buyers.reduce((sum, buyer) => sum + buyer.amount, 0n))} ETH from buyer wallet balances`,
      `Execution: fires after Pons launch confirms and restrictionEndBlock passes; each wallet broadcasts its own router buy in parallel.`,
      `Atomic: no. Same-block inclusion is not guaranteed, and PonsLauncherToken rejects any buy before restrictions lift regardless of caller.`,
    ];

    const tokenAddress = ponsState.launchedToken || ponsState.predictedToken;
    if (buyers.length > 0 && tokenAddress && ponsState.dexConfig && ponsState.launchConfig) {
      try {
        const sim = await simulatePonsBuyCurve(
          state.provider,
          ponsState.dexConfig,
          tokenAddress,
          ponsState.launchConfig.pairToken,
          ethers.parseUnits("1000000000", 18), // Pons launch config always mints a fixed 1B supply
          buyers.map((buyer) => ({ label: `Wallet ${buyer.index + 1} (${short(buyer.wallet.address)})`, ethIn: buyer.amount })),
        );
        lines.push("");
        lines.push(`--- Buy preview (live pool, sequential — each wallet's price reflects prior wallets already buying) ---`);
        let cumPct = 0;
        for (const row of sim.rows) {
          cumPct += row.pctOfSupply;
          lines.push(`${row.label}: ${row.ethIn} ETH -> ${trimNumber(row.tokensOut)} tokens (${row.pctOfSupply.toFixed(2)}% of supply, ${cumPct.toFixed(2)}% cumulative)`);
        }
        lines.push(`Projected market cap after all buys: ${trimNumber(sim.marketCapInPairUnits)} ETH (${trimNumber(sim.priceOfTokenInPairUnits)} ETH per token)`);
        lines.push(`Model assumes constant pool liquidity across the whole sequence (single active tick range) — treat later wallets as an optimistic lower bound, not a guarantee.`);
      } catch (simError) {
        lines.push("");
        lines.push(`Buy preview unavailable: ${formatError(simError)}`);
      }
    }

    resultEl.textContent = lines.join("\n");
    log(`Pons ${prefix} review OK. ${buyers.length} wallet(s) ready.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Pons ${prefix} review failed: ${formatError(error)}`);
  }
}

/// Runs one private-key-wallet leg (Fast Lane or Burst) against a token that
/// is either already launched (ponsState.launchedToken) or about to be
/// launched by the caller separately. Waits for restrictionEndBlock, then
/// broadcasts every enabled wallet's router buy in parallel.
// Throws on failure (per-wallet submit/receipt failures are still tolerated
// and just logged, matching prior behavior — this only throws for
// leg-level problems: no launched token, or a thrown error before any
// submission). pushStep is caller-owned so executePonsAll can share one log.
async function executePonsPrivateKeyLegCore(prefix, count, pushStep, ns = "") {
  const ponsState = ponsStateFor(ns);
  requireSigner();
  await ensurePonsChain();
  const buyers = await getPonsPrivateKeyBuyerRows(prefix, count);

  if (!ponsState.launchedToken) throw new Error("No launched Pons token detected yet. Run Execute Launch Flow first.");
  if (!buyers.length) {
    pushStep(`${prefix}: no wallets enabled. Nothing to do.`);
    return { submitted: 0, confirmed: 0 };
  }

  const ctx = { dexConfig: ponsState.dexConfig, launchConfig: ponsState.launchConfig, predictedToken: ponsState.launchedToken, launchedToken: ponsState.launchedToken };
  if (ponsState.restrictionsEndBlock > 0n) {
    await waitPastPonsRestrictions(ponsState.restrictionsEndBlock, pushStep, ns);
  }

  // Even once restrictionsEndBlock has numerically passed, the launch
  // transaction's pool/position writes can still be settling on the RPC
  // node's own view of chain state for a moment right after launch —
  // observed live as every immediate post-launch buy reverting with "TF"
  // (TransferHelper: TRANSFER_FROM_FAILED), while replaying the exact same
  // calldata moments later succeeded cleanly. A short fixed settle delay
  // here, plus the retry below, absorbs that window instead of requiring a
  // manual re-run of the whole leg.
  await delay(PONS_POST_RESTRICTION_SETTLE_MS);

  const token = new Contract(ponsState.launchedToken, PONS_TOKEN_ABI, state.provider);
  const decimals = await token.decimals();
  pushStep(`Preparing ${buyers.length} ${prefix} buy transaction(s)...`);

  const submissions = await Promise.allSettled(buyers.map(async (buyer) => {
    const router = getPonsRouter(ctx.dexConfig, buyer.wallet, ctx.launchConfig);
    const params = getPonsSwapParams(ctx, buyer);
    let lastError;
    for (let attempt = 1; attempt <= PONS_BUY_SUBMIT_ATTEMPTS; attempt += 1) {
      try {
        const gas = await router.exactInputSingle.estimateGas(params, { value: buyer.amount });
        inputs[`${prefix}BuyerGas${buyer.index}`].value = `${gas}`;
        const tx = await router.exactInputSingle(params, { value: buyer.amount, gasLimit: (gas * 125n) / 100n });
        inputs[`${prefix}BuyerHash${buyer.index}`].value = tx.hash;
        inputs[`${prefix}BuyerStatus${buyer.index}`].value = "Submitted";
        return { buyer, tx };
      } catch (error) {
        lastError = error;
        if (attempt < PONS_BUY_SUBMIT_ATTEMPTS) {
          pushStep(`${prefix} buyer ${buyer.index + 1} attempt ${attempt} failed (${formatError(error)}), retrying...`);
          await delay(PONS_BUY_RETRY_DELAY_MS);
        }
      }
    }
    throw lastError;
  }));

  const accepted = [];
  for (const [position, result] of submissions.entries()) {
    const buyer = buyers[position];
    if (result.status === "fulfilled") {
      accepted.push(result.value);
      pushStep(`${prefix} buyer ${buyer.index + 1} submitted: ${explorerTx(result.value.tx.hash)}`);
    } else {
      inputs[`${prefix}BuyerStatus${buyer.index}`].value = "Submit failed";
      pushStep(`${prefix} buyer ${buyer.index + 1} submit failed: ${formatError(result.reason)}`);
    }
  }

  pushStep(`Waiting for ${accepted.length} submitted ${prefix} receipt(s)...`);
  const receipts = await Promise.allSettled(accepted.map(async (item) => {
    const receipt = await item.tx.wait();
    const received = await token.balanceOf(item.buyer.recipient);
    return { ...item, receipt, received };
  }));
  let confirmed = 0;
  for (const [position, result] of receipts.entries()) {
    const buyer = accepted[position].buyer;
    if (result.status === "fulfilled") {
      const { receipt, received } = result.value;
      const ok = receipt.status === 1;
      if (ok) confirmed += 1;
      inputs[`${prefix}BuyerStatus${buyer.index}`].value = ok ? `Confirmed block ${receipt.blockNumber}` : "Reverted";
      inputs[`${prefix}BuyerReceived${buyer.index}`].value = ethers.formatUnits(received, decimals);
      pushStep(`${prefix} buyer ${buyer.index + 1} ${ok ? "confirmed" : "reverted"} in block ${receipt.blockNumber}.`);
    } else {
      inputs[`${prefix}BuyerStatus${buyer.index}`].value = "Receipt wait failed";
      pushStep(`${prefix} buyer ${buyer.index + 1} receipt wait failed: ${formatError(result.reason)}`);
    }
  }
  pushStep(`${prefix} complete.`);
  return { submitted: accepted.length, confirmed };
}

async function executePonsPrivateKeyLeg(prefix, count, resultElId) {
  const resultEl = document.querySelector(`#${resultElId}`);
  const steps = [];
  const push = (line) => {
    steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    resultEl.textContent = steps.join("\n");
    log(`Pons ${prefix}: ${line}`);
  };
  try {
    await executePonsPrivateKeyLegCore(prefix, count, push);
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Pons ${prefix} execution failed: ${formatError(error)}`);
  }
}

// ======================== MULTIPLE BURST BUY ========================
// Buys an arbitrary, already-existing token (not necessarily launched
// through this app) with many wallets at once. Unlike the Pons Burst
// section above, there is no launch/restriction-window wait — it detects
// the token's pool (V2 or V3, reusing the same detection/quote helpers
// built for the Market Maker Bot) and fires every enabled wallet's buy
// immediately.

function getMultiBurstBuyerRows() {
  const buyers = [];
  const seen = new Set();
  for (let index = 0; index < 25; index += 1) {
    if (!inputs[`multiBurstBuyerEnabled${index}`]?.checked) continue;
    const rawKey = inputs[`multiBurstBuyerKey${index}`].value.trim();
    const normalizedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedKey)) throw new Error(`Multi Burst buyer ${index + 1} private key must be a 64-character hex string.`);
    const wallet = new Wallet(normalizedKey, getRpcProvider());
    if (seen.has(wallet.address.toLowerCase())) throw new Error(`Duplicate Multi Burst buyer wallet ${wallet.address}.`);
    seen.add(wallet.address.toLowerCase());
    const recipient = inputs[`multiBurstBuyerAddress${index}`].value.trim() || wallet.address;
    if (!ethers.isAddress(recipient)) throw new Error(`Multi Burst buyer ${index + 1} recipient is invalid.`);
    const amount = parseEthInput(inputs[`multiBurstBuyerAmount${index}`].value, `Multi Burst buyer ${index + 1} amount`);
    if (amount === 0n) throw new Error(`Multi Burst buyer ${index + 1} amount must be greater than zero.`);
    buyers.push({ index, wallet, recipient, amount });
  }
  return buyers;
}

async function multiBurstCheckPool() {
  const resultEl = document.querySelector("#multiBurstResult");
  const tokenAddress = inputs.multiBurstTokenAddress.value.trim();
  if (!ethers.isAddress(tokenAddress)) {
    resultEl.textContent = "Enter a valid token contract address.";
    return;
  }
  resultEl.textContent = "Checking pool...";
  const provider = getRpcProvider();
  const pool = await mmCheckPool(provider, getRouterAddress(), tokenAddress);
  if (!pool.exists) {
    resultEl.textContent = `No pool found for this token. ${pool.error || "Add liquidity first (LP tab)."}`;
    return;
  }
  resultEl.textContent = pool.version === "v3"
    ? `V3 pool found at ${short(pool.poolAddress)} (fee ${pool.poolFee}). Ready to buy.`
    : `V2 pool found at ${short(pool.pairAddress)} — ${trimNumber(pool.wethReserve)} WETH / ${trimNumber(pool.tokenReserve)} token reserves. Ready to buy.`;
  log(`Multi Burst: pool check for ${short(tokenAddress)} — ${pool.version === "v3" ? "V3" : "V2"} pool found.`);
}

async function multiBurstExecute() {
  const resultEl = document.querySelector("#multiBurstResult");
  try {
    const tokenAddress = inputs.multiBurstTokenAddress.value.trim();
    if (!ethers.isAddress(tokenAddress)) throw new Error("Enter a valid token contract address.");

    const buyers = getMultiBurstBuyerRows();
    if (buyers.length === 0) {
      resultEl.textContent = "No wallets enabled. Nothing to do.";
      return;
    }

    const provider = getRpcProvider();
    const routerAddress = getRouterAddress();
    resultEl.textContent = "Checking pool...";
    const pool = await mmCheckPool(provider, routerAddress, tokenAddress);
    if (!pool.exists) {
      resultEl.textContent = `No pool found for this token. ${pool.error || "Add liquidity first (LP tab)."}`;
      return;
    }

    const slippagePct = parseFloat(inputs.multiBurstSlippage.value) || 25;
    const token = new Contract(tokenAddress, artifact.abi, provider);
    let decimals = 18;
    try { decimals = Number(await token.decimals()); } catch {}

    log(`Multi Burst: buying ${short(tokenAddress)} with ${buyers.length} wallet(s) via ${pool.version === "v3" ? "V3" : "V2"} pool.`);
    resultEl.textContent = `Preparing ${buyers.length} buy transaction(s)...`;

    const submissions = await Promise.allSettled(buyers.map(async (buyer) => {
      let hash;
      if (pool.version === "v3") {
        const router = new Contract(pool.swapRouter, [PONS_ROUTER_ABI[0]], buyer.wallet);
        const quoted = await mmQuoteV3(pool.poolAddress, !pool.isToken0, buyer.amount, buyer.wallet.provider);
        const amountOutMin = mmApplySlippage(quoted, slippagePct);
        const params = {
          tokenIn: pool.wethAddress,
          tokenOut: tokenAddress,
          fee: pool.poolFee,
          recipient: buyer.recipient,
          amountIn: buyer.amount,
          amountOutMinimum: amountOutMin,
          sqrtPriceLimitX96: 0n,
        };
        const tx = await router.exactInputSingle(params, { value: buyer.amount });
        hash = tx.hash;
        inputs[`multiBurstBuyerHash${buyer.index}`].value = tx.hash;
        inputs[`multiBurstBuyerStatus${buyer.index}`].value = "Submitted";
        await tx.wait();
      } else {
        const router = new Contract(routerAddress, ROUTER_ABI, buyer.wallet);
        const weth = await router.WETH();
        const path = [weth, tokenAddress];
        const quoted = await mmQuoteV2(routerAddress, path, buyer.amount, buyer.wallet.provider);
        const amountOutMin = mmApplySlippage(quoted, slippagePct);
        const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(amountOutMin, path, buyer.recipient, getDeadline("20"), { value: buyer.amount });
        hash = tx.hash;
        inputs[`multiBurstBuyerHash${buyer.index}`].value = tx.hash;
        inputs[`multiBurstBuyerStatus${buyer.index}`].value = "Submitted";
        await tx.wait();
      }
      const received = await token.balanceOf(buyer.recipient);
      inputs[`multiBurstBuyerReceived${buyer.index}`].value = ethers.formatUnits(received, decimals);
      inputs[`multiBurstBuyerStatus${buyer.index}`].value = "Confirmed";
      return { buyer, hash };
    }));

    let confirmed = 0;
    const lines = [];
    for (const [position, result] of submissions.entries()) {
      const buyer = buyers[position];
      if (result.status === "fulfilled") {
        confirmed++;
        lines.push(`Buyer ${buyer.index + 1} confirmed: ${result.value.hash}`);
      } else {
        inputs[`multiBurstBuyerStatus${buyer.index}`].value = "Failed";
        lines.push(`Buyer ${buyer.index + 1} failed: ${formatError(result.reason)}`);
      }
    }
    resultEl.textContent = `${confirmed}/${buyers.length} confirmed.\n${lines.join("\n")}`;
    log(`Multi Burst: ${confirmed}/${buyers.length} wallet(s) confirmed.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Multi Burst failed: ${formatError(error)}`);
  }
}

// ======================== WALLET WASH ========================
// Buy with one wallet, sell with a different wallet — two independent,
// one-shot actions against the same token. Reuses the same pool
// detection/quote/slippage helpers built for the Market Maker Bot and
// Multiple Burst Buy, so it works on both V2 and V3 pools.

async function washCheckPool() {
  const resultEl = document.querySelector("#washPoolResult");
  const tokenAddress = inputs.washTokenAddress.value.trim();
  if (!ethers.isAddress(tokenAddress)) {
    resultEl.textContent = "Enter a valid token contract address.";
    return;
  }
  resultEl.textContent = "Checking pool...";
  const provider = getRpcProvider();
  const pool = await mmCheckPool(provider, getRouterAddress(), tokenAddress);
  if (!pool.exists) {
    resultEl.textContent = `No pool found for this token. ${pool.error || "Add liquidity first (LP tab)."}`;
    return;
  }
  resultEl.textContent = pool.version === "v3"
    ? `V3 pool found at ${short(pool.poolAddress)} (fee ${pool.poolFee}). Ready to buy/sell.`
    : `V2 pool found at ${short(pool.pairAddress)} — ${trimNumber(pool.wethReserve)} WETH / ${trimNumber(pool.tokenReserve)} token reserves. Ready to buy/sell.`;
  log(`Wallet Wash: pool check for ${short(tokenAddress)} — ${pool.version === "v3" ? "V3" : "V2"} pool found.`);
}

// ethAmountOverride (bigint wei), when given, is used instead of reading
// inputs.washBuyAmount — the Sell -> Relay -> Buy sequence below buys with
// whatever ETH actually arrived at Wallet B through the relay hop, not a
// pre-typed amount that may not match. Recipient is always Wallet B itself
// in that flow (no separate recipient field), since the funds already
// landed on that exact wallet.
// keyOverride/resultElId let the batch runner below reuse this exact logic
// for 33 different wallets instead of only ever reading the single fixed
// inputs.washBuyKey field — same pool check, same slippage protection.
async function washBuy(ethAmountOverride, keyOverride, resultElId = "washBuyResult") {
  const resultEl = document.querySelector(`#${resultElId}`);
  try {
    const tokenAddress = inputs.washTokenAddress.value.trim();
    if (!ethers.isAddress(tokenAddress)) throw new Error("Enter a valid token contract address.");
    const keyRaw = keyOverride ?? inputs.washBuyKey.value.trim();
    if (!keyRaw) throw new Error("Enter Wallet B's private key.");
    const ethAmount = ethAmountOverride ?? parseEthInput(inputs.washBuyAmount?.value || "0", "ETH amount to spend");
    if (ethAmount === 0n) throw new Error("ETH amount must be greater than zero.");
    const slippagePct = parseFloat(inputs.washSlippage.value) || 25;

    const provider = getRpcProvider();
    const wallet = new Wallet(keyRaw.startsWith("0x") ? keyRaw : `0x${keyRaw}`, provider);
    const recipient = wallet.address;

    const routerAddress = getRouterAddress();
    resultEl.textContent = "Checking pool...";
    const pool = await mmCheckPool(provider, routerAddress, tokenAddress);
    if (!pool.exists) {
      resultEl.textContent = `No pool found for this token. ${pool.error || "Add liquidity first (LP tab)."}`;
      return;
    }

    resultEl.textContent = "Submitting buy...";
    log(`Wallet Wash: buying ${short(tokenAddress)} with ${short(wallet.address)} for ${ethers.formatEther(ethAmount)} ETH via ${pool.version === "v3" ? "V3" : "V2"} pool.`);

    let tx;
    if (pool.version === "v3") {
      const router = new Contract(pool.swapRouter, [PONS_ROUTER_ABI[0]], wallet);
      const quoted = await mmQuoteV3(pool.poolAddress, !pool.isToken0, ethAmount, provider);
      const amountOutMin = mmApplySlippage(quoted, slippagePct);
      const params = {
        tokenIn: pool.wethAddress,
        tokenOut: tokenAddress,
        fee: pool.poolFee,
        recipient,
        amountIn: ethAmount,
        amountOutMinimum: amountOutMin,
        sqrtPriceLimitX96: 0n,
      };
      tx = await router.exactInputSingle(params, { value: ethAmount });
    } else {
      const router = new Contract(routerAddress, ROUTER_ABI, wallet);
      const weth = await router.WETH();
      const path = [weth, tokenAddress];
      const quoted = await mmQuoteV2(routerAddress, path, ethAmount, provider);
      const amountOutMin = mmApplySlippage(quoted, slippagePct);
      tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(amountOutMin, path, recipient, getDeadline("20"), { value: ethAmount });
    }
    resultEl.textContent = `Buy submitted: ${tx.hash}`;
    log(`Wallet Wash buy submitted: ${tx.hash}`);
    const receipt = await tx.wait();
    const token = new Contract(tokenAddress, artifact.abi, provider);
    let decimals = 18;
    try { decimals = Number(await token.decimals()); } catch {}
    const received = await token.balanceOf(recipient);
    resultEl.textContent = `Buy confirmed in block ${receipt.blockNumber}: ${tx.hash}\nToken balance now: ${ethers.formatUnits(received, decimals)}`;
    log(`Wallet Wash buy confirmed in block ${receipt.blockNumber}.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Wallet Wash buy failed: ${formatError(error)}`);
  }
}

// Builds the swap call (unsent) for one sell chunk, V2 or V3.
function buildWashSellTx(pool, tokenAddress, routerAddress, wallet, chunkAmount, recipient, amountOutMin) {
  if (pool.version === "v3") {
    const router = new Contract(pool.swapRouter, [PONS_ROUTER_ABI[0]], wallet);
    const params = {
      tokenIn: tokenAddress,
      tokenOut: pool.wethAddress,
      fee: pool.poolFee,
      recipient,
      amountIn: chunkAmount,
      amountOutMinimum: amountOutMin,
      sqrtPriceLimitX96: 0n,
    };
    return { call: () => router.exactInputSingle(params), staticCall: () => router.exactInputSingle.staticCall(params) };
  }
  const router = new Contract(routerAddress, ROUTER_ABI, wallet);
  return {
    call: async () => {
      const weth = await router.WETH();
      return router.swapExactTokensForETHSupportingFeeOnTransferTokens(chunkAmount, amountOutMin, [tokenAddress, weth], recipient, getDeadline("20"));
    },
    staticCall: async () => {
      const weth = await router.WETH();
      return router.swapExactTokensForETHSupportingFeeOnTransferTokens.staticCall(chunkAmount, amountOutMin, [tokenAddress, weth], recipient, getDeadline("20"));
    },
  };
}

async function quoteWashSell(pool, tokenAddress, routerAddress, chunkAmount, provider) {
  return pool.version === "v3"
    ? mmQuoteV3(pool.poolAddress, pool.isToken0, chunkAmount, provider)
    : mmQuoteV2(routerAddress, [tokenAddress, await new Contract(routerAddress, ROUTER_ABI, provider).WETH()], chunkAmount, provider);
}

// Some tokens reject a transfer above an amount the ERC-20-level
// balance/allowance checks don't reveal (a custom per-tx limit — confirmed
// live on one token where amounts as low as ~9,111 tokens reverted with
// "STF" from the router's TransferHelper despite ample balance/allowance,
// while ~9,110 succeeded). Probes via staticCall first (no gas spent on a
// doomed tx). Once a working chunk size is found by halving, that size is
// reused for every remaining chunk instead of re-probing from the full
// amount each time — selling a large balance under a small per-tx limit
// would otherwise re-discover the same limit from scratch on every chunk.
// MAX_WASH_SELL_CHUNKS guards against a token with a very low per-tx cap
// silently turning one sell into hundreds of real, gas-costing
// transactions unattended (e.g. selling a multi-million balance in
// ~9,000-token chunks is ~1,000 transactions). Once this many chunks have
// gone through, it stops and reports how much is left rather than
// continuing — re-run washSell to keep going for the remainder.
const MAX_WASH_SELL_CHUNKS = 20;

async function washSellWithChunking(wallet, provider, tokenAddress, totalAmount, recipient, pool, routerAddress, slippagePct, decimals, pushStep) {
  const dustFloor = 10n ** BigInt(Math.max(0, decimals - 6)); // stop halving once chunks are near-dust
  let remaining = totalAmount;
  let chunkSize = totalAmount;
  const hashes = [];

  while (remaining > 0n) {
    if (hashes.length >= MAX_WASH_SELL_CHUNKS) {
      pushStep(`Stopped after ${MAX_WASH_SELL_CHUNKS} chunk(s) as a safety limit — ${ethers.formatUnits(remaining, decimals)} tokens still unsold. Run Sell again to continue with the remainder (the discovered chunk size will need to be re-probed).`);
      break;
    }
    const amount = chunkSize > remaining ? remaining : chunkSize;
    const quoted = await quoteWashSell(pool, tokenAddress, routerAddress, amount, provider);
    const amountOutMin = mmApplySlippage(quoted, slippagePct);
    const built = buildWashSellTx(pool, tokenAddress, routerAddress, wallet, amount, recipient, amountOutMin);

    try {
      await built.staticCall();
    } catch (error) {
      if (chunkSize > dustFloor) {
        chunkSize = chunkSize / 2n;
        pushStep(`Sell of ${ethers.formatUnits(amount, decimals)} reverted (${error.reason || error.shortMessage || "unknown reason"}) — probing a smaller chunk size (${ethers.formatUnits(chunkSize, decimals)}).`);
        continue;
      }
      throw new Error(`Sell reverted even at a small chunk size (${ethers.formatUnits(amount, decimals)}): ${error.reason || error.shortMessage || error.message}`);
    }

    const tx = await built.call();
    pushStep(`Chunk ${hashes.length + 1}/${MAX_WASH_SELL_CHUNKS} submitted (size ${ethers.formatUnits(chunkSize, decimals)}): ${ethers.formatUnits(amount, decimals)} tokens — ${tx.hash}`);
    await tx.wait();
    hashes.push(tx.hash);
    remaining -= amount;
    pushStep(`Chunk confirmed. Remaining: ${ethers.formatUnits(remaining, decimals)}`);
    // chunkSize is now a known-working size — every subsequent chunk reuses
    // it directly instead of re-probing from the top of the loop again.
  }

  // A V3 sell only ever lands WETH, never native ETH — unwrap it now.
  // Only possible when the recipient is the selling wallet itself (we hold
  // its key here); a custom recipient's WETH is left for them to unwrap.
  if (pool.version === "v3" && recipient.toLowerCase() === wallet.address.toLowerCase()) {
    const wrapped = new Contract(pool.wethAddress, WRAPPED_NATIVE_ABI, wallet);
    const wrappedBalance = await wrapped.balanceOf(wallet.address);
    if (wrappedBalance > 0n) {
      pushStep(`Unwrapping ${ethers.formatEther(wrappedBalance)} WETH to native ETH...`);
      const unwrapTx = await wrapped.withdraw(wrappedBalance);
      await unwrapTx.wait();
      pushStep(`Unwrapped: ${unwrapTx.hash}`);
    }
  } else if (pool.version === "v3") {
    pushStep(`Sold to a custom recipient (${short(recipient)}) — that address holds WETH, not native ETH. Unwrap it there separately.`);
  }
  return hashes;
}

// keyOverride/amountOverride/resultElId let the batch runner below reuse
// this exact logic for 33 different wallets instead of only ever reading
// the single fixed inputs.washSellKey/washSellAmount fields — same pool
// check, same slippage protection, same chunked-sell fallback.
async function washSell(keyOverride, amountOverride, resultElId = "washSellResult") {
  const resultEl = document.querySelector(`#${resultElId}`);
  const steps = [];
  const pushStep = (line) => {
    steps.push(line);
    resultEl.textContent = steps.join("\n");
    log(`Wallet Wash: ${line}`);
  };
  try {
    const tokenAddress = inputs.washTokenAddress.value.trim();
    if (!ethers.isAddress(tokenAddress)) throw new Error("Enter a valid token contract address.");
    const keyRaw = keyOverride ?? inputs.washSellKey.value.trim();
    if (!keyRaw) throw new Error("Enter Wallet A's private key.");
    const slippagePct = parseFloat(inputs.washSlippage.value) || 25;

    const provider = getRpcProvider();
    const wallet = new Wallet(keyRaw.startsWith("0x") ? keyRaw : `0x${keyRaw}`, provider);
    const recipient = wallet.address;

    const token = new Contract(tokenAddress, artifact.abi, wallet);
    let decimals = 18;
    try { decimals = Number(await token.decimals()); } catch {}

    const amountText = amountOverride ?? inputs.washSellAmount.value.trim();
    const balance = await token.balanceOf(wallet.address);
    const rawAmount = amountText.toLowerCase() === "all" ? balance : ethers.parseUnits(cleanAmount(amountText, "Token amount to sell"), decimals);
    if (rawAmount === 0n) throw new Error("Token amount to sell must be greater than zero.");
    if (rawAmount > balance) throw new Error("Wallet A does not hold enough of this token.");

    const routerAddress = getRouterAddress();
    pushStep("Checking pool...");
    const pool = await mmCheckPool(provider, routerAddress, tokenAddress);
    if (!pool.exists) {
      resultEl.textContent = `No pool found for this token. ${pool.error || "Add liquidity first (LP tab)."}`;
      return;
    }

    const spender = pool.version === "v3" ? pool.swapRouter : routerAddress;
    const allowance = await token.allowance(wallet.address, spender);
    if (allowance < rawAmount) {
      pushStep("Approving router...");
      const approveTx = await token.approve(spender, rawAmount);
      pushStep(`Approval submitted ${approveTx.hash}`);
      await approveTx.wait();
    }

    pushStep(`Selling ${ethers.formatUnits(rawAmount, decimals)} ${short(tokenAddress)} with ${short(wallet.address)} via ${pool.version === "v3" ? "V3" : "V2"} pool. If the full amount reverts, this automatically retries in smaller chunks.`);
    const hashes = await washSellWithChunking(wallet, provider, tokenAddress, rawAmount, recipient, pool, routerAddress, slippagePct, decimals, pushStep);
    pushStep(`Sell complete across ${hashes.length} transaction(s).`);
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Wallet Wash sell failed: ${formatError(error)}`);
  }
}

// Sell (Wallet A) -> relay hop(s), randomized amount/timing -> Buy (Wallet
// B), reusing washSell/washBuy for the actual swaps and the same relay
// mechanism as Multi-Hop Fund for the transfer between them. Deliberately
// avoids a direct A->B transfer, which is the most obvious two-node edge a
// bubble map can show (same two wallets, same token, back to back) — this
// raises the bar against casual clustering, it does not make the flow
// untraceable; a determined trace can still follow value through the relay.
async function washRunSequence() {
  const resultEl = document.querySelector("#washBothResult");
  const steps = [];
  const push = (line) => {
    steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    resultEl.textContent = steps.join("\n");
    log(`Wallet Wash: ${line}`);
  };

  try {
    const sellKeyRaw = inputs.washSellKey.value.trim();
    if (!sellKeyRaw) throw new Error("Enter Wallet A's private key.");
    const buyKeyRaw = inputs.washBuyKey.value.trim();
    if (!buyKeyRaw) throw new Error("Enter Wallet B's private key.");
    const relayCount = Math.max(1, Math.min(6, parseInt(inputs.washRelayCount.value) || 2));
    const variancePct = Math.max(0, Math.min(90, parseFloat(inputs.washRelayVariancePct.value) || 10));
    const gasReserve = Math.max(0, parseFloat(inputs.washRelayGasReserve.value) || 0.0005);
    const delayRangeText = inputs.washRelayDelayRange.value.trim() || "20-90";

    const provider = getRpcProvider();
    const walletA = new Wallet(sellKeyRaw.startsWith("0x") ? sellKeyRaw : `0x${sellKeyRaw}`, provider);
    const walletB = new Wallet(buyKeyRaw.startsWith("0x") ? buyKeyRaw : `0x${buyKeyRaw}`, provider);
    if (walletA.address.toLowerCase() === walletB.address.toLowerCase()) throw new Error("Wallet A and Wallet B must be different wallets — using the same one defeats the point of the relay.");

    push("Step 1/3 — Selling with Wallet A...");
    await washSell();
    if (document.querySelector("#washSellResult").textContent.toLowerCase().includes("failed")) {
      resultEl.textContent = `${resultEl.textContent}\nSell failed — see Wallet A result above. Relay and buy were not attempted.`;
      log("Wallet Wash: sell failed, sequence stopped.");
      return;
    }

    const ethBalance = Number(ethers.formatEther(await provider.getBalance(walletA.address)));
    if (ethBalance <= gasReserve) throw new Error(`Wallet A only has ${trimNumber(ethBalance)} ETH after selling — not enough above the ${gasReserve} gas reserve to fund the relay.`);
    const relayTotal = ethBalance - gasReserve;

    push(`Step 2/3 — Routing ${trimNumber(relayTotal)} ETH through ${relayCount} relay wallet(s) to Wallet B (reserving ${gasReserve} ETH in Wallet A for its own gas)...`);
    const relays = Array.from({ length: relayCount }, () => Wallet.createRandom().connect(provider));
    push(`Generated ${relayCount} disposable relay wallet(s): ${relays.map((r) => short(r.address)).join(", ")}`);

    const hop1Shares = randomizedShares(relayTotal, relayCount, variancePct);
    for (const [i, relay] of relays.entries()) {
      const amount = hop1Shares[i];
      if (amount <= 0) continue;
      const tx = await walletA.sendTransaction({ to: relay.address, value: ethers.parseEther(trimNumber(amount)) });
      push(`  Wallet A → relay ${i + 1} (${short(relay.address)}): ${trimNumber(amount)} ETH — ${tx.hash}`);
      await tx.wait();
      const delay = randomDelayMs(delayRangeText);
      push(`  waiting ${(delay / 1000).toFixed(1)}s...`);
      await sleepMs(delay);
    }

    let totalToWalletB = 0;
    for (const [i, relay] of relays.entries()) {
      const relayBalance = Number(ethers.formatEther(await provider.getBalance(relay.address)));
      const spendable = Math.max(0, relayBalance - gasReserve);
      if (spendable <= 0) {
        push(`  relay ${i + 1} (${short(relay.address)}) has no spendable balance after gas reserve — skipping.`);
        continue;
      }
      const tx = await relay.sendTransaction({ to: walletB.address, value: ethers.parseEther(trimNumber(spendable)) });
      push(`  relay ${i + 1} → Wallet B: ${trimNumber(spendable)} ETH — ${tx.hash}`);
      await tx.wait();
      totalToWalletB += spendable;
      if (i < relays.length - 1) {
        const delay = randomDelayMs(delayRangeText);
        push(`  waiting ${(delay / 1000).toFixed(1)}s...`);
        await sleepMs(delay);
      }
    }

    if (totalToWalletB <= 0) throw new Error("No ETH reached Wallet B through the relay hop — nothing left to buy with.");

    // Buy with Wallet B's actual live balance minus the same gas reserve
    // used elsewhere in this flow — spending the full received amount as
    // the swap value leaves nothing for the buy transaction's own gas and
    // reverts with "insufficient funds for gas * price + value".
    const walletBBalance = Number(ethers.formatEther(await provider.getBalance(walletB.address)));
    const buyAmount = Math.max(0, walletBBalance - gasReserve);
    if (buyAmount <= 0) throw new Error(`Wallet B received ${trimNumber(walletBBalance)} ETH, which doesn't leave enough above the ${gasReserve} gas reserve to buy with.`);

    push(`Step 3/3 — Buying with Wallet B using ${trimNumber(buyAmount)} ETH (reserving ${gasReserve} ETH of the ${trimNumber(walletBBalance)} received for its own gas)...`);
    await washBuy(ethers.parseEther(trimNumber(buyAmount)));
    const buyFailed = document.querySelector("#washBuyResult").textContent.toLowerCase().includes("failed");
    push(buyFailed
      ? "Buy failed — see Wallet B result above for details."
      : "Sequence complete: sold with Wallet A, routed through relays, bought with Wallet B.");
    push(`Relay private keys (for sweeping any leftover dust — these were never saved anywhere): ${relays.map((r) => `${short(r.address)}=${r.privateKey}`).join(" | ")}`);
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Wallet Wash sequence failed: ${formatError(error)}`);
  }
}

// Same sell -> relay -> buy shape as washRunSequence above, but the relay
// hop bridges through a disposable Solana wallet via Relay Protocol
// instead of same-chain relay wallets. Explicitly does NOT hide this from
// a bubble map any better than the same-chain version — see the hint text
// on this card and the comment atop cross-chain-relay.js. Built because
// the user asked for it after confirming they understood that.
async function washRunSequenceCrossChain() {
  const resultEl = document.querySelector("#washCrossChainResult");
  const steps = [];
  const push = (line) => {
    steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    resultEl.textContent = steps.join("\n");
    log(`Wallet Wash (Solana relay): ${line}`);
  };

  try {
    const sellKeyRaw = inputs.washSellKey.value.trim();
    if (!sellKeyRaw) throw new Error("Enter Wallet A's private key.");
    const buyKeyRaw = inputs.washBuyKey.value.trim();
    if (!buyKeyRaw) throw new Error("Enter Wallet B's private key.");
    const evmGasReserve = Math.max(0, parseFloat(inputs.washRelayGasReserve.value) || 0.0005);
    // Blank defaults to this app's own /api/solana-rpc proxy, which reads
    // SOLANA_RPC_URL from .env.local server-side (falling back to the public
    // endpoint only if that's unset too) — same pattern as the EVM RPC field
    // defaulting to /rpc. Keeps a real Helius/QuickNode key out of the
    // browser instead of pasting it into this field in plaintext.
    const solanaRpcUrl = resolveRpcUrl(inputs.washSolanaRpcUrl.value.trim() || "/api/solana-rpc");
    const solanaGasReserve = Math.max(0, parseFloat(inputs.washSolanaGasReserve.value) || 0.002);
    push(`Using Solana RPC: ${solanaRpcUrl}`);

    const provider = getRpcProvider();
    const walletA = new Wallet(sellKeyRaw.startsWith("0x") ? sellKeyRaw : `0x${sellKeyRaw}`, provider);
    const walletB = new Wallet(buyKeyRaw.startsWith("0x") ? buyKeyRaw : `0x${buyKeyRaw}`, provider);
    if (walletA.address.toLowerCase() === walletB.address.toLowerCase()) throw new Error("Wallet A and Wallet B must be different wallets — using the same one defeats the point of the relay.");

    const {
      generateSolanaKeypair,
      solanaSecretKeyToBase58,
      bridgeEthToSolana,
      bridgeSolanaToEth,
      waitForSolanaBalance,
    } = await import("./cross-chain-relay.js");
    const { Connection } = await import("@solana/web3.js");

    push("Step 1/4 — Selling with Wallet A...");
    await washSell();
    if (document.querySelector("#washSellResult").textContent.toLowerCase().includes("failed")) {
      resultEl.textContent = `${resultEl.textContent}\nSell failed — see Wallet A result above. Relay and buy were not attempted.`;
      log("Wallet Wash (Solana relay): sell failed, sequence stopped.");
      return;
    }

    const ethBalance = Number(ethers.formatEther(await provider.getBalance(walletA.address)));
    if (ethBalance <= evmGasReserve) throw new Error(`Wallet A only has ${trimNumber(ethBalance)} ETH after selling — not enough above the ${evmGasReserve} gas reserve to bridge.`);
    const bridgeAmountEth = ethBalance - evmGasReserve;
    const bridgeAmountWei = ethers.parseEther(trimNumber(bridgeAmountEth));

    const solanaKeypair = generateSolanaKeypair();
    const solanaAddress = solanaKeypair.publicKey.toBase58();
    push(`Generated disposable Solana relay wallet: ${solanaAddress}`);

    try {
      const response = await projectFetch("/api/wallets/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chain: "solana",
          privateKeys: [solanaSecretKeyToBase58(solanaKeypair)],
          label: "wash-relay (solana): cross-chain pair",
        }),
        credentials: "same-origin",
      });
      if (response.ok) push("  saved Solana relay wallet to the wallet vault (Disperse tab).");
      else push(`  could not save Solana relay wallet to the vault (continuing anyway): ${(await response.json()).error || response.statusText}`);
    } catch (error) {
      push(`  could not save Solana relay wallet to the vault (continuing anyway): ${formatError(error)}`);
    }

    push(`Step 2/4 — Bridging ${trimNumber(bridgeAmountEth)} ETH from Wallet A to ${short(solanaAddress)} on Solana via Relay Protocol...`);
    await bridgeEthToSolana({
      evmWallet: walletA,
      solanaKeypair,
      amountWei: bridgeAmountWei,
      solanaRpcUrl,
      onProgress: (data) => {
        const hash = data?.txHashes?.at(-1)?.txHash;
        if (hash) push(`  bridge tx: ${hash}`);
      },
    });
    push("  bridge to Solana confirmed — waiting for the destination-side SOL to actually land (Relay's solver delivers this on its own schedule, a few seconds to a couple minutes after the deposit confirms)...");

    const connection = new Connection(solanaRpcUrl, "confirmed");
    const reserveLamports = Math.round(solanaGasReserve * 1e9);
    const solLamports = await waitForSolanaBalance(connection, solanaKeypair.publicKey, {
      minLamports: reserveLamports + 1,
      onPoll: (lamports) => push(`  Solana relay wallet balance so far: ${lamports / 1e9} SOL...`),
    });
    const solBalance = solLamports / 1e9;
    push(`  Solana relay wallet balance: ${solBalance} SOL`);
    const bridgeBackLamports = solLamports - reserveLamports;
    if (bridgeBackLamports <= 0) throw new Error(`Solana relay wallet only received ${solBalance} SOL after waiting — not enough above the ${solanaGasReserve} SOL fee reserve to bridge back. It may still be in flight; check ${solanaAddress} on solscan.io before retrying.`);

    push(`Step 3/4 — Bridging ${(bridgeBackLamports / 1e9)} SOL from Solana back to Wallet B on Robinhood Chain...`);
    await bridgeSolanaToEth({
      solanaKeypair,
      evmRecipientAddress: walletB.address,
      amountLamports: bridgeBackLamports,
      solanaRpcUrl,
      onProgress: (data) => {
        const hash = data?.txHashes?.at(-1)?.txHash;
        if (hash) push(`  bridge tx: ${hash}`);
      },
    });
    push("  bridge back to Robinhood Chain confirmed.");

    const walletBBalance = Number(ethers.formatEther(await provider.getBalance(walletB.address)));
    const buyAmount = Math.max(0, walletBBalance - evmGasReserve);
    if (buyAmount <= 0) throw new Error(`Wallet B received ${trimNumber(walletBBalance)} ETH, which doesn't leave enough above the ${evmGasReserve} gas reserve to buy with.`);

    push(`Step 4/4 — Buying with Wallet B using ${trimNumber(buyAmount)} ETH...`);
    await washBuy(ethers.parseEther(trimNumber(buyAmount)));
    const buyFailed = document.querySelector("#washBuyResult").textContent.toLowerCase().includes("failed");
    push(buyFailed
      ? "Buy failed — see Wallet B result above for details."
      : "Sequence complete: sold with Wallet A, bridged through Solana, bridged back, bought with Wallet B.");
    push(`Solana relay secret key (base58, for sweeping any leftover dust — also saved to the wallet vault above): ${solanaSecretKeyToBase58(solanaKeypair)}`);
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Wallet Wash cross-chain sequence failed: ${formatError(error)}`);
  }
}

// Parameterized version of washRunSequenceCrossChain — same sell -> bridge
// to Solana -> bridge back -> buy shape, but takes its wallets/reserves as
// plain arguments (like washRunPair below does for the same-chain version)
// so Batch Wash can run it for any of up to 33 pairs, one after another.
// Each pair gets its own disposable Solana wallet, saved to the vault
// before any funds move, same as the single-pair flow. Returns {ok,
// summary} instead of throwing, so one pair's bridge failing doesn't stop
// the rest of the batch.
async function washRunPairCrossChain(sellKey, buyKey, sellAmountText, evmGasReserve, solanaRpcUrl, solanaGasReserve, resultElId, pairLabel) {
  const resultEl = document.querySelector(`#${resultElId}`);
  const push = (line) => {
    resultEl.textContent = `${resultEl.textContent}\n[${new Date().toLocaleTimeString()}] ${line}`.trim();
    log(`Wallet Wash (Solana relay) ${pairLabel}: ${line}`);
  };

  try {
    push(`Using Solana RPC: ${solanaRpcUrl}`);
    const provider = getRpcProvider();
    const walletA = new Wallet(sellKey.startsWith("0x") ? sellKey : `0x${sellKey}`, provider);
    const walletB = new Wallet(buyKey.startsWith("0x") ? buyKey : `0x${buyKey}`, provider);
    if (walletA.address.toLowerCase() === walletB.address.toLowerCase()) throw new Error("Sell and buy wallets must be different — using the same one defeats the point of the relay.");

    const {
      generateSolanaKeypair,
      solanaSecretKeyToBase58,
      bridgeEthToSolana,
      bridgeSolanaToEth,
      waitForSolanaBalance,
    } = await import("./cross-chain-relay.js");
    const { Connection } = await import("@solana/web3.js");

    push(`Step 1/4 — Selling with ${short(walletA.address)}...`);
    await washSell(sellKey, sellAmountText, resultElId);
    if (resultEl.textContent.toLowerCase().includes("failed")) {
      push("Sell failed. Bridge and buy were not attempted for this pair.");
      return { ok: false, summary: `${pairLabel}: sell failed` };
    }

    const ethBalance = Number(ethers.formatEther(await provider.getBalance(walletA.address)));
    if (ethBalance <= evmGasReserve) throw new Error(`Sell wallet only has ${trimNumber(ethBalance)} ETH after selling — not enough above the ${evmGasReserve} gas reserve to bridge.`);
    const bridgeAmountEth = ethBalance - evmGasReserve;
    const bridgeAmountWei = ethers.parseEther(trimNumber(bridgeAmountEth));

    const solanaKeypair = generateSolanaKeypair();
    const solanaAddress = solanaKeypair.publicKey.toBase58();
    push(`Generated disposable Solana relay wallet: ${solanaAddress}`);

    try {
      const response = await projectFetch("/api/wallets/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chain: "solana",
          privateKeys: [solanaSecretKeyToBase58(solanaKeypair)],
          label: `wash-relay (solana): ${pairLabel}`,
        }),
        credentials: "same-origin",
      });
      if (response.ok) push("  saved Solana relay wallet to the wallet vault (Disperse tab).");
      else push(`  could not save Solana relay wallet to the vault (continuing anyway): ${(await response.json()).error || response.statusText}`);
    } catch (error) {
      push(`  could not save Solana relay wallet to the vault (continuing anyway): ${formatError(error)}`);
    }

    push(`Step 2/4 — Bridging ${trimNumber(bridgeAmountEth)} ETH to ${short(solanaAddress)} on Solana...`);
    await bridgeEthToSolana({
      evmWallet: walletA,
      solanaKeypair,
      amountWei: bridgeAmountWei,
      solanaRpcUrl,
      onProgress: (data) => {
        const hash = data?.txHashes?.at(-1)?.txHash;
        if (hash) push(`  bridge tx: ${hash}`);
      },
    });
    push("  bridge to Solana confirmed — waiting for the destination-side SOL to actually land...");

    const connection = new Connection(solanaRpcUrl, "confirmed");
    const reserveLamports = Math.round(solanaGasReserve * 1e9);
    const solLamports = await waitForSolanaBalance(connection, solanaKeypair.publicKey, {
      minLamports: reserveLamports + 1,
      onPoll: (lamports) => push(`  Solana relay wallet balance so far: ${lamports / 1e9} SOL...`),
    });
    const solBalance = solLamports / 1e9;
    push(`  Solana relay wallet balance: ${solBalance} SOL`);
    const bridgeBackLamports = solLamports - reserveLamports;
    if (bridgeBackLamports <= 0) throw new Error(`Solana relay wallet only received ${solBalance} SOL after waiting — not enough above the ${solanaGasReserve} SOL fee reserve to bridge back. It may still be in flight; check ${solanaAddress} on solscan.io before retrying.`);

    push(`Step 3/4 — Bridging ${(bridgeBackLamports / 1e9)} SOL back to ${short(walletB.address)}...`);
    await bridgeSolanaToEth({
      solanaKeypair,
      evmRecipientAddress: walletB.address,
      amountLamports: bridgeBackLamports,
      solanaRpcUrl,
      onProgress: (data) => {
        const hash = data?.txHashes?.at(-1)?.txHash;
        if (hash) push(`  bridge tx: ${hash}`);
      },
    });
    push("  bridge back to Robinhood Chain confirmed.");

    const walletBBalance = Number(ethers.formatEther(await provider.getBalance(walletB.address)));
    const buyAmount = Math.max(0, walletBBalance - evmGasReserve);
    if (buyAmount <= 0) throw new Error(`Buy wallet received ${trimNumber(walletBBalance)} ETH, not enough above the ${evmGasReserve} gas reserve to buy with.`);

    push(`Step 4/4 — Buying with ${short(walletB.address)} using ${trimNumber(buyAmount)} ETH...`);
    await washBuy(ethers.parseEther(trimNumber(buyAmount)), buyKey, resultElId);
    const buyFailed = resultEl.textContent.toLowerCase().includes("failed");
    push(buyFailed ? "Buy failed." : "Pair complete (via Solana relay).");
    push(`Solana relay secret key (also saved to the vault above): ${solanaSecretKeyToBase58(solanaKeypair)}`);
    return { ok: !buyFailed, summary: `${pairLabel}: ${buyFailed ? "buy failed" : "OK (Solana relay)"}` };
  } catch (error) {
    push(`Failed: ${formatError(error)}`);
    return { ok: false, summary: `${pairLabel}: ${formatError(error)}` };
  }
}

// One sell->relay->buy chain for one pair, used by both washRunSequence's
// UI-driven single pair and the batch runner below — this version takes
// its wallets/amount as plain arguments instead of reading fixed input
// fields, so it can run for any of up to 33 pairs. Writes its own progress
// into resultElId (a per-pair panel in batch mode) and returns a short
// {ok, summary} outcome for the batch summary line, instead of throwing —
// one pair failing should not stop the other 32.
// Persists a wash run's relay wallets to the same encrypted vault Disperse
// uses (server-side, AES-256-GCM at rest) so leftover dust is recoverable
// later from the Disperse tab instead of only ever appearing once in this
// run's log line, gone as soon as the log is cleared.
async function saveWashRelayWallets(relays, pairLabel) {
  const response = await projectFetch("/api/wallets/save", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      privateKeys: relays.map((r) => r.privateKey),
      label: `wash-relay: ${pairLabel}`,
    }),
    credentials: "same-origin",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Wallet save failed.");
  return data.wallets;
}

async function washRunPair(sellKey, buyKey, sellAmountText, relayCount, variancePct, gasReserve, delayRangeText, resultElId, pairLabel) {
  const resultEl = document.querySelector(`#${resultElId}`);
  const push = (line) => {
    // Appends rather than replacing resultEl's full content — washSell/
    // washBuy write their own real failure reason into this same element
    // (shared resultElId), and overwriting it here (as an earlier version
    // did) silently discarded that detail, leaving only a generic
    // "sell failed" with no way to see why.
    resultEl.textContent = `${resultEl.textContent}\n[${new Date().toLocaleTimeString()}] ${line}`.trim();
    log(`Wallet Wash ${pairLabel}: ${line}`);
  };

  try {
    const provider = getRpcProvider();
    const walletA = new Wallet(sellKey.startsWith("0x") ? sellKey : `0x${sellKey}`, provider);
    const walletB = new Wallet(buyKey.startsWith("0x") ? buyKey : `0x${buyKey}`, provider);
    if (walletA.address.toLowerCase() === walletB.address.toLowerCase()) throw new Error("Sell and buy wallets must be different — using the same one defeats the point of the relay.");

    push(`Step 1/3 — Selling with ${short(walletA.address)}...`);
    await washSell(sellKey, sellAmountText, resultElId);
    if (resultEl.textContent.toLowerCase().includes("failed")) {
      push("Sell failed. Relay and buy were not attempted for this pair.");
      return { ok: false, summary: `${pairLabel}: sell failed` };
    }

    const ethBalance = Number(ethers.formatEther(await provider.getBalance(walletA.address)));
    if (ethBalance <= gasReserve) throw new Error(`Sell wallet only has ${trimNumber(ethBalance)} ETH after selling — not enough above the ${gasReserve} gas reserve to fund the relay.`);
    const relayTotal = ethBalance - gasReserve;

    push(`Step 2/3 — Routing ${trimNumber(relayTotal)} ETH through ${relayCount} relay wallet(s)...`);
    const relays = Array.from({ length: relayCount }, () => Wallet.createRandom().connect(provider));

    // Save the relay wallets to the encrypted vault before sending anything
    // through them, so they're recoverable (via the Disperse tab) even if
    // this run fails partway through — previously the only record of a
    // relay's private key was the one log line further down, gone as soon
    // as the log is cleared.
    try {
      await saveWashRelayWallets(relays, pairLabel);
      push(`  saved ${relays.length} relay wallet(s) to the wallet vault (Disperse tab).`);
    } catch (error) {
      push(`  could not save relay wallets to the vault (continuing anyway): ${formatError(error)}`);
    }

    const hop1Shares = randomizedShares(relayTotal, relayCount, variancePct);
    for (const [i, relay] of relays.entries()) {
      const amount = hop1Shares[i];
      if (amount <= 0) continue;
      const tx = await walletA.sendTransaction({ to: relay.address, value: ethers.parseEther(trimNumber(amount)) });
      push(`  sell wallet → relay ${i + 1}: ${trimNumber(amount)} ETH — ${tx.hash}`);
      await tx.wait();
      await sleepMs(randomDelayMs(delayRangeText));
    }

    let totalToWalletB = 0;
    for (const [i, relay] of relays.entries()) {
      const relayBalance = Number(ethers.formatEther(await provider.getBalance(relay.address)));
      const spendable = Math.max(0, relayBalance - gasReserve);
      if (spendable <= 0) continue;
      const tx = await relay.sendTransaction({ to: walletB.address, value: ethers.parseEther(trimNumber(spendable)) });
      push(`  relay ${i + 1} → buy wallet: ${trimNumber(spendable)} ETH — ${tx.hash}`);
      await tx.wait();
      totalToWalletB += spendable;
      if (i < relays.length - 1) await sleepMs(randomDelayMs(delayRangeText));
    }

    if (totalToWalletB <= 0) throw new Error("No ETH reached the buy wallet through the relay hop.");

    const walletBBalance = Number(ethers.formatEther(await provider.getBalance(walletB.address)));
    const buyAmount = Math.max(0, walletBBalance - gasReserve);
    if (buyAmount <= 0) throw new Error(`Buy wallet received ${trimNumber(walletBBalance)} ETH, not enough above the ${gasReserve} gas reserve to buy with.`);

    push(`Step 3/3 — Buying with ${short(walletB.address)} using ${trimNumber(buyAmount)} ETH...`);
    await washBuy(ethers.parseEther(trimNumber(buyAmount)), buyKey, resultElId);
    const buyFailed = resultEl.textContent.toLowerCase().includes("failed");
    push(buyFailed ? "Buy failed." : "Pair complete.");
    push(`Relay keys (sweep any dust; never saved): ${relays.map((r) => `${short(r.address)}=${r.privateKey}`).join(" | ")}`);
    return { ok: !buyFailed, summary: `${pairLabel}: ${buyFailed ? "buy failed" : "OK"}` };
  } catch (error) {
    push(`Failed: ${formatError(error)}`);
    return { ok: false, summary: `${pairLabel}: ${formatError(error)}` };
  }
}

// Batch wash: up to 33 independent sell->relay->buy pairs, matched by line
// position between the two textareas. Pairs run one after another (not in
// parallel) so activity is spread over time rather than firing at once —
// one pair failing does not stop the rest.
async function washBatchRun(resultElSelector = "#washBatchResult", fieldNs = null) {
  // resultElSelector lets callers (the "Pons + Wash" tab, the Pons tab's
  // auto-wash) point this at their own result panel; the batch's per-pair
  // helpers get the same id (minus the leading "#") so their own push()
  // writes land in one place. fieldNs, when given, is the id prefix for the
  // washBatch* setting inputs to read (e.g. "pw"); null means derive it from
  // the result panel id ("...washBatchResult" -> that prefix), and a result
  // panel not ending in "washBatchResult" (the Pons tab passes its own
  // "#ponsAllWashResult") falls back to the canonical "" fields, which that
  // caller populates before calling.
  const resultElId = resultElSelector.replace(/^#/, "");
  if (fieldNs === null) {
    fieldNs = resultElId.endsWith("washBatchResult") ? resultElId.replace(/washBatchResult$/, "") : "";
  }
  const f = (name) => inputs[`${fieldNs}${name}`] ?? inputs[name];
  const statusEl = document.querySelector(resultElSelector);
  const tokenAddress = inputs.washTokenAddress.value.trim();
  if (!ethers.isAddress(tokenAddress)) {
    statusEl.textContent = "Enter a valid token contract address in the Token card above.";
    return;
  }

  const sellKeys = mmParseKeys(f("washBatchSellKeys").value);
  const buyKeys = mmParseKeys(f("washBatchBuyKeys").value);
  if (sellKeys.length === 0 || buyKeys.length === 0) {
    statusEl.textContent = "Paste at least one sell wallet and one buy wallet.";
    return;
  }
  const pairCount = Math.min(sellKeys.length, buyKeys.length, 33);
  if (sellKeys.length !== buyKeys.length) {
    log(`Wallet Wash batch: ${sellKeys.length} sell key(s) and ${buyKeys.length} buy key(s) pasted — running ${pairCount} matched pair(s), extra unmatched key(s) ignored.`);
  }

  const relayCount = Math.max(1, Math.min(6, parseInt(f("washBatchRelayCount").value) || 2));
  const variancePct = Math.max(0, Math.min(90, parseFloat(f("washBatchVariancePct").value) || 10));
  const gasReserve = Math.max(0, parseFloat(f("washBatchGasReserve").value) || 0.0005);
  const delayRangeText = f("washBatchDelayRange").value.trim() || "20-90";
  const useCrossChain = f("washBatchUseCrossChain").checked;
  const solanaRpcUrl = resolveRpcUrl(f("washBatchSolanaRpcUrl").value.trim() || "/api/solana-rpc");
  const solanaGasReserve = Math.max(0, parseFloat(f("washBatchSolanaGasReserve").value) || 0.002);

  // Every pair always sells the wallet's exact, real on-chain balance
  // ("all" reads token.balanceOf fresh right before selling) — no manually
  // typed amount to mistype or to fall out of sync with a rounded balance
  // shown in a wallet UI (which is what caused an earlier false "wallet A
  // does not hold enough" failure: the UI displayed a 3-decimal-rounded
  // balance, and typing that rounded number back was fractionally more
  // than the true on-chain value).
  const sellAmountTexts = Array(pairCount).fill("all");

  // washRunPair/washRunPairCrossChain write their own per-step detail
  // (including the real reason a sell/bridge/buy failed, not just
  // "failed") into this same #washBatchResult element via their own push()
  // — pushSummary must append to that, not replace it, or a batch-level
  // line here would wipe out the detail that was just written and leave
  // only a generic "sell failed" with no way to see why (this was a real
  // bug: an earlier version tracked its own separate summaryLines array
  // and stomped the shared element back down to just that on every call).
  const pushSummary = (line) => {
    statusEl.textContent = `${statusEl.textContent}\n[${new Date().toLocaleTimeString()}] ${line}`.trim();
  };
  pushSummary(`Starting batch wash: ${pairCount} pair(s), one after another.`);

  let succeeded = 0;
  for (let i = 0; i < pairCount; i += 1) {
    const pairLabel = `Pair ${i + 1}/${pairCount}`;
    pushSummary(`${pairLabel}: starting${useCrossChain ? " via Solana relay" : ""} (sell ${short(new Wallet(sellKeys[i]).address)} → buy ${short(new Wallet(buyKeys[i]).address)})...`);
    const result = useCrossChain
      ? await washRunPairCrossChain(sellKeys[i], buyKeys[i], sellAmountTexts[i], gasReserve, solanaRpcUrl, solanaGasReserve, resultElId, pairLabel)
      : await washRunPair(sellKeys[i], buyKeys[i], sellAmountTexts[i], relayCount, variancePct, gasReserve, delayRangeText, resultElId, pairLabel);
    if (result.ok) succeeded++;
    pushSummary(result.summary);
    if (i < pairCount - 1) {
      const delay = randomDelayMs(delayRangeText);
      pushSummary(`Waiting ${(delay / 1000).toFixed(1)}s before the next pair...`);
      await sleepMs(delay);
    }
  }

  pushSummary(`Batch wash complete: ${succeeded}/${pairCount} pair(s) succeeded.`);
  log(`Wallet Wash batch: ${succeeded}/${pairCount} pair(s) succeeded.`);
}

// Clears any red "has-issue" outline left on wallet-row cards from a
// previous Validate All run, so a re-validate doesn't leave stale flags on
// rows that have since been fixed.
function clearPonsWalletIssueMarks(panelSelector = '[data-tab-panel="pons"]') {
  for (const card of document.querySelectorAll(`${panelSelector} .buyer-row.has-issue`)) {
    card.classList.remove("has-issue");
  }
}

function markPonsWalletIssue(prefix, index) {
  const anchor = document.querySelector(`#${prefix}BuyerEnabled${index}`) || document.querySelector(`#${prefix}BuyerKey${index}`);
  const card = anchor?.closest(".buyer-row");
  if (card) card.classList.add("has-issue");
}

// Non-throwing per-wallet check, used only by Validate All so one bad row
// doesn't stop the scan of every other row the way
// getPonsPrivateKeyBuyerRows (used by the real Execute path) intentionally
// does. Returns every issue found, each tagged with which wallet/section it
// belongs to, so Validate All can both list them in one message and mark
// every offending card — not just the first.
function checkPonsWalletRowsForIssues(prefix, count) {
  const issues = [];
  const seen = new Set();
  for (let index = 0; index < count; index += 1) {
    if (!inputs[`${prefix}BuyerEnabled${index}`]?.checked) continue;
    const label = `${prefix} wallet ${index + 1}`;
    let bad = false;

    const rawKey = inputs[`${prefix}BuyerKey${index}`].value.trim();
    const normalizedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedKey)) {
      issues.push(`${label}: private key must be a 64-character hex string.`);
      bad = true;
    } else {
      try {
        const address = new Wallet(normalizedKey).address.toLowerCase();
        if (seen.has(address)) {
          issues.push(`${label}: duplicate wallet address, already used in this section.`);
          bad = true;
        }
        seen.add(address);
      } catch {
        issues.push(`${label}: private key is invalid.`);
        bad = true;
      }
    }

    const recipient = inputs[`${prefix}BuyerAddress${index}`].value.trim();
    if (recipient && !ethers.isAddress(recipient)) {
      issues.push(`${label}: recipient address is invalid.`);
      bad = true;
    }

    const amountText = inputs[`${prefix}BuyerAmount${index}`].value.trim();
    if (!amountText || parseFloat(amountText) <= 0) {
      issues.push(`${label}: native amount to spend must be greater than zero.`);
      bad = true;
    }

    if (inputs[`${prefix}BuyerMinOut${index}`] && !inputs[`${prefix}BuyerMinOut${index}`].value.trim()) {
      issues.push(`${label}: minimum token output is required.`);
      bad = true;
    }

    if (bad) markPonsWalletIssue(prefix, index);
  }
  return issues;
}

// One-click validation: runs the same simulation checks as the individual
// Validate buttons (launch simulate, Fast Lane review, Burst review) plus a
// non-throwing per-wallet scan of every enabled row across Fast Lane and
// all three Burst sections. Every issue found is listed together in one
// message, and every offending wallet card gets a red outline — instead of
// only the first bad row (which is all the throwing per-section checks
// would otherwise surface). Does not submit any transaction.
async function validatePonsAll(ns = "") {
  const resultEl = document.querySelector(`#${ns}ponsAllResult`);
  const lines = [];
  const push = (line) => {
    lines.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    resultEl.textContent = lines.join("\n");
  };

  clearPonsWalletIssueMarks(ns ? '[data-tab-panel="ponsWash"]' : '[data-tab-panel="pons"]');
  const allIssues = [];

  push("Validating launch, Fast Lane, and Burst...");
  await reviewPonsLaunch(ns);
  const launchFailed = document.querySelector(`#${ns}ponsReviewResult`).textContent.toLowerCase().includes("failed");
  push(launchFailed
    ? "Launch validation FAILED — see Review section above for details."
    : "Launch validation OK — see Review section above for the full simulation.");
  if (launchFailed) allIssues.push("Launch: " + document.querySelector(`#${ns}ponsReviewResult`).textContent);

  const walletLegs = [{ prefix: `${ns}ponsFastLane`, count: 5, resultId: `${ns}ponsFastLaneReviewResult`, label: "Fast Lane" },
    ...PONS_BURST_SECTIONS.map(({ prefix, label }) => ({ prefix: `${ns}${prefix}`, count: PONS_BURST_SECTION_SIZE, resultId: `${ns}${prefix}ReviewResult`, label }))];

  for (const { prefix, count, resultId, label } of walletLegs) {
    const rowIssues = checkPonsWalletRowsForIssues(prefix, count);
    allIssues.push(...rowIssues);

    if (rowIssues.length === 0) {
      await reviewPonsPrivateKeyLeg(prefix, count, resultId, ns);
      const sectionFailed = document.querySelector(`#${resultId}`).textContent.toLowerCase().includes("failed");
      push(sectionFailed
        ? `${label} validation FAILED — see ${label} section above for details.`
        : `${label} validation OK — see ${label} section above for wallet count, spend, and buy preview.`);
      if (sectionFailed) allIssues.push(`${label}: ${document.querySelector(`#${resultId}`).textContent}`);
    } else {
      push(`${label}: ${rowIssues.length} wallet row(s) have issues — flagged in red below, listed in the summary.`);
    }
  }

  if (allIssues.length > 0) {
    resultEl.textContent = `⚠ ${allIssues.length} issue(s) found:\n${allIssues.map((i) => `- ${i}`).join("\n")}\n\n${lines.join("\n")}`;
    log(`Pons: Validate All found ${allIssues.length} issue(s).`);
  } else {
    push("All validations complete — no issues found. Review each section's own result panel for full detail before executing.");
    log("Pons: Validate All complete, no issues.");
  }
}

// One-click execution: launches the token, waits for restrictionsEndBlock
// on-chain, then runs Fast Lane and Burst in sequence. Stops immediately if
// the launch itself fails — Fast Lane/Burst never fire against a token that
// didn't actually launch. Per-wallet failures within a leg do not stop the
// next leg (matches each leg's own standalone behavior).
async function executePonsAll(ns = "") {
  const ponsState = ponsStateFor(ns);
  const resultEl = document.querySelector(`#${ns}ponsAllResult`);
  const lines = [];
  const push = (line) => {
    lines.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    resultEl.textContent = lines.join("\n");
    log(`Pons all: ${line}`);
  };

  if (!window.confirm("Execute All will launch the token, then automatically wait for restrictions to lift and fire Fast Lane and Burst — no further confirmation prompts. Continue?")) {
    push("Execute All cancelled before starting.");
    return;
  }

  try {
    push("Step 1/3 — Launching token...");
    await executePonsLaunchCore(push, ns);

    push("Step 2/3 — Running Fast Lane...");
    const fastLane = await executePonsPrivateKeyLegCore(`${ns}ponsFastLane`, 5, push, ns);
    push(`Fast Lane done: ${fastLane.confirmed}/${fastLane.submitted} confirmed.`);

    push("Step 3/3 — Running Burst sections...");
    let burstConfirmed = 0;
    let burstSubmitted = 0;
    for (const { prefix, label } of PONS_BURST_SECTIONS) {
      const result = await executePonsPrivateKeyLegCore(`${ns}${prefix}`, PONS_BURST_SECTION_SIZE, push, ns);
      push(`${label} done: ${result.confirmed}/${result.submitted} confirmed.`);
      burstConfirmed += result.confirmed;
      burstSubmitted += result.submitted;
    }

    push(`Execute All complete. Token ${ponsState.launchedToken}. Fast Lane ${fastLane.confirmed}/${fastLane.submitted}, Burst ${burstConfirmed}/${burstSubmitted} confirmed.`);

    // Auto-wash: only on the standalone Pons tab (ns === ""), only if the
    // "then Wallet Wash" checkbox is ticked. The "Pons + Wash" tab has its
    // own wash orchestration and does not use this path.
    if (ns === "" && document.querySelector("#ponsAllThenWash")?.checked) {
      await runPonsAllAutoWash(push, ponsState.launchedToken);
    }
  } catch (error) {
    push(`Execute All stopped: ${formatError(error)}`);
    log(`Pons Execute All failed: ${formatError(error)}`);
  }
}

// Runs the Batch Wallet Wash right after Execute All on the standalone Pons
// tab: every bundle wallet (Fast Lane + Burst, whatever keys are in those
// rows) sells its whole balance through relay wallets into a matched Wash
// Buy wallet auto-fetched from this project's vault (wash-buy category).
// Uses the settings entered in the Run Everything card. Reuses washBatchRun
// unchanged by populating the canonical washBatch*/washTokenAddress inputs
// first.
async function runPonsAllAutoWash(push, launchedToken) {
  if (!launchedToken || !ethers.isAddress(launchedToken)) {
    push("Auto-wash skipped: no launched token address.");
    return;
  }
  // Sell side: every valid, enabled private key across Fast Lane + Burst 1/2/3.
  const slots = [
    ...Array.from({ length: 5 }, (_, i) => ({ prefix: "ponsFastLane", index: i })),
    ...PONS_BURST_SECTIONS.flatMap(({ prefix }) => Array.from({ length: PONS_BURST_SECTION_SIZE }, (_, i) => ({ prefix, index: i }))),
  ];
  const seen = new Set();
  const sellKeys = [];
  for (const { prefix, index } of slots) {
    if (!inputs[`${prefix}BuyerEnabled${index}`]?.checked) continue;
    const raw = (inputs[`${prefix}BuyerKey${index}`]?.value || "").trim();
    const norm = raw.startsWith("0x") ? raw : `0x${raw}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(norm)) continue;
    let addr;
    try { addr = new Wallet(norm).address.toLowerCase(); } catch { continue; }
    if (seen.has(addr)) continue;
    seen.add(addr);
    sellKeys.push(norm);
  }
  if (sellKeys.length === 0) {
    push("Auto-wash skipped: no bundle wallet keys found in the Fast Lane / Burst rows.");
    return;
  }

  push(`Auto-wash: fetching Wash Buy wallets from the project vault...`);
  let buyKeys = [];
  try {
    const washBuy = await fetchCategoryWalletsWithKeys("wash-buy");
    buyKeys = washBuy.map((w) => w.privateKey);
  } catch (error) {
    push(`Auto-wash skipped: could not load Wash Buy wallets (${formatError(error)}).`);
    return;
  }
  if (buyKeys.length === 0) {
    push("Auto-wash skipped: no Wash Buy wallets saved for this project (Wallets tab → Wallet Wash — Buy Wallets).");
    return;
  }

  const startDelayMs = Math.max(0, (parseFloat(inputs.ponsAllWashStartDelay?.value) || 0) * 1000);
  if (startDelayMs > 0) {
    push(`Auto-wash: waiting ${(startDelayMs / 1000).toFixed(0)}s before starting the wash...`);
    await sleepMs(startDelayMs);
  }

  // Populate the canonical inputs washBatchRun / washSell / washBuy read.
  inputs.washTokenAddress.value = launchedToken;
  inputs.washSlippage.value = (inputs.ponsAllWashSlippage?.value || "25").trim() || "25";
  inputs.washBatchSellKeys.value = sellKeys.join("\n");
  inputs.washBatchBuyKeys.value = buyKeys.join("\n");
  inputs.washBatchRelayCount.value = (inputs.ponsAllWashRelayCount?.value || "2").trim() || "2";
  inputs.washBatchDelayRange.value = (inputs.ponsAllWashDelayRange?.value || "20-90").trim() || "20-90";
  inputs.washBatchVariancePct.value = (inputs.ponsAllWashVariancePct?.value || "10").trim() || "10";
  inputs.washBatchGasReserve.value = (inputs.ponsAllWashGasReserve?.value || "0.0005").trim() || "0.0005";
  inputs.washBatchUseCrossChain.checked = Boolean(document.querySelector("#ponsAllWashUseCrossChain")?.checked);
  // Always route the Solana leg through this app's own /api/solana-rpc
  // proxy (which reads SOLANA_RPC_URL server-side) — never a user-entered
  // endpoint. Leaving this blank makes washBatchRun fall back to that proxy.
  inputs.washBatchSolanaRpcUrl.value = "";
  inputs.washBatchSolanaGasReserve.value = (inputs.ponsAllWashSolanaGasReserve?.value || "0.002").trim() || "0.002";

  const pairCount = Math.min(sellKeys.length, buyKeys.length);
  push(`Auto-wash: running Batch Wash across ${pairCount} pair(s) — full detail below.`);
  const washEl = document.querySelector("#ponsAllWashResult");
  if (washEl) washEl.textContent = "";
  await washBatchRun("#ponsAllWashResult", "");
  const last = (washEl?.textContent || "").trim().split("\n").filter(Boolean).pop() || "Batch Wash finished.";
  push(`Auto-wash: ${last.replace(/^\[[^\]]*\]\s*/, "")}`);
}

function normalizeSalt(value) {
  if (!value) return ethers.hexlify(ethers.randomBytes(32));
  if (/^0x[0-9a-fA-F]{64}$/.test(value)) return value;
  return ethers.id(value);
}

function parseUintInput(value, fieldName) {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) throw new Error(`${fieldName} must be a non-negative integer.`);
  return BigInt(text);
}

function parseTokenUnits(value, decimals, fieldName) {
  return ethers.parseUnits(cleanAmount(value, fieldName), decimals);
}

function explorerTx(hash) {
  return `${PONS_CHAIN.explorerUrl}tx/${hash}`;
}

function explorerAddress(address) {
  return `${PONS_CHAIN.explorerUrl}address/${address}`;
}

async function loadLunchStatus() {
  const resultEl = document.querySelector("#lunchContractResult");
  try {
    requireSigner();
    await ensureLunchChain();
    const primary = await state.signer.getAddress();
    const launcher = getLunchFactory(state.signer);
    const executor = getLunch7702Coordinator(state.signer);
    const delegate = getLunch7702Delegate(LUNCH_CHAIN.delegate7702, state.signer);
    lunchState.factory = launcher;

    const [block, balance, factoryAddress, npmAddress, xToken, feeLocker, launchFee, enforcedSupply, tickMagnitude, midBandTicks, band1DepthWei, allTokensLength, executorOwner, executorLauncher, configuredDelegate, delegateCoordinator, delegateRouter, delegateXToken] = await Promise.all([
      state.provider.getBlockNumber(),
      state.provider.getBalance(primary),
      launcher.factory(),
      launcher.npm(),
      launcher.xToken(),
      launcher.feeLocker(),
      launcher.launchFeeWei(),
      launcher.enforcedSupply(),
      launcher.launchTickMagnitude(),
      launcher.midBandTicks(),
      launcher.band1DepthWei(),
      launcher.allTokensLength(),
      executor.owner(),
      executor.launcher(),
      executor.delegateImplementation(),
      delegate.coordinator(),
      delegate.router(),
      delegate.xToken(),
    ]);
    if (executorLauncher.toLowerCase() !== LUNCH_CHAIN.launchContract.toLowerCase()) throw new Error("Atomic executor launcher mismatch.");
    if (configuredDelegate.toLowerCase() !== LUNCH_CHAIN.delegate7702.toLowerCase()) throw new Error("7702 delegate mismatch.");
    if (delegateCoordinator.toLowerCase() !== LUNCH_CHAIN.coordinator7702.toLowerCase()) throw new Error("7702 coordinator mismatch.");
    if (delegateRouter.toLowerCase() !== LUNCH_CHAIN.router.toLowerCase()) throw new Error("7702 router mismatch.");
    if (delegateXToken.toLowerCase() !== xToken.toLowerCase()) throw new Error("7702 wrapped-native token mismatch.");

    lunchState.factoryAddress = factoryAddress;
    lunchState.npm = npmAddress;
    lunchState.xToken = xToken;
    lunchState.feeLocker = feeLocker;
    lunchState.launchFee = launchFee;
    lunchState.enforcedSupply = enforcedSupply;
    inputs.lunchCurrentBlock.value = String(block);
    inputs.lunchPrimaryWallet.value = primary;
    inputs.lunchPrimaryBalance.value = `${ethers.formatEther(balance)} ETH`;
    inputs.lunchLaunchFee.value = `${ethers.formatEther(launchFee)} ETH`;
    inputs.lunchAtomicOwner.value = executorOwner;
    inputs.lunchFactory.value = factoryAddress;
    inputs.lunchNpm.value = npmAddress;
    inputs.lunchXToken.value = xToken;
    inputs.lunchFeeLocker.value = feeLocker;
    inputs.lunchEnforcedSupply.value = `${ethers.formatUnits(enforcedSupply, 18)} tokens`;
    inputs.lunchTickMagnitude.value = String(tickMagnitude);
    inputs.lunchBuyerAddress0.value ||= primary;
    inputs.lunchBuyerBalance0.value = `${ethers.formatEther(balance)} ETH`;
    if (enforcedSupply > 0n) inputs.lunchTotalSupply.value = ethers.formatUnits(enforcedSupply, 18);

    resultEl.textContent = [
      `Proxy verified on Blockscout: yes`,
      `Implementation: ${LUNCH_CHAIN.implementation}`,
      `7702 coordinator: ${LUNCH_CHAIN.coordinator7702}`,
      `7702 delegate: ${LUNCH_CHAIN.delegate7702}`,
      `Coordinator owner: ${executorOwner}${executorOwner.toLowerCase() === primary.toLowerCase() ? " (connected)" : " (connect this wallet to execute)"}`,
      `allTokensLength: ${allTokensLength}`,
      `midBandTicks: ${midBandTicks}, band1DepthWei: ${ethers.formatEther(band1DepthWei)} ETH`,
      `Mode: EIP-7702 - launch plus up to 7 separately funded EOA buys in one transaction`,
    ].join("\n");
    log("Loaded Lunch.fun contract status.");
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Lunch status failed: ${formatError(error)}`);
  }
}

async function reviewLunchLaunch() {
  const resultEl = document.querySelector("#lunchReviewResult");
  try {
    requireSigner();
    await ensureLunchChain();
    const ctx = await buildLunchContext();
    const launchGas = await ctx.launcher.launchWithMetaSalt.estimateGas(
      ctx.name,
      ctx.symbol,
      ctx.totalSupply,
      ctx.fee,
      ctx.initialBuyFlag,
      ctx.meta,
      ctx.userSalt,
      { value: ctx.launchValue },
    );
    await ctx.launcher.launchWithMetaSalt.staticCall(
      ctx.name,
      ctx.symbol,
      ctx.totalSupply,
      ctx.fee,
      ctx.initialBuyFlag,
      ctx.meta,
      ctx.userSalt,
      { value: ctx.launchValue },
    );
    lunchState.predictedToken = ctx.predictedToken;

    const laterSpend = ctx.buyers.slice(1).reduce((sum, buyer) => sum + buyer.amount, 0n);
    const enabledRows = ctx.buyers.filter((buyer) => buyer.enabled);
    for (const buyer of ctx.buyers) {
      inputs[`lunchBuyerStatus${buyer.index}`].value = buyer.index === 0 ? "Ready for launch signature" : "Ready after token exists";
      if (buyer.index > 0) inputs[`lunchBuyerBalance${buyer.index}`].value = "Paid by primary wallet";
      inputs[`lunchBuyerGas${buyer.index}`].value = buyer.index === 0 ? `${launchGas}` : "estimated after token exists";
    }

    resultEl.textContent = [
      `Predicted token: ${ctx.predictedToken}`,
      `Launch function: launchWithMetaSalt(string,string,uint256,uint24,uint256,Meta,bytes32)`,
      `Purchase function for later rows: V3 router exactInputSingle`,
      `Factory: ${ctx.factoryAddress}`,
      `NPM: ${ctx.npm}`,
      `X token: ${ctx.xToken}`,
      `Fee tier: ${ctx.fee}`,
      `Supply: ${ethers.formatUnits(ctx.totalSupply, 18)} tokens`,
      `Launch fee: ${ethers.formatEther(ctx.launchFee)} ETH`,
      `Primary dev-buy: ${ethers.formatEther(ctx.primaryBuyAmount)} ETH (${ctx.initialBuyFlag > 0n ? "enabled" : "disabled/refunded"})`,
      `Later recipient buys total: ${ethers.formatEther(laterSpend)} ETH`,
      `Total primary wallet ETH required before gas: ${ethers.formatEther(ctx.launchValue + laterSpend)} ETH`,
      `Buyer order: ${enabledRows.map((buyer) => `${buyer.index + 1}:${short(buyer.recipient)}`).join(" -> ") || "none"}`,
      `Atomic: only launch + primary dev-buy. Same-block later buys are not guaranteed.`,
      `Risk: creator dev-buy has no min output; it is direct pool exact-input logic inside the launcher.`,
    ].join("\n");
    log(`Lunch review OK. Predicted token ${ctx.predictedToken}.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Lunch review failed: ${formatError(error)}`);
  }
}

async function reviewLunchAtomicLaunch() {
  const resultEl = document.querySelector("#lunchReviewResult");
  try {
    requireSigner();
    await ensureLunchChain();
    const ctx = await buildLunchAtomicContext();
    const amountsOut = await ctx.executor.launchAndBuy.staticCall(ctx.params, ctx.buys, { value: ctx.value });
    const gas = await ctx.executor.launchAndBuy.estimateGas(ctx.params, ctx.buys, { value: ctx.value });
    lunchState.predictedToken = ctx.predictedToken;

    for (const buyer of ctx.enabledBuyers) {
      inputs[`lunchBuyerStatus${buyer.index}`].value = "Ready in atomic transaction";
      inputs[`lunchBuyerBalance${buyer.index}`].value = buyer.index === 0 ? inputs.lunchPrimaryBalance.value : "Paid by executor owner";
      inputs[`lunchBuyerGas${buyer.index}`].value = `${gas} total`;
      inputs[`lunchBuyerReceived${buyer.index}`].value = `simulated ${ethers.formatUnits(amountsOut[2][ctx.enabledBuyers.indexOf(buyer)], 18)}`;
    }

    resultEl.textContent = [
      `Atomic executor: ${LUNCH_CHAIN.atomicExecutor}`,
      `Predicted token: ${ctx.predictedToken}`,
      `Enabled buys: ${ctx.buys.length}`,
      `Execution order: ${ctx.enabledBuyers.map((buyer) => `${buyer.index + 1}:${short(buyer.recipient)}`).join(" -> ")}`,
      `Launch fee: ${ethers.formatEther(ctx.launchFee)} ETH`,
      `Purchase total: ${ethers.formatEther(ctx.buyValue)} ETH`,
      `Total required before gas: ${ethers.formatEther(ctx.value)} ETH`,
      `Estimated total gas: ${gas}`,
      `Deadline: ${new Date(Number(ctx.params.deadline) * 1000).toLocaleString()}`,
      `Atomic guarantee: launch and every listed buy are internal calls in one transaction. Any failure reverts everything.`,
    ].join("\n");
    log(`Lunch atomic review OK. Predicted token ${ctx.predictedToken}.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Lunch atomic review failed: ${formatError(error)}`);
  }
}

async function executeLunchAtomicLaunch() {
  const resultEl = document.querySelector("#lunchExecutionResult");
  try {
    requireSigner();
    await ensureLunchChain();
    const ctx = await buildLunchAtomicContext();
    const steps = [];
    const pushStep = (line) => {
      steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
      resultEl.textContent = steps.join("\n");
      log(`Lunch atomic: ${line}`);
    };

    pushStep("Simulating the complete atomic launch and all buys...");
    await ctx.executor.launchAndBuy.staticCall(ctx.params, ctx.buys, { value: ctx.value });
    const gas = await ctx.executor.launchAndBuy.estimateGas(ctx.params, ctx.buys, { value: ctx.value });
    pushStep(`Simulation passed. Estimated gas ${gas}.`);
    for (const buyer of ctx.enabledBuyers) {
      inputs[`lunchBuyerGas${buyer.index}`].value = `${gas} total`;
      inputs[`lunchBuyerStatus${buyer.index}`].value = "Awaiting one wallet confirmation";
    }

    pushStep("Awaiting executor-owner signature for one atomic transaction...");
    const tx = await ctx.executor.launchAndBuy(ctx.params, ctx.buys, {
      value: ctx.value,
      gasLimit: (gas * 125n) / 100n,
    });
    for (const buyer of ctx.enabledBuyers) {
      inputs[`lunchBuyerHash${buyer.index}`].value = tx.hash;
      inputs[`lunchBuyerStatus${buyer.index}`].value = "Atomic transaction submitted";
    }
    pushStep(`Submitted: ${lunchExplorerTx(tx.hash)}`);

    const receipt = await tx.wait();
    if (receipt.status !== 1) throw new Error("Atomic launch transaction reverted.");
    const launchEvent = decodeLunchLaunchEvent(receipt.logs);
    if (!launchEvent) throw new Error("V3TokenLaunched event was not found in the atomic receipt.");
    lunchState.launchedToken = launchEvent.token;
    lunchState.launchedPool = launchEvent.pool;
    await saveLaunchedTokenToProject(launchEvent.token, "Lunch.fun");
    const token = new Contract(launchEvent.token, PONS_TOKEN_ABI, state.signer);
    const decimals = await token.decimals();
    for (const buyer of ctx.enabledBuyers) {
      const received = await token.balanceOf(buyer.recipient);
      inputs[`lunchBuyerReceived${buyer.index}`].value = ethers.formatUnits(received, decimals);
      inputs[`lunchBuyerStatus${buyer.index}`].value = `Atomic confirmation block ${receipt.blockNumber}`;
    }
    pushStep(`Confirmed in block ${receipt.blockNumber}. Token: ${lunchExplorerAddress(launchEvent.token)}`);
    pushStep(`Pool: ${lunchExplorerAddress(launchEvent.pool)}`);
    pushStep("Complete. No external transaction occurred between launch and the configured buys.");
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Lunch atomic execution failed: ${formatError(error)}`);
  }
}

async function buildLunchAtomicContext() {
  const primary = await state.signer.getAddress();
  const launcher = getLunchFactory(state.signer);
  const executor = getLunchAtomicExecutor(state.signer);
  const [owner, launchFee, enforcedSupply, xToken] = await Promise.all([
    executor.owner(), launcher.launchFeeWei(), launcher.enforcedSupply(), launcher.xToken(),
  ]);
  if (owner.toLowerCase() !== primary.toLowerCase()) {
    throw new Error(`Connected wallet is not the atomic executor owner. Connect ${owner}.`);
  }
  const name = inputs.lunchTokenName.value.trim();
  const symbol = inputs.lunchTokenSymbol.value.trim();
  if (!name || !symbol) throw new Error("Lunch token name and symbol are required.");
  const totalSupply = parseTokenUnits(inputs.lunchTotalSupply.value, 18, "Lunch total supply");
  if (enforcedSupply > 0n && totalSupply !== enforcedSupply) {
    throw new Error(`Lunch total supply must equal enforced supply ${ethers.formatUnits(enforcedSupply, 18)}.`);
  }
  const fee = Number(parseUintInput(inputs.lunchFeeTier.value || "10000", "Lunch fee tier"));
  if (fee !== 10000) throw new Error("Lunch launcher requires fee tier 10000.");
  const enabledBuyers = getLunchBuyerRows(primary).filter((buyer) => buyer.enabled);
  if (enabledBuyers.length === 0) throw new Error("Enable at least one atomic buyer row.");
  const seen = new Set();
  const buys = enabledBuyers.map((buyer) => {
    if (!ethers.isAddress(buyer.recipient) || buyer.recipient === ethers.ZeroAddress) throw new Error(`Buyer ${buyer.index + 1} has an invalid recipient.`);
    if (seen.has(buyer.recipient.toLowerCase())) throw new Error(`Duplicate Lunch buyer recipient: ${buyer.recipient}`);
    seen.add(buyer.recipient.toLowerCase());
    if (buyer.amount <= 0n) throw new Error(`Buyer ${buyer.index + 1} amount must be greater than zero.`);
    const amountOutMinimum = parseTokenUnits(buyer.minOut, 18, `Buyer ${buyer.index + 1} minimum token output`);
    if (amountOutMinimum <= 0n) throw new Error(`Buyer ${buyer.index + 1} minimum output must be greater than zero.`);
    return { recipient: buyer.recipient, amountIn: buyer.amount, amountOutMinimum, sqrtPriceLimitX96: 0n };
  });
  const minutes = Number(cleanAmount(inputs.lunchDeadline.value || "5", "Lunch deadline"));
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 60) throw new Error("Lunch deadline must be between 0 and 60 minutes.");
  const userSalt = normalizeSalt(inputs.lunchSalt.value.trim());
  if (!inputs.lunchSalt.value.trim()) inputs.lunchSalt.value = userSalt;
  const params = {
    name, symbol, totalSupply, fee,
    meta: {
      image: inputs.lunchImage.value.trim(), banner: inputs.lunchBanner.value.trim(), description: inputs.lunchDescription.value.trim(),
      website: inputs.lunchWebsite.value.trim(), twitter: inputs.lunchTwitter.value.trim(), telegram: inputs.lunchTelegram.value.trim(),
    },
    userSalt,
    deadline: BigInt(Math.floor(Date.now() / 1000) + Math.floor(minutes * 60)),
  };
  const buyValue = buys.reduce((sum, buy) => sum + buy.amountIn, 0n);
  const value = launchFee + buyValue;
  const balance = await state.provider.getBalance(primary);
  if (balance <= value) throw new Error(`Wallet balance is below ${ethers.formatEther(value)} ETH plus gas.`);
  const predictedToken = await launcher.predictTokenAddress(name, symbol, totalSupply, LUNCH_CHAIN.atomicExecutor, userSalt);
  return { primary, launcher, executor, owner, launchFee, enforcedSupply, xToken, enabledBuyers, buys, buyValue, value, params, predictedToken };
}

function getLunchAtomicExecutor(signerOrProvider) {
  return new Contract(LUNCH_CHAIN.atomicExecutor, LUNCH_ATOMIC_ABI, signerOrProvider);
}

function getDopplerExecutor(signerOrProvider) {
  if (!DOPPLER_CHAIN.atomicExecutor) throw new Error("Set DOPPLER_CHAIN.atomicExecutor after deploying DopplerAtomicExecutor.");
  return new Contract(DOPPLER_CHAIN.atomicExecutor, DOPPLER_ATOMIC_ABI, signerOrProvider);
}

function getDopplerAirlock(signerOrProvider) {
  return new Contract(DOPPLER_CHAIN.airlock, DOPPLER_AIRLOCK_ABI, signerOrProvider);
}

async function ensureDopplerChain() {
  const network = await state.provider.getNetwork();
  if (network.chainId !== BigInt(DOPPLER_CHAIN.id)) {
    throw new Error(`Connected network is chain ${network.chainId}, expected ${DOPPLER_CHAIN.name} (${DOPPLER_CHAIN.id}). Use Switch Network first.`);
  }
}

function dopplerExplorerTx(hash) {
  return `${DOPPLER_CHAIN.explorerUrl}tx/${hash}`;
}

function dopplerExplorerAddress(address) {
  return `${DOPPLER_CHAIN.explorerUrl}address/${address}`;
}

function decodeDopplerCreateEvent(logs) {
  const iface = new ethers.Interface(DOPPLER_ATOMIC_ABI);
  for (const entry of logs) {
    try {
      const parsed = iface.parseLog(entry);
      if (parsed && parsed.name === "AtomicLaunch") {
        return { asset: parsed.args.asset, pool: parsed.args.pool };
      }
    } catch {
      // Not this executor's event; keep scanning.
    }
  }
  return null;
}

function getDopplerBuyerRows(primary) {
  const count = 5;
  return Array.from({ length: count }, (_, index) => {
    const enabled = inputs[`dopplerBuyerEnabled${index}`]?.checked ?? false;
    const rawAddress = inputs[`dopplerBuyerAddress${index}`]?.value.trim() ?? "";
    const recipient = index === 0 && !rawAddress ? primary : rawAddress;
    const amountValue = inputs[`dopplerBuyerAmount${index}`]?.value || "0";
    return {
      index,
      enabled,
      recipient,
      amount: ethers.parseEther(cleanAmount(amountValue, `Doppler buyer ${index + 1} amount`)),
      minOut: inputs[`dopplerBuyerMinOut${index}`]?.value.trim() ?? "",
    };
  });
}

async function loadDopplerStatus() {
  const resultEl = document.querySelector("#dopplerContractResult");
  try {
    requireSigner();
    await ensureDopplerChain();
    const primary = await state.signer.getAddress();
    const balance = await state.provider.getBalance(primary);
    inputs.dopplerPrimaryWallet.value = primary;
    inputs.dopplerPrimaryBalance.value = `${ethers.formatEther(balance)} ETH`;

    const airlock = getDopplerAirlock(state.provider);
    const [tokenFactoryState, governanceFactoryState, poolInitializerState, liquidityMigratorState] = await Promise.all([
      airlock.getModuleState(DOPPLER_CHAIN.tokenFactory),
      airlock.getModuleState(DOPPLER_CHAIN.governanceFactory),
      airlock.getModuleState(DOPPLER_CHAIN.poolInitializer),
      airlock.getModuleState(DOPPLER_CHAIN.liquidityMigrator),
    ]);
    const lines = [
      `tokenFactory module state: ${tokenFactoryState} (expect 1 = TokenFactory)`,
      `governanceFactory module state: ${governanceFactoryState} (expect 2 = GovernanceFactory)`,
      `poolInitializer module state: ${poolInitializerState} (expect 3 = PoolInitializer)`,
      `liquidityMigrator module state: ${liquidityMigratorState} (expect 4 = LiquidityMigrator)`,
    ];
    if ([tokenFactoryState, governanceFactoryState, poolInitializerState, liquidityMigratorState].some((s) => s === 0n || s === 0)) {
      lines.push("WARNING: at least one module shows NotWhitelisted (0). Airlock.create() will revert until Doppler's Airlock owner whitelists it.");
    }
    if (DOPPLER_CHAIN.atomicExecutor) {
      const executor = getDopplerExecutor(state.provider);
      const owner = await executor.owner();
      lines.push(`Executor owner: ${owner}`);
      lines.push(owner.toLowerCase() === primary.toLowerCase() ? "Connected wallet IS the executor owner." : "Connected wallet is NOT the executor owner; launchAndBuy will revert.");
    } else {
      lines.push("No DopplerAtomicExecutor address configured yet — deploy it and set DOPPLER_CHAIN.atomicExecutor.");
    }
    resultEl.textContent = lines.join("\n");
    log("Doppler status loaded.");
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Doppler status load failed: ${formatError(error)}`);
  }
}

async function buildDopplerContext() {
  const primary = await state.signer.getAddress();
  const executor = getDopplerExecutor(state.signer);
  const owner = await executor.owner();
  if (owner.toLowerCase() !== primary.toLowerCase()) {
    throw new Error(`Connected wallet is not the Doppler atomic executor owner. Connect ${owner}.`);
  }

  const name = inputs.dopplerTokenName.value.trim();
  const symbol = inputs.dopplerTokenSymbol.value.trim();
  if (!name || !symbol) throw new Error("Doppler token name and symbol are required.");
  const initialSupply = parseTokenUnits(inputs.dopplerInitialSupply.value, 18, "Doppler initial supply");
  const numTokensToSell = parseTokenUnits(inputs.dopplerNumTokensToSell.value, 18, "Doppler tokens to sell");
  if (numTokensToSell <= 0n || numTokensToSell > initialSupply) {
    throw new Error("Tokens to sell must be greater than zero and no more than the initial supply.");
  }
  const integratorInput = inputs.dopplerIntegrator.value.trim();
  const integrator = integratorInput ? integratorInput : ethers.ZeroAddress;
  if (integrator !== ethers.ZeroAddress && !ethers.isAddress(integrator)) throw new Error("Integrator must be a valid address or blank.");
  const salt = normalizeSalt(inputs.dopplerSalt.value.trim());
  if (!inputs.dopplerSalt.value.trim()) inputs.dopplerSalt.value = salt;

  const requireHexBytes = (value, fieldName) => {
    const trimmed = value.trim();
    if (!trimmed) return "0x";
    if (!/^0x([0-9a-fA-F]{2})*$/.test(trimmed)) throw new Error(`${fieldName} must be 0x-prefixed hex bytes.`);
    return trimmed;
  };
  const tokenFactoryData = requireHexBytes(inputs.dopplerTokenFactoryData.value, "tokenFactoryData");
  const governanceFactoryData = requireHexBytes(inputs.dopplerGovernanceFactoryData.value, "governanceFactoryData");
  const poolInitializerData = requireHexBytes(inputs.dopplerPoolInitializerData.value, "poolInitializerData");
  const liquidityMigratorData = requireHexBytes(inputs.dopplerLiquidityMigratorData.value, "liquidityMigratorData");

  const createData = {
    initialSupply,
    numTokensToSell,
    numeraire: DOPPLER_CHAIN.numeraire,
    tokenFactory: DOPPLER_CHAIN.tokenFactory,
    tokenFactoryData,
    governanceFactory: DOPPLER_CHAIN.governanceFactory,
    governanceFactoryData,
    poolInitializer: DOPPLER_CHAIN.poolInitializer,
    poolInitializerData,
    liquidityMigrator: DOPPLER_CHAIN.liquidityMigrator,
    liquidityMigratorData,
    integrator,
    salt,
  };

  const enabledBuyers = getDopplerBuyerRows(primary).filter((buyer) => buyer.enabled);
  if (enabledBuyers.length === 0) throw new Error("Enable at least one Doppler buyer row.");
  const seen = new Set();
  const buys = enabledBuyers.map((buyer) => {
    if (!ethers.isAddress(buyer.recipient) || buyer.recipient === ethers.ZeroAddress) throw new Error(`Buyer ${buyer.index + 1} has an invalid recipient.`);
    if (seen.has(buyer.recipient.toLowerCase())) throw new Error(`Duplicate Doppler buyer recipient: ${buyer.recipient}`);
    seen.add(buyer.recipient.toLowerCase());
    if (buyer.amount <= 0n) throw new Error(`Buyer ${buyer.index + 1} amount must be greater than zero.`);
    const amountOutMinimum = parseTokenUnits(buyer.minOut, 18, `Buyer ${buyer.index + 1} minimum token output`);
    if (amountOutMinimum <= 0n) throw new Error(`Buyer ${buyer.index + 1} minimum output must be greater than zero.`);
    return { recipient: buyer.recipient, amountIn: buyer.amount, amountOutMinimum };
  });

  const numeraireIsNative = inputs.dopplerNumeraireIsNative.checked;
  const buyValue = buys.reduce((sum, buy) => sum + buy.amountIn, 0n);
  const value = numeraireIsNative ? buyValue : 0n;

  const minutes = Number(cleanAmount(inputs.dopplerDeadline.value || "5", "Doppler deadline"));
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 60) throw new Error("Doppler deadline must be between 0 and 60 minutes.");
  const deadline = BigInt(Math.floor(Date.now() / 1000) + Math.floor(minutes * 60));

  const balance = await state.provider.getBalance(primary);
  if (balance <= value) throw new Error(`Wallet balance is below ${ethers.formatEther(value)} ETH plus gas.`);

  return { primary, executor, owner, createData, enabledBuyers, buys, buyValue, numeraireIsNative, value, deadline };
}

async function reviewDopplerLaunch() {
  const resultEl = document.querySelector("#dopplerReviewResult");
  try {
    requireSigner();
    await ensureDopplerChain();
    const ctx = await buildDopplerContext();
    const result = await ctx.executor.launchAndBuy.staticCall(ctx.createData, ctx.buys, ctx.numeraireIsNative, ctx.deadline, { value: ctx.value });
    const gas = await ctx.executor.launchAndBuy.estimateGas(ctx.createData, ctx.buys, ctx.numeraireIsNative, ctx.deadline, { value: ctx.value });
    dopplerState.predictedAsset = result.asset;

    for (const buyer of ctx.enabledBuyers) {
      inputs[`dopplerBuyerStatus${buyer.index}`].value = "Ready in atomic transaction";
      inputs[`dopplerBuyerGas${buyer.index}`].value = `${gas} total`;
    }

    resultEl.textContent = [
      `Atomic executor: ${DOPPLER_CHAIN.atomicExecutor}`,
      `Simulated asset: ${result.asset}`,
      `Simulated pool: ${result.pool}`,
      `Enabled buys: ${ctx.buys.length}`,
      `Execution order: ${ctx.enabledBuyers.map((buyer) => `${buyer.index + 1}:${short(buyer.recipient)}`).join(" -> ")}`,
      `Purchase total: ${ethers.formatEther(ctx.buyValue)} ETH${ctx.numeraireIsNative ? "" : " (numeraire is not native; buy value is not sent as msg.value)"}`,
      `Total msg.value required: ${ethers.formatEther(ctx.value)} ETH`,
      `Estimated total gas: ${gas}`,
      `Deadline: ${new Date(Number(ctx.deadline) * 1000).toLocaleString()}`,
      `Atomic guarantee: launch and every listed buy are internal calls in one transaction. Any failure reverts everything.`,
    ].join("\n");
    log(`Doppler review OK. Simulated asset ${result.asset}.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Doppler review failed: ${formatError(error)}`);
  }
}

async function executeDopplerLaunch() {
  const resultEl = document.querySelector("#dopplerExecutionResult");
  try {
    requireSigner();
    await ensureDopplerChain();
    const ctx = await buildDopplerContext();
    const steps = [];
    const pushStep = (line) => {
      steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
      resultEl.textContent = steps.join("\n");
      log(`Doppler atomic: ${line}`);
    };

    pushStep("Simulating the complete atomic launch and all buys...");
    await ctx.executor.launchAndBuy.staticCall(ctx.createData, ctx.buys, ctx.numeraireIsNative, ctx.deadline, { value: ctx.value });
    const gas = await ctx.executor.launchAndBuy.estimateGas(ctx.createData, ctx.buys, ctx.numeraireIsNative, ctx.deadline, { value: ctx.value });
    pushStep(`Simulation passed. Estimated gas ${gas}.`);
    for (const buyer of ctx.enabledBuyers) {
      inputs[`dopplerBuyerGas${buyer.index}`].value = `${gas} total`;
      inputs[`dopplerBuyerStatus${buyer.index}`].value = "Awaiting wallet confirmation";
    }

    pushStep("Awaiting executor-owner signature for one atomic transaction...");
    const tx = await ctx.executor.launchAndBuy(ctx.createData, ctx.buys, ctx.numeraireIsNative, ctx.deadline, {
      value: ctx.value,
      gasLimit: (gas * 125n) / 100n,
    });
    for (const buyer of ctx.enabledBuyers) inputs[`dopplerBuyerStatus${buyer.index}`].value = "Transaction submitted";
    pushStep(`Submitted: ${dopplerExplorerTx(tx.hash)}`);

    const receipt = await tx.wait();
    if (receipt.status !== 1) throw new Error("Atomic launch transaction reverted.");
    const launchEvent = decodeDopplerCreateEvent(receipt.logs);
    if (!launchEvent) throw new Error("AtomicLaunch event was not found in the receipt.");
    dopplerState.launchedAsset = launchEvent.asset;
    dopplerState.launchedPool = launchEvent.pool;
    await saveLaunchedTokenToProject(launchEvent.asset, "Doppler");

    const token = new Contract(launchEvent.asset, ["function decimals() view returns (uint8)", "function balanceOf(address) view returns (uint256)"], state.signer);
    const decimals = await token.decimals();
    for (const buyer of ctx.enabledBuyers) {
      const received = await token.balanceOf(buyer.recipient);
      inputs[`dopplerBuyerReceived${buyer.index}`].value = ethers.formatUnits(received, decimals);
      inputs[`dopplerBuyerStatus${buyer.index}`].value = `Confirmed block ${receipt.blockNumber}`;
    }
    pushStep(`Confirmed in block ${receipt.blockNumber}. Asset: ${dopplerExplorerAddress(launchEvent.asset)}`);
    pushStep(`Pool: ${dopplerExplorerAddress(launchEvent.pool)}`);
    pushStep("Complete. No external transaction occurred between launch and the configured buys.");
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Doppler execution failed: ${formatError(error)}`);
  }
}

/// Builds the Universal Router V4_SWAP calldata for one exact-input single
/// swap paid by `wallet`, using this deployment's fixed hooks/tickSpacing/
/// dynamic-fee flag. Mirrors DopplerAtomicExecutor._executeBuys() exactly so
/// burst-mode buyers hit the same pool the same way the atomic path does.
function buildDopplerV4SwapCalldata(asset, currencyIn, amountIn, amountOutMinimum, recipient) {
  const zeroForOne = BigInt(currencyIn) < BigInt(asset);
  const key = zeroForOne
    ? { currency0: currencyIn, currency1: asset, fee: DOPPLER_CHAIN.dynamicFeeFlag, tickSpacing: DOPPLER_CHAIN.tickSpacing, hooks: DOPPLER_CHAIN.hooks }
    : { currency0: asset, currency1: currencyIn, fee: DOPPLER_CHAIN.dynamicFeeFlag, tickSpacing: DOPPLER_CHAIN.tickSpacing, hooks: DOPPLER_CHAIN.hooks };

  const actions = ethers.solidityPacked(
    ["uint8", "uint8", "uint8"],
    [DOPPLER_ACTION_SWAP_EXACT_IN_SINGLE, DOPPLER_ACTION_SETTLE_ALL, DOPPLER_ACTION_TAKE_ALL],
  );
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const params = [
    abiCoder.encode([POOL_KEY_TUPLE, "bool", "uint256", "uint256", "bytes"], [key, zeroForOne, amountIn, amountOutMinimum, "0x"]),
    abiCoder.encode(["address", "uint256"], [currencyIn, amountIn]),
    abiCoder.encode(["address", "address"], [asset, recipient]),
  ];
  const inputsEncoded = [abiCoder.encode(["bytes", "bytes[]"], [actions, params])];
  return { commands: DOPPLER_CMD_V4_SWAP, inputs: inputsEncoded, zeroForOne, key };
}

async function loadDopplerBurstStatus() {
  const resultEl = document.querySelector("#dopplerBurstContractResult");
  try {
    requireSigner();
    await ensureDopplerChain();
    const primary = await state.signer.getAddress();
    const balance = await state.provider.getBalance(primary);
    inputs.dopplerBurstPrimaryWallet.value = primary;
    inputs.dopplerBurstPrimaryBalance.value = `${ethers.formatEther(balance)} ETH`;

    const airlock = getDopplerAirlock(state.provider);
    const [tokenFactoryState, governanceFactoryState, poolInitializerState, liquidityMigratorState] = await Promise.all([
      airlock.getModuleState(DOPPLER_CHAIN.tokenFactory),
      airlock.getModuleState(DOPPLER_CHAIN.governanceFactory),
      airlock.getModuleState(DOPPLER_CHAIN.poolInitializer),
      airlock.getModuleState(DOPPLER_CHAIN.liquidityMigrator),
    ]);
    resultEl.textContent = [
      `tokenFactory module state: ${tokenFactoryState} (expect 1)`,
      `governanceFactory module state: ${governanceFactoryState} (expect 2)`,
      `poolInitializer module state: ${poolInitializerState} (expect 3)`,
      `liquidityMigrator module state: ${liquidityMigratorState} (expect 4)`,
      `Mode: burst - Airlock.create() confirms first, then buyer wallet V4 swaps are broadcast in parallel`,
      `Atomic: no. Same-block inclusion: not guaranteed.`,
    ].join("\n");
    log("Doppler burst status loaded.");
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Doppler burst status load failed: ${formatError(error)}`);
  }
}

async function getDopplerBurstBuyerRows(primary) {
  const wallets = [];
  const seen = new Set();
  const buyers = [];
  for (let index = 0; index < 25; index += 1) {
    if (!inputs[`dopplerBurstBuyerEnabled${index}`]?.checked) continue;
    const rawKey = inputs[`dopplerBurstBuyerKey${index}`].value.trim();
    const normalizedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedKey)) throw new Error(`Burst buyer ${index + 1} private key must be a 64-character hex string.`);
    const wallet = new Wallet(normalizedKey, state.provider);
    if (seen.has(wallet.address.toLowerCase())) throw new Error(`Duplicate burst buyer wallet ${wallet.address}.`);
    seen.add(wallet.address.toLowerCase());
    wallets.push(wallet);
    const recipient = inputs[`dopplerBurstBuyerAddress${index}`].value.trim() || wallet.address;
    if (!ethers.isAddress(recipient)) throw new Error(`Burst buyer ${index + 1} recipient is invalid.`);
    const amountIn = parseEthInput(inputs[`dopplerBurstBuyerAmount${index}`].value, `Burst buyer ${index + 1} amount`);
    const minOut = parseTokenUnits(inputs[`dopplerBurstBuyerMinOut${index}`].value, 18, `Burst buyer ${index + 1} minimum output`);
    if (amountIn === 0n || minOut === 0n) throw new Error(`Burst buyer ${index + 1} amount and minimum output must be nonzero.`);
    const balance = await state.provider.getBalance(wallet.address);
    inputs[`dopplerBurstBuyerBalance${index}`].value = `${ethers.formatEther(balance)} ETH`;
    if (balance < amountIn) throw new Error(`Burst buyer ${index + 1} lacks ETH for its own purchase.`);
    buyers.push({ index, wallet, recipient, amountIn, minOut });
  }
  return buyers;
}

async function buildDopplerBurstContext() {
  const primary = await state.signer.getAddress();
  const airlock = getDopplerAirlock(state.signer);

  const name = inputs.dopplerBurstTokenName.value.trim();
  const symbol = inputs.dopplerBurstTokenSymbol.value.trim();
  if (!name || !symbol) throw new Error("Doppler burst token name and symbol are required.");
  const initialSupply = parseTokenUnits(inputs.dopplerBurstInitialSupply.value, 18, "Doppler burst initial supply");
  const numTokensToSell = parseTokenUnits(inputs.dopplerBurstNumTokensToSell.value, 18, "Doppler burst tokens to sell");
  if (numTokensToSell <= 0n || numTokensToSell > initialSupply) {
    throw new Error("Tokens to sell must be greater than zero and no more than the initial supply.");
  }
  const integratorInput = inputs.dopplerBurstIntegrator.value.trim();
  const integrator = integratorInput ? integratorInput : ethers.ZeroAddress;
  if (integrator !== ethers.ZeroAddress && !ethers.isAddress(integrator)) throw new Error("Integrator must be a valid address or blank.");
  const salt = normalizeSalt(inputs.dopplerBurstSalt.value.trim());
  if (!inputs.dopplerBurstSalt.value.trim()) inputs.dopplerBurstSalt.value = salt;

  const requireHexBytes = (value, fieldName) => {
    const trimmed = value.trim();
    if (!trimmed) return "0x";
    if (!/^0x([0-9a-fA-F]{2})*$/.test(trimmed)) throw new Error(`${fieldName} must be 0x-prefixed hex bytes.`);
    return trimmed;
  };
  const createData = {
    initialSupply,
    numTokensToSell,
    numeraire: DOPPLER_CHAIN.numeraire,
    tokenFactory: DOPPLER_CHAIN.tokenFactory,
    tokenFactoryData: requireHexBytes(inputs.dopplerBurstTokenFactoryData.value, "tokenFactoryData"),
    governanceFactory: DOPPLER_CHAIN.governanceFactory,
    governanceFactoryData: requireHexBytes(inputs.dopplerBurstGovernanceFactoryData.value, "governanceFactoryData"),
    poolInitializer: DOPPLER_CHAIN.poolInitializer,
    poolInitializerData: requireHexBytes(inputs.dopplerBurstPoolInitializerData.value, "poolInitializerData"),
    liquidityMigrator: DOPPLER_CHAIN.liquidityMigrator,
    liquidityMigratorData: requireHexBytes(inputs.dopplerBurstLiquidityMigratorData.value, "liquidityMigratorData"),
    integrator,
    salt,
  };

  const numeraireIsNative = inputs.dopplerBurstNumeraireIsNative.checked;
  const balance = await state.provider.getBalance(primary);
  const buyers = await getDopplerBurstBuyerRows(primary);
  const buyerValue = buyers.reduce((sum, buyer) => sum + buyer.amountIn, 0n);
  if (balance <= 0n) throw new Error("Launcher wallet has no balance for gas.");
  return { primary, airlock, createData, numeraireIsNative, buyers, buyerValue };
}

async function reviewDopplerBurstLaunch() {
  const resultEl = document.querySelector("#dopplerBurstReviewResult");
  try {
    requireSigner();
    await ensureDopplerChain();
    const ctx = await buildDopplerBurstContext();
    const result = await ctx.airlock.create.staticCall(ctx.createData);
    const gas = await ctx.airlock.create.estimateGas(ctx.createData);
    for (const buyer of ctx.buyers) {
      inputs[`dopplerBurstBuyerAddress${buyer.index}`].value ||= buyer.wallet.address;
      inputs[`dopplerBurstBuyerGas${buyer.index}`].value = "estimated after launch";
      inputs[`dopplerBurstBuyerStatus${buyer.index}`].value = "Ready for burst";
    }
    resultEl.textContent = [
      `Simulated asset: ${result.asset}`,
      `Simulated pool: ${result.pool}`,
      `Launch gas estimate: ${gas}`,
      `Burst buyer wallets: ${ctx.buyers.map((buyer) => short(buyer.wallet.address)).join(", ") || "none"}`,
      `Burst buy total: ${ethers.formatEther(ctx.buyerValue)} ETH from buyer wallet balances`,
      `Execution: Airlock.create() confirms first, asset is decoded from receipt, then all buyer V4 swaps are broadcast in parallel.`,
      `Atomic: no. Same-block inclusion: not guaranteed.`,
    ].join("\n");
    log(`Doppler burst review OK. Simulated asset ${result.asset}.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Doppler burst review failed: ${formatError(error)}`);
  }
}

async function executeDopplerBurstLaunch() {
  const resultEl = document.querySelector("#dopplerBurstExecutionResult");
  try {
    requireSigner();
    await ensureDopplerChain();
    const ctx = await buildDopplerBurstContext();
    const steps = [];
    const push = (line) => {
      steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
      resultEl.textContent = steps.join("\n");
      log(`Doppler burst: ${line}`);
    };

    push("Simulating Airlock.create()...");
    await ctx.airlock.create.staticCall(ctx.createData);
    const launchGas = await ctx.airlock.create.estimateGas(ctx.createData);
    push(`Launch simulation passed. Estimated gas ${launchGas}.`);

    push("Awaiting launcher wallet signature...");
    const launchTx = await ctx.airlock.create(ctx.createData, { gasLimit: (launchGas * 125n) / 100n });
    push(`Launch submitted: ${dopplerExplorerTx(launchTx.hash)}`);
    const launchReceipt = await launchTx.wait();
    if (launchReceipt.status !== 1) throw new Error("Doppler burst launch transaction reverted.");

    const launchEvent = decodeDopplerCreateEvent(launchReceipt.logs) || (() => {
      const iface = new ethers.Interface(DOPPLER_AIRLOCK_ABI);
      for (const entry of launchReceipt.logs) {
        try {
          const parsed = iface.parseLog(entry);
          if (parsed && parsed.name === "Create") return { asset: parsed.args.asset, pool: parsed.args.poolOrHook };
        } catch {
          // Not Airlock's Create event; keep scanning.
        }
      }
      return null;
    })();
    if (!launchEvent) throw new Error("Create event was not found in the launch receipt.");
    dopplerState.launchedAsset = launchEvent.asset;
    dopplerState.launchedPool = launchEvent.pool;
    await saveLaunchedTokenToProject(launchEvent.asset, "Doppler Burst");
    push(`Launch confirmed block ${launchReceipt.blockNumber}. Asset ${dopplerExplorerAddress(launchEvent.asset)}`);

    if (!ctx.buyers.length) {
      push("No burst buyers enabled. Done after launch.");
      return;
    }

    const currencyIn = ctx.numeraireIsNative ? ethers.ZeroAddress : DOPPLER_CHAIN.numeraire;
    const token = new Contract(launchEvent.asset, ["function decimals() view returns (uint8)", "function balanceOf(address) view returns (uint256)"], state.provider);
    const decimals = await token.decimals();
    push(`Preparing ${ctx.buyers.length} burst buy transaction(s)...`);

    const submissions = await Promise.allSettled(ctx.buyers.map(async (buyer) => {
      const { commands, inputs: swapInputs } = buildDopplerV4SwapCalldata(launchEvent.asset, currencyIn, buyer.amountIn, buyer.minOut, buyer.recipient);
      const router = new Contract(DOPPLER_CHAIN.universalRouter, DOPPLER_UNIVERSAL_ROUTER_ABI, buyer.wallet);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 300);
      const gas = await router.execute.estimateGas(commands, swapInputs, deadline, { value: buyer.amountIn });
      inputs[`dopplerBurstBuyerGas${buyer.index}`].value = `${gas}`;
      const tx = await router.execute(commands, swapInputs, deadline, { value: buyer.amountIn, gasLimit: (gas * 125n) / 100n });
      inputs[`dopplerBurstBuyerHash${buyer.index}`].value = tx.hash;
      inputs[`dopplerBurstBuyerStatus${buyer.index}`].value = "Submitted";
      return { buyer, tx };
    }));

    const accepted = [];
    for (const [position, result] of submissions.entries()) {
      const buyer = ctx.buyers[position];
      if (result.status === "fulfilled") {
        accepted.push(result.value);
        push(`Buyer ${buyer.index + 1} submitted: ${dopplerExplorerTx(result.value.tx.hash)}`);
      } else {
        inputs[`dopplerBurstBuyerStatus${buyer.index}`].value = "Submit failed";
        push(`Buyer ${buyer.index + 1} submit failed: ${formatError(result.reason)}`);
      }
    }

    push(`Waiting for ${accepted.length} submitted burst receipt(s)...`);
    const receipts = await Promise.allSettled(accepted.map(async (item) => {
      const receipt = await item.tx.wait();
      const received = await token.balanceOf(item.buyer.recipient);
      return { ...item, receipt, received };
    }));
    for (const [position, result] of receipts.entries()) {
      const buyer = accepted[position].buyer;
      if (result.status === "fulfilled") {
        const { receipt, received } = result.value;
        const ok = receipt.status === 1;
        inputs[`dopplerBurstBuyerStatus${buyer.index}`].value = ok ? `Confirmed block ${receipt.blockNumber}` : "Reverted";
        inputs[`dopplerBurstBuyerReceived${buyer.index}`].value = ethers.formatUnits(received, decimals);
        push(`Buyer ${buyer.index + 1} ${ok ? "confirmed" : "reverted"} in block ${receipt.blockNumber}.`);
      } else {
        inputs[`dopplerBurstBuyerStatus${buyer.index}`].value = "Receipt wait failed";
        push(`Buyer ${buyer.index + 1} receipt wait failed: ${formatError(result.reason)}`);
      }
    }
    push("Burst complete.");
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Doppler burst execution failed: ${formatError(error)}`);
  }
}

async function reviewLunch7702Launch() {
  const resultEl = document.querySelector("#lunchReviewResult");
  try {
    const ctx = await buildLunch7702Context();
    let gas = LUNCH_7702_BASE_GAS + LUNCH_7702_GAS_PER_BUYER * BigInt(ctx.buyers.length);
    let simulationNote = `Skipped eth_call simulation: at least one buyer wallet is not yet delegated on-chain, and eth_call does not apply an authorizationList. This is expected before the first atomic launch for these wallets; the real type-4 transaction applies delegations before executing.`;
    if (!ctx.pendingDelegation) {
      await state.provider.call({ from: ctx.owner.address, ...ctx.request });
      gas = await state.provider.estimateGas({ from: ctx.owner.address, ...ctx.request });
      simulationNote = `Full type-4 simulation passed. Each buyer authorization is limited to this token, amount, minimum output, deadline, and nonce.`;
    }
    for (const buyer of ctx.buyers) {
      inputs[`lunchBuyerGas${buyer.index}`].value = `${gas} ${ctx.pendingDelegation ? "estimated" : "total"}`;
      inputs[`lunchBuyerStatus${buyer.index}`].value = "7702 authorization ready";
    }
    resultEl.textContent = [
      `Coordinator: ${LUNCH_CHAIN.coordinator7702}`,
      `Delegate: ${LUNCH_CHAIN.delegate7702}`,
      `Predicted token: ${ctx.predictedToken}`,
      `Actual router callers: ${ctx.buyers.map((buyer) => buyer.account).join(" -> ")}`,
      `Each wallet spends: ${ctx.buyers.map((buyer) => ethers.formatEther(buyer.amountIn)).join(", ")} ETH`,
      `Launch fee paid by coordinator owner: ${ethers.formatEther(ctx.launchFee)} ETH`,
      `Estimated total gas: ${gas}`,
      simulationNote,
    ].join("\n");
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Lunch 7702 review failed: ${formatError(error)}`);
  }
}

async function executeLunch7702Launch({ context = null, deferRevocation = false } = {}) {
  const resultEl = document.querySelector("#lunchExecutionResult");
  try {
    const ctx = context || await buildLunch7702Context();
    const steps = [];
    const push = (line) => { steps.push(`[${new Date().toLocaleTimeString()}] ${line}`); resultEl.textContent = steps.join("\n"); };
    let gas = LUNCH_7702_BASE_GAS + LUNCH_7702_GAS_PER_BUYER * BigInt(ctx.buyers.length);
    if (ctx.pendingDelegation) {
      push("Skipping eth_call simulation: buyer wallet(s) are not yet delegated on-chain and eth_call cannot apply an authorizationList. Submitting the real atomic type-4 transaction directly.");
    } else {
      push("Simulating EIP-7702 launch and all separately funded wallet buys...");
      await state.provider.call({ from: ctx.owner.address, ...ctx.request });
      gas = await state.provider.estimateGas({ from: ctx.owner.address, ...ctx.request });
      push(`Simulation passed. Awaiting one owner signature; estimated gas ${gas}.`);
    }
    const tx = await ctx.owner.sendTransaction({ ...ctx.request, gasLimit: gas * 125n / 100n });
    for (const buyer of ctx.buyers) {
      inputs[`lunchBuyerHash${buyer.index}`].value = tx.hash;
      inputs[`lunchBuyerStatus${buyer.index}`].value = "Atomic type-4 transaction submitted";
    }
    push(`Submitted: ${lunchExplorerTx(tx.hash)}`);
    const receipt = await tx.wait();
    if (receipt.status !== 1) throw new Error("EIP-7702 launch reverted.");
    const launchEvent = decodeLunchLaunchEvent(receipt.logs);
    if (!launchEvent) throw new Error("Launch event missing from receipt.");
    if (deferRevocation) {
      for (const buyer of ctx.buyers) {
        inputs[`lunchBuyerStatus${buyer.index}`].value = `Confirmed block ${receipt.blockNumber}; burst broadcasting`;
      }
      push(`Launch and buys confirmed atomically in block ${receipt.blockNumber}. Delegation revocation deferred until the burst leg settles.`);
      return { token: launchEvent.token, pool: launchEvent.pool, ctx, receipt };
    }
    await finalizeLunch7702Launch(ctx, launchEvent, receipt, push);
    return { token: launchEvent.token, pool: launchEvent.pool, ctx, receipt };
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Lunch 7702 execution failed: ${formatError(error)}`);
    return null;
  }
}

async function finalizeLunch7702Launch(ctx, launchEvent, receipt, push) {
    const token = new Contract(launchEvent.token, PONS_TOKEN_ABI, state.provider);
    const decimals = await token.decimals();
    for (const buyer of ctx.buyers) {
      inputs[`lunchBuyerReceived${buyer.index}`].value = ethers.formatUnits(await token.balanceOf(buyer.account), decimals);
      inputs[`lunchBuyerStatus${buyer.index}`].value = `Confirmed block ${receipt.blockNumber}; revoking`;
    }
    push(`Launch and buys confirmed atomically in block ${receipt.blockNumber}. Revoking buyer delegations...`);
    const revocations = [];
    for (const wallet of ctx.wallets) {
      revocations.push(await wallet.authorize({ address: ethers.ZeroAddress, chainId: BigInt(LUNCH_CHAIN.id), nonce: await state.provider.getTransactionCount(wallet.address, "pending") }));
    }
    const revokeTx = await ctx.owner.sendTransaction({ to: ctx.owner.address, value: 0n, authorizationList: revocations });
    push(`Revocation submitted: ${lunchExplorerTx(revokeTx.hash)}`);
    await revokeTx.wait();
    for (const buyer of ctx.buyers) {
      inputs[`lunchBuyerStatus${buyer.index}`].value = "Buy confirmed; delegation revoked";
      inputs[`lunchBuyerKey${buyer.index}`].value = "";
    }
    push(`Complete. Token: ${lunchExplorerAddress(launchEvent.token)}. Every router call originated from its listed buyer wallet.`);
}

async function buildLunch7702Context() {
  requireSigner();
  await ensureLunchChain();
  if (state.walletMode !== "RPC" || !(state.signer instanceof Wallet)) throw new Error("Connect the coordinator owner using Connect RPC Wallet; MetaMask cannot assemble this multi-authorization transaction.");
  const owner = state.signer;
  const coordinator = getLunch7702Coordinator(owner);
  if ((await coordinator.owner()).toLowerCase() !== owner.address.toLowerCase()) throw new Error("Connected RPC wallet is not the 7702 coordinator owner.");
  const launcher = getLunchFactory(state.provider);
  const launchFee = await launcher.launchFeeWei();
  const enforcedSupply = await launcher.enforcedSupply();
  const name = inputs.lunchTokenName.value.trim();
  const symbol = inputs.lunchTokenSymbol.value.trim();
  if (!name || !symbol) throw new Error("Lunch token name and symbol are required.");
  const totalSupply = parseTokenUnits(inputs.lunchTotalSupply.value, 18, "Lunch total supply");
  if (enforcedSupply > 0n && totalSupply !== enforcedSupply) throw new Error("Lunch total supply does not match enforced supply.");
  const minutes = Number(cleanAmount(inputs.lunchDeadline.value || "5", "Lunch deadline"));
  if (minutes <= 0 || minutes > 60) throw new Error("Deadline must be between 0 and 60 minutes.");
  const userSalt = normalizeSalt(inputs.lunchSalt.value.trim());
  if (!inputs.lunchSalt.value.trim()) inputs.lunchSalt.value = userSalt;
  const params = {
    name, symbol, totalSupply, fee: 10000,
    meta: { image: inputs.lunchImage.value.trim(), banner: inputs.lunchBanner.value.trim(), description: inputs.lunchDescription.value.trim(), website: inputs.lunchWebsite.value.trim(), twitter: inputs.lunchTwitter.value.trim(), telegram: inputs.lunchTelegram.value.trim() },
    userSalt, deadline: BigInt(Math.floor(Date.now() / 1000) + Math.floor(minutes * 60)),
  };
  const predictedToken = await launcher.predictTokenAddress(name, symbol, totalSupply, LUNCH_CHAIN.coordinator7702, userSalt);
  const wallets = [];
  const buyers = [];
  const authorizationList = [];
  const seen = new Set();
  const expectedCode = `0xef0100${LUNCH_CHAIN.delegate7702.slice(2).toLowerCase()}`;
  for (let index = 0; index < 5; index++) {
    if (!inputs[`lunchBuyerEnabled${index}`].checked) continue;
    const rawKey = inputs[`lunchBuyerKey${index}`].value.trim();
    if (!rawKey) throw new Error(`Buyer ${index + 1} private key is required.`);
    const normalizedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedKey)) throw new Error(`Buyer ${index + 1} private key must be a 64-character hex string.`);
    const wallet = new Wallet(normalizedKey, state.provider);
    if (seen.has(wallet.address.toLowerCase())) throw new Error(`Duplicate buyer wallet ${wallet.address}.`);
    seen.add(wallet.address.toLowerCase());
    wallets.push(wallet);
    inputs[`lunchBuyerAddress${index}`].value = wallet.address;
    const amountIn = parseEthInput(inputs[`lunchBuyerAmount${index}`].value, `Buyer ${index + 1} amount`);
    const amountOutMinimum = parseTokenUnits(inputs[`lunchBuyerMinOut${index}`].value, 18, `Buyer ${index + 1} minimum output`);
    if (amountIn === 0n || amountOutMinimum === 0n) throw new Error(`Buyer ${index + 1} amount and minimum output must be nonzero.`);
    const balance = await state.provider.getBalance(wallet.address);
    inputs[`lunchBuyerBalance${index}`].value = `${ethers.formatEther(balance)} ETH`;
    if (balance < amountIn) throw new Error(`Buyer ${index + 1} lacks ETH for its own purchase.`);
    const code = (await state.provider.getCode(wallet.address)).toLowerCase();
    if (code !== "0x" && code !== expectedCode) throw new Error(`Buyer ${index + 1} has an incompatible existing delegation.`);
    const nonce = code === expectedCode ? await getLunch7702Delegate(wallet.address, state.provider).executionNonce() : 0n;
    const value = { token: predictedToken, fee: 10000, amountIn, amountOutMinimum, sqrtPriceLimitX96: 0n, deadline: params.deadline, nonce };
    const signature = await wallet.signTypedData(
      { name: "Lunch7702Buyer", version: "1", chainId: BigInt(LUNCH_CHAIN.id), verifyingContract: wallet.address },
      { AuthorizedBuy: [
        { name: "token", type: "address" }, { name: "fee", type: "uint24" }, { name: "amountIn", type: "uint256" },
        { name: "amountOutMinimum", type: "uint256" }, { name: "sqrtPriceLimitX96", type: "uint160" },
        { name: "deadline", type: "uint256" }, { name: "nonce", type: "uint256" },
      ] }, value,
    );
    buyers.push({ index, account: wallet.address, amountIn, amountOutMinimum, sqrtPriceLimitX96: 0n, nonce, signature });
    authorizationList.push(await wallet.authorize({ address: LUNCH_CHAIN.delegate7702, chainId: BigInt(LUNCH_CHAIN.id), nonce: await state.provider.getTransactionCount(wallet.address, "pending") }));
  }
  if (!buyers.length) throw new Error("Enable at least one buyer wallet.");
  const encodedBuyers = buyers.map(({ index, ...buyer }) => buyer);
  const data = new ethers.Interface(LUNCH_7702_COORDINATOR_ABI).encodeFunctionData("launchAndBuy", [params, encodedBuyers]);
  const pendingDelegation = wallets.length !== 0 && (await Promise.all(wallets.map(async (wallet) => (await state.provider.getCode(wallet.address)).toLowerCase() !== expectedCode))).some(Boolean);
  return { owner, coordinator, launcher, launchFee, params, predictedToken, wallets, buyers, pendingDelegation, request: { to: LUNCH_CHAIN.coordinator7702, data, value: launchFee, authorizationList } };
}

function getLunch7702Coordinator(signerOrProvider) {
  return new Contract(LUNCH_CHAIN.coordinator7702, LUNCH_7702_COORDINATOR_ABI, signerOrProvider);
}

function getLunch7702Delegate(address, signerOrProvider) {
  return new Contract(address, LUNCH_7702_DELEGATE_ABI, signerOrProvider);
}

async function loadLunchBurstStatus() {
  const resultEl = document.querySelector("#lunchBurstContractResult");
  try {
    requireSigner();
    await ensureLunchChain();
    const primary = await state.signer.getAddress();
    const launcher = getLunchFactory(state.signer);
    lunchState.factory = launcher;
    const [block, balance, factoryAddress, npmAddress, xToken, launchFee, enforcedSupply, allTokensLength] = await Promise.all([
      state.provider.getBlockNumber(),
      state.provider.getBalance(primary),
      launcher.factory(),
      launcher.npm(),
      launcher.xToken(),
      launcher.launchFeeWei(),
      launcher.enforcedSupply(),
      launcher.allTokensLength(),
    ]);
    lunchState.factoryAddress = factoryAddress;
    lunchState.npm = npmAddress;
    lunchState.xToken = xToken;
    lunchState.launchFee = launchFee;
    lunchState.enforcedSupply = enforcedSupply;
    inputs.lunchBurstCurrentBlock.value = String(block);
    inputs.lunchBurstPrimaryWallet.value = primary;
    inputs.lunchBurstPrimaryBalance.value = `${ethers.formatEther(balance)} ETH`;
    inputs.lunchBurstLaunchFee.value = `${ethers.formatEther(launchFee)} ETH`;
    inputs.lunchBurstFactory.value = factoryAddress;
    inputs.lunchBurstNpm.value = npmAddress;
    inputs.lunchBurstXToken.value = xToken;
    inputs.lunchBurstEnforcedSupply.value = `${ethers.formatUnits(enforcedSupply, 18)} tokens`;
    if (enforcedSupply > 0n) inputs.lunchBurstTotalSupply.value = ethers.formatUnits(enforcedSupply, 18);
    resultEl.textContent = [
      `Required function: launchWithMetaSalt`,
      `Router function: exactInputSingle`,
      `allTokensLength: ${allTokensLength}`,
      `Mode: burst - launch confirms first, then buyer wallet txs are broadcast in parallel`,
      `Atomic: no. Same-block inclusion: not guaranteed.`,
    ].join("\n");
    log("Loaded Lunch burst status.");
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Lunch burst status failed: ${formatError(error)}`);
  }
}

async function reviewLunchBurstLaunch() {
  const resultEl = document.querySelector("#lunchBurstReviewResult");
  try {
    requireSigner();
    await ensureLunchChain();
    const ctx = await buildLunchBurstContext();
    await ctx.launcher.launchWithMetaSalt.staticCall(ctx.name, ctx.symbol, ctx.totalSupply, ctx.fee, ctx.initialBuyFlag, ctx.meta, ctx.userSalt, { value: ctx.launchValue });
    const launchGas = await ctx.launcher.launchWithMetaSalt.estimateGas(ctx.name, ctx.symbol, ctx.totalSupply, ctx.fee, ctx.initialBuyFlag, ctx.meta, ctx.userSalt, { value: ctx.launchValue });
    lunchState.predictedToken = ctx.predictedToken;
    for (const buyer of ctx.buyers) {
      inputs[`lunchBurstBuyerAddress${buyer.index}`].value ||= buyer.wallet.address;
      inputs[`lunchBurstBuyerBalance${buyer.index}`].value = `${ethers.formatEther(buyer.balance)} ETH`;
      inputs[`lunchBurstBuyerGas${buyer.index}`].value = "estimated after launch";
      inputs[`lunchBurstBuyerStatus${buyer.index}`].value = "Ready for burst";
    }
    resultEl.textContent = [
      `Predicted token: ${ctx.predictedToken}`,
      `Launch function: launchWithMetaSalt(string,string,uint256,uint24,uint256,Meta,bytes32)`,
      `Dev buy in launch tx: ${ethers.formatEther(ctx.devBuy)} ETH`,
      `Launch fee: ${ethers.formatEther(ctx.launchFee)} ETH`,
      `Launch gas estimate: ${launchGas}`,
      `Burst buyer wallets: ${ctx.buyers.map((buyer) => short(buyer.wallet.address)).join(", ") || "none"}`,
      `Burst buy total: ${ethers.formatEther(ctx.buyerValue)} ETH from buyer wallet balances`,
      `Minimum outputs: ${ctx.buyers.map((buyer) => ethers.formatUnits(buyer.minOut, 18)).join(", ") || "none"}`,
      `Execution: launcher tx confirms first, token is decoded from receipt, then all buyer txs are broadcast in parallel.`,
      `Atomic: no. Same-block inclusion: not guaranteed.`,
    ].join("\n");
    log(`Lunch burst review OK. Predicted token ${ctx.predictedToken}.`);
  } catch (error) {
    resultEl.textContent = formatError(error);
    log(`Lunch burst review failed: ${formatError(error)}`);
  }
}

async function executeLunchBurstLaunch() {
  const resultEl = document.querySelector("#lunchBurstExecutionResult");
  try {
    requireSigner();
    await ensureLunchChain();
    const ctx = await buildLunchBurstContext();
    const steps = [];
    const push = (line) => {
      steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
      resultEl.textContent = steps.join("\n");
      log(`Lunch burst: ${line}`);
    };

    push("Simulating Lunch.fun launch...");
    await ctx.launcher.launchWithMetaSalt.staticCall(ctx.name, ctx.symbol, ctx.totalSupply, ctx.fee, ctx.initialBuyFlag, ctx.meta, ctx.userSalt, { value: ctx.launchValue });
    const launchGas = await ctx.launcher.launchWithMetaSalt.estimateGas(ctx.name, ctx.symbol, ctx.totalSupply, ctx.fee, ctx.initialBuyFlag, ctx.meta, ctx.userSalt, { value: ctx.launchValue });
    push(`Launch simulation passed. Estimated gas ${launchGas}.`);

    push("Awaiting launcher wallet signature...");
    const launchTx = await ctx.launcher.launchWithMetaSalt(ctx.name, ctx.symbol, ctx.totalSupply, ctx.fee, ctx.initialBuyFlag, ctx.meta, ctx.userSalt, {
      value: ctx.launchValue,
      gasLimit: (launchGas * 125n) / 100n,
    });
    push(`Launch submitted: ${lunchExplorerTx(launchTx.hash)}`);
    const launchReceipt = await launchTx.wait();
    if (launchReceipt.status !== 1) throw new Error("Lunch burst launch transaction reverted.");

    const launchEvent = decodeLunchLaunchEvent(launchReceipt.logs);
    if (!launchEvent) throw new Error("V3TokenLaunched event was not found in the launch receipt.");
    lunchState.launchedToken = launchEvent.token;
    lunchState.launchedPool = launchEvent.pool;
    await saveLaunchedTokenToProject(launchEvent.token, "Lunch Burst");
    push(`Launch confirmed block ${launchReceipt.blockNumber}. Token ${lunchExplorerAddress(launchEvent.token)}`);
    push(`Pool detected: ${lunchExplorerAddress(launchEvent.pool)}`);

    if (!ctx.buyers.length) {
      push("No burst buyers enabled. Done after launch.");
      return;
    }

    const token = new Contract(launchEvent.token, PONS_TOKEN_ABI, state.provider);
    const decimals = await token.decimals();
    push(`Estimating ${ctx.buyers.length} burst buy transaction(s) after token detection...`);
    const prepared = await Promise.all(ctx.buyers.map(async (buyer) => prepareLunchBurstBuy(ctx, buyer, launchEvent.token, token, decimals)));
    for (const item of prepared) {
      inputs[`lunchBurstBuyerGas${item.buyer.index}`].value = `${item.gas}`;
      inputs[`lunchBurstBuyerReceived${item.buyer.index}`].value = `expected ${ethers.formatUnits(item.quote, decimals)}`;
      inputs[`lunchBurstBuyerStatus${item.buyer.index}`].value = "Ready to broadcast";
    }

    push("Broadcasting all burst buyer transactions in parallel...");
    const submissions = await Promise.allSettled(prepared.map(async (item) => {
      const router = new Contract(ctx.routerAddress, [PONS_ROUTER_ABI[0]], item.buyer.wallet);
      const tx = await router.exactInputSingle(item.params, {
        value: item.buyer.amountIn,
        gasLimit: (item.gas * 125n) / 100n,
      });
      inputs[`lunchBurstBuyerHash${item.buyer.index}`].value = tx.hash;
      inputs[`lunchBurstBuyerStatus${item.buyer.index}`].value = "Submitted";
      return { ...item, tx };
    }));
    const accepted = [];
    for (const [position, result] of submissions.entries()) {
      const buyer = prepared[position].buyer;
      if (result.status === "fulfilled") {
        accepted.push(result.value);
        push(`Buyer ${buyer.index + 1} submitted: ${lunchExplorerTx(result.value.tx.hash)}`);
      } else {
        inputs[`lunchBurstBuyerStatus${buyer.index}`].value = "Submit failed";
        push(`Buyer ${buyer.index + 1} submit failed: ${formatError(result.reason)}`);
      }
    }

    push(`Waiting for ${accepted.length} submitted burst receipt(s)...`);
    const receipts = await Promise.allSettled(accepted.map(async (item) => {
      const receipt = await item.tx.wait();
      const after = await token.balanceOf(item.buyer.recipient);
      return { ...item, receipt, received: after - item.before };
    }));
    for (const result of receipts) {
      if (result.status === "fulfilled") {
        const { buyer, receipt, received } = result.value;
        inputs[`lunchBurstBuyerStatus${buyer.index}`].value = receipt.status === 1 ? `Confirmed block ${receipt.blockNumber}` : "Reverted";
        inputs[`lunchBurstBuyerReceived${buyer.index}`].value = ethers.formatUnits(received, decimals);
      } else {
        push(`Receipt wait failed: ${formatError(result.reason)}`);
      }
    }
    push("Burst flow complete. Submitted buyer txs were parallel, but block ordering is determined by the network.");
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Lunch burst execution failed: ${formatError(error)}`);
  }
}

function updateLunchComboMode() {
  const mode = document.querySelector('input[name="lunchComboMode"]:checked').value;
  document.querySelector("#lunchComboAtomicSection").style.display = mode === "burst" ? "none" : "";
  document.querySelector("#lunchComboBurstSection").style.display = mode === "atomic" ? "none" : "";
  document.querySelector("#lunchComboAtomicButtons").style.display = mode === "chained" ? "none" : "";
  document.querySelector("#lunchComboBurstButtons").style.display = mode === "chained" ? "none" : "";
  document.querySelector("#lunchComboChainedButtons").style.display = mode === "chained" ? "" : "none";
  document.querySelector("#lunchComboChainedHint").style.display = mode === "chained" ? "" : "none";
}

function mirrorLunchComboTokenForm() {
  const fields = ["TokenName", "TokenSymbol", "TotalSupply", "FeeTier", "Image", "Banner", "Description", "Website", "Twitter", "Telegram", "Salt"];
  for (const field of fields) {
    inputs[`lunch${field}`].value = inputs[`lunchCombo${field}`].value;
    inputs[`lunchBurst${field}`].value = inputs[`lunchCombo${field}`].value;
  }
  inputs.lunchDeadline.value = inputs.lunchComboDeadline.value;
  inputs.lunchBurstDevBuyEth.value = inputs.lunchComboDevBuyEth.value;
}

function mirrorLunchComboAtomicBuyerRows() {
  for (let index = 0; index < 5; index++) {
    inputs[`lunchBuyerEnabled${index}`].checked = inputs[`lunchComboBuyerEnabled${index}`].checked;
    inputs[`lunchBuyerKey${index}`].value = inputs[`lunchComboBuyerKey${index}`].value;
    inputs[`lunchBuyerAddress${index}`].value = inputs[`lunchComboBuyerAddress${index}`].value;
    inputs[`lunchBuyerAmount${index}`].value = inputs[`lunchComboBuyerAmount${index}`].value;
    inputs[`lunchBuyerMinOut${index}`].value = inputs[`lunchComboBuyerMinOut${index}`].value;
  }
}

function copyLunchAtomicBuyerStatusToCombo() {
  for (let index = 0; index < 5; index++) {
    for (const field of ["Address", "Balance", "Gas", "Status", "Hash", "Received"]) {
      inputs[`lunchComboBuyer${field}${index}`].value = inputs[`lunchBuyer${field}${index}`].value;
    }
  }
}

function mirrorLunchComboBurstBuyerRows() {
  for (let index = 0; index < 25; index++) {
    inputs[`lunchBurstBuyerEnabled${index}`].checked = inputs[`lunchComboBurstBuyerEnabled${index}`].checked;
    inputs[`lunchBurstBuyerKey${index}`].value = inputs[`lunchComboBurstBuyerKey${index}`].value;
    inputs[`lunchBurstBuyerAddress${index}`].value = inputs[`lunchComboBurstBuyerAddress${index}`].value;
    inputs[`lunchBurstBuyerAmount${index}`].value = inputs[`lunchComboBurstBuyerAmount${index}`].value;
    inputs[`lunchBurstBuyerMinOut${index}`].value = inputs[`lunchComboBurstBuyerMinOut${index}`].value;
  }
}

function copyLunchBurstBuyerStatusToCombo() {
  for (let index = 0; index < 25; index++) {
    for (const field of ["Address", "Balance", "Gas", "Status", "Hash", "Received"]) {
      inputs[`lunchComboBurstBuyer${field}${index}`].value = inputs[`lunchBurstBuyer${field}${index}`].value;
    }
  }
}

async function loadLunchComboStatus() {
  const atomic = document.querySelector("#lunchComboModeAtomic").checked;
  await (atomic ? loadLunchStatus() : loadLunchBurstStatus());
  const source = atomic ? "lunch" : "lunchBurst";
  inputs.lunchComboCurrentBlock.value = inputs[`${source}CurrentBlock`].value;
  inputs.lunchComboPrimaryWallet.value = inputs[`${source}PrimaryWallet`].value;
  inputs.lunchComboPrimaryBalance.value = inputs[`${source}PrimaryBalance`].value;
  const resultEl = document.querySelector("#lunchComboContractResult");
  const sourceEl = document.querySelector(`#${source}ContractResult`);
  resultEl.textContent = sourceEl ? sourceEl.textContent : "";
}

async function reviewLunchComboAtomic() {
  mirrorLunchComboTokenForm();
  mirrorLunchComboAtomicBuyerRows();
  await reviewLunch7702Launch();
  copyLunchAtomicBuyerStatusToCombo();
  document.querySelector("#lunchComboReviewResult").textContent = document.querySelector("#lunchReviewResult").textContent;
}

async function executeLunchComboAtomic() {
  mirrorLunchComboTokenForm();
  mirrorLunchComboAtomicBuyerRows();
  await executeLunch7702Launch();
  copyLunchAtomicBuyerStatusToCombo();
  document.querySelector("#lunchComboExecutionResult").textContent = document.querySelector("#lunchExecutionResult").textContent;
}

async function reviewLunchComboBurst() {
  mirrorLunchComboTokenForm();
  mirrorLunchComboBurstBuyerRows();
  await reviewLunchBurstLaunch();
  copyLunchBurstBuyerStatusToCombo();
  document.querySelector("#lunchComboReviewResult").textContent = document.querySelector("#lunchBurstReviewResult").textContent;
}

async function executeLunchComboBurst() {
  mirrorLunchComboTokenForm();
  mirrorLunchComboBurstBuyerRows();
  await executeLunchBurstLaunch();
  copyLunchBurstBuyerStatusToCombo();
  document.querySelector("#lunchComboExecutionResult").textContent = document.querySelector("#lunchBurstExecutionResult").textContent;
}

async function reviewLunchComboChained() {
  const resultEl = document.querySelector("#lunchComboReviewResult");
  const steps = [];
  const push = (line) => {
    steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    resultEl.textContent = steps.join("\n");
    log(`Lunch combo chained review: ${line}`);
  };
  try {
    mirrorLunchComboTokenForm();
    mirrorLunchComboAtomicBuyerRows();
    mirrorLunchComboBurstBuyerRows();

    push("Validating atomic leg (launch plus EIP-7702 buyer wallets)...");
    await reviewLunch7702Launch();
    copyLunchAtomicBuyerStatusToCombo();
    push(document.querySelector("#lunchReviewResult").textContent);

    const atomicContext = await buildLunch7702Context();
    push("Pre-signing burst leg locally against the predicted token (not broadcast)...");
    const presignedBurst = await preparePresignedLunchBurstBuys(atomicContext.predictedToken, push);
    copyLunchBurstBuyerStatusToCombo();

    push(`Validation complete. ${presignedBurst.length} burst transaction(s) ready to broadcast once the atomic leg confirms.`);
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Lunch combo chained review failed: ${formatError(error)}`);
  }
}

async function executeLunchComboChained() {
  const resultEl = document.querySelector("#lunchComboExecutionResult");
  const steps = [];
  const push = (line) => {
    steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    resultEl.textContent = steps.join("\n");
    log(`Lunch combo chained: ${line}`);
  };
  try {
    mirrorLunchComboTokenForm();
    mirrorLunchComboAtomicBuyerRows();
    mirrorLunchComboBurstBuyerRows();

    push("Preparing and locally signing burst transactions for the predicted token...");
    const atomicContext = await buildLunch7702Context();
    const presignedBurst = await preparePresignedLunchBurstBuys(atomicContext.predictedToken, push);

    push("Starting atomic leg: launch plus EIP-7702 buyer wallets in one transaction...");
    const launched = await executeLunch7702Launch({ context: atomicContext, deferRevocation: true });
    copyLunchAtomicBuyerStatusToCombo();
    push(document.querySelector("#lunchExecutionResult").textContent);
    if (!launched) throw new Error("Atomic leg failed or was aborted; burst leg was not started.");
    if (launched.token.toLowerCase() !== atomicContext.predictedToken.toLowerCase()) {
      throw new Error(`Launched token ${launched.token} did not match pre-signed target ${atomicContext.predictedToken}; burst transactions were not broadcast.`);
    }
    push(`Atomic leg complete. Token ${lunchExplorerAddress(launched.token)}.`);

    push("Atomic receipt confirmed. Broadcasting all pre-signed burst transactions directly to the Robinhood sequencer...");
    await broadcastPresignedLunchBurstBuys(presignedBurst, launched.token, push);
    copyLunchBurstBuyerStatusToCombo();

    push("Burst transactions settled. Revoking EIP-7702 buyer delegations...");
    await finalizeLunch7702Launch(
      launched.ctx,
      { token: launched.token, pool: launched.pool },
      launched.receipt,
      push,
    );
    copyLunchAtomicBuyerStatusToCombo();
    push("Chained flow complete.");
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Lunch combo chained execution failed: ${formatError(error)}`);
  }
}

async function preparePresignedLunchBurstBuys(tokenAddress, push) {
  const primary = await state.signer.getAddress();
  const routerAddress = inputs.lunchBurstRouter.value.trim() || LUNCH_CHAIN.router;
  if (!ethers.isAddress(routerAddress)) throw new Error("Lunch burst router is invalid.");
  const fee = Number(parseUintInput(inputs.lunchBurstFeeTier.value || "10000", "Lunch burst fee tier"));
  if (fee !== 10000) throw new Error("Lunch launcher requires fee tier 10000.");
  if ((await state.provider.getCode(tokenAddress)) !== "0x") {
    throw new Error(`Predicted token ${tokenAddress} already has code; refusing to pre-sign burst transactions.`);
  }

  const launcher = getLunchFactory(state.provider);
  const [xToken, feeData, buyers] = await Promise.all([
    launcher.xToken(),
    state.provider.getFeeData(),
    getLunchBurstBuyerRows(primary),
  ]);
  if (!buyers.length) {
    push("No burst buyers enabled. Only the atomic leg will execute.");
    return [];
  }

  const baseMaxFee = feeData.maxFeePerGas ?? feeData.gasPrice;
  if (baseMaxFee == null || baseMaxFee <= 0n) throw new Error("RPC did not return a usable gas fee for pre-signing.");
  const maxFeePerGas = (baseMaxFee * LUNCH_PRESIGNED_FEE_BUFFER_BPS) / 10000n;
  const reportedPriorityFee = feeData.maxPriorityFeePerGas ?? 0n;
  const maxPriorityFeePerGas = reportedPriorityFee > maxFeePerGas ? maxFeePerGas : reportedPriorityFee;
  const routerInterface = new ethers.Interface([PONS_ROUTER_ABI[0]]);

  const prepared = await Promise.all(buyers.map(async (buyer) => {
    const nonce = await state.provider.getTransactionCount(buyer.wallet.address, "pending");
    const maximumGasCost = LUNCH_PRESIGNED_BURST_GAS_LIMIT * maxFeePerGas;
    if (buyer.balance < buyer.amountIn + maximumGasCost) {
      throw new Error(
        `Burst buyer ${buyer.index + 1} needs at least ${ethers.formatEther(buyer.amountIn + maximumGasCost)} ETH for its buy and pre-signed gas ceiling.`,
      );
    }
    const params = {
      tokenIn: xToken,
      tokenOut: tokenAddress,
      fee,
      recipient: buyer.recipient,
      amountIn: buyer.amountIn,
      amountOutMinimum: buyer.minOut,
      sqrtPriceLimitX96: 0n,
    };
    const raw = await buyer.wallet.signTransaction({
      chainId: LUNCH_CHAIN.id,
      type: 2,
      nonce,
      to: routerAddress,
      data: routerInterface.encodeFunctionData("exactInputSingle", [params]),
      value: buyer.amountIn,
      gasLimit: LUNCH_PRESIGNED_BURST_GAS_LIMIT,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
    const hash = ethers.Transaction.from(raw).hash;
    inputs[`lunchBurstBuyerGas${buyer.index}`].value = `${LUNCH_PRESIGNED_BURST_GAS_LIMIT} ceiling`;
    inputs[`lunchBurstBuyerReceived${buyer.index}`].value = `minimum ${ethers.formatUnits(buyer.minOut, 18)}`;
    inputs[`lunchBurstBuyerStatus${buyer.index}`].value = "Pre-signed locally; not broadcast";
    inputs[`lunchBurstBuyerHash${buyer.index}`].value = hash;
    return { buyer, params, raw, hash, nonce };
  }));

  push(
    `Pre-signed ${prepared.length} burst transaction(s) in browser memory for ${lunchExplorerAddress(tokenAddress)}. ` +
    `Gas ceiling ${LUNCH_PRESIGNED_BURST_GAS_LIMIT}; max fee ${ethers.formatUnits(maxFeePerGas, "gwei")} gwei.`,
  );
  return prepared;
}

async function broadcastPresignedLunchBurstBuys(prepared, tokenAddress, push) {
  if (!prepared.length) return;
  const sequencer = new JsonRpcProvider(
    LUNCH_SEQUENCER_RPC,
    { chainId: LUNCH_CHAIN.id, name: "robinhood" },
    { staticNetwork: true, batchMaxCount: 1 },
  );
  const submissions = await Promise.allSettled(prepared.map(async (item) => {
    let route = "direct sequencer";
    try {
      const returnedHash = await sequencer.send("eth_sendRawTransaction", [item.raw]);
      if (returnedHash.toLowerCase() !== item.hash.toLowerCase()) {
        throw new Error(`Sequencer returned unexpected transaction hash ${returnedHash}.`);
      }
    } catch (sequencerError) {
      route = "configured RPC fallback";
      try {
        const returnedHash = await state.provider.send("eth_sendRawTransaction", [item.raw]);
        if (returnedHash.toLowerCase() !== item.hash.toLowerCase()) {
          throw new Error(`RPC returned unexpected transaction hash ${returnedHash}.`);
        }
      } catch (fallbackError) {
        const combined = new Error(
          `Direct sequencer failed: ${formatError(sequencerError)}. Configured RPC fallback failed: ${formatError(fallbackError)}`,
        );
        combined.sequencerError = sequencerError;
        combined.fallbackError = fallbackError;
        throw combined;
      }
    }
    inputs[`lunchBurstBuyerStatus${item.buyer.index}`].value = `Submitted via ${route}`;
    return { ...item, route };
  }));

  const accepted = [];
  for (const [position, result] of submissions.entries()) {
    const item = prepared[position];
    if (result.status === "fulfilled") {
      accepted.push(result.value);
      push(`Buyer ${item.buyer.index + 1} submitted via ${result.value.route}: ${lunchExplorerTx(item.hash)}`);
    } else {
      inputs[`lunchBurstBuyerStatus${item.buyer.index}`].value = "Submit failed";
      push(`Buyer ${item.buyer.index + 1} submit failed: ${formatError(result.reason)}`);
    }
  }
  if (accepted.length !== prepared.length) {
    throw new Error(`${prepared.length - accepted.length} pre-signed burst transaction(s) could not be submitted; delegation revocation was paused.`);
  }

  push(`Waiting for ${accepted.length} pre-signed burst receipt(s) before creating nonce-safe revocations...`);
  const token = new Contract(tokenAddress, PONS_TOKEN_ABI, state.provider);
  const decimals = await token.decimals();
  const receipts = await Promise.allSettled(accepted.map(async (item) => {
    const receipt = await state.provider.waitForTransaction(item.hash);
    if (!receipt) throw new Error(`No receipt returned for ${item.hash}.`);
    const received = await token.balanceOf(item.buyer.recipient);
    return { ...item, receipt, received };
  }));

  let failed = 0;
  for (const [position, result] of receipts.entries()) {
    const item = accepted[position];
    if (result.status === "fulfilled") {
      const { receipt, received } = result.value;
      const ok = receipt.status === 1;
      if (!ok) failed += 1;
      inputs[`lunchBurstBuyerStatus${item.buyer.index}`].value = ok ? `Confirmed block ${receipt.blockNumber}` : "Reverted";
      inputs[`lunchBurstBuyerReceived${item.buyer.index}`].value = ethers.formatUnits(received, decimals);
      push(`Buyer ${item.buyer.index + 1} ${ok ? "confirmed" : "reverted"} in block ${receipt.blockNumber}.`);
    } else {
      failed += 1;
      inputs[`lunchBurstBuyerStatus${item.buyer.index}`].value = "Receipt wait failed";
      push(`Buyer ${item.buyer.index + 1} receipt wait failed: ${formatError(result.reason)}`);
    }
  }
  if (failed) throw new Error(`${failed} burst transaction(s) failed or could not be confirmed; delegation revocation was paused for manual review.`);
}

async function prepareLunchBurstBuy(ctx, buyer, tokenAddress, token, decimals) {
  const router = new Contract(ctx.routerAddress, [PONS_ROUTER_ABI[0]], buyer.wallet);
  const params = {
    tokenIn: ctx.xToken,
    tokenOut: tokenAddress,
    fee: ctx.fee,
    recipient: buyer.recipient,
    amountIn: buyer.amountIn,
    amountOutMinimum: buyer.minOut,
    sqrtPriceLimitX96: 0n,
  };
  const before = await token.balanceOf(buyer.recipient);
  const quote = await router.exactInputSingle.staticCall(params, { value: buyer.amountIn });
  if (quote < buyer.minOut) throw new Error(`Buyer ${buyer.index + 1} quote ${ethers.formatUnits(quote, decimals)} is below minimum.`);
  const gas = await router.exactInputSingle.estimateGas(params, { value: buyer.amountIn });
  return { buyer, params, before, quote, gas };
}

async function buildLunchBurstContext() {
  const primary = await state.signer.getAddress();
  const launcher = getLunchFactory(state.signer);
  const [launchFee, enforcedSupply, xToken] = await Promise.all([
    launcher.launchFeeWei(),
    launcher.enforcedSupply(),
    launcher.xToken(),
  ]);
  const name = inputs.lunchBurstTokenName.value.trim();
  const symbol = inputs.lunchBurstTokenSymbol.value.trim();
  if (!name || !symbol) throw new Error("Lunch burst token name and symbol are required.");
  const totalSupply = parseTokenUnits(inputs.lunchBurstTotalSupply.value, 18, "Lunch burst total supply");
  if (enforcedSupply > 0n && totalSupply !== enforcedSupply) {
    throw new Error(`Lunch burst total supply must equal enforced supply ${ethers.formatUnits(enforcedSupply, 18)}.`);
  }
  const fee = Number(parseUintInput(inputs.lunchBurstFeeTier.value || "10000", "Lunch burst fee tier"));
  if (fee !== 10000) throw new Error("Lunch launcher requires fee tier 10000.");
  const routerAddress = inputs.lunchBurstRouter.value.trim() || LUNCH_CHAIN.router;
  if (!ethers.isAddress(routerAddress)) throw new Error("Lunch burst router is invalid.");
  const devBuy = parseEthInput(inputs.lunchBurstDevBuyEth.value || "0", "Lunch burst dev buy");
  const initialBuyFlag = devBuy > 0n ? 1n : 0n;
  const userSalt = normalizeSalt(inputs.lunchBurstSalt.value.trim());
  if (!inputs.lunchBurstSalt.value.trim()) inputs.lunchBurstSalt.value = userSalt;
  const meta = {
    image: inputs.lunchBurstImage.value.trim(),
    banner: inputs.lunchBurstBanner.value.trim(),
    description: inputs.lunchBurstDescription.value.trim(),
    website: inputs.lunchBurstWebsite.value.trim(),
    twitter: inputs.lunchBurstTwitter.value.trim(),
    telegram: inputs.lunchBurstTelegram.value.trim(),
  };
  const predictedToken = await launcher.predictTokenAddress(name, symbol, totalSupply, primary, userSalt);
  const launchValue = launchFee + devBuy;
  const primaryBalance = await state.provider.getBalance(primary);
  if (primaryBalance <= launchValue) throw new Error(`Launcher balance is below ${ethers.formatEther(launchValue)} ETH plus gas.`);
  const buyers = await getLunchBurstBuyerRows(primary);
  const buyerValue = buyers.reduce((sum, buyer) => sum + buyer.amountIn, 0n);
  return { primary, launcher, launchFee, enforcedSupply, xToken, name, symbol, totalSupply, fee, routerAddress, devBuy, initialBuyFlag, userSalt, meta, predictedToken, launchValue, buyers, buyerValue };
}

async function getLunchBurstBuyerRows(primary) {
  const rows = [];
  const seenWallets = new Set([primary.toLowerCase()]);
  const seenRecipients = new Set();
  for (let index = 0; index < 25; index++) {
    if (!inputs[`lunchBurstBuyerEnabled${index}`].checked) continue;
    const rawKey = inputs[`lunchBurstBuyerKey${index}`].value.trim();
    if (!rawKey) throw new Error(`Burst buyer ${index + 1} private key is required.`);
    const normalizedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedKey)) throw new Error(`Burst buyer ${index + 1} private key must be a 64-character hex string.`);
    const wallet = new Wallet(normalizedKey, state.provider);
    const walletKey = wallet.address.toLowerCase();
    if (seenWallets.has(walletKey)) throw new Error(`Duplicate or launcher burst wallet: ${wallet.address}`);
    seenWallets.add(walletKey);
    const recipient = inputs[`lunchBurstBuyerAddress${index}`].value.trim() || wallet.address;
    if (!ethers.isAddress(recipient) || recipient === ethers.ZeroAddress) throw new Error(`Burst buyer ${index + 1} recipient is invalid.`);
    const recipientKey = recipient.toLowerCase();
    if (seenRecipients.has(recipientKey)) throw new Error(`Duplicate burst recipient: ${recipient}`);
    seenRecipients.add(recipientKey);
    const amountIn = parseEthInput(inputs[`lunchBurstBuyerAmount${index}`].value, `Burst buyer ${index + 1} amount`);
    const minOut = parseTokenUnits(inputs[`lunchBurstBuyerMinOut${index}`].value, 18, `Burst buyer ${index + 1} minimum output`);
    if (amountIn <= 0n || minOut <= 0n) throw new Error(`Burst buyer ${index + 1} amount and minimum output must be nonzero.`);
    const balance = await state.provider.getBalance(wallet.address);
    if (balance <= amountIn) throw new Error(`Burst buyer ${index + 1} ${wallet.address} lacks ETH for buy amount plus gas.`);
    rows.push({ index, wallet, recipient, amountIn, minOut, balance });
  }
  return rows;
}

async function executeLunchBurstBuysOnly(tokenAddress, push) {
  const primary = await state.signer.getAddress();
  const routerAddress = inputs.lunchBurstRouter.value.trim() || LUNCH_CHAIN.router;
  if (!ethers.isAddress(routerAddress)) throw new Error("Lunch burst router is invalid.");
  const fee = Number(parseUintInput(inputs.lunchBurstFeeTier.value || "10000", "Lunch burst fee tier"));
  if (fee !== 10000) throw new Error("Lunch launcher requires fee tier 10000.");
  const launcher = getLunchFactory(state.signer);
  const xToken = await launcher.xToken();
  const buyers = await getLunchBurstBuyerRows(primary);
  if (!buyers.length) {
    push("No burst buyers enabled. Skipping burst leg.");
    return;
  }
  const ctx = { routerAddress, fee, xToken };
  const token = new Contract(tokenAddress, PONS_TOKEN_ABI, state.provider);
  const decimals = await token.decimals();
  push(`Estimating ${buyers.length} burst buy transaction(s) against ${lunchExplorerAddress(tokenAddress)}...`);
  const prepared = await Promise.all(buyers.map(async (buyer) => prepareLunchBurstBuy(ctx, buyer, tokenAddress, token, decimals)));
  for (const item of prepared) {
    inputs[`lunchBurstBuyerGas${item.buyer.index}`].value = `${item.gas}`;
    inputs[`lunchBurstBuyerReceived${item.buyer.index}`].value = `expected ${ethers.formatUnits(item.quote, decimals)}`;
    inputs[`lunchBurstBuyerStatus${item.buyer.index}`].value = "Ready to broadcast";
  }

  push("Broadcasting all burst buyer transactions in parallel...");
  const submissions = await Promise.allSettled(prepared.map(async (item) => {
    const router = new Contract(ctx.routerAddress, [PONS_ROUTER_ABI[0]], item.buyer.wallet);
    const tx = await router.exactInputSingle(item.params, {
      value: item.buyer.amountIn,
      gasLimit: (item.gas * 125n) / 100n,
    });
    inputs[`lunchBurstBuyerHash${item.buyer.index}`].value = tx.hash;
    inputs[`lunchBurstBuyerStatus${item.buyer.index}`].value = "Submitted";
    return { ...item, tx };
  }));
  const accepted = [];
  for (const [position, result] of submissions.entries()) {
    const buyer = prepared[position].buyer;
    if (result.status === "fulfilled") {
      accepted.push(result.value);
      push(`Buyer ${buyer.index + 1} submitted: ${lunchExplorerTx(result.value.tx.hash)}`);
    } else {
      inputs[`lunchBurstBuyerStatus${buyer.index}`].value = "Submit failed";
      push(`Buyer ${buyer.index + 1} submit failed: ${formatError(result.reason)}`);
    }
  }

  push(`Waiting for ${accepted.length} submitted burst receipt(s)...`);
  const receipts = await Promise.allSettled(accepted.map(async (item) => {
    const receipt = await item.tx.wait();
    const after = await token.balanceOf(item.buyer.recipient);
    return { ...item, receipt, received: after - item.before };
  }));
  for (const result of receipts) {
    if (result.status === "fulfilled") {
      const { buyer, receipt, received } = result.value;
      inputs[`lunchBurstBuyerStatus${buyer.index}`].value = receipt.status === 1 ? `Confirmed block ${receipt.blockNumber}` : "Reverted";
      inputs[`lunchBurstBuyerReceived${buyer.index}`].value = ethers.formatUnits(received, decimals);
    } else {
      push(`Receipt wait failed: ${formatError(result.reason)}`);
    }
  }
  push("Burst leg complete. Submitted buyer txs were parallel, but block ordering is determined by the network.");
}

async function executeLunchLaunch() {
  const resultEl = document.querySelector("#lunchExecutionResult");
  try {
    requireSigner();
    await ensureLunchChain();
    const steps = [];
    const pushStep = (line) => {
      steps.push(`[${new Date().toLocaleTimeString()}] ${line}`);
      resultEl.textContent = steps.join("\n");
      log(`Lunch: ${line}`);
    };

    pushStep("Validating contract and simulating launch...");
    const ctx = await buildLunchContext();
    await ctx.launcher.launchWithMetaSalt.staticCall(ctx.name, ctx.symbol, ctx.totalSupply, ctx.fee, ctx.initialBuyFlag, ctx.meta, ctx.userSalt, { value: ctx.launchValue });
    const launchGas = await ctx.launcher.launchWithMetaSalt.estimateGas(ctx.name, ctx.symbol, ctx.totalSupply, ctx.fee, ctx.initialBuyFlag, ctx.meta, ctx.userSalt, { value: ctx.launchValue });
    inputs.lunchBuyerGas0.value = `${launchGas}`;

    pushStep("Awaiting primary-wallet signature for Lunch launch...");
    inputs.lunchBuyerStatus0.value = "Awaiting wallet confirmation";
    const launchTx = await ctx.launcher.launchWithMetaSalt(ctx.name, ctx.symbol, ctx.totalSupply, ctx.fee, ctx.initialBuyFlag, ctx.meta, ctx.userSalt, { value: ctx.launchValue });
    inputs.lunchBuyerHash0.value = launchTx.hash;
    inputs.lunchBuyerStatus0.value = "Launch submitted";
    pushStep(`Launch submitted: ${lunchExplorerTx(launchTx.hash)}`);

    const launchReceipt = await launchTx.wait();
    if (launchReceipt.status !== 1) throw new Error("Lunch launch transaction reverted.");
    inputs.lunchBuyerStatus0.value = `Launch confirmed block ${launchReceipt.blockNumber}`;
    pushStep(`Launch confirmed in block ${launchReceipt.blockNumber}.`);

    const launchEvent = decodeLunchLaunchEvent(launchReceipt.logs);
    if (!launchEvent) throw new Error("V3TokenLaunched event was not found in the launch receipt.");
    lunchState.launchedToken = launchEvent.token;
    lunchState.launchedPool = launchEvent.pool;
    await saveLaunchedTokenToProject(launchEvent.token, "Lunch + Burst");
    pushStep(`Token address detected: ${lunchExplorerAddress(launchEvent.token)}`);
    pushStep(`Pool address detected: ${lunchExplorerAddress(launchEvent.pool)}`);

    const token = new Contract(launchEvent.token, PONS_TOKEN_ABI, state.signer);
    const decimals = await token.decimals();
    const primaryRecipient = ctx.buyers[0]?.recipient || ctx.primary;
    if (ctx.primaryBuyAmount > 0n) {
      const primaryBalance = await token.balanceOf(primaryRecipient);
      inputs.lunchBuyerReceived0.value = ethers.formatUnits(primaryBalance, decimals);
    }

    const laterBuyers = ctx.buyers.slice(1).filter((buyer) => buyer.enabled && buyer.amount > 0n);
    for (const buyer of laterBuyers) {
      pushStep(`Simulating buyer ${buyer.index + 1} router purchase...`);
      inputs[`lunchBuyerStatus${buyer.index}`].value = "Simulating";
      const receipt = await executeLunchRouterBuy(ctx, buyer, token, decimals, pushStep);
      if (!receipt || receipt.status !== 1) {
        inputs[`lunchBuyerStatus${buyer.index}`].value = "Failed";
        throw new Error(`Buyer ${buyer.index + 1} failed. Later purchases stopped.`);
      }
    }
    pushStep("Complete. Lunch launch flow finished.");
  } catch (error) {
    resultEl.textContent = `${resultEl.textContent}\nFailed: ${formatError(error)}`.trim();
    log(`Lunch execution failed: ${formatError(error)}`);
  }
}

async function executeLunchRouterBuy(ctx, buyer, token, decimals, pushStep) {
  const router = new Contract(ctx.router, [PONS_ROUTER_ABI[0]], state.signer);
  const params = {
    tokenIn: ctx.xToken,
    tokenOut: lunchState.launchedToken || ctx.predictedToken,
    fee: ctx.fee,
    recipient: buyer.recipient,
    amountIn: buyer.amount,
    amountOutMinimum: parseTokenUnits(buyer.minOut, decimals, `Buyer ${buyer.index + 1} minimum token output`),
    sqrtPriceLimitX96: 0n,
  };
  const before = await token.balanceOf(buyer.recipient);
  const out = await router.exactInputSingle.staticCall(params, { value: buyer.amount });
  inputs[`lunchBuyerReceived${buyer.index}`].value = `expected ${ethers.formatUnits(out, decimals)}`;
  const gas = await router.exactInputSingle.estimateGas(params, { value: buyer.amount });
  inputs[`lunchBuyerGas${buyer.index}`].value = `${gas}`;
  inputs[`lunchBuyerStatus${buyer.index}`].value = "Awaiting wallet confirmation";
  const tx = await router.exactInputSingle(params, { value: buyer.amount });
  inputs[`lunchBuyerHash${buyer.index}`].value = tx.hash;
  inputs[`lunchBuyerStatus${buyer.index}`].value = "Submitted";
  pushStep(`Buyer ${buyer.index + 1} submitted: ${lunchExplorerTx(tx.hash)}`);
  const receipt = await tx.wait();
  const after = await token.balanceOf(buyer.recipient);
  inputs[`lunchBuyerReceived${buyer.index}`].value = ethers.formatUnits(after - before, decimals);
  inputs[`lunchBuyerStatus${buyer.index}`].value = `Confirmed block ${receipt.blockNumber}`;
  pushStep(`Buyer ${buyer.index + 1} confirmed in block ${receipt.blockNumber}. Received ${ethers.formatUnits(after - before, decimals)} tokens.`);
  return receipt;
}

async function buildLunchContext() {
  const primary = await state.signer.getAddress();
  const launcher = getLunchFactory(state.signer);
  const [launchFee, factoryAddress, npmAddress, xToken, feeLocker, enforcedSupply] = await Promise.all([
    launcher.launchFeeWei(),
    launcher.factory(),
    launcher.npm(),
    launcher.xToken(),
    launcher.feeLocker(),
    launcher.enforcedSupply(),
  ]);
  const name = inputs.lunchTokenName.value.trim();
  const symbol = inputs.lunchTokenSymbol.value.trim();
  if (!name || !symbol) throw new Error("Lunch token name and symbol are required.");
  const totalSupply = parseTokenUnits(inputs.lunchTotalSupply.value, 18, "Lunch total supply");
  if (enforcedSupply > 0n && totalSupply !== enforcedSupply) {
    throw new Error(`Lunch total supply must equal enforced supply ${ethers.formatUnits(enforcedSupply, 18)}.`);
  }
  const fee = Number(parseUintInput(inputs.lunchFeeTier.value || "10000", "Lunch fee tier"));
  if (fee !== 10000) throw new Error("Lunch launcher requires fee tier 10000.");
  const buyers = getLunchBuyerRows(primary);
  validateLunchBuyers(buyers);
  const primaryBuyAmount = buyers[0]?.enabled ? buyers[0].amount : 0n;
  const initialBuyFlag = primaryBuyAmount > 0n ? 1n : 0n;
  const meta = {
    image: inputs.lunchImage.value.trim(),
    banner: inputs.lunchBanner.value.trim(),
    description: inputs.lunchDescription.value.trim(),
    website: inputs.lunchWebsite.value.trim(),
    twitter: inputs.lunchTwitter.value.trim(),
    telegram: inputs.lunchTelegram.value.trim(),
  };
  const userSalt = normalizeSalt(inputs.lunchSalt.value.trim());
  if (!inputs.lunchSalt.value.trim()) inputs.lunchSalt.value = userSalt;
  const predictedToken = await launcher.predictTokenAddress(name, symbol, totalSupply, primary, userSalt);
  return {
    primary,
    launcher,
    router: inputs.lunchRouter.value.trim() || LUNCH_CHAIN.router,
    factoryAddress,
    npm: npmAddress,
    xToken,
    feeLocker,
    launchFee,
    enforcedSupply,
    name,
    symbol,
    totalSupply,
    fee,
    buyers,
    primaryBuyAmount,
    initialBuyFlag,
    launchValue: launchFee + primaryBuyAmount,
    meta,
    userSalt,
    predictedToken,
  };
}

function getLunchBuyerRows(primary) {
  return Array.from({ length: 5 }, (_, index) => {
    const enabled = inputs[`lunchBuyerEnabled${index}`].checked;
    const fallbackRecipient = index === 0 ? primary : "";
    const recipient = inputs[`lunchBuyerAddress${index}`].value.trim() || fallbackRecipient;
    const amountText = inputs[`lunchBuyerAmount${index}`].value.trim() || "0";
    return {
      index,
      enabled,
      recipient,
      amount: enabled ? parseEthInput(amountText, `Lunch buyer ${index + 1} amount`) : 0n,
      minOut: inputs[`lunchBuyerMinOut${index}`].value.trim(),
    };
  });
}

function validateLunchBuyers(buyers) {
  const seen = new Set();
  for (const buyer of buyers.filter((row) => row.enabled)) {
    if (!ethers.isAddress(buyer.recipient) || buyer.recipient === ethers.ZeroAddress) {
      throw new Error(`Lunch buyer ${buyer.index + 1} has an invalid recipient address.`);
    }
    const key = buyer.recipient.toLowerCase();
    if (seen.has(key)) throw new Error(`Duplicate Lunch buyer recipient: ${buyer.recipient}`);
    seen.add(key);
    if (buyer.index > 0 && buyer.amount > 0n && !buyer.minOut) {
      throw new Error(`Lunch buyer ${buyer.index + 1} needs a minimum token output. Do not use zero in production.`);
    }
  }
}

function getLunchFactory(signerOrProvider) {
  return new Contract(LUNCH_CHAIN.launchContract, LUNCH_FACTORY_ABI, signerOrProvider);
}

async function ensureLunchChain() {
  if (!state.provider || !state.signer) throw new Error("Connect primary wallet first.");
  const network = await state.provider.getNetwork();
  if (network.chainId !== BigInt(LUNCH_CHAIN.id)) {
    throw new Error(`Wrong network. Expected ${LUNCH_CHAIN.name} chain ${LUNCH_CHAIN.id}, connected to ${network.chainId}.`);
  }
}

function decodeLunchLaunchEvent(logs) {
  const iface = new ethers.Interface(LUNCH_FACTORY_ABI);
  for (const logEntry of logs) {
    if (logEntry.address.toLowerCase() !== LUNCH_CHAIN.launchContract.toLowerCase()) continue;
    try {
      const parsed = iface.parseLog(logEntry);
      if (parsed?.name === "V3TokenLaunched") {
        return {
          token: parsed.args.token,
          tokenId: parsed.args.tokenId,
          pool: parsed.args.pool,
          fee: parsed.args.fee,
        };
      }
    } catch {
      // Not a Lunch launcher event.
    }
  }
  return null;
}

function lunchExplorerTx(hash) {
  return `${LUNCH_CHAIN.explorerUrl}tx/${hash}`;
}

function lunchExplorerAddress(address) {
  return `${LUNCH_CHAIN.explorerUrl}address/${address}`;
}

async function verifyContract() {
  const resultEl = document.querySelector("#verifyResult");
  try {
    const address = getVerificationAddress();
    resultEl.textContent = "Waiting for Blockscout/RPC indexing, then submitting verification...";
    const guid = await submitVerificationWithRetry(address, getConstructorArgs());
    resultEl.textContent = `Verification submitted. GUID: ${guid}`;
  } catch (error) {
    resultEl.textContent = error.shortMessage || error.message;
    log(`Verification failed: ${error.shortMessage || error.message}`);
  }
}

async function submitVerificationWithRetry(address, constructorArgs) {
  await waitForDeployedCode(address);
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      log(`Verification attempt ${attempt}/5...`);
      return await submitVerification(address, constructorArgs);
    } catch (error) {
      lastError = error;
      const message = error.shortMessage || error.message || "";
      if (/already verified/i.test(message)) return "already verified";
      if (attempt < 5) {
        log(`Verification attempt ${attempt} failed: ${message}. Retrying in 15s...`);
        await delay(15_000);
      }
    }
  }
  throw lastError;
}

async function submitVerification(address, constructorArgs) {
  inputs.verifyAddress.value = address;
  const constructorArguments = inputs.verifyConstructorArgs.value.trim().replace(/^0x/, "") || encodeConstructorArgs(constructorArgs);
  const form = new FormData();
  form.append("contractaddress", address);
  form.append("sourceCode", JSON.stringify(verification.standardJsonInput));
  form.append("contractname", inputs.verifyContractName.value.trim() || verification.contractName);
  form.append("codeformat", "solidity-standard-json-input");
  form.append("compilerversion", inputs.verifyCompiler.value.trim() || verification.compilerVersion);
  form.append("optimizationUsed", verification.optimizer?.enabled ? "1" : "0");
  form.append("runs", String(verification.optimizer?.runs ?? 200));
  form.append("constructorArguments", constructorArguments);
  form.append("evmversion", verification.evmVersion || "london");

  log(`Submitting Blockscout verification for ${address}...`);
  const response = await fetch(`${ROBINHOOD_CHAIN.blockscoutApiUrl}?module=contract&action=verifysourcecode`, {
    method: "POST",
    body: form,
  });
  const json = await response.json();
  if (!response.ok || json.status === "0") {
    throw new Error(json.result || json.message || `HTTP ${response.status}`);
  }
  inputs.verifyGuid.value = json.result;
  log(`Blockscout verification submitted for ${address}. GUID: ${json.result}`);
  return json.result;
}

async function waitForDeployedCode(address) {
  for (let attempt = 1; attempt <= 12; attempt++) {
    const code = await state.provider.getCode(address);
    if (code && code !== "0x") {
      log(`Deployed bytecode visible on RPC for ${short(address)}.`);
      if (attempt > 1) await delay(10_000);
      return;
    }
    log(`Waiting for deployed bytecode ${attempt}/12...`);
    await delay(5_000);
  }
  throw new Error("Deployed bytecode was not visible after waiting.");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkVerificationStatus() {
  const resultEl = document.querySelector("#verifyResult");
  const guid = inputs.verifyGuid.value.trim();
  if (!guid) {
    resultEl.textContent = "Enter a verification GUID first.";
    return;
  }
  try {
    const url = `${ROBINHOOD_CHAIN.blockscoutApiUrl}?module=contract&action=checkverifystatus&guid=${encodeURIComponent(guid)}`;
    const response = await fetch(url);
    const json = await response.json();
    resultEl.textContent = json.result || json.message || `HTTP ${response.status}`;
    log(`Verification status: ${resultEl.textContent}`);
  } catch (error) {
    resultEl.textContent = error.shortMessage || error.message;
    log(`Verification status failed: ${error.shortMessage || error.message}`);
  }
}

function openBlockscout() {
  try {
    const address = getVerificationAddress();
    window.open(`${ROBINHOOD_CHAIN.blockExplorerUrl}address/${address}`, "_blank", "noopener,noreferrer");
  } catch (error) {
    document.querySelector("#verifyResult").textContent = error.message;
  }
}

function getVerificationAddress() {
  const address = inputs.verifyAddress.value.trim() || inputs.contractAddress.value.trim() || state.contract?.target;
  if (!ethers.isAddress(address || "")) throw new Error("A valid contract address is required for verification.");
  return address;
}

function encodeConstructorArgs(args = getConstructorArgs()) {
  const constructorAbi = artifact.abi.find((item) => item.type === "constructor");
  const types = constructorAbi.inputs.map((input) => input.type);
  const encoded = ethers.AbiCoder.defaultAbiCoder().encode(types, args);
  return encoded.replace(/^0x/, "");
}

function formatGeneratedAccounts() {
  return state.generatedWallets
    .map((wallet, index) => `Wallet ${index + 1}\nAddress: ${wallet.address}\nPrivate Key: ${wallet.privateKey}`)
    .join("\n\n");
}

// Many tokens on this chain only ever have Uniswap V3 liquidity, never a V2
// pair (see mmCheckPool/mmCheckPoolV3, used identically by the Market Maker
// Bot) — calling the V2-only swap function against such a token reverts
// with no reason ("likely require(false)") because the pair simply doesn't
// exist. sendBuy auto-detects which pool type the loaded token actually
// has and swaps through the matching router, so the plain Buy tab works
// for both kinds of tokens without the user needing to know which one it
// is.
async function sendBuy(signer, buyerAddress, ethAmount = inputs.buyEthAmount.value.trim()) {
  const tokenAddress = state.contract.target;
  const provider = signer.provider;
  const routerAddress = getRouterAddress();
  const pool = await mmCheckPool(provider, routerAddress, tokenAddress);
  if (!pool.exists) throw new Error(`No liquidity pool found for this token: ${pool.error}`);

  const recipient = inputs.buyRecipient.value.trim() || buyerAddress;
  const ethIn = parseEthInput(ethAmount, "ETH per buy");
  const deadline = getDeadline(inputs.buyDeadline.value);
  const manualMinTokens = inputs.buyMinTokens.value.trim();

  if (pool.version === "v3") {
    const router = new Contract(pool.swapRouter, [PONS_ROUTER_ABI[0]], signer);
    // Buying with WETH as tokenIn: tokenInIsToken0 is the inverse of
    // whether the *project token* is token0 (same convention as
    // mmExecuteBuyV3).
    const quoted = await mmQuoteV3(pool.poolAddress, !pool.isToken0, ethIn, provider);
    const minTokens = manualMinTokens && manualMinTokens !== "0"
      ? await parseTokenAmount(manualMinTokens)
      : mmApplySlippage(quoted, 5); // default 5% slippage tolerance
    const params = {
      tokenIn: pool.wethAddress,
      tokenOut: tokenAddress,
      fee: pool.poolFee,
      recipient,
      amountIn: ethIn,
      amountOutMinimum: minTokens,
      sqrtPriceLimitX96: 0n,
    };
    return router.exactInputSingle(params, { value: ethIn });
  }

  const router = new Contract(routerAddress, ROUTER_ABI, signer);
  const weth = await router.WETH();
  const path = [weth, tokenAddress];
  const minTokens = manualMinTokens
    ? await parseTokenAmount(manualMinTokens)
    : 0n;
  return router.swapExactETHForTokensSupportingFeeOnTransferTokens(minTokens, path, recipient, deadline, {
    value: ethIn,
  });
}

function parseBatchBuyers(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [privateKey, ethAmount] = line.split(/[,\s]+/).map((part) => part.trim()).filter(Boolean);
      return {
        privateKey,
        ethAmount: ethAmount || inputs.buyEthAmount.value.trim(),
      };
    });
}

async function parseTokenAmount(value) {
  const token = getToken(state.signer || getRpcProvider());
  const decimals = await token.decimals();
  return parseTokenInput(value, decimals, "Token amount");
}

function getRouter(signerOrProvider) {
  return new Contract(getRouterAddress(), ROUTER_ABI, signerOrProvider);
}

function getToken(signerOrProvider) {
  return new Contract(state.contract.target, artifact.abi, signerOrProvider);
}

function getRouterAddress() {
  return inputs.router.value.trim() || ROBINHOOD_CHAIN.router;
}

function getRpcProvider() {
  return new JsonRpcProvider(resolveRpcUrl(inputs.rpcUrl.value.trim() || "/rpc"));
}

function resolveRpcUrl(url) {
  if (url.startsWith("/")) {
    return `${window.location.origin}${url}`;
  }
  return url;
}

function getDeadline(minutesValue) {
  const minutes = Number(minutesValue || "20");
  return Math.floor(Date.now() / 1000) + Math.max(1, minutes) * 60;
}

// Every launch tab's "Use Wallets Tab" Dev-wallet <select>. Kept in one
// place so it can be refreshed both on initial bind and whenever the user
// navigates to a launch tab or changes the vault (see refreshDevWalletSelects).
const DEV_WALLET_SELECT_IDS = [
  "ponsDevWalletSelect", "pwponsDevWalletSelect", "pwponsWashDevWalletSelect",
  "lunchDevWalletSelect", "lunchBurstDevWalletSelect", "lunchComboDevWalletSelect", "dopplerDevWalletSelect",
];

// Re-fetch and re-fill every Dev-wallet dropdown from the active project's
// vault. switchFunctionTabByName only toggles CSS — it does not re-render or
// re-fetch — so without this, a wallet generated in the Wallets tab did not
// show up in a launch tab's dropdown until a full page refresh.
function refreshDevWalletSelects() {
  if (!auth.activeProjectId) return;
  for (const id of DEV_WALLET_SELECT_IDS) {
    if (document.querySelector(`#${id}`)) populateDevWalletSelect(id);
  }
}

// Tab ids whose "Use Wallets Tab" section pulls from the vault.
const LAUNCH_TAB_IDS = new Set(["pons", "ponsWash", "lunch", "lunchBurst", "lunchCombo", "doppler"]);

function switchFunctionTabByName(name) {
  for (const tab of document.querySelectorAll("[data-tab]")) {
    tab.classList.toggle("active", tab.dataset.tab === name);
  }
  for (const panel of document.querySelectorAll("[data-tab-panel]")) {
    panel.classList.toggle("active", panel.dataset.tabPanel === name);
  }
  // Landing on a launch tab: make sure its Dev-wallet dropdown reflects
  // whatever is currently saved in the vault, not what was there at page load.
  if (LAUNCH_TAB_IDS.has(name)) refreshDevWalletSelects();
}

function formatResult(result) {
  if (Array.isArray(result)) return result.map(String).join(", ");
  return String(result);
}

function formatError(error) {
  const nested = error?.info?.error || error?.error;
  const nestedMessage = typeof nested === "string" ? nested : nested?.message;
  const dataMessage = error?.data?.message || error?.info?.payload?.method;
  return [error?.shortMessage, error?.reason, nestedMessage, error?.message, dataMessage].filter(Boolean).join(" | ");
}

function requireSigner() {
  if (!state.signer) throw new Error("Connect MetaMask or RPC wallet first");
}

function requireContract() {
  requireSigner();
  if (!state.contract) throw new Error("Deploy or attach a contract first");
}

// Used by batch buy/sell (pasted private keys) and other flows that never
// touch state.signer at all — each pasted key gets its own Wallet/Contract
// instance against the RPC provider. Requiring MetaMask here would force
// users to connect a browser wallet just to run a pure private-key batch
// buy, which they may not want or need to do at all.
function requireContractLoaded() {
  if (!state.contract) throw new Error("Enter a token contract address and click Attach first");
}

// Permissions and projects must be known before the first render, otherwise
// the sidebar/switcher would flash empty and then populate — which looks
// like a bug and briefly advertises features the user cannot actually use.
loadSessionPermissions().then(async () => {
  await loadProjects();
  render();
});
