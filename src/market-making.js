import { Contract, JsonRpcProvider, ethers } from "ethers";
import "./market-making.css";

const RPC_URL = `${window.location.origin}/rpc`;
const provider = new JsonRpcProvider(RPC_URL, { chainId: 4663, name: "robinhood" }, { staticNetwork: true });
const WETH = "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73";
const TOKEN_ABI = [
  "function balanceOf(address) view returns(uint256)", "function decimals() view returns(uint8)",
  "function symbol() view returns(string)", "function totalSupply() view returns(uint256)",
];
const POOL_ABI = [
  "function token0() view returns(address)", "function token1() view returns(address)",
  "function fee() view returns(uint24)", "function liquidity() view returns(uint128)",
  "function slot0() view returns(uint160 sqrtPriceX96,int24 tick,uint16,uint16,uint16,uint8,bool)",
];
const TABS = ["Overview", "Strategy", "Wallets", "Executions", "Liquidity", "Automation", "Risk Controls", "Audit Log"];
const root = document.querySelector("#market-making-app");
const state = {
  tab: "Overview", prefix: "MM", wallets: [], balances: new Map(), page: 1, pageSize: 25,
  tokenAddress: localStorage.getItem("mmTokenAddress") || "",
  poolAddress: localStorage.getItem("mmPoolAddress") || "",
  tokenSymbol: "TOKEN", tokenDecimals: 18, tokenSupply: 0n, pool: null,
  environment: localStorage.getItem("mmEnvironment") || "READ_ONLY",
  emergencyPaused: localStorage.getItem("mmEmergencyPaused") === "true",
};

render();
bind();
loadWallets();

function render() {
  root.innerHTML = `
    <main class="mm-shell">
      <header class="mm-header">
        <div><a href="/wallet-manager.html">← Wallet Command Center</a><p class="mm-kicker">Administrator · Robinhood Chain</p><h1>Market Making</h1><p>Legitimate treasury execution, inventory controls, and liquidity oversight.</p></div>
        <div class="mm-status"><span></span> Treasury Execution · Chain 4663</div>
      </header>
      <div id="mmModeBanner"></div>
      <section class="mm-guardrail"><strong>Project-controlled activity</strong><span>MM/MN wallets are commonly controlled. Their actions are never reported as organic volume or unique traders.</span><button id="mmEmergency">Emergency pause</button></section>
      <section class="mm-controls">
        <label>Project <select id="mmProject"><option value="local">Local launchpad project</option></select></label>
        <label>Wallet prefix <select id="mmPrefix"><option>MM</option><option>MN</option></select></label>
        <label>Environment <select id="mmEnvironment"><option value="READ_ONLY">Read-only</option><option value="SIMULATION">Simulation</option><option value="MANUAL_PRODUCTION">Manual production</option><option value="AUTOMATED_PRODUCTION">Automated production</option></select></label>
        <label>Project token <input id="mmToken" value="${esc(state.tokenAddress)}" placeholder="0x token" /></label>
        <label>V3 pool <input id="mmPool" value="${esc(state.poolAddress)}" placeholder="0x pool" /></label>
        <button id="mmLoad">Load live state</button>
      </section>
      <nav class="mm-tabs">${TABS.map(tab => `<button data-tab="${tab}" class="${tab === state.tab ? "active" : ""}">${tab}</button>`).join("")}</nav>
      <section id="mmContent"></section>
    </main>`;
  renderTab();
}

function bind() {
  root.addEventListener("click", async event => {
    const tab = event.target.closest("[data-tab]")?.dataset.tab;
    if (tab) { state.tab = tab; root.querySelectorAll("[data-tab]").forEach(button => button.classList.toggle("active", button.dataset.tab === tab)); renderTab(); }
    if (event.target.id === "mmLoad") await loadLiveState();
    if (event.target.dataset.page) { state.page = Number(event.target.dataset.page); renderWallets(); }
  });
  root.querySelector("#mmPrefix").addEventListener("change", async event => { state.prefix = event.target.value; state.page = 1; await loadWallets(); });
  const environment = root.querySelector("#mmEnvironment");
  environment.value = state.environment;
  environment.addEventListener("change", changeEnvironment);
  root.querySelector("#mmEmergency").addEventListener("click", emergencyPause);
  renderModeBanner();
}

function changeEnvironment(event) {
  const requested = event.target.value;
  if (requested === "MANUAL_PRODUCTION" && !window.confirm("Enable Manual Production? Every transaction will still require a complete preview and explicit confirmation.")) {
    event.target.value = state.environment; return;
  }
  if (requested === "AUTOMATED_PRODUCTION") {
    const phrase = window.prompt("Type exactly:\nENABLE AUTOMATED TREASURY EXECUTION");
    if (phrase !== "ENABLE AUTOMATED TREASURY EXECUTION") {
      event.target.value = state.environment;
      setNotice("Automated Production was not enabled because the confirmation phrase did not match.", true);
      return;
    }
    localStorage.setItem("mmAutomationEnabledAt", new Date().toISOString());
  }
  state.environment = requested; state.emergencyPaused = false;
  localStorage.setItem("mmEnvironment", requested); localStorage.setItem("mmEmergencyPaused", "false");
  renderModeBanner(); setNotice(`${environmentLabel(requested)} enabled.`);
}

function emergencyPause() {
  if (!window.confirm("Immediately pause production treasury execution and return to Read-only mode?")) return;
  state.emergencyPaused = true; state.environment = "READ_ONLY";
  localStorage.setItem("mmEmergencyPaused", "true"); localStorage.setItem("mmEnvironment", "READ_ONLY");
  root.querySelector("#mmEnvironment").value = "READ_ONLY";
  renderModeBanner(); setNotice("Emergency pause is active. Production execution is blocked.", true);
}

function renderModeBanner() {
  const banner = root.querySelector("#mmModeBanner"); if (!banner) return;
  const detail = state.emergencyPaused ? "Emergency pause active. No production execution is permitted."
    : state.environment === "SIMULATION" ? "Simulation mode: production-chain submission is blocked."
    : state.environment === "MANUAL_PRODUCTION" ? "Every treasury action requires a preview and explicit confirmation."
    : state.environment === "AUTOMATED_PRODUCTION" ? "Enabled with assignment, role, risk, reservation, and self-trading checks."
    : "No signing or transaction submission.";
  banner.className = `mm-mode-banner ${state.emergencyPaused ? "paused" : state.environment.toLowerCase().replaceAll("_", "-")}`;
  banner.innerHTML = `<strong>${environmentLabel(state.environment)}</strong><span>${detail}</span>`;
}

function environmentLabel(value) {
  return ({ READ_ONLY: "Read-only", SIMULATION: "Simulation", MANUAL_PRODUCTION: "Manual Production", AUTOMATED_PRODUCTION: "Automated Production" })[value] || value;
}

async function loadWallets() {
  setNotice("Loading Command Center wallets…");
  try {
    const response = await fetch(`/api/command-center/wallets?labelPrefix=${state.prefix}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    state.wallets = data.wallets || [];
    renderTab();
  } catch (error) { setNotice(error.message, true); }
}

async function loadLiveState() {
  const tokenAddress = root.querySelector("#mmToken").value.trim();
  const poolAddress = root.querySelector("#mmPool").value.trim();
  if (!ethers.isAddress(tokenAddress)) return setNotice("Enter a valid project-token address.", true);
  state.tokenAddress = ethers.getAddress(tokenAddress);
  state.poolAddress = ethers.isAddress(poolAddress) ? ethers.getAddress(poolAddress) : "";
  localStorage.setItem("mmTokenAddress", state.tokenAddress);
  localStorage.setItem("mmPoolAddress", state.poolAddress);
  setNotice("Reading fresh wallet and pool state…");
  try {
    const token = new Contract(state.tokenAddress, TOKEN_ABI, provider);
    const [decimals, symbol, supply, wethDecimals, balances] = await Promise.all([
      token.decimals(), token.symbol().catch(() => "TOKEN"), token.totalSupply(),
      new Contract(WETH, TOKEN_ABI, provider).decimals(),
      Promise.all(state.wallets.map(async wallet => {
        const [eth, weth, projectToken, nonce] = await Promise.all([
          provider.getBalance(wallet.address),
          new Contract(WETH, TOKEN_ABI, provider).balanceOf(wallet.address),
          token.balanceOf(wallet.address),
          provider.getTransactionCount(wallet.address, "pending"),
        ]);
        return [wallet.id, { eth, weth, projectToken, nonce, wethDecimals: Number(wethDecimals || 18) }];
      })),
    ]);
    state.tokenDecimals = Number(decimals); state.tokenSymbol = symbol; state.tokenSupply = supply; state.balances = new Map(balances);
    if (state.poolAddress) {
      const pool = new Contract(state.poolAddress, POOL_ABI, provider);
      const [token0, token1, fee, liquidity, slot0] = await Promise.all([pool.token0(), pool.token1(), pool.fee(), pool.liquidity(), pool.slot0()]);
      state.pool = { token0, token1, fee, liquidity, sqrtPriceX96: slot0.sqrtPriceX96, tick: slot0.tick };
    }
    renderTab();
    setNotice(`Live state loaded for ${symbol}.`);
  } catch (error) { setNotice(error.shortMessage || error.message, true); }
}

function renderTab() {
  const content = root.querySelector("#mmContent");
  if (!content) return;
  if (state.tab === "Overview") return renderOverview(content);
  if (state.tab === "Wallets") return renderWallets(content);
  const panels = {
    Strategy: ["Strategy configuration", strategyFields()],
    Executions: ["Execution history", emptyState("No treasury executions have been recorded. Production execution is disabled until authenticated strategy persistence exists.")],
    Liquidity: ["Liquidity management", emptyState("Enter a verified V3 pool to inspect it. Position-manager actions remain read-only without the administrator signer service.")],
    Automation: ["Automation", automationPanel()],
    "Risk Controls": ["Risk controls", riskFields()],
    "Audit Log": ["Audit log", emptyState("No immutable audit database exists in this local repository. Configuration mutations are therefore disabled.")],
  };
  const [title, body] = panels[state.tab];
  content.innerHTML = `<article class="mm-panel"><p class="mm-kicker">${state.tab}</p><h2>${title}</h2>${body}</article>`;
}

function renderOverview(content) {
  const eligible = state.wallets.filter(wallet => wallet.eligibility?.eligible);
  const excluded = state.wallets.filter(wallet => !wallet.eligibility?.eligible);
  const totals = eligible.reduce((acc, wallet) => {
    const item = state.balances.get(wallet.id); if (!item) return acc;
    acc.eth += item.eth; acc.weth += item.weth; acc.token += item.projectToken; return acc;
  }, { eth: 0n, weth: 0n, token: 0n });
  const cards = [
    ["Assigned wallets", "0", "Explicit assignment required"],
    ["Eligible wallets", eligible.length, `${excluded.length} excluded`],
    ["Active wallets", eligible.filter(w => w.enabled && !w.emergencyPaused).length, "Command Center state"],
    ["Pending executions", eligible.filter(w => w.pendingTransaction).length, "One maximum per wallet"],
    [`Combined ${state.tokenSymbol}`, fmtToken(totals.token), "Available before reservations"],
    ["Combined WETH", fmt(totals.weth, 18, 5), "Project controlled"],
    ["Combined native ETH", fmt(totals.eth, 18, 5), "Gas and treasury"],
    ["Total supply", fmtToken(state.tokenSupply), state.tokenSymbol],
  ];
  content.innerHTML = `<div class="mm-grid">${cards.map(([a,b,c]) => `<article class="mm-card"><span>${a}</span><strong>${b}</strong><small>${c}</small></article>`).join("")}</div>
    <div class="mm-two"><article class="mm-panel"><p class="mm-kicker">Pool state</p><h2>${state.poolAddress ? short(state.poolAddress) : "No pool loaded"}</h2>${poolDetails()}</article>
    <article class="mm-panel"><p class="mm-kicker">Eligibility</p><h2>Command Center wallet status</h2>${excluded.length ? excluded.slice(0,8).map(w => `<p class="mm-reason">${esc(w.label)} <span>${w.eligibility.reasons.join(", ")}</span></p>`).join("") : `<p class="mm-muted">No exclusions for the selected prefix.</p>`}</article></div>`;
}

function renderWallets(content = root.querySelector("#mmContent")) {
  const start = (state.page - 1) * state.pageSize;
  const rows = state.wallets.slice(start, start + state.pageSize);
  const pages = Math.max(1, Math.ceil(state.wallets.length / state.pageSize));
  content.innerHTML = `<article class="mm-panel"><div class="mm-heading"><div><p class="mm-kicker">Execution wallets</p><h2>${state.wallets.length} ${state.prefix} wallet${state.wallets.length === 1 ? "" : "s"}</h2></div><span>Page ${state.page} of ${pages}</span></div>
  ${rows.length ? `<div class="mm-table"><div class="mm-row mm-row-head"><span>Wallet</span><span>ETH</span><span>WETH</span><span>${esc(state.tokenSymbol)}</span><span>Signer</span><span>Nonce</span><span>Eligibility</span><span>Assignment</span></div>${rows.map(walletRow).join("")}</div>` : emptyState("No eligible MM/MN wallets were found in Command Center. Add or enable appropriately labeled wallets before activating this strategy.")}
  <div class="mm-pages">${Array.from({length:pages},(_,i)=>`<button data-page="${i+1}" ${state.page===i+1?"disabled":""}>${i+1}</button>`).join("")}</div></article>`;
}

function walletRow(wallet) {
  const balance = state.balances.get(wallet.id);
  return `<div class="mm-row"><span><strong>${esc(wallet.label)}</strong><small>${short(wallet.address)}</small></span><span>${balance?fmt(balance.eth,18,4):"—"}</span><span>${balance?fmt(balance.weth,18,4):"—"}</span><span>${balance?fmtToken(balance.projectToken):"—"}</span><span>${wallet.signerStatus}</span><span>${balance?.nonce??"—"}</span><span class="${wallet.eligibility?.eligible?"ok":"bad"}">${wallet.eligibility?.eligible?"Eligible":wallet.eligibility?.reasons.join(", ")}</span><span>Unassigned</span></div>`;
}

function poolDetails() {
  if (!state.pool) return `<p class="mm-muted">Load a token and pool to read slot0 and liquidity.</p>`;
  return `<dl><div><dt>Token0</dt><dd>${short(state.pool.token0)}</dd></div><div><dt>Token1</dt><dd>${short(state.pool.token1)}</dd></div><div><dt>Fee tier</dt><dd>${state.pool.fee}</dd></div><div><dt>Current tick</dt><dd>${state.pool.tick}</dd></div><div><dt>sqrtPriceX96</dt><dd>${state.pool.sqrtPriceX96}</dd></div><div><dt>Active liquidity</dt><dd>${state.pool.liquidity}</dd></div></dl>`;
}
function strategyFields(){return `<div class="mm-form"><label>Wallet prefix<select><option>MM</option><option>MN</option></select></label><label>Action<select><option>Inventory rebalance</option><option>Treasury token sale</option><option>Treasury buyback</option><option>Collect LP fees</option><option>Gas funding</option></select></label><label>Strategy period<select><option>Daily</option><option>Weekly</option><option>Hourly</option><option>Custom</option></select></label><label>Max treasury sell %<input type="number" min="0" max="100" value="0"></label></div><p class="mm-warning">Saving is disabled because this repository has no authenticated durable strategy store.</p>`}
function riskFields(){return `<div class="mm-form"><label>Maximum slippage %<input type="number" value="1"></label><label>Maximum price impact %<input type="number" value="2"></label><label>Minimum pool TVL<input placeholder="USD"></label><label>Minimum native gas balance<input value="0.002"></label><label>Maximum transactions/hour<input type="number" value="1"></label><label>Cooldown seconds<input type="number" value="300"></label></div><p class="mm-warning">Controls are displayed read-only until authenticated strategy persistence exists.</p>`}
function automationPanel(){const enabledAt=localStorage.getItem("mmAutomationEnabledAt");return `<div class="mm-form"><label>Current environment<input readonly value="${environmentLabel(state.environment)}"></label><label>Emergency status<input readonly value="${state.emergencyPaused?"Paused":"Ready"}"></label><label>Automated activation<input readonly value="${enabledAt?new Date(enabledAt).toLocaleString():"Not activated"}"></label></div><p class="mm-warning">Automated execution never bypasses explicit wallet assignment, controlled-wallet checks, limits, simulation, or reservations.</p>`}
function emptyState(text){return `<div class="mm-empty"><strong>Not configured</strong><p>${text}</p></div>`}
function setNotice(text,error=false){let el=root.querySelector(".mm-notice");if(!el){el=document.createElement("div");el.className="mm-notice";root.querySelector(".mm-shell")?.prepend(el)}el.textContent=text;el.classList.toggle("error",error)}
function fmt(value,decimals,digits){return Number(ethers.formatUnits(value,decimals)).toLocaleString(undefined,{maximumFractionDigits:digits})}
function fmtToken(value){return fmt(value,state.tokenDecimals,4)}
function short(value){return value?`${value.slice(0,6)}…${value.slice(-4)}`:"—"}
function esc(value){return String(value??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
