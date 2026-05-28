#!/usr/bin/env node
// Cross-platform installer for the pi-dash skill.
// Usage:
//   node install.mjs                 # interactive: prompts which target(s) to install
//   node install.mjs --all           # install to both Claude Code and Codex
//   node install.mjs --claude-code   # install to Claude Code only
//   node install.mjs --codex         # install to Codex only

import { existsSync, rmSync, cpSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout, argv, env, exit } from 'node:process';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_NAME = 'pi-dash';
const SOURCE_DIR = resolve(SCRIPT_DIR, 'skills', 'codex', SKILL_NAME);

const TARGETS = {
  'claude-code': {
    label: 'Claude Code',
    dir: join(env.CLAUDE_HOME || join(homedir(), '.claude'), 'skills', SKILL_NAME),
  },
  codex: {
    label: 'Codex',
    dir: join(env.CODEX_HOME || join(homedir(), '.codex'), 'skills', SKILL_NAME),
  },
};

const ALL_KEYS = ['claude-code', 'codex'];

function parseFlag() {
  const flags = argv.slice(2);
  if (flags.includes('--all')) return ALL_KEYS;
  if (flags.includes('--claude-code')) return ['claude-code'];
  if (flags.includes('--codex')) return ['codex'];
  if (flags.includes('--help') || flags.includes('-h')) {
    printUsage();
    exit(0);
  }
  return null;
}

function printUsage() {
  stdout.write(
    [
      'pi-dash skill installer',
      '',
      'Usage:',
      '  node install.mjs                 Interactive prompt (default: all)',
      '  node install.mjs --all           Install to Claude Code and Codex',
      '  node install.mjs --claude-code   Install to Claude Code only',
      '  node install.mjs --codex         Install to Codex only',
      '',
      'Targets:',
      `  Claude Code  ->  ${TARGETS['claude-code'].dir}`,
      `  Codex        ->  ${TARGETS.codex.dir}`,
      '',
    ].join('\n'),
  );
}

async function promptForTargets() {
  stdout.write(
    [
      'pi-dash skill installer',
      '',
      `Source: ${SOURCE_DIR}`,
      '',
      'Install to:',
      '  1) All (Claude Code + Codex)   [default]',
      '  2) Claude Code only',
      '  3) Codex only',
      '',
    ].join('\n'),
  );

  if (!stdin.isTTY) {
    stdout.write('Non-interactive shell detected — defaulting to "all".\n');
    return ALL_KEYS;
  }

  const rl = createInterface({ input: stdin, output: stdout });
  const answer = ((await rl.question('Choose [1]: ')) || '').trim() || '1';
  rl.close();

  switch (answer) {
    case '1':
      return ALL_KEYS;
    case '2':
      return ['claude-code'];
    case '3':
      return ['codex'];
    default:
      stdout.write(`Invalid choice: ${answer}\n`);
      exit(1);
  }
}

function installToTarget(key) {
  const { label, dir } = TARGETS[key];
  mkdirSync(dirname(dir), { recursive: true });
  if (existsSync(dir)) {
    stdout.write(`[${label}] replacing existing skill at ${dir}\n`);
    rmSync(dir, { recursive: true, force: true });
  }
  cpSync(SOURCE_DIR, dir, { recursive: true });
  stdout.write(`[${label}] installed to ${dir}\n`);
}

async function main() {
  if (!existsSync(SOURCE_DIR)) {
    stdout.write(`Error: skill source not found at ${SOURCE_DIR}\n`);
    stdout.write('Run this script from the pi-dash-skill repo root.\n');
    exit(1);
  }

  const selected = parseFlag() ?? (await promptForTargets());

  for (const key of selected) {
    installToTarget(key);
  }

  stdout.write('\nDone. Restart the agent to pick up the new skill.\n');
}

main().catch((err) => {
  stdout.write(`${err.stack || err}\n`);
  exit(1);
});
