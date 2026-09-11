import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const source = path.resolve("artifacts/contracts/HRD.sol/HRD.json");
const destinationDir = path.resolve("src");
const destination = path.join(destinationDir, "HRD.artifact.json");
const verificationDestination = path.join(destinationDir, "HRD.verification.json");

await mkdir(destinationDir, { recursive: true });
await copyFile(source, destination);
console.log(`Exported ${destination}`);

const buildInfoDir = path.resolve("artifacts/build-info");
const buildInfoFiles = await readdir(buildInfoDir);
const newestFirst = await Promise.all(
  buildInfoFiles.map(async (file) => ({
    file,
    mtimeMs: (await stat(path.join(buildInfoDir, file))).mtimeMs,
  })),
);
newestFirst.sort((a, b) => b.mtimeMs - a.mtimeMs);
let verification;

for (const { file } of newestFirst) {
  const buildInfo = JSON.parse(await readFile(path.join(buildInfoDir, file), "utf8"));
  if (buildInfo.output?.contracts?.["contracts/HRD.sol"]?.HRD) {
    verification = {
      contractName: "contracts/HRD.sol:HRD",
      compilerVersion: `v${buildInfo.solcLongVersion}`,
      standardJsonInput: buildInfo.input,
      optimizer: buildInfo.input.settings?.optimizer ?? { enabled: true, runs: 200 },
      evmVersion: buildInfo.input.settings?.evmVersion ?? "london",
    };
    break;
  }
}

if (!verification) {
  throw new Error("Could not find HRD build-info for Blockscout verification export.");
}

await writeFile(verificationDestination, JSON.stringify(verification, null, 2));
console.log(`Exported ${verificationDestination}`);
