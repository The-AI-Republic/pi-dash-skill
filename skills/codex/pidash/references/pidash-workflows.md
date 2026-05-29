# Pi Dash Agent Workflows

## Preflight

Before using Pi Dash, verify the CLI is available and authenticated:

```bash
pidash --version
pidash workspace me
```

If either command fails, tell the user to install the Pi Dash CLI or run:

```bash
pidash auth login
```

## Project Selection

Use `.pidash/context.md` when it exists. It is authoritative for the local workspace.

If the file contains one project, use that project.

If it contains multiple projects, choose the best project from the project `name` and `description` without asking the user. After the operation, explicitly report the chosen project name.

Prompt for project confirmation only when `.pidash/context.md` is missing. In that case:

1. Run `pidash project list`.
2. Compare the project names and descriptions with workspace signals such as repository name, package name, README, and remote URL.
3. Ask the user to confirm the best candidate.
4. After confirmation, run `pidash context init --project <project-id-or-identifier>`.

In non-interactive mode, do not guess. Use this order:

1. Explicit project from the user.
2. `.pidash/context.md`.
3. `PIDASH_PROJECT_ID`.
4. `pidash config set default-project <project-id-or-identifier>` local config.
5. Pi Dash cloud workspace default project.

If none is available, fail with instructions to set a default project.

## Issues

Create issues with:

```bash
pidash issue create --project <project-id-or-identifier> --title "<title>" --description "<description>"
```

If the project is supplied by default resolution, `--project` may be omitted.

If the user says the issue belongs in another project after creation, move it:

```bash
pidash issue move <PROJECT-123> --project <target-project-id-or-identifier>
```

## Search

Find existing issues by content with `pidash issue search`:

```bash
pidash issue search "<query>"
```

When to use:

- Before creating a new issue, search the title's key phrase so you don't
  file a duplicate. If a strong match exists, surface it to the user and
  ask whether to update that one instead of creating a new one.
- When the user asks to "find", "look up", "show me issues about", or to
  resume work on a ticket they haven't named.

Query syntax (Postgres websearch_to_tsquery):

- Quoted phrases for exact wording: `pidash issue search '"dark mode"'`
- `OR` for alternatives: `pidash issue search 'crash OR panic'`
- `-` to exclude: `pidash issue search 'release -alpha'`
- Stem-aware: `color` matches `colors`, `colored`.

Flags:

- `--project <slug-or-id>`: scope to one project. Omit to search the whole
  workspace.
- `--status open|closed|all`: default `all`. `open` = in progress;
  `closed` = completed or cancelled.
- `--since <ISO 8601>`: lower bound on `updated_at`,
  e.g. `--since 2025-01-01T00:00:00Z`.
- `--limit <n>`: default 10, hard cap 50 (tuned for agent context).
- `--sort rank|-created|-updated`: default `rank` (relevance);
  `-created` newest first, `-updated` most recently touched first.

In non-interactive mode, never pass an empty or whitespace-only query — the
server rejects it. Always supply a concrete `<query>`.
