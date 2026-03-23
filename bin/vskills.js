#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, '../scripts/cli.ts');

const args = ['tsx', cliPath, ...process.argv.slice(2)];
const result = spawnSync('npx', args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
