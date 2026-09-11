#!/usr/bin/env node
// Runs a command with `--env-file=.env.local` if that file exists locally,
// otherwise runs it plain (e.g. on Railway/CI, where real env vars are
// injected by the platform instead of a .env.local file).
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const envFile = '.env.local';
const args = process.argv.slice(2);

const nodeArgs = existsSync(envFile) ? [`--env-file=${envFile}`, ...args] : args;

const result = spawnSync(process.execPath, nodeArgs, { stdio: 'inherit' });

if (result.error) {
  console.error(result.error);
  process.exit(1);
}
process.exit(result.status ?? 1);
