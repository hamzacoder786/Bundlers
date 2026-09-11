import "./login.css";

const root = document.querySelector("#login-app");

const params = new URLSearchParams(window.location.search);
const nextPath = params.get("next") || "/";

const state = {
  mode: "login", // "login" | "register"
};

render();

function render() {
  const isLogin = state.mode === "login";
  root.innerHTML = `
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

          <h1>${isLogin ? "Welcome back" : "Create account"}</h1>
          <p class="hint">${isLogin
            ? "This gate protects access to the deployer, wallet, and market-making tools. Sessions expire after 12 hours."
            : "New accounts are created with the trader role. Username: 3-32 characters (letters, numbers, _ . -). Password: 8+ characters."}</p>

          <form id="authForm">
            <label>
              <span>Username</span>
              <input id="username" name="username" autocomplete="username" placeholder="Enter username" required />
            </label>
            <label>
              <span>Password</span>
              <input id="password" name="password" type="password" autocomplete="${isLogin ? "current-password" : "new-password"}" placeholder="Enter password" required />
            </label>
            <button type="submit" id="submitBtn">${isLogin ? "Sign In" : "Create Account"}</button>
          </form>

          <div class="result" id="authResult"></div>

          <p class="switch-mode">
            ${isLogin ? "No account yet?" : "Already have an account?"}
            <button type="button" id="switchModeBtn">${isLogin ? "Create one" : "Sign in"}</button>
          </p>
        </section>
      </div>
    </main>
  `;
  document.querySelector("#authForm").addEventListener("submit", handleSubmit);
  document.querySelector("#switchModeBtn").addEventListener("click", () => {
    state.mode = isLogin ? "register" : "login";
    render();
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  const isLogin = state.mode === "login";
  const resultEl = document.querySelector("#authResult");
  const submitBtn = document.querySelector("#submitBtn");
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;

  submitBtn.disabled = true;
  submitBtn.textContent = isLogin ? "Signing in..." : "Creating account...";
  resultEl.textContent = "";
  resultEl.classList.remove("error");

  try {
    const response = await fetch(isLogin ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "same-origin",
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || (isLogin ? "Sign in failed." : "Registration failed."));
    }
    window.location.href = nextPath.startsWith("/") ? nextPath : "/";
  } catch (error) {
    resultEl.textContent = error.message;
    resultEl.classList.add("error");
    submitBtn.disabled = false;
    submitBtn.textContent = isLogin ? "Sign In" : "Create Account";
  }
}
