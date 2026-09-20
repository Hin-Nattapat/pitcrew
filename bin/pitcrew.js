#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { select } from '@inquirer/prompts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(repoRoot, 'skills', 'pitcrew');

const targets = {
  antigravity: { label: 'Antigravity CLI', project: ['.agents', 'skills'], global: ['.gemini', 'antigravity-cli', 'skills'] },
  codex: { label: 'Codex', project: ['.agents', 'skills'], global: ['.agents', 'skills'] },
  claude: { label: 'Claude Code', project: ['.claude', 'skills'], global: ['.claude', 'skills'] },
};

function usage() {
  console.log(`Pitcrew installer

Usage:
  pitcrew install [options]

Options:
  --target <antigravity|codex|claude|all>
  --scope <project|global>
  --force       replace an existing Pitcrew installation
  --dry-run     show destinations without writing files
  --help`);
}

function parseArgs(args) {
  const first = args[0];
  const options = { command: first && !first.startsWith('-') ? first : first ? 'install' : 'help', force: false, dryRun: false };
  const start = first && !first.startsWith('-') ? 1 : 0;
  for (let index = start; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.command = 'help';
    else if (arg === '--force') options.force = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--target') options.target = args[++index];
    else if (arg === '--scope') options.scope = args[++index];
    else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

export async function chooseInteractive({ select: selectPrompt = select } = {}) {
  const target = await selectPrompt({
    message: 'Install for:',
    choices: [
      { name: 'Antigravity CLI', value: 'antigravity' },
      { name: 'Codex', value: 'codex' },
      { name: 'Claude Code', value: 'claude' },
      { name: 'All', value: 'all' },
    ],
  });
  const scope = await selectPrompt({
    message: 'Install scope:',
    choices: [
      { name: 'This project', value: 'project' },
      { name: 'Global (all projects)', value: 'global' },
    ],
  });
  return { target, scope };
}

async function choose(options) {
  if (options.target && options.scope) return options;
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Pass --target and --scope in non-interactive mode.');
  return { ...options, ...(await chooseInteractive()) };
}

function destinations(target, scope, cwd) {
  const names = target === 'all' ? Object.keys(targets) : [target];
  const paths = new Map();
  for (const name of names) {
    const config = targets[name];
    const base = scope === 'project' ? cwd : homedir();
    const pathParts = scope === 'project' ? config.project : config.global;
    const destination = join(base, ...pathParts, 'pitcrew');
    const label = paths.get(destination);
    paths.set(destination, label ? `${label}, ${config.label}` : config.label);
  }
  return [...paths.entries()].map(([path, label]) => ({ path, label }));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.command === 'help') return usage();
  if (options.command !== 'install') throw new Error(`Unknown command: ${options.command}`);
  if (!existsSync(source)) throw new Error(`Pitcrew skill source is missing: ${source}`);

  await choose(options);
  if (!['antigravity', 'codex', 'claude', 'all'].includes(options.target)) throw new Error(`Invalid target: ${options.target}`);
  if (!['project', 'global'].includes(options.scope)) throw new Error(`Invalid scope: ${options.scope}`);

  const locations = destinations(options.target, options.scope, process.cwd());
  const existing = locations.filter(({ path }) => existsSync(path) && !options.force);
  if (existing.length) throw new Error(`${existing.map(({ path }) => path).join(', ')} already exists; use --force to replace it.`);

  for (const { path, label } of locations) {
    console.log(`${options.dryRun ? 'Would install' : 'Installing'} Pitcrew for ${label}: ${path}`);
    if (!options.dryRun) {
      mkdirSync(dirname(path), { recursive: true });
      cpSync(source, path, { recursive: true, force: true });
    }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`pitcrew: ${error.message}`);
    process.exitCode = 1;
  });
}
