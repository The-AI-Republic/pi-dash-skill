---
name: pi-dash
description: Use when the user wants Codex to create, update, list, move, or inspect Pi Dash issues/projects from the current coding workspace using the pidash CLI. Also use when the user asks to initialize Pi Dash workspace context or connect the current repo to a Pi Dash project.
metadata:
  short-description: Use Pi Dash from Codex
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

## Non-Interactive Mode

Never guess in non-interactive mode. Use explicit project, `.pidash/context.md`, `PIDASH_PROJECT_ID`, local CLI default project, or the cloud workspace default project. If none is available, fail with a clear setup instruction.
