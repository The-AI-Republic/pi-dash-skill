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

## Install In Codex

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
