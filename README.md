# Pi Dash Skill

Agent skills for using Pi Dash from coding agents.

## Codex

Install the Codex skill from this stable path:

```text
https://github.com/The-AI-Republic/pi-dash-skill/tree/main/skills/codex/pi-dash
```

Manual install:

```bash
mkdir -p ~/.codex/skills
cp -R skills/codex/pi-dash ~/.codex/skills/pi-dash
```

Restart Codex after installing.

## Runtime Dependency

The skill uses the `pidash` CLI. Users should run:

```bash
pidash auth login
pidash workspace me
```

Project context is stored in `.pidash/context.md` inside the workspace and can be initialized with:

```bash
pidash context init --project <project-id-or-identifier>
```
