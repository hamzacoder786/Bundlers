import { Contract, JsonRpcProvider, ethers } from "ethers";
import "./wallet-manager.css";

const RPC_URL = `${window.location.origin}/rpc`;
const EXPLORER = "https://robinhoodchain.blockscout.com";
const TOKEN_ABI = [
  "function balanceOf(address account) view returns(uint256)",
  "function decimals() view returns(uint8)",
  "function symbol() view returns(string)",
  "function totalSupply() view returns(uint256)",
];

const provider = new JsonRpcProvider(RPC_URL, { chainId: 4663, name: "robinhood" }, { staticNetwork: true });
const root = document.querySelector("#wallet-manager");
const managerState = {
  wallets: [],
  balances: new Map(),
  tokenAddress: localStorage.getItem("walletManagerToken") || "",
  tokenSymbol: "TOKEN",
  tokenDecimals: 18,
  totalSupply: 0n,
  loading: false,
  marketMakingFilter: "ALL",
};

renderShell();
bindShell();
initialize();

async function initialize() {
  await loadWallets();
  if (ethers.isAddress(managerState.tokenAddress)) await refreshBalances();
}

function renderShell() {
  root.innerHTML = `
    <main class="wm-shell">
      <header class="wm-header">
        <div>
          <div class="wm-header-links"><a class="wm-back" href="/" target="_self">← Token launcher</a><a class="wm-back" href="/admin/market-making" target="_self">Market Making →</a></div>
          <p class="wm-kicker">Robinhood Chain · Local control surface</p>
          <h1>Wallet Command Center</h1>
          <p class="wm-subtitle">Monitor every managed wallet, then buy or sell from a single focused screen.</p>
        </div>
        <div class="wm-network"><span></span> Chain 4663 · Live</div>
      </header>

      <section class="wm-token-bar">
        <label>
          Token contract
          <input id="wmTokenAddress" value="${escapeHtml(managerState.tokenAddress)}" placeholder="0x token address" autocomplete="off" />
        </label>
        <button id="wmLoadToken" class="wm-primary">Load balances</button>
        <button id="wmRefresh" class="wm-secondary">Refresh</button>
        <p id="wmStatus" class="wm-status">Add a token address to begin.</p>
      </section>

      <section class="wm-summary" aria-label="Portfolio totals">
        ${summaryCard("Token supply", "wmTotalSupply", "—", "Contract-wide")}
        ${summaryCard("Wallet tokens", "wmWalletTokens", "—", "Across managed wallets")}
        ${summaryCard("Total ETH", "wmTotalEth", "—", "Across managed wallets", true)}
        ${summaryCard("Wallets", "wmWalletCount", "0", "Saved locally")}
      </section>

      <section class="wm-main wm-mm-section">
        <div class="wm-section-head">
          <div><p class="wm-kicker">Command Center</p><h2>Market Making Wallets</h2></div>
          <select id="wmMmFilter" aria-label="Market-making wallet filter">
            <option value="ALL">All market-making wallets</option>
            <option value="MM">MM prefix</option><option value="MN">MN prefix</option>
            <option value="ENABLED">Enabled</option><option value="DISABLED">Disabled</option>
            <option value="AVAILABLE">Available</option><option value="PENDING">Pending transaction</option>
            <option value="ASSIGNED">Assigned</option><option value="UNASSIGNED">Unassigned</option>
          </select>
        </div>
        <div id="wmMmRows" class="wm-mm-list"></div>
      </section>

      <section class="wm-layout">
        <div class="wm-main">
          <div class="wm-section-head">
            <div>
              <p class="wm-kicker">Portfolio</p>
              <h2>Managed wallets</h2>
            </div>
            <span id="wmLastUpdated">Not refreshed</span>
          </div>
          <div id="wmWalletRows" class="wm-wallet-list"></div>
        </div>

        <aside class="wm-sidebar">
          <p class="wm-kicker">Local vault</p>
          <h2>Add wallet</h2>
          <p class="wm-note">The private key is written to this project’s <code>.env</code> file and is never returned by the page.</p>
          <form id="wmAddWallet">
            <label>
              Wallet label
              <input id="wmWalletLabel" maxlength="48" placeholder="Marketing 01" required autocomplete="off" />
            </label>
            <label>
              Private key
              <input id="wmWalletKey" type="password" placeholder="0x…" required autocomplete="new-password" />
            </label>
            <button class="wm-primary wm-full" type="submit">Save wallet</button>
          </form>
          <div class="wm-security">
            <strong>Local-only secrets</strong>
            <p>Keep this page on your trusted machine. Never expose the development server publicly.</p>
          </div>
        </aside>
      </section>
    </main>
  `;
}

function summaryCard(label, id, value, meta, accent = false) {
  return `
    <article class="wm-stat ${accent ? "wm-stat-accent" : ""}">
      <p>${label}</p>
      <strong id="${id}">${value}</strong>
      <span>${meta}</span>
    </article>
  `;
}

function bindShell() {
  document.querySelector("#wmLoadToken").addEventListener("click", async () => {
    const value = document.querySelector("#wmTokenAddress").value.trim();
    if (!ethers.isAddress(value)) return setStatus("Enter a valid token contract address.", "error");
    managerState.tokenAddress = ethers.getAddress(value);
    localStorage.setItem("walletManagerToken", managerState.tokenAddress);
    await refreshBalances();
  });
  document.querySelector("#wmRefresh").addEventListener("click", refreshBalances);
  document.querySelector("#wmAddWallet").addEventListener("submit", addWallet);
  document.querySelector("#wmMmFilter").addEventListener("change", (event) => {
    managerState.marketMakingFilter = event.target.value;
    renderMarketMakingRows();
  });
}

async function loadWallets() {
  try {
    const response = await fetch("/api/managed-wallets", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load wallets.");
    managerState.wallets = data.wallets || [];
    document.querySelector("#wmWalletCount").textContent = String(managerState.wallets.length);
    renderWalletRows();
    renderMarketMakingRows();
  } catch (error) {
    setStatus(error.message, "error");
  }
}

function renderMarketMakingRows() {
  const container = document.querySelector("#wmMmRows");
  let wallets = managerState.wallets.filter((wallet) => wallet.marketMakingLabel);
  const filter = managerState.marketMakingFilter;
  if (filter === "MM" || filter === "MN") wallets = wallets.filter((wallet) => wallet.marketMakingLabel.prefix === filter);
  if (filter === "ENABLED") wallets = wallets.filter((wallet) => wallet.enabled);
  if (filter === "DISABLED") wallets = wallets.filter((wallet) => !wallet.enabled);
  if (filter === "AVAILABLE") wallets = wallets.filter((wallet) => wallet.enabled && wallet.signerAvailable && !wallet.pendingTransaction && !wallet.emergencyPaused);
  if (filter === "PENDING") wallets = wallets.filter((wallet) => wallet.pendingTransaction);
  if (filter === "ASSIGNED") wallets = wallets.filter((wallet) => Object.keys(wallet.strategyAssignments || {}).length);
  if (filter === "UNASSIGNED") wallets = wallets.filter((wallet) => !Object.keys(wallet.strategyAssignments || {}).length);
  if (!wallets.length) {
    container.innerHTML = `<div class="wm-empty"><strong>No eligible MM/MN wallets were found in Command Center.</strong><p>Add or enable appropriately labeled wallets before activating this strategy.</p></div>`;
    return;
  }
  container.innerHTML = wallets.map((wallet) => {
    const balance = managerState.balances.get(wallet.address.toLowerCase());
    const assigned = Object.keys(wallet.strategyAssignments || {});
    const available = wallet.enabled && wallet.signerAvailable && !wallet.pendingTransaction && !wallet.emergencyPaused;
    return `<article class="wm-mm-row">
      <strong>${escapeHtml(wallet.label)}</strong><code>${shortAddress(wallet.address)}</code>
      <span>${wallet.chain}</span><span>${wallet.signerStatus}</span>
      <span>${wallet.enabled ? "Enabled" : "Disabled"}</span>
      <span>${balance ? `${formatEth(balance.eth)} ETH` : "— ETH"}</span>
      <span>${balance ? `${formatToken(balance.tokens)} ${escapeHtml(managerState.tokenSymbol)}` : "—"}</span>
      <span>${wallet.pendingTransaction ? "Pending" : available ? "Available" : "Unavailable"}</span>
      <span>${assigned.length ? assigned.join(", ") : "Unassigned"}</span>
      <button type="button" disabled title="Create a strategy before assignment">Assign to Market-Making Strategy</button>
    </article>`;
  }).join("");
}

async function refreshBalances() {
  if (managerState.loading) return;
  if (!ethers.isAddress(managerState.tokenAddress)) {
    setStatus("Load a valid token contract first.", "error");
    return;
  }
  managerState.loading = true;
  setBusy(true);
  setStatus("Reading supply and wallet balances…");
  try {
    const token = new Contract(managerState.tokenAddress, TOKEN_ABI, provider);
    const [decimals, symbol, totalSupply, walletBalances] = await Promise.all([
      token.decimals(),
      token.symbol().catch(() => "TOKEN"),
      token.totalSupply(),
      Promise.all(managerState.wallets.map(async (wallet) => {
        const [eth, tokens] = await Promise.all([
          provider.getBalance(wallet.address),
          token.balanceOf(wallet.address),
        ]);
        return [wallet.address.toLowerCase(), { eth, tokens }];
      })),
    ]);
    managerState.tokenDecimals = Number(decimals);
    managerState.tokenSymbol = symbol;
    managerState.totalSupply = totalSupply;
    managerState.balances = new Map(walletBalances);
    const totalEth = walletBalances.reduce((sum, [, item]) => sum + item.eth, 0n);
    const totalTokens = walletBalances.reduce((sum, [, item]) => sum + item.tokens, 0n);
    document.querySelector("#wmTotalSupply").textContent = `${formatToken(totalSupply)} ${symbol}`;
    document.querySelector("#wmWalletTokens").textContent = `${formatToken(totalTokens)} ${symbol}`;
    document.querySelector("#wmTotalEth").textContent = `${formatEth(totalEth)} ETH`;
    document.querySelector("#wmLastUpdated").textContent = `Updated ${new Date().toLocaleTimeString()}`;
    renderWalletRows();
    setStatus(`Loaded ${symbol} and ${managerState.wallets.length} wallet${managerState.wallets.length === 1 ? "" : "s"}.`, "success");
  } catch (error) {
    setStatus(formatError(error), "error");
  } finally {
    managerState.loading = false;
    setBusy(false);
  }
}

function renderWalletRows() {
  const container = document.querySelector("#wmWalletRows");
  if (!managerState.wallets.length) {
    container.innerHTML = `
      <div class="wm-empty">
        <strong>No managed wallets yet</strong>
        <p>Add a wallet from the local vault panel. Its address and balances will appear here.</p>
      </div>
    `;
    return;
  }
  container.innerHTML = managerState.wallets.map((wallet, index) => {
    const balance = managerState.balances.get(wallet.address.toLowerCase());
    return `
      <article class="wm-wallet" data-wallet="${wallet.address}">
        <div class="wm-wallet-top">
          <div class="wm-wallet-index">${String(index + 1).padStart(2, "0")}</div>
          <div class="wm-wallet-identity">
            <strong>${escapeHtml(wallet.label)}</strong>
            <a href="${EXPLORER}/address/${wallet.address}" target="_blank" rel="noreferrer">${shortAddress(wallet.address)} ↗</a>
          </div>
          <div class="wm-balance">
            <span>ETH balance</span>
            <strong>${balance ? `${formatEth(balance.eth)} ETH` : "—"}</strong>
          </div>
          <div class="wm-balance">
            <span>${escapeHtml(managerState.tokenSymbol)} balance</span>
            <strong>${balance ? formatToken(balance.tokens) : "—"}</strong>
          </div>
          <button class="wm-icon-button" data-action="remove" title="Remove wallet" aria-label="Remove ${escapeHtml(wallet.label)}">×</button>
        </div>
        <div class="wm-trades">
          <form class="wm-trade wm-buy" data-side="buy">
            <div><span class="wm-side-label">Buy</span><small>ETH → ${escapeHtml(managerState.tokenSymbol)}</small></div>
            <label>Spend ETH <input name="amount" inputmode="decimal" placeholder="0.01" required /></label>
            <label>Minimum ${escapeHtml(managerState.tokenSymbol)} <input name="minimumOutput" inputmode="decimal" value="0" required /></label>
            <button class="wm-buy-button" type="submit">Buy</button>
          </form>
          <form class="wm-trade wm-sell" data-side="sell">
            <div><span class="wm-side-label">Sell</span><small>${escapeHtml(managerState.tokenSymbol)} → ETH</small></div>
            <label>Sell tokens <input name="amount" inputmode="decimal" placeholder="all" value="all" required /></label>
            <label>Minimum ETH <input name="minimumOutput" inputmode="decimal" value="0" required /></label>
            <button class="wm-sell-button" type="submit">Sell</button>
          </form>
        </div>
        <div class="wm-wallet-message" aria-live="polite"></div>
      </article>
    `;
  }).join("");

  for (const card of container.querySelectorAll(".wm-wallet")) {
    const address = card.dataset.wallet;
    card.querySelector('[data-action="remove"]').addEventListener("click", () => removeWallet(address));
    for (const form of card.querySelectorAll(".wm-trade")) {
      form.addEventListener("submit", (event) => executeTrade(event, address, form.dataset.side));
    }
  }
}

async function addWallet(event) {
  event.preventDefault();
  const labelInput = document.querySelector("#wmWalletLabel");
  const keyInput = document.querySelector("#wmWalletKey");
  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  setStatus("Saving wallet to the local environment file…");
  try {
    const response = await fetch("/api/managed-wallets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ label: labelInput.value.trim(), privateKey: keyInput.value.trim() }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not save wallet.");
    keyInput.value = "";
    labelInput.value = "";
    await loadWallets();
    if (ethers.isAddress(managerState.tokenAddress)) await refreshBalances();
    setStatus(`${data.wallet.label} saved locally.`, "success");
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    button.disabled = false;
  }
}

async function removeWallet(address) {
  const wallet = managerState.wallets.find((item) => item.address.toLowerCase() === address.toLowerCase());
  if (!wallet || !window.confirm(`Remove ${wallet.label} (${shortAddress(address)}) from the local .env file?`)) return;
  try {
    const response = await fetch(`/api/managed-wallets/${address}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not remove wallet.");
    managerState.balances.delete(address.toLowerCase());
    await loadWallets();
    if (ethers.isAddress(managerState.tokenAddress)) await refreshBalances();
    setStatus(`${wallet.label} removed.`, "success");
  } catch (error) {
    setStatus(error.message, "error");
  }
}

async function executeTrade(event, address, side) {
  event.preventDefault();
  if (!ethers.isAddress(managerState.tokenAddress)) return setStatus("Load a token before trading.", "error");
  const form = event.currentTarget;
  const amount = form.elements.amount.value.trim();
  const minimumOutput = form.elements.minimumOutput.value.trim() || "0";
  const wallet = managerState.wallets.find((item) => item.address.toLowerCase() === address.toLowerCase());
  const action = side === "buy"
    ? `BUY ${managerState.tokenSymbol} with ${amount} ETH`
    : `SELL ${amount.toLowerCase() === "all" ? "ALL" : amount} ${managerState.tokenSymbol} for ETH`;
  if (!window.confirm(`${action}\n\nWallet: ${wallet.label} (${address})\nMinimum output: ${minimumOutput}\n\nThis will submit a real Robinhood Chain transaction.`)) return;

  const card = form.closest(".wm-wallet");
  const message = card.querySelector(".wm-wallet-message");
  const buttons = card.querySelectorAll("button");
  buttons.forEach((button) => { button.disabled = true; });
  message.className = "wm-wallet-message";
  message.textContent = `${side === "buy" ? "Buying" : "Selling"}… simulation, gas estimate, and confirmation in progress.`;
  try {
    const response = await fetch("/api/managed-wallets/trade", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ address, tokenAddress: managerState.tokenAddress, side, amount, minimumOutput }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Trade failed.");
    const links = [
      data.approvalHash ? `<a href="${EXPLORER}/tx/${data.approvalHash}" target="_blank" rel="noreferrer">approval</a>` : "",
      `<a href="${EXPLORER}/tx/${data.hash}" target="_blank" rel="noreferrer">${side}</a>`,
      data.unwrapHash ? `<a href="${EXPLORER}/tx/${data.unwrapHash}" target="_blank" rel="noreferrer">unwrap</a>` : "",
    ].filter(Boolean).join(" · ");
    message.className = "wm-wallet-message success";
    message.innerHTML = `Confirmed in block ${data.blockNumber}. Quoted output ${data.quotedOutput}. ${links}`;
    await refreshBalances();
  } catch (error) {
    message.className = "wm-wallet-message error";
    message.textContent = formatError(error);
  } finally {
    buttons.forEach((button) => { button.disabled = false; });
  }
}

function setBusy(busy) {
  document.querySelector("#wmLoadToken").disabled = busy;
  document.querySelector("#wmRefresh").disabled = busy;
}

function setStatus(message, tone = "") {
  const element = document.querySelector("#wmStatus");
  element.textContent = message;
  element.className = `wm-status ${tone}`.trim();
}

function formatToken(value) {
  return compactNumber(ethers.formatUnits(value, managerState.tokenDecimals), 4);
}

function formatEth(value) {
  return compactNumber(ethers.formatEther(value), 6);
}

function compactNumber(value, maximumFractionDigits) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    notation: Math.abs(numeric) >= 1_000_000 ? "compact" : "standard",
  }).format(numeric);
}

function shortAddress(address) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function formatError(error) {
  return error?.shortMessage || error?.reason || error?.message || String(error);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
