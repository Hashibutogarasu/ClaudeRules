# ClaudeRules

A Claude Code plugin providing a set of PreToolUse hooks, implemented in TypeScript and sharing type definitions from the `modules/types` package.

## Hooks

- Detects and denies `echo` / `printf` used purely as a visual separator between commands
- Denies loops (`for`/`while`/`xargs`) that dump multiple files' contents behind `echo` headers instead of reading them individually
- Denies launching a NeoForge mod's development client (`./gradlew runClient`, etc.)
- Denies running `flutter run` (client or web-server targets)
- Denies launching an Android app natively (`adb shell am start`, etc.)
- Asks for confirmation when `rm -rf` targets a path outside the workspace
- Denies every `AskUserQuestion` call

## Commands

- `/pr [base-branch]` — commits any pending changes and opens a pull request following this repo's commit message and PR body conventions (see `.github/PULL_REQUEST_TEMPLATE/`)
- `/create-pr-template` — creates an AI-oriented PR template (`## Summary` / `## Check List`) at `.github/PULL_REQUEST_TEMPLATE/ai.md`, proposing to overwrite or keep it if one already exists, then opens a PR with the `pr` skill
- `/create-default-branch-protection` — creates a ruleset (via `gh`) that lets the default branch be updated only through merged pull requests; stops if the `gh` account differs from the repository owner or an equivalent or stronger rule already exists

## Installation

This repository is a Claude Code plugin marketplace (`.claude-plugin/marketplace.json`) that hosts the `claude-rules` plugin (`.claude-plugin/plugin.json`). The compiled hooks (`hooks/*.mjs`) are committed, so no build step is needed to install it.

### From GitHub

```sh
claude plugin marketplace add Hashibutogarasu/ClaudeRules
claude plugin install claude-rules@ClaudeRules
```

Or, inside Claude Code:

```
/plugin marketplace add Hashibutogarasu/ClaudeRules
/plugin install claude-rules@ClaudeRules
```

### Updating

```sh
claude plugin marketplace update ClaudeRules
claude plugin update claude-rules@ClaudeRules
```

### Uninstall

```sh
claude plugin uninstall claude-rules@ClaudeRules
claude plugin marketplace remove ClaudeRules
```

### From a local checkout

```sh
pnpm install
pnpm run plugin:install
```

`pnpm run plugin:install` builds the plugin, registers this checkout as a local marketplace, and installs the plugin in one step. Remove it with `pnpm run plugin:remove`.

## Releasing

CI (`.github/workflows/ci.yml`) reuses the Karasu-Lab JsWorkflows to format, type check and build on every push and pull request. On a push to `main`, the `release` job reads `version` from `.claude-plugin/plugin.json` and creates a GitHub Release tagged `v<version>-<short commit hash>` (for example `v0.1.0-52c6f18`) with generated notes, unless that tag already exists. Every merge to `main` therefore produces a release, and the base version only needs bumping when it should change.

To change the base version:

1. Bump `version` in `.claude-plugin/plugin.json` (and `package.json` to match).
2. Run `pnpm run build` and commit the updated `hooks/*.mjs` output.
3. Merge to `main`. The release is published automatically.
