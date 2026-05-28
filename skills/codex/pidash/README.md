# Pi Dash skill

A portable `SKILL.md` package that teaches Claude Code or Codex how to drive
the `pidash` CLI from a coding workspace — creating, listing, moving, and
inspecting Pi Dash issues without leaving the editor session.

## Install

Run the installer from the repository root:

```bash
node install.mjs
```

The installer copies this folder into `~/.claude/skills/pidash/` and/or
`~/.codex/skills/pidash/`. See the [repository README](../../../README.md)
for the full set of install paths — non-interactive flags, env-var overrides
(`CLAUDE_HOME` / `CODEX_HOME`), and Codex's built-in `$skill-installer`.

## Layout

- `SKILL.md` — frontmatter (`name`, `description`, `metadata`) plus the
  behavior guide the agent loads at activation time.
- `agents/openai.yaml` — Codex-specific interface manifest. Not copied into
  Claude Code installs.
- `references/pidash-workflows.md` — detailed workflow notes that `SKILL.md`
  asks the agent to read before creating or moving issues.
