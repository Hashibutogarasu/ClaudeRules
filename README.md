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

CI (`.github/workflows/ci.yml`) reuses the Karasu-Lab JsWorkflows to format, type check and build on every push and pull request. On a push to `main`, the `release` job reads `version` from `.claude-plugin/plugin.json` and creates a GitHub Release tagged `v<version>` with generated notes, unless that tag already exists.

To cut a release:

1. Bump `version` in `.claude-plugin/plugin.json` (and `package.json` to match).
2. Run `pnpm run build` and commit the updated `hooks/*.mjs` output.
3. Merge to `main`. The release is published automatically.

## Layout

- `modules/types` — a pure TypeScript project holding only the type definitions the hooks share
- `hooks/src` — each hook's implementation (TypeScript, `.mts`)
- `hooks/assets/locales` — JSON locale assets managing the hooks' deny/ask reason messages
- `hooks/*.mjs` — build output (compiled by `tsc`, referenced from `hooks.json`)
- `commands/` — custom slash commands (e.g. `/pr`)
- `.github/PULL_REQUEST_TEMPLATE/` — `human.md` (shown when opening a PR by hand) and `ai.md` (the body-generation rules `/pr` follows)
