import test from "node:test";
import assert from "node:assert/strict";
import {
  ReservationBook, assertNoControlledCounterparty, classifyExecution,
  controlledWalletSet, finalPermittedAmount, parseMarketMakingLabel,
  selectExecutionWallet, walletEligibility,
} from "../lib/market-making-service.mjs";

test("only exact approved MM/MN labels are eligible", () => {
  for (const label of ["MM", "MM1", "MM27", "MN", "MN6"]) assert.ok(parseMarketMakingLabel(label));
  for (const label of ["MYMM1", "MM-wallet-1", "mm1", "MM0", "MN01", ""]) assert.equal(parseMarketMakingLabel(label), null);
});

const base = { label: "MM1", projectId: "p1", chainId: 4663, enabled: true, archived: false, watchOnly: false, signerAvailable: true, emergencyPaused: false };
test("project, enabled, signer and chain eligibility are enforced", () => {
  assert.equal(walletEligibility(base, { projectId: "p1", chainId: 4663, labelPrefix: "MM" }).eligible, true);
  for (const patch of [{ projectId: "p2" }, { enabled: false }, { watchOnly: true }, { signerAvailable: false }, { chainId: 1 }]) {
    assert.equal(walletEligibility({ ...base, ...patch }, { projectId: "p1", chainId: 4663, labelPrefix: "MM" }).eligible, false);
  }
});

test("matching label without assignment cannot execute and pending wallet is excluded", () => {
  const wallet = { ...base, address: "0x0000000000000000000000000000000000000001", nativeBalance: 10n, inputBalance: 10n, remainingAllowance: 10n, pendingNonce: 0, cooldownUntil: 0, assignments: {} };
  assert.throws(() => selectExecutionWallet([wallet], { strategyId: "s1", requiredRole: "TREASURY_SELLER", requiredInputAmount: 1n, now: 1 }), /NO_ELIGIBLE/);
  wallet.assignments.s1 = { enabled: true, roles: ["TREASURY_SELLER"] };
  wallet.pendingTransaction = true;
  assert.throws(() => selectExecutionWallet([wallet], { strategyId: "s1", requiredRole: "TREASURY_SELLER", requiredInputAmount: 1n, now: 1 }), /NO_ELIGIBLE/);
});

test("wallet and strategy allowances reduce to the strictest amount", () => {
  assert.equal(finalPermittedAmount([100n, 80n, 40n, 60n]), 40n);
});

test("reservations prevent concurrent balance reuse", () => {
  const book = new ReservationBook();
  const input = { walletId: "w1", strategyId: "s1", executionId: "e1", tokenAddress: "0x0000000000000000000000000000000000000001", amount: 1n, estimatedGasCost: 1n };
  book.reserve(input);
  assert.throws(() => book.reserve({ ...input, executionId: "e2" }), /RESERVATION_CONFLICT/);
  book.release("e1");
  assert.doesNotThrow(() => book.reserve({ ...input, executionId: "e3" }));
});

test("MM and MN are commonly controlled and cannot intentionally trade together", () => {
  const wallets = [
    { label: "MM1", address: "0x0000000000000000000000000000000000000001" },
    { label: "MN2", address: "0x0000000000000000000000000000000000000002" },
  ];
  const set = controlledWalletSet(wallets);
  assert.throws(() => assertNoControlledCounterparty({ controlledWallets: set, from: wallets[0].address, intentionalCounterparty: wallets[1].address }), /SELF_TRADE/);
});

test("gas funding and controlled execution never count as organic volume", () => {
  assert.deepEqual(classifyExecution({ kind: "GAS_FUNDING" }), { category: "INTERNAL_TREASURY_TRANSFER", countsAsVolume: false, organic: false });
  assert.deepEqual(classifyExecution({ kind: "SWAP", controlled: true }), { category: "TREASURY_EXECUTION", countsAsVolume: false, organic: false });
});

test("eligibility scales beyond one hundred exactly labeled wallets", () => {
  const wallets = Array.from({ length: 125 }, (_, index) => ({
    ...base,
    label: `MM${index + 1}`,
    address: `0x${(index + 1).toString(16).padStart(40, "0")}`,
  }));
  const eligible = wallets.filter(wallet => walletEligibility(wallet, { projectId: "p1", chainId: 4663, labelPrefix: "MM" }).eligible);
  assert.equal(eligible.length, 125);
  assert.equal(eligible.slice(0, 50).length, 50);
  assert.equal(eligible.slice(100, 125).length, 25);
});
