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

## Quick Install (macOS / Linux / Windows)

From a clone of this repository:

```bash
node install.mjs
```

The script prompts for a target — **All** (Claude Code + Codex, default),
**Claude Code only**, or **Codex only** — and copies the skill into the right
directory for each. It works identically on macOS, Linux, and Windows
(PowerShell or cmd) as long as Node.js is installed, which both Claude Code
and Codex already require.

Non-interactive use:

```bash
node install.mjs --all
node install.mjs --claude-code
node install.mjs --codex
```

Restart your agent after installing.

The sections below cover agent-specific install paths if you'd rather skip the
script.

## Install In Codex

### Recommended: use Codex's built-in `$skill-installer`

Codex ships with a system skill that installs other skills directly from a
GitHub repo — no clone or `cp` required. Inside a Codex session, ask:

```text
Install the pi-dash skill from github.com/The-AI-Republic/pi-dash-skill at skills/codex/pi-dash
```

Codex invokes `$skill-installer`, which runs:

```bash
scripts/install-skill-from-github.py \
  --repo The-AI-Republic/pi-dash-skill \
  --path skills/codex/pi-dash
```

The skill lands in `~/.codex/skills/pi-dash/` (or `$CODEX_HOME/skills/pi-dash`).
Private repos are supported via existing git credentials or `GITHUB_TOKEN` /
`GH_TOKEN`. Restart Codex after installing.

### Manual install (clone + copy)

From a clone of this repository:

```bash
mkdir -p ~/.codex/skills
rm -rf ~/.codex/skills/pi-dash
cp -R skills/codex/pi-dash ~/.codex/skills/pi-dash
```

Restart Codex after installing. The skill is available as `pi-dash` and should
load automatically for Pi Dash issue/project tasks.

## Install In Claude Code

Claude Code loads personal skills from `~/.claude/skills/<skill-name>/SKILL.md`.
Install the same portable skill folder there:

```bash
mkdir -p ~/.claude/skills
rm -rf ~/.claude/skills/pi-dash
cp -R skills/codex/pi-dash ~/.claude/skills/pi-dash
```

Restart Claude Code after installing. Invoke it directly with:

```text
/pi-dash create an issue to change the font size
```

Claude Code can also load the skill automatically when the request is clearly
about Pi Dash issues, projects, or workspace context.

## Update

Pull the latest repository changes, then rerun the install command for your
agent:

```bash
git pull
rm -rf ~/.codex/skills/pi-dash
cp -R skills/codex/pi-dash ~/.codex/skills/pi-dash
```

For Claude Code, replace the destination with `~/.claude/skills/pi-dash`.

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
