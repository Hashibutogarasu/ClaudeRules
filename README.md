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

## Setup

```sh
pnpm install
pnpm run install-plugin
```

`pnpm run install-plugin` builds the plugin, registers this repository as a local marketplace (`claude plugin marketplace add .`), and installs the plugin (`claude plugin install claude-rules@ClaudeRules`) in one step.

## Uninstall

```sh
pnpm run uninstall-plugin
```

## Layout

- `modules/types` — a pure TypeScript project holding only the type definitions the hooks share
- `hooks/src` — each hook's implementation (TypeScript, `.mts`)
- `hooks/assets/locales` — JSON locale assets managing the hooks' deny/ask reason messages
- `hooks/*.mjs` — build output (compiled by `tsc`, referenced from `hooks.json`)
- `commands/` — custom slash commands (e.g. `/pr`)
- `.github/PULL_REQUEST_TEMPLATE/` — `human.md` (shown when opening a PR by hand) and `ai.md` (the body-generation rules `/pr` follows)
