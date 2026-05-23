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
