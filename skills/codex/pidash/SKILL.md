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

## Issue Comments

When posting a Pi Dash issue comment that is your own agent message, mark the comment speaker explicitly:

```bash
pidash comment add <identifier> --body-file <path> --as-agent "Codex" --agent-run-id "$PIDASH_AGENT_RUN_ID"
```

Use your actual runtime name for `--as-agent` when known, for example `Codex` or `Claude Code`; otherwise use `AI Agent`.

If `PIDASH_AGENT_RUN_ID` is not set because you are not inside a Pi Dash agent run, omit `--agent-run-id` but still use `--as-agent`. Do not rely on the authenticated CLI user to identify agent-written comments; `actor` is the audit principal, while `--as-agent` marks who spoke in the issue conversation.

## Pull Requests

When you open a GitHub pull request for the issue you are working on, do **both**, in this order:

1. **Comment the PR link on the issue** (see [Issue Comments](#issue-comments)). Issue comments are the main bridge to the human; this is how a reviewer follows your work in the issue conversation.
2. **Associate the PR with the issue** so Pi Dash records a structured link and can show the PR's live status on the issue:

```bash
pidash issue attach-pr <identifier> --url <pull-request-url> --agent-run-id "$PIDASH_AGENT_RUN_ID"
```

Do both — commenting the link does not create the association, and the association does not post a human-visible comment. `attach-pr` is idempotent; one issue may have many PRs, but a PR attaches to exactly one issue. Omit `--agent-run-id` when not inside a Pi Dash agent run.

## Non-Interactive Mode

Never guess in non-interactive mode. Use explicit project, `.pidash/context.md`, `PIDASH_PROJECT_ID`, local CLI default project, or the cloud workspace default project. If none is available, fail with a clear setup instruction.
