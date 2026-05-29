---
name: pidash
description: Use when the user wants to create, update, list, move, search, or inspect Pi Dash issues/projects from the current coding workspace using the pidash CLI. Also use when the user asks to initialize Pi Dash workspace context or connect the current repo to a Pi Dash project.
metadata:
  short-description: Use Pi Dash from a coding agent
---

# Pi Dash

Use the local `pidash` CLI to work with Pi Dash from the current coding workspace.

## Core Workflow

For detailed behavior, read `references/pidash-workflows.md` before creating or moving issues.

Preflight on first use:

```bash
pidash --version
pidash workspace me
```

If authentication fails, ask the user to run:

```bash
pidash auth login
```

## Project Context

Check `.pidash/context.md` in the workspace root.

If it exists, use it as authoritative project context. Do not ask the user which project to use. If multiple projects are present, choose the best match from project names/descriptions and the user's request.

If it is missing, run:

```bash
pidash project list
```

Make a best guess from project metadata and repo signals, then ask the user to confirm. After confirmation:

```bash
pidash context init --project <project-id-or-identifier>
```

## Issue Creation

Create issues with:

```bash
pidash issue create --project <project-id-or-identifier> --title "<title>" --description "<description>"
```

After creating the issue, explicitly say which project was used:

```text
Created issue <identifier> in project <project name>.
```

If the user corrects the project after creation, move the issue:

```bash
pidash issue move <identifier> --project <target-project-id-or-identifier>
```

## Issue Search

Find existing issues by content before creating a new one, or to surface
relevant work for the user:

```bash
pidash issue search "<query>" [--project <slug-or-id>] [--status open|closed|all] [--limit <n>]
```

The query supports websearch syntax (quoted phrases, `OR`, `-exclude`) and is
stem-aware (`color` matches `colors`, `colored`). Default limit is 10, hard
cap is 50.

When to use:

- Before `pidash issue create`, search the title's key phrase to avoid filing
  a duplicate. If a strong match comes back, surface it to the user and ask
  whether to update that one instead.
- When the user says "find", "look up", "show issues about", or wants to
  resume work on an unspecified ticket.

Scope to one project with `--project <slug-or-id>`; omit to search the whole
workspace. Use `--sort -updated` to see the most recently touched matches
first.

## Non-Interactive Mode

Never guess in non-interactive mode. Use explicit project, `.pidash/context.md`, `PIDASH_PROJECT_ID`, local CLI default project, or the cloud workspace default project. If none is available, fail with a clear setup instruction.
