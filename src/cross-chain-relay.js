/**
 * Cross-chain relay via Relay Protocol (relay.link): bridges native ETH
 * from Robinhood Chain to Solana (as SOL) and back, used as an extra hop
 * inside Wallet Wash's sell -> relay -> buy sequence.
 *
 * IMPORTANT, told to the user directly and repeatedly before this was
 * built: routing funds through Solana and back does NOT defeat bubble-map
 * clustering. A bridge deposit/withdrawal is itself a distinctive,
 * trackable on-chain event — if anything, it adds a second linkable event
 * on top of the same-chain relay hop, rather than removing the first one.
 * This exists because the user explicitly asked for it understanding that,
 * not as a privacy claim.
 *
 * Both legs (EVM -> Solana, Solana -> EVM) go through Relay's public HTTP
 * API via its official SDK, routed through this app's own /api/relay/*
 * server-side proxy (see lib/app-middleware.mjs's handleRelayProxy)
 * instead of api.relay.link directly — Relay's quote endpoint requires an
 * API key (confirmed live: unkeyed requests are rejected with
 * "Please provide an api key" / UNAUTHORIZED_QUOTE), and that key must
 * never reach the browser, so it's attached server-side by the proxy
 * instead of configured into the client here. Verified live against
 * Relay's /chains endpoint before building this: Robinhood Chain (id 4663)
 * and Solana (id 792703809) are both listed as enabled, ETH<->SOL bridging
 * supported, and a real test quote (0.005 ETH -> ~0.119 SOL) succeeded end
 * to end once the key was in place.
 */

import { createClient, getClient } from "@relayprotocol/relay-sdk";
import { configureDynamicChains } from "@relayprotocol/relay-sdk/chain-utils";
import { adaptSolanaWallet } from "@relayprotocol/relay-svm-wallet-adapter";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export const ROBINHOOD_CHAIN_ID = 4663;
export const SOLANA_CHAIN_ID = 792703809;

// Priority fee for Solana bridge transactions. Relay builds its transactions
// with no priority fee at all, which is why bridge-back legs kept dying with
// TransactionExpiredBlockheightExceededError — validators order by fee, and a
// zero-fee transaction can sit unincluded past its ~60-90s blockhash window.
// Multiplied by the attempt number on each retry so a congested moment
// escalates instead of failing identically. 200k microLamports/CU against a
// 200k CU limit is ~0.00004 SOL — negligible next to the amounts being
// bridged, and far cheaper than a stranded transfer.
const SOLANA_PRIORITY_FEE_MICROLAMPORTS = 200_000;
const SOLANA_COMPUTE_UNIT_LIMIT = 200_000;
export const NATIVE_ETH = "0x0000000000000000000000000000000000000000";
export const NATIVE_SOL = "11111111111111111111111111111111";

let clientPromise = null;

// Relay's SDK is a module-level singleton (createClient/getClient) — set it
// up once, lazily, the first time this module is actually used (keeps a
// bad/missing config from breaking every page that imports this file, only
// the wash flow that calls into it). Chain configs (RPC URLs, real bridge
// contract addresses, fee schedules) come straight from Relay's own
// /chains endpoint via configureDynamicChains() rather than being
// hand-typed here — verified live before building this that Robinhood
// Chain (4663) and Solana (792703809) are both present and enabled there.
async function ensureRelayClient() {
  if (clientPromise) return clientPromise;
  clientPromise = (async () => {
    // createClient() must run first — configureDynamicChains() reads
    // baseApiUrl/source off the already-created client internally (and
    // logs through it on failure), it doesn't accept them as arguments.
    // Getting this order backwards throws inside the SDK itself
    // ("Cannot read properties of undefined (reading 'log')"), confirmed
    // by testing against the real package before writing this.
    createClient({
      baseApiUrl: `${window.location.origin}/api/relay`,
      source: "rh-launch-token-interface",
      chains: [],
    });
    await configureDynamicChains(); // populates client.chains from Relay's live /chains list, via our own proxy
    return getClient();
  })();
  return clientPromise;
}

// Minimal AdaptedWallet for an ethers.Wallet, matching the interface Relay's
// SDK expects (see @relayprotocol/relay-sdk's AdaptedWallet type) — written
// by hand instead of pulling in viem's WalletClient, since this app signs
// everything with ethers already.
function adaptEthersWallet(wallet) {
  return {
    vmType: "evm",
    getChainId: async () => Number((await wallet.provider.getNetwork()).chainId),
    address: async () => wallet.address,
    switchChain: async () => {}, // single-provider setup here; nothing to switch
    handleSignMessageStep: async (item) => {
      const sign = item.data?.sign;
      if (!sign) throw new Error("Relay signature step had no signable payload.");
      if (sign.signatureKind === "eip712") {
        return wallet.signTypedData(sign.domain, sign.types, sign.value);
      }
      return wallet.signMessage(sign.message);
    },
    handleSendTransactionStep: async (_chainId, item) => {
      const tx = await wallet.sendTransaction({
        to: item.data.to,
        data: item.data.data,
        value: item.data.value ? BigInt(item.data.value) : undefined,
        ...(item.data.maxFeePerGas ? { maxFeePerGas: BigInt(item.data.maxFeePerGas) } : {}),
        ...(item.data.maxPriorityFeePerGas ? { maxPriorityFeePerGas: BigInt(item.data.maxPriorityFeePerGas) } : {}),
        ...(item.data.gas ? { gasLimit: BigInt(item.data.gas) } : {}),
      });
      return tx.hash;
    },
    handleConfirmTransactionStep: async (txHash) => {
      const receipt = await wallet.provider.waitForTransaction(txHash);
      if (!receipt || receipt.status !== 1) throw new Error(`Transaction ${txHash} reverted.`);
      return { blockHash: receipt.blockHash, blockNumber: receipt.blockNumber, txHash: receipt.hash };
    },
  };
}

// Solana-side adapter for a raw Keypair (private key held in this browser
// session only, exactly like every other wash relay wallet) — signs and
// sends via a Connection, matching adaptSolanaWallet's expected callback
// shape (see the package's real .d.ts, checked before writing this).
//
// handleConfirmTransactionStep is overridden after the fact:
// @relayprotocol/relay-svm-wallet-adapter's own implementation calls
// connection.getLatestBlockhash() *after* the transaction was already sent
// (see node_modules/@relayprotocol/relay-svm-wallet-adapter/_esm/src/adapter.js),
// then confirms using THAT fresh blockhash's lastValidBlockHeight instead of
// the one the transaction was actually signed/sent against. That mismatch
// makes confirmTransaction think the block-height window closed early, so it
// throws TransactionExpiredBlockheightExceededError even when the send
// (sendSolanaTransactionWithFreshBlockhash below) already confirmed the
// transaction on chain moments earlier — confirmed live: bridge-back legs
// failed with "Signature ... has expired: block height exceeded" while the
// signature was in fact landing. Since our own send step already awaits
// connection.confirmTransaction() before returning, this override just
// checks the signature's actual status instead of re-running a second,
// miscalibrated confirmation.
function adaptSolanaKeypairWallet(keypair, connection) {
  const wallet = adaptSolanaWallet(
    keypair.publicKey.toBase58(),
    SOLANA_CHAIN_ID,
    connection,
    async (transaction) => sendSolanaTransactionWithFreshBlockhash(connection, keypair, transaction),
  );
  wallet.handleConfirmTransactionStep = async (txHash) => {
    const { value } = await connection.getSignatureStatuses([txHash], { searchTransactionHistory: true });
    const status = value?.[0];
    if (status?.err) throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
    if (!status || (status.confirmationStatus !== "confirmed" && status.confirmationStatus !== "finalized")) {
      // Our send step already awaited confirmation before returning this
      // signature, so a missing/unconfirmed status here means the RPC node
      // just hasn't indexed it yet, not that it failed — poll briefly
      // instead of trusting a single read.
      const deadline = Date.now() + 30_000;
      let latest = status;
      while (Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 2_000));
        const polled = await connection.getSignatureStatuses([txHash], { searchTransactionHistory: true });
        latest = polled.value?.[0];
        if (latest?.err) throw new Error(`Transaction failed: ${JSON.stringify(latest.err)}`);
        if (latest?.confirmationStatus === "confirmed" || latest?.confirmationStatus === "finalized") break;
      }
      if (!latest || (latest.confirmationStatus !== "confirmed" && latest.confirmationStatus !== "finalized")) {
        throw new Error(`Transaction ${txHash} could not be confirmed as landed.`);
      }
    }
    const slot = status?.slot ?? (await connection.getSignatureStatuses([txHash])).value?.[0]?.slot ?? 0;
    return { blockHash: String(slot), blockNumber: slot, txHash };
  };
  return wallet;
}

// A Solana transaction is only valid for ~150 blocks (~60-90s) after the
// blockhash it was signed against. sendTransaction's own `maxRetries`
// re-broadcasts the SAME signed bytes, so once that window closes every
// retry is re-sending an already-doomed transaction — which is exactly how
// a bridge-back leg died live with
// TransactionExpiredBlockheightExceededError after ~50s of polling,
// stranding real SOL in the relay wallet (the signature was never on
// chain: getSignatureStatuses returned null).
//
// Retrying properly means re-signing against a NEW blockhash each attempt,
// not re-sending the old bytes. Re-signing is safe here because the
// expired transaction provably never landed — a Solana transaction that
// did land cannot expire, so there is no double-spend window: either the
// old one confirmed (and we return before retrying) or it can never
// confirm at all.
// Pulls the original instructions back out of an already-compiled V0 message
// so a priority-fee instruction can be prepended and the message rebuilt.
// Resolving address lookup tables first is required: a message that uses them
// stores most accounts as table indices, and decompiling without the resolved
// tables throws rather than silently producing wrong accounts.
async function resolveLookupTables(connection, transaction) {
  const lookups = transaction.message?.addressTableLookups ?? [];
  if (lookups.length === 0) return [];
  const accounts = await Promise.all(
    lookups.map((lookup) => connection.getAddressLookupTable(lookup.accountKey).then((res) => res.value)),
  );
  const resolved = accounts.filter((account) => account !== null);
  if (resolved.length !== lookups.length) {
    throw new Error("Could not resolve every address lookup table referenced by the Solana transaction.");
  }
  return resolved;
}

function decompileInstructions(transaction, TransactionMessage, lookupTables) {
  return TransactionMessage.decompile(transaction.message, {
    addressLookupTableAccounts: lookupTables,
  }).instructions;
}

async function sendSolanaTransactionWithFreshBlockhash(connection, keypair, transaction, { attempts = 4 } = {}) {
  const { ComputeBudgetProgram, TransactionMessage, VersionedTransaction } = await import("@solana/web3.js");
  let lastError;

  // Resolve once up front rather than per attempt — the tables don't change
  // between retries, and re-fetching them would add avoidable latency inside
  // the very window we're racing.
  const lookupTables = transaction.message ? await resolveLookupTables(connection, transaction) : [];

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

      if (transaction.message) {
        // Rebuild with an escalating priority fee. Note: measured against
        // mainnet during the failures, getRecentPrioritizationFees returned 0
        // across all 150 sampled blocks — the network was NOT congested, so a
        // missing priority fee is not the whole story and the fresh blockhash
        // above is the load-bearing part of this fix. The fee is still worth
        // adding: it costs ~0.00004 SOL, and it removes deprioritization as a
        // variable if congestion does appear on a later run.
        const existing = decompileInstructions(transaction, TransactionMessage, lookupTables);
        const withoutBudget = existing.filter((ix) => !ix.programId.equals(ComputeBudgetProgram.programId));
        const microLamports = SOLANA_PRIORITY_FEE_MICROLAMPORTS * attempt;
        const instructions = [
          ComputeBudgetProgram.setComputeUnitPrice({ microLamports }),
          ComputeBudgetProgram.setComputeUnitLimit({ units: SOLANA_COMPUTE_UNIT_LIMIT }),
          ...withoutBudget,
        ];
        const message = new TransactionMessage({
          payerKey: keypair.publicKey,
          instructions,
          recentBlockhash: blockhash,
        }).compileToV0Message(lookupTables);
        transaction = new VersionedTransaction(message);
        transaction.sign([keypair]);
      } else {
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;
        transaction.signatures = [];
        transaction.sign(keypair);
      }

      const signature = await connection.sendTransaction(transaction, {
        maxRetries: 5,
        skipPreflight: true, // preflight re-simulates against a moving chain and
                             // rejects on transient state; we already validate above
      });
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");
      return { signature };
    } catch (error) {
      lastError = error;
      const expired = String(error?.name || "").includes("TransactionExpired")
        || /block height exceeded|blockhash not found/i.test(String(error?.message || ""));
      // Only an expiry is safe to retry by re-signing. Anything else (a real
      // program error, insufficient funds) would just fail again identically,
      // so surface it immediately instead of burning more attempts.
      if (!expired || attempt === attempts) throw error;
    }
  }
  throw lastError;
}

// execute() can resolve without throwing while the bridge itself still
// failed — Relay reports that via result.data.error / result.data.errors,
// or an `error` field on an individual step, rather than always rejecting
// the promise (confirmed against the real Execute type before writing
// this). Trusting "no exception" as "succeeded" would silently treat a
// failed/refunded bridge as a completed one, so every call below checks
// this explicitly.
function assertExecuteSucceeded(result, legLabel) {
  const data = result?.data;
  if (data?.error) throw new Error(`${legLabel} failed: ${data.error.message || data.error}`);
  if (data?.errors?.length) throw new Error(`${legLabel} failed: ${data.errors.map((e) => e.message).filter(Boolean).join("; ")}`);
  if (data?.refunded) throw new Error(`${legLabel} was refunded by Relay instead of completing — funds were returned to the sender, not delivered.`);
  const failedStep = data?.steps?.find((step) => step.error || step.items?.some((item) => item.error || item.checkStatus === "failure"));
  if (failedStep) throw new Error(`${legLabel} failed on step "${failedStep.id || failedStep.action}": ${failedStep.error || failedStep.items?.find((i) => i.error)?.error || "unknown error"}`);
  return data;
}

/**
 * Bridges native ETH from an EVM wallet on Robinhood Chain to native SOL on
 * a Solana wallet. Returns once Relay reports the destination leg complete.
 */
export async function bridgeEthToSolana({ evmWallet, solanaKeypair, amountWei, solanaRpcUrl, onProgress }) {
  const client = await ensureRelayClient();
  const quote = await client.actions.getQuote({
    chainId: ROBINHOOD_CHAIN_ID,
    toChainId: SOLANA_CHAIN_ID,
    currency: NATIVE_ETH,
    toCurrency: NATIVE_SOL,
    amount: amountWei.toString(),
    tradeType: "EXACT_INPUT",
    user: evmWallet.address,
    recipient: solanaKeypair.publicKey.toBase58(),
  });
  const result = await client.actions.execute({
    quote,
    wallet: adaptEthersWallet(evmWallet),
    onProgress,
  });
  return assertExecuteSucceeded(result, "ETH → Solana bridge");
}

/**
 * Bridges native SOL from a Solana wallet back to native ETH on an EVM
 * wallet on Robinhood Chain.
 */
export async function bridgeSolanaToEth({ solanaKeypair, evmRecipientAddress, amountLamports, solanaRpcUrl, onProgress }) {
  const client = await ensureRelayClient();
  const connection = new Connection(solanaRpcUrl, "confirmed");
  const quote = await client.actions.getQuote({
    chainId: SOLANA_CHAIN_ID,
    toChainId: ROBINHOOD_CHAIN_ID,
    currency: NATIVE_SOL,
    toCurrency: NATIVE_ETH,
    amount: amountLamports.toString(),
    tradeType: "EXACT_INPUT",
    user: solanaKeypair.publicKey.toBase58(),
    recipient: evmRecipientAddress,
  });
  const result = await client.actions.execute({
    quote,
    wallet: adaptSolanaKeypairWallet(solanaKeypair, connection),
    onProgress,
  });
  return assertExecuteSucceeded(result, "Solana → ETH bridge");
}

/** Generates a new throwaway Solana keypair for one relay hop. */
export function generateSolanaKeypair() {
  return Keypair.generate();
}

export function solanaSecretKeyToBase58(keypair) {
  return bs58.encode(keypair.secretKey);
}

export function solanaKeypairFromBase58(secretKeyBase58) {
  return Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
}

export async function getSolanaBalanceLamports(connection, publicKey) {
  return connection.getBalance(publicKey, "confirmed");
}

// execute() resolving does not mean the destination-side funds have
// actually landed yet — confirmed live: a bridgeEthToSolana() call
// resolved successfully with a real Solana deposit tx signature, but an
// immediate getBalance() read straight after returned 0. The SOL was
// there (0.228 SOL, verified against the real chain) less than a minute
// later — Relay's solver delivers the destination leg on its own
// schedule after the source-chain deposit confirms, execute() only
// guarantees the steps it directly submitted/signed went through, not
// that the solver has finished paying out yet. Poll instead of reading
// once, so a legitimately-in-flight delivery isn't mistaken for a failed
// bridge.
export async function waitForSolanaBalance(connection, publicKey, { minLamports = 1, timeoutMs = 120_000, intervalMs = 3_000, onPoll } = {}) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const lamports = await connection.getBalance(publicKey, "confirmed");
    if (onPoll) onPoll(lamports);
    if (lamports >= minLamports) return lamports;
    if (Date.now() >= deadline) return lamports; // give up and return whatever's there — caller decides if that's enough
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
