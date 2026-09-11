# Setup

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev -- --port 5174
```

Open:

```text
http://127.0.0.1:5174/
```

## Build

```bash
npm run build
```

## Tests

```bash
npm test
```

## Environment

Copy `.env.example` to `.env` if you want to externalize public config. The current Vite app still contains the Robinhood defaults directly in `src/main.js` for compatibility with the existing launcher.

## Pons Launch Mode

Selected mode: **Mode B: launch followed by sequential router purchases**.

- Launch function: `launchToken(TokenParams params, uint256 launchConfigId, uint256 dexId, bytes32 salt)`
- Purchase function: Uniswap V3 router `exactInputSingle`
- Additional wallets: the current UI does not request private keys and does not store secrets. Later buys are funded by the connected primary wallet and delivered to configured recipient addresses.
- Atomic purchases: only the primary initial buy can be atomic inside `launchToken`.
- Same-block inclusion: not guaranteed. Extra launch-block buys are blocked by `PonsLauncherToken`.
- Helper contract: not deployed. The existing factory does not need replacement for supported Mode B, and a helper would require separate review.

## Current Limitations

- This repository is a Vite/ethers app, not a Next.js/wagmi app. The Pons tab was integrated into the existing toolchain to avoid replacing the current launcher.
- Independent multi-wallet sessions are not implemented in this Vite app.
- Expected token output before launch is limited because the pool does not exist until the launch transaction confirms.
- The existing Pons factory hardcodes `amountOutMinimum = 0` for the atomic initial buy. Later buys require a user-provided minimum output.
- Fork integration tests are not included yet because the current project is not configured for Foundry or a fork runner.

## Lunch.fun Launch Mode

Selected mode: **Mode B: launch followed by sequential router purchases**.

- Launch proxy: `0xf5Ac14e7691EF44b15b59FcC6a756e41A3E5EFd6`
- Implementation inspected: `0xc419ba7b9c32103ab8b1a04de4ea2ed518e03749`
- Launch function: `launchWithMetaSalt(string,string,uint256,uint24,uint256,Meta,bytes32)`
- Address prediction: `predictTokenAddress(string,string,uint256,address,bytes32)`
- Purchase function for later recipients: V3 router `exactInputSingle`
- Atomic purchases: only the primary creator dev-buy can happen inside the launch transaction.
- Same-block inclusion: not guaranteed.
- Additional wallet rows: recipient addresses funded by the connected primary wallet. No private keys are requested.

## Lunch.fun Launch Plus Immediate Buyer Keys In Local Env

For buyer wallets that must spend from their own ETH balances right after the creator dev-buy, use the local Node script instead of the browser UI. This flow does not require `LUNCH_TOKEN_ADDRESS`; the script launches the token first, waits for the launch receipt, decodes `V3TokenLaunched`, then uses that detected token address for the buyer transactions.

Create `.env.local` in the project root:

```bash
LUNCH_RPC_URL=https://robinhood-mainnet.g.alchemy.com/v2/your-key
LUNCH_LAUNCHER_PRIVATE_KEY=0x_launcher_key
LUNCH_TOKEN_NAME=Example Lunch
LUNCH_TOKEN_SYMBOL=LUNCH
LUNCH_TOTAL_SUPPLY=1000000000
LUNCH_DEV_BUY_ETH=0.05
LUNCH_USER_SALT=
LUNCH_META_IMAGE=
LUNCH_META_BANNER=
LUNCH_META_DESCRIPTION=
LUNCH_META_WEBSITE=
LUNCH_META_TWITTER=
LUNCH_META_TELEGRAM=
LUNCH_ROUTER=0xCaf681a66D020601342297493863E78C959E5cb2
LUNCH_X_TOKEN=0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73
LUNCH_POOL_FEE=10000
LUNCH_BUYER_PRIVATE_KEYS=0x_key_1,0x_key_2,0x_key_3
LUNCH_BUY_AMOUNTS_ETH=0.01,0.02,0.03
LUNCH_MIN_OUT_TOKENS=1000,2000,3000
LUNCH_RECIPIENTS=
```

Then run:

```bash
npm run lunch:launch-and-buy
```

Row 1 is the launcher wallet dev-buy inside `launchWithMetaSalt` when `LUNCH_DEV_BUY_ETH` is greater than zero. Rows 2-7 are the additional buyer private keys in `LUNCH_BUYER_PRIVATE_KEYS`, executed sequentially after the token and pool are detected from the launch receipt.

This is still **Mode B**: the dev-buy is atomic with launch, but additional buyer transactions are sent after launch confirmation. Same-block inclusion for those later buyer wallets is not guaranteed without validator, sequencer, or private bundle support.

## Lunch.fun Buyer-Only Script

If a token already exists and you only need to buy from the env buyer wallets, set `LUNCH_TOKEN_ADDRESS` and run:

```bash
npm run lunch:buyers
```

You can also pass the token address directly:

```bash
npm run lunch:buyers -- --token 0x_launched_token_address
```

Notes:

- `.env.local` is git-ignored.
- Keys are read locally by Node and are never shown in the browser.
- The script logs wallet addresses, transaction hashes, and token amounts received, but never logs private keys.
- It stops on the first failed buy to preserve the configured order.

## Lunch.fun Atomic Launch and Buys

`LunchAtomicExecutor` performs the launch, creator dev-buy, and all additional recipient buys inside one blockchain transaction. No unrelated transaction can execute between these internal calls. If any buy fails, the entire launch transaction reverts.

Important: Lunch.fun records the executor contract as the token creator. The executor is owned by `LUNCH_LAUNCHER_PRIVATE_KEY` and exposes an owner-only `creatorCall` function for creator/fee-locker administration. Buyer rows are recipients funded by the owner; buyer private keys are not used.

Add these values to `.env.local` alongside the existing Lunch token metadata:

```bash
LUNCH_RPC_URL=https://robinhood-mainnet.g.alchemy.com/v2/your-key
LUNCH_LAUNCHER_PRIVATE_KEY=0x_owner_key
LUNCH_ATOMIC_EXECUTOR=
LUNCH_TOKEN_NAME=Example Lunch
LUNCH_TOKEN_SYMBOL=LUNCH
LUNCH_TOTAL_SUPPLY=1000000000
LUNCH_USER_SALT=unique-launch-salt
LUNCH_DEADLINE_SECONDS=300
LUNCH_RECIPIENTS=0x_recipient_1,0x_recipient_2,0x_recipient_3
LUNCH_BUY_AMOUNTS_ETH=0.01,0.02,0.03
LUNCH_MIN_OUT_TOKENS=1000,1900,2700
```

To make a creator purchase, put the creator wallet first in `LUNCH_RECIPIENTS` with its amount and nonzero minimum output in the corresponding first entries. The executor deliberately disables Lunch.fun’s built-in dev-buy because that path has no minimum-output protection.

Deploy the executor once:

```bash
npm run lunch:atomic:deploy
```

Copy the printed `LUNCH_ATOMIC_EXECUTOR` address into `.env.local`. Then simulate and submit the atomic launch:

```bash
npm run lunch:atomic:launch
```

The launch script performs a full `eth_call` simulation and gas estimate before asking the wallet to submit. Test on Robinhood Chain testnet or a mainnet fork and independently review the executor before using material funds. The complete transaction must also fit within the chain's per-transaction gas limit.

## EIP-7702 Atomic Buys From Separate Wallets

The deployed EIP-7702 coordinator makes every buyer EOA spend its own ETH and appear as the direct router caller while keeping the launch and all swaps in one outer transaction.

- Delegate implementation: `0xd2fdF4EB2d5E666D5c7fB621064041A8B0CE3378`
- Atomic coordinator: `0x4884CFB8ecd665b227479B031102B106BEe2F00c`
- Each buyer signs both an EIP-7702 delegation and a nonce-protected EIP-712 authorization limited to the predicted token, exact input, minimum output, and deadline.
- Delegations are revoked in a follow-up type-4 transaction after the atomic launch confirms.
- The buyer private keys are local secrets and must never be committed or shared.

For the command-line flow, set matching comma-separated `LUNCH_BUYER_PRIVATE_KEYS`, `LUNCH_BUY_AMOUNTS_ETH`, and `LUNCH_MIN_OUT_TOKENS`, then run:

```bash
npm run lunch:7702:launch
npm run lunch:7702:revoke # emergency/manual revocation if automatic cleanup is interrupted
```
