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
