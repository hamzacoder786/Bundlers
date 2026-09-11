import { Interface, ZeroAddress, parseEther, parseUnits } from "ethers";

export const PONS_FACTORY_EVENTS = [
  "event TokenLaunched(address indexed token,address indexed deployer,address indexed dexFactory,address pairToken,address pool,uint256 dexId,uint256 launchConfigId,uint256 positionId,uint256 restrictionsEndBlock,uint256 initialBuyAmount)",
];

export function calculateMinOut(expectedOut, slippageBps) {
  if (slippageBps < 0n || slippageBps > 10_000n) {
    throw new Error("Invalid slippage bps.");
  }
  return (expectedOut * (10_000n - slippageBps)) / 10_000n;
}

export function tokenOrdering(token, pairToken) {
  const left = BigInt(token.toLowerCase());
  const right = BigInt(pairToken.toLowerCase());
  return {
    token0: left < right ? token : pairToken,
    token1: left < right ? pairToken : token,
    isToken0: left < right,
  };
}

export function calculateLaunchValue(launchFeeEth, primaryBuyEth) {
  return parseEther(launchFeeEth) + parseEther(primaryBuyEth || "0");
}

export function parseTokenAmount(value, decimals = 18) {
  return parseUnits(String(value), decimals);
}

export function validateBuyerOrder(rows) {
  const enabled = rows.filter((row) => row.enabled);
  const seen = new Set();
  for (const row of enabled) {
    if (!row.recipient || row.recipient === ZeroAddress) {
      throw new Error(`Buyer ${row.index + 1} has an invalid recipient.`);
    }
    const key = row.recipient.toLowerCase();
    if (seen.has(key)) {
      throw new Error(`Duplicate buyer recipient: ${row.recipient}`);
    }
    seen.add(key);
  }
  return enabled.map((row) => row.index);
}

export function decodeTokenLaunched(logs, factoryAddress) {
  const iface = new Interface(PONS_FACTORY_EVENTS);
  for (const log of logs) {
    if (log.address.toLowerCase() !== factoryAddress.toLowerCase()) continue;
    try {
      const parsed = iface.parseLog(log);
      if (parsed?.name !== "TokenLaunched") continue;
      return {
        token: parsed.args.token,
        pool: parsed.args.pool,
        restrictionsEndBlock: parsed.args.restrictionsEndBlock,
        initialBuyAmount: parsed.args.initialBuyAmount,
      };
    } catch {
      // Ignore unrelated logs.
    }
  }
  return null;
}
