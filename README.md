# Pi Dash Skill

Agent skills for using Pi Dash from coding agents. The current skill is written
as a portable `SKILL.md` package and can be installed in Codex or Claude Code.

## Prerequisites

Install and authenticate the Pi Dash CLI first:

```bash
pidash auth login
pidash workspace me
```

The skill uses `.pidash/context.md` in the current workspace to decide which Pi
Dash project to use. Initialize it when needed:

```bash
pidash context init --project <project-id-or-identifier>
```

## Install via npm (recommended)

No clone required — `npx` downloads the installer + skill on demand:

```bash
npx @airepublic/pidash-skill-installer
```

The installer prompts for a target — **All** (Claude Code + Codex, default),
**Claude Code only**, or **Codex only** — fetches the skill from this repo's
`main` branch, and writes it into the agent's skills directory. Works
identically on macOS, Linux, and Windows (PowerShell or cmd).

For a persistent global install:

```bash
npm install -g @airepublic/pidash-skill-installer
pidash-skill-installer
```

Non-interactive use (required when stdin isn't a TTY, e.g. CI):

```bash
npx @airepublic/pidash-skill-installer --all
npx @airepublic/pidash-skill-installer --claude-code
npx @airepublic/pidash-skill-installer --codex
```

Requires Node.js 18+ (both Claude Code and Codex already do). Set
`CLAUDE_HOME` or `CODEX_HOME` to override the default install locations
(`~/.claude` and `~/.codex`). Restart your agent after installing.

## Install from a clone

For development or to test local changes:

```bash
git clone https://github.com/The-AI-Republic/pi-dash-skill.git
cd pi-dash-skill
node install.mjs
```

Same prompts and flags as the npm path; the script skips the GitHub
download because the skill folder is present next to it.

The sections below cover agent-specific install paths if you'd rather skip the
installer altogether.

## Install In Codex

### Recommended: use Codex's built-in `$skill-installer`

Codex ships with a system skill that installs other skills directly from a
GitHub repo — no clone or `cp` required. Inside a Codex session, ask:

```text
Install the pidash skill from github.com/The-AI-Republic/pi-dash-skill at skills/codex/pidash
```

`$skill-installer` resolves the GitHub URL, downloads the folder, and places
it in `~/.codex/skills/pidash/` (or `$CODEX_HOME/skills/pidash`). Private
repos are supported via existing git credentials or `GITHUB_TOKEN` /
`GH_TOKEN`. Restart Codex after installing.

### Manual install (clone + copy)

From a clone of this repository:

```bash
mkdir -p ~/.codex/skills
rm -rf ~/.codex/skills/pidash
cp -R skills/codex/pidash ~/.codex/skills/pidash
```

Restart Codex after installing. The skill is available as `pidash` and should
load automatically for Pi Dash issue/project tasks.

## Install In Claude Code

Claude Code loads personal skills from `~/.claude/skills/<skill-name>/SKILL.md`.
Install the same portable skill folder there:

```bash
mkdir -p ~/.claude/skills
rm -rf ~/.claude/skills/pidash
cp -R skills/codex/pidash ~/.claude/skills/pidash
```

Restart Claude Code after installing. Invoke it directly with:

```text
/pidash create an issue to change the font size
```

Claude Code can also load the skill automatically when the request is clearly
about Pi Dash issues, projects, or workspace context.

## Update

`npx` always pulls the latest skill from `main`:

```bash
npx @airepublic/pidash-skill-installer
```

For a global install:

```bash
npm update -g @airepublic/pidash-skill-installer
pidash-skill-installer
```

From a clone:

```bash
git pull
node install.mjs
```

Pass `--all`, `--claude-code`, or `--codex` to update a specific target
without the prompt.

## Verify

In the project workspace where the agent will run:

```bash
pidash --version
pidash workspace me
pidash project list
```

Then ask the agent to create or inspect a Pi Dash issue. If
`.pidash/context.md` is missing, the agent should list projects, make a best
guess, ask for confirmation, and initialize workspace context after you confirm.
