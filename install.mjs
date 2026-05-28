#!/usr/bin/env node
// Cross-platform installer for the pi-dash skill.
// Usage:
//   node install.mjs                 # interactive: prompts which target(s) to install
//   node install.mjs --all           # install to both Claude Code and Codex
//   node install.mjs --claude-code   # install to Claude Code only
//   node install.mjs --codex         # install to Codex only

import { existsSync, rmSync, cpSync, mkdirSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout, stderr, argv, env, exit, pid, versions } from 'node:process';

const REQUIRED_NODE_MAJOR = 18;
const detectedNode = versions.node;
if (Number(detectedNode.split('.')[0]) < REQUIRED_NODE_MAJOR) {
  stderr.write(
    `Error: install.mjs requires Node.js ${REQUIRED_NODE_MAJOR}+ (detected ${detectedNode}).\n`,
  );
  exit(1);
}

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_NAME = 'pi-dash';
const SOURCE_DIR = resolve(SCRIPT_DIR, 'skills', 'codex', SKILL_NAME);

const TARGETS = {
  'claude-code': {
    label: 'Claude Code',
    dir: join(env.CLAUDE_HOME || join(homedir(), '.claude'), 'skills', SKILL_NAME),
    excludePaths: ['agents'],
  },
  codex: {
    label: 'Codex',
    dir: join(env.CODEX_HOME || join(homedir(), '.codex'), 'skills', SKILL_NAME),
    excludePaths: [],
  },
};

const ALL_KEYS = Object.keys(TARGETS);
const TARGET_FLAGS = new Map([
  ['--all', ALL_KEYS],
  ['--claude-code', ['claude-code']],
  ['--codex', ['codex']],
]);
const KNOWN_FLAGS = new Set([...TARGET_FLAGS.keys(), '--help', '-h']);

function printUsage(out = stdout) {
  out.write(
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
      ...ALL_KEYS.map((key) => `  ${TARGETS[key].label.padEnd(12)} ->  ${TARGETS[key].dir}`),
      '',
      'Environment:',
      '  CLAUDE_HOME  override Claude Code home (default: ~/.claude)',
      '  CODEX_HOME   override Codex home (default: ~/.codex)',
      '',
    ].join('\n'),
  );
}

function parseFlag() {
  const flags = argv.slice(2);
  if (flags.length === 0) return null;

  const unknown = flags.filter((f) => !KNOWN_FLAGS.has(f));
  if (unknown.length > 0) {
    stderr.write(`Error: unknown flag(s): ${unknown.join(' ')}\n`);
    printUsage(stderr);
    exit(1);
  }

  if (flags.includes('--help') || flags.includes('-h')) {
    printUsage();
    exit(0);
  }

  const targets = flags.filter((f) => TARGET_FLAGS.has(f));
  if (targets.length > 1) {
    stderr.write(`Error: pass only one target flag; got: ${targets.join(' ')}\n`);
    exit(1);
  }
  return targets.length === 1 ? TARGET_FLAGS.get(targets[0]) : null;
}

async function promptForTargets() {
  if (!stdin.isTTY) {
    stderr.write(
      'Non-interactive shell detected. Re-run with --all, --claude-code, or --codex.\n',
    );
    exit(1);
  }

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

  const rl = createInterface({ input: stdin, output: stdout });
  let answer;
  try {
    answer = ((await rl.question('Choose [1]: ')) || '').trim() || '1';
  } finally {
    rl.close();
  }

  switch (answer) {
    case '1':
      return ALL_KEYS;
    case '2':
      return ['claude-code'];
    case '3':
      return ['codex'];
    default:
      stderr.write(`Invalid choice: ${answer}\n`);
      exit(1);
  }
}

function makeExcludeFilter(excludePaths) {
  if (excludePaths.length === 0) return undefined;
  const exclude = new Set(excludePaths.map((p) => p.split('/').join(sep)));
  return (src) => !exclude.has(relative(SOURCE_DIR, src));
}

function installToTarget(key) {
  const { label, dir, excludePaths } = TARGETS[key];
  mkdirSync(dirname(dir), { recursive: true });

  const stamp = `${pid}-${Date.now()}`;
  const stagingDir = `${dir}.installing-${stamp}`;
  const backupDir = `${dir}.bak-${stamp}`;
  const filter = makeExcludeFilter(excludePaths);
  let backedUp = false;

  try {
    cpSync(SOURCE_DIR, stagingDir, { recursive: true, filter });

    if (existsSync(dir)) {
      stdout.write(`[${label}] replacing existing skill at ${dir}\n`);
      renameSync(dir, backupDir);
      backedUp = true;
    }

    renameSync(stagingDir, dir);

    if (backedUp) {
      rmSync(backupDir, { recursive: true, force: true });
    }
    stdout.write(`[${label}] installed to ${dir}\n`);
  } catch (err) {
    if (existsSync(stagingDir)) {
      rmSync(stagingDir, { recursive: true, force: true });
    }
    if (backedUp) {
      if (!existsSync(dir)) {
        renameSync(backupDir, dir);
      } else {
        rmSync(backupDir, { recursive: true, force: true });
      }
    }
    throw err;
  }
}

async function main() {
  if (!existsSync(SOURCE_DIR)) {
    stderr.write(`Error: skill source not found at ${SOURCE_DIR}\n`);
    stderr.write('install.mjs must sit next to the skills/ directory.\n');
    exit(1);
  }

  const selected = parseFlag() ?? (await promptForTargets());

  for (const key of selected) {
    installToTarget(key);
  }

  stdout.write('\nDone. Restart the agent to pick up the new skill.\n');
}

main().catch((err) => {
  const message =
    err?.stack || (err === undefined || err === null ? '(unknown error)' : String(err));
  stderr.write(`${message}\n`);
  exit(1);
});
