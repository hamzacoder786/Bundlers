export const MARKET_MAKING_LABEL = /^(MM|MN)([1-9][0-9]*)?$/;
export const MARKET_MAKING_ROLES = Object.freeze([
  "TREASURY_SELLER", "TREASURY_BUYER", "LIQUIDITY_MANAGER",
  "FEE_COLLECTOR", "GAS_FUNDER", "READ_ONLY",
]);

export function parseMarketMakingLabel(label) {
  const match = MARKET_MAKING_LABEL.exec(String(label || ""));
  return match ? { prefix: match[1], number: match[2] ? Number(match[2]) : null } : null;
}

export function walletEligibility(wallet, input) {
  const reasons = [];
  const parsed = parseMarketMakingLabel(wallet.label);
  if (!parsed || parsed.prefix !== input.labelPrefix) reasons.push("LABEL_PREFIX_MISMATCH");
  if (wallet.projectId !== input.projectId) reasons.push("OTHER_PROJECT");
  if (Number(wallet.chainId) !== Number(input.chainId)) reasons.push("WRONG_CHAIN");
  if (!wallet.enabled) reasons.push("DISABLED");
  if (wallet.archived) reasons.push("ARCHIVED");
  if (wallet.watchOnly) reasons.push("WATCH_ONLY");
  if (!wallet.signerAvailable) reasons.push("SIGNER_UNAVAILABLE");
  if (wallet.emergencyPaused) reasons.push("EMERGENCY_PAUSED");
  return { eligible: reasons.length === 0, reasons };
}

export function listEligibleWallets(wallets, input) {
  return wallets.map((wallet) => ({ ...wallet, eligibility: walletEligibility(wallet, input) }));
}

export function controlledWalletSet(wallets, extraAddresses = []) {
  return new Set([
    ...wallets.filter((wallet) => parseMarketMakingLabel(wallet.label) || wallet.projectControlled)
      .map((wallet) => wallet.address.toLowerCase()),
    ...extraAddresses.map((address) => address.toLowerCase()),
  ]);
}

export function assertNoControlledCounterparty(input) {
  const controlled = input.controlledWallets;
  if (controlled.has(input.from.toLowerCase()) && controlled.has(input.intentionalCounterparty.toLowerCase())) {
    throw new Error("CONTROLLED_WALLET_SELF_TRADE");
  }
}

export function classifyExecution(input) {
  if (input.kind === "GAS_FUNDING") return { category: "INTERNAL_TREASURY_TRANSFER", countsAsVolume: false, organic: false };
  if (input.controlled) return { category: "TREASURY_EXECUTION", countsAsVolume: false, organic: false };
  return { category: "USER_EXECUTION", countsAsVolume: true, organic: true };
}

export function finalPermittedAmount(values) {
  const normalized = values.map(BigInt);
  return normalized.reduce((minimum, value) => value < minimum ? value : minimum);
}

export function selectExecutionWallet(wallets, input) {
  const candidates = wallets.filter((wallet) => {
    const assignment = wallet.assignments?.[input.strategyId];
    if (!assignment?.enabled || !assignment.roles?.includes(input.requiredRole)) return false;
    if (wallet.pendingTransaction || wallet.cooldownUntil > input.now) return false;
    if (BigInt(wallet.nativeBalance) < BigInt(wallet.minimumNativeGasBalance || 0)) return false;
    if (BigInt(wallet.inputBalance) < BigInt(input.requiredInputAmount)) return false;
    if (BigInt(wallet.remainingAllowance) < BigInt(input.requiredInputAmount)) return false;
    return true;
  });
  candidates.sort((a, b) =>
    Number(a.lastSuccessfulExecution || 0) - Number(b.lastSuccessfulExecution || 0) ||
    Number(a.pendingNonce || 0) - Number(b.pendingNonce || 0) ||
    a.address.toLowerCase().localeCompare(b.address.toLowerCase()));
  if (!candidates.length) throw new Error("NO_ELIGIBLE_ASSIGNED_WALLET");
  return candidates[0];
}

export class ReservationBook {
  #walletLocks = new Set();
  #strategyLocks = new Set();
  #reservations = new Map();

  reserve(input) {
    const walletKey = `${input.walletId}:${input.tokenAddress.toLowerCase()}`;
    if (this.#walletLocks.has(walletKey) || this.#strategyLocks.has(input.strategyId)) {
      throw new Error("RESERVATION_CONFLICT");
    }
    this.#walletLocks.add(walletKey);
    this.#strategyLocks.add(input.strategyId);
    const reservation = { ...input, id: input.executionId, status: "RESERVED" };
    this.#reservations.set(reservation.id, reservation);
    return reservation;
  }

  release(id) {
    const reservation = this.#reservations.get(id);
    if (!reservation) return;
    this.#walletLocks.delete(`${reservation.walletId}:${reservation.tokenAddress.toLowerCase()}`);
    this.#strategyLocks.delete(reservation.strategyId);
    reservation.status = "RELEASED";
  }
}
