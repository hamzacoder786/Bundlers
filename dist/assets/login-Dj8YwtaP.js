import"./modulepreload-polyfill-B5Qt9EMX.js";const u=document.querySelector("#login-app"),m=new URLSearchParams(window.location.search),i=m.get("next")||"/",s={mode:"login"};c();function c(){const e=s.mode==="login";u.innerHTML=`
      <div class="login-grid">
        <section class="login-visual" aria-hidden="true">
          <div class="visual-panel">
            <div class="visual-badge">Robinhood Chain</div>
            <h2>Launch faster.<br />Trade smarter.</h2>
            <p>Secure access to deployment, wallet operations, and project workflows from one controlled dashboard.</p>
            <ul class="feature-list">
              <li>Protected wallet access</li>
              <li>Project-based orchestration</li>
              <li>Session-controlled login</li>
            </ul>
          </div>
        </section>

        <section class="login-card">
          <div class="brand-row">
            <div class="brand-mark">R</div>
            <span>Robinhood Chain Token Launcher</span>
          </div>

          <h1>${e?"Welcome back":"Create account"}</h1>
          <p class="hint">${e?"This gate protects access to the deployer, wallet, and market-making tools. Sessions expire after 12 hours.":"New accounts are created with the trader role. Username: 3-32 characters (letters, numbers, _ . -). Password: 8+ characters."}</p>

          <form id="authForm">
            <label>
              <span>Username</span>
              <input id="username" name="username" autocomplete="username" placeholder="Enter username" required />
            </label>
            <label>
              <span>Password</span>
              <input id="password" name="password" type="password" autocomplete="${e?"current-password":"new-password"}" placeholder="Enter password" required />
            </label>
            <button type="submit" id="submitBtn">${e?"Sign In":"Create Account"}</button>
          </form>

          <div class="result" id="authResult"></div>

          <p class="switch-mode">
            ${e?"No account yet?":"Already have an account?"}
            <button type="button" id="switchModeBtn">${e?"Create one":"Sign in"}</button>
          </p>
        </section>
      </div>
    </main>
  `,document.querySelector("#authForm").addEventListener("submit",p),document.querySelector("#switchModeBtn").addEventListener("click",()=>{s.mode=e?"register":"login",c()})}async function p(e){e.preventDefault();const t=s.mode==="login",n=document.querySelector("#authResult"),a=document.querySelector("#submitBtn"),l=document.querySelector("#username").value.trim(),d=document.querySelector("#password").value;a.disabled=!0,a.textContent=t?"Signing in...":"Creating account...",n.textContent="",n.classList.remove("error");try{const o=await fetch(t?"/api/auth/login":"/api/auth/register",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({username:l,password:d}),credentials:"same-origin"}),r=await o.json();if(!o.ok||!r.ok)throw new Error(r.error||(t?"Sign in failed.":"Registration failed."));window.location.href=i.startsWith("/")?i:"/"}catch(o){n.textContent=o.message,n.classList.add("error"),a.disabled=!1,a.textContent=t?"Sign In":"Create Account"}}
