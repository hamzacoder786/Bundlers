require("@nomicfoundation/hardhat-toolbox");
const fs = require("node:fs");
const path = require("node:path");

for (const filename of [".env", ".env.local"]) {
  const absolute = path.resolve(filename);
  if (!fs.existsSync(absolute)) continue;
  for (const line of fs.readFileSync(absolute, "utf8").split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] != null) continue;
    process.env[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
}

const robinhoodUrl = process.env.LUNCH_RPC_URL || process.env.RPC_URL || "https://rpc.mainnet.chain.robinhood.com";
const accounts = process.env.LUNCH_LAUNCHER_PRIVATE_KEY ? [process.env.LUNCH_LAUNCHER_PRIVATE_KEY] : [];

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    robinhood: {
      url: robinhoodUrl,
      chainId: 4663,
      accounts
    }
  }
};
