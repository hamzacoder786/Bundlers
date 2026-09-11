import"./modulepreload-polyfill-B5Qt9EMX.js";import{J as q,i as b,g as H,C as W,f as D,a6 as R}from"./provider-jsonrpc-D-gqrPu_.js";const x=`${window.location.origin}/rpc`,v="https://robinhoodchain.blockscout.com",I=["function balanceOf(address account) view returns(uint256)","function decimals() view returns(uint8)","function symbol() view returns(string)","function totalSupply() view returns(uint256)"],A=new q(x,{chainId:4663,name:"robinhood"},{staticNetwork:!0}),O=document.querySelector("#wallet-manager"),l={wallets:[],balances:new Map,tokenAddress:localStorage.getItem("walletManagerToken")||"",tokenSymbol:"TOKEN",tokenDecimals:18,totalSupply:0n,loading:!1,marketMakingFilter:"ALL"};B();j();P();async function P(){await h(),b(l.tokenAddress)&&await w()}function B(){O.innerHTML=`
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
          <input id="wmTokenAddress" value="${d(l.tokenAddress)}" placeholder="0x token address" autocomplete="off" />
        </label>
        <button id="wmLoadToken" class="wm-primary">Load balances</button>
        <button id="wmRefresh" class="wm-secondary">Refresh</button>
        <p id="wmStatus" class="wm-status">Add a token address to begin.</p>
      </section>

      <section class="wm-summary" aria-label="Portfolio totals">
        ${g("Token supply","wmTotalSupply","—","Contract-wide")}
        ${g("Wallet tokens","wmWalletTokens","—","Across managed wallets")}
        ${g("Total ETH","wmTotalEth","—","Across managed wallets",!0)}
        ${g("Wallets","wmWalletCount","0","Saved locally")}
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
  `}function g(e,a,n,t,s=!1){return`
    <article class="wm-stat ${s?"wm-stat-accent":""}">
      <p>${e}</p>
      <strong id="${a}">${n}</strong>
      <span>${t}</span>
    </article>
  `}function j(){document.querySelector("#wmLoadToken").addEventListener("click",async()=>{const e=document.querySelector("#wmTokenAddress").value.trim();if(!b(e))return o("Enter a valid token contract address.","error");l.tokenAddress=H(e),localStorage.setItem("walletManagerToken",l.tokenAddress),await w()}),document.querySelector("#wmRefresh").addEventListener("click",w),document.querySelector("#wmAddWallet").addEventListener("submit",U),document.querySelector("#wmMmFilter").addEventListener("change",e=>{l.marketMakingFilter=e.target.value,E()})}async function h(){try{const e=await fetch("/api/managed-wallets",{cache:"no-store"}),a=await e.json();if(!e.ok)throw new Error(a.error||"Could not load wallets.");l.wallets=a.wallets||[],document.querySelector("#wmWalletCount").textContent=String(l.wallets.length),T(),E()}catch(e){o(e.message,"error")}}function E(){const e=document.querySelector("#wmMmRows");let a=l.wallets.filter(t=>t.marketMakingLabel);const n=l.marketMakingFilter;if((n==="MM"||n==="MN")&&(a=a.filter(t=>t.marketMakingLabel.prefix===n)),n==="ENABLED"&&(a=a.filter(t=>t.enabled)),n==="DISABLED"&&(a=a.filter(t=>!t.enabled)),n==="AVAILABLE"&&(a=a.filter(t=>t.enabled&&t.signerAvailable&&!t.pendingTransaction&&!t.emergencyPaused)),n==="PENDING"&&(a=a.filter(t=>t.pendingTransaction)),n==="ASSIGNED"&&(a=a.filter(t=>Object.keys(t.strategyAssignments||{}).length)),n==="UNASSIGNED"&&(a=a.filter(t=>!Object.keys(t.strategyAssignments||{}).length)),!a.length){e.innerHTML='<div class="wm-empty"><strong>No eligible MM/MN wallets were found in Command Center.</strong><p>Add or enable appropriately labeled wallets before activating this strategy.</p></div>';return}e.innerHTML=a.map(t=>{const s=l.balances.get(t.address.toLowerCase()),r=Object.keys(t.strategyAssignments||{}),f=t.enabled&&t.signerAvailable&&!t.pendingTransaction&&!t.emergencyPaused;return`<article class="wm-mm-row">
      <strong>${d(t.label)}</strong><code>${S(t.address)}</code>
      <span>${t.chain}</span><span>${t.signerStatus}</span>
      <span>${t.enabled?"Enabled":"Disabled"}</span>
      <span>${s?`${k(s.eth)} ETH`:"— ETH"}</span>
      <span>${s?`${y(s.tokens)} ${d(l.tokenSymbol)}`:"—"}</span>
      <span>${t.pendingTransaction?"Pending":f?"Available":"Unavailable"}</span>
      <span>${r.length?r.join(", "):"Unassigned"}</span>
      <button type="button" disabled title="Create a strategy before assignment">Assign to Market-Making Strategy</button>
    </article>`}).join("")}async function w(){if(!l.loading){if(!b(l.tokenAddress)){o("Load a valid token contract first.","error");return}l.loading=!0,L(!0),o("Reading supply and wallet balances…");try{const e=new W(l.tokenAddress,I,A),[a,n,t,s]=await Promise.all([e.decimals(),e.symbol().catch(()=>"TOKEN"),e.totalSupply(),Promise.all(l.wallets.map(async c=>{const[m,u]=await Promise.all([A.getBalance(c.address),e.balanceOf(c.address)]);return[c.address.toLowerCase(),{eth:m,tokens:u}]}))]);l.tokenDecimals=Number(a),l.tokenSymbol=n,l.totalSupply=t,l.balances=new Map(s);const r=s.reduce((c,[,m])=>c+m.eth,0n),f=s.reduce((c,[,m])=>c+m.tokens,0n);document.querySelector("#wmTotalSupply").textContent=`${y(t)} ${n}`,document.querySelector("#wmWalletTokens").textContent=`${y(f)} ${n}`,document.querySelector("#wmTotalEth").textContent=`${k(r)} ETH`,document.querySelector("#wmLastUpdated").textContent=`Updated ${new Date().toLocaleTimeString()}`,T(),o(`Loaded ${n} and ${l.wallets.length} wallet${l.wallets.length===1?"":"s"}.`,"success")}catch(e){o(C(e),"error")}finally{l.loading=!1,L(!1)}}}function T(){const e=document.querySelector("#wmWalletRows");if(!l.wallets.length){e.innerHTML=`
      <div class="wm-empty">
        <strong>No managed wallets yet</strong>
        <p>Add a wallet from the local vault panel. Its address and balances will appear here.</p>
      </div>
    `;return}e.innerHTML=l.wallets.map((a,n)=>{const t=l.balances.get(a.address.toLowerCase());return`
      <article class="wm-wallet" data-wallet="${a.address}">
        <div class="wm-wallet-top">
          <div class="wm-wallet-index">${String(n+1).padStart(2,"0")}</div>
          <div class="wm-wallet-identity">
            <strong>${d(a.label)}</strong>
            <a href="${v}/address/${a.address}" target="_blank" rel="noreferrer">${S(a.address)} ↗</a>
          </div>
          <div class="wm-balance">
            <span>ETH balance</span>
            <strong>${t?`${k(t.eth)} ETH`:"—"}</strong>
          </div>
          <div class="wm-balance">
            <span>${d(l.tokenSymbol)} balance</span>
            <strong>${t?y(t.tokens):"—"}</strong>
          </div>
          <button class="wm-icon-button" data-action="remove" title="Remove wallet" aria-label="Remove ${d(a.label)}">×</button>
        </div>
        <div class="wm-trades">
          <form class="wm-trade wm-buy" data-side="buy">
            <div><span class="wm-side-label">Buy</span><small>ETH → ${d(l.tokenSymbol)}</small></div>
            <label>Spend ETH <input name="amount" inputmode="decimal" placeholder="0.01" required /></label>
            <label>Minimum ${d(l.tokenSymbol)} <input name="minimumOutput" inputmode="decimal" value="0" required /></label>
            <button class="wm-buy-button" type="submit">Buy</button>
          </form>
          <form class="wm-trade wm-sell" data-side="sell">
            <div><span class="wm-side-label">Sell</span><small>${d(l.tokenSymbol)} → ETH</small></div>
            <label>Sell tokens <input name="amount" inputmode="decimal" placeholder="all" value="all" required /></label>
            <label>Minimum ETH <input name="minimumOutput" inputmode="decimal" value="0" required /></label>
            <button class="wm-sell-button" type="submit">Sell</button>
          </form>
        </div>
        <div class="wm-wallet-message" aria-live="polite"></div>
      </article>
    `}).join("");for(const a of e.querySelectorAll(".wm-wallet")){const n=a.dataset.wallet;a.querySelector('[data-action="remove"]').addEventListener("click",()=>_(n));for(const t of a.querySelectorAll(".wm-trade"))t.addEventListener("submit",s=>F(s,n,t.dataset.side))}}async function U(e){e.preventDefault();const a=document.querySelector("#wmWalletLabel"),n=document.querySelector("#wmWalletKey"),t=e.currentTarget.querySelector("button");t.disabled=!0,o("Saving wallet to the local environment file…");try{const s=await fetch("/api/managed-wallets",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({label:a.value.trim(),privateKey:n.value.trim()})}),r=await s.json();if(!s.ok)throw new Error(r.error||"Could not save wallet.");n.value="",a.value="",await h(),b(l.tokenAddress)&&await w(),o(`${r.wallet.label} saved locally.`,"success")}catch(s){o(s.message,"error")}finally{t.disabled=!1}}async function _(e){const a=l.wallets.find(n=>n.address.toLowerCase()===e.toLowerCase());if(!(!a||!window.confirm(`Remove ${a.label} (${S(e)}) from the local .env file?`)))try{const n=await fetch(`/api/managed-wallets/${e}`,{method:"DELETE"}),t=await n.json();if(!n.ok)throw new Error(t.error||"Could not remove wallet.");l.balances.delete(e.toLowerCase()),await h(),b(l.tokenAddress)&&await w(),o(`${a.label} removed.`,"success")}catch(n){o(n.message,"error")}}async function F(e,a,n){if(e.preventDefault(),!b(l.tokenAddress))return o("Load a token before trading.","error");const t=e.currentTarget,s=t.elements.amount.value.trim(),r=t.elements.minimumOutput.value.trim()||"0",f=l.wallets.find(i=>i.address.toLowerCase()===a.toLowerCase()),c=n==="buy"?`BUY ${l.tokenSymbol} with ${s} ETH`:`SELL ${s.toLowerCase()==="all"?"ALL":s} ${l.tokenSymbol} for ETH`;if(!window.confirm(`${c}

Wallet: ${f.label} (${a})
Minimum output: ${r}

This will submit a real Robinhood Chain transaction.`))return;const m=t.closest(".wm-wallet"),u=m.querySelector(".wm-wallet-message"),$=m.querySelectorAll("button");$.forEach(i=>{i.disabled=!0}),u.className="wm-wallet-message",u.textContent=`${n==="buy"?"Buying":"Selling"}… simulation, gas estimate, and confirmation in progress.`;try{const i=await fetch("/api/managed-wallets/trade",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({address:a,tokenAddress:l.tokenAddress,side:n,amount:s,minimumOutput:r})}),p=await i.json();if(!i.ok)throw new Error(p.error||"Trade failed.");const N=[p.approvalHash?`<a href="${v}/tx/${p.approvalHash}" target="_blank" rel="noreferrer">approval</a>`:"",`<a href="${v}/tx/${p.hash}" target="_blank" rel="noreferrer">${n}</a>`,p.unwrapHash?`<a href="${v}/tx/${p.unwrapHash}" target="_blank" rel="noreferrer">unwrap</a>`:""].filter(Boolean).join(" · ");u.className="wm-wallet-message success",u.innerHTML=`Confirmed in block ${p.blockNumber}. Quoted output ${p.quotedOutput}. ${N}`,await w()}catch(i){u.className="wm-wallet-message error",u.textContent=C(i)}finally{$.forEach(i=>{i.disabled=!1})}}function L(e){document.querySelector("#wmLoadToken").disabled=e,document.querySelector("#wmRefresh").disabled=e}function o(e,a=""){const n=document.querySelector("#wmStatus");n.textContent=e,n.className=`wm-status ${a}`.trim()}function y(e){return M(D(e,l.tokenDecimals),4)}function k(e){return M(R(e),6)}function M(e,a){const n=Number(e);return Number.isFinite(n)?new Intl.NumberFormat("en-US",{maximumFractionDigits:a,notation:Math.abs(n)>=1e6?"compact":"standard"}).format(n):e}function S(e){return`${e.slice(0,6)}…${e.slice(-4)}`}function C(e){return(e==null?void 0:e.shortMessage)||(e==null?void 0:e.reason)||(e==null?void 0:e.message)||String(e)}function d(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
