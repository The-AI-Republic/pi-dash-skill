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

## Comments

When posting a comment that is your own agent message, mark the speaker explicitly:

```bash
pidash comment add <PROJECT-123> --body-file <path> --as-agent "Codex" --agent-run-id "$PIDASH_AGENT_RUN_ID"
```

Use your actual runtime name for `--as-agent` when known, for example `Codex` or `Claude Code`; otherwise use `AI Agent`.

If `PIDASH_AGENT_RUN_ID` is not set because you are not inside a Pi Dash agent run, omit `--agent-run-id` but still use `--as-agent`.

The authenticated CLI user remains the audit actor. `--as-agent` is what lets Pi Dash and future agent prompts distinguish AI-agent messages from human replies in the issue conversation.

## Pull requests

When you open a GitHub pull request for the issue you are working on, do **both**, in this order:

1. **Comment the PR link on the issue.** Issue comments are the main bridge to the human, so post the PR link as a comment (see [Comments](#comments)). This is how a reviewer sees the PR in the issue conversation.

2. **Associate the PR with the issue.** Run a second command so Pi Dash records a structured link and can show the PR's live status on the issue:

   ```bash
   pidash issue attach-pr <PROJECT-123> --url <pull-request-url> --agent-run-id "$PIDASH_AGENT_RUN_ID"
   ```

`attach-pr` is idempotent — re-running it for the same PR is a no-op. One issue may have several attached PRs; a given PR attaches to exactly one issue. Commenting the link does **not** create the association on its own — you must run `attach-pr` as well. If `PIDASH_AGENT_RUN_ID` is not set, omit `--agent-run-id`.
