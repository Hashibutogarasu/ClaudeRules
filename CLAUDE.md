# Project layout

- `modules/types` — a pure TypeScript project holding only the type definitions the hooks share
- `hooks/src` — each hook's implementation (TypeScript, `.mts`)
- `hooks/assets/locales` — JSON locale assets managing the hooks' deny/ask reason messages
- `hooks/*.mjs` — build output (compiled by `tsc`, referenced from `hooks.json`)
- `assets/` — files embedded into commands at build time (e.g. `PR_TEMPLATE.md`)
- `commands-src/` — command sources containing `#include "assets/<file>"` tags, expanded by `markdown-include` during `pnpm run build`
- `markdown-include/` — one `markdown-include` config per command in `commands-src/` (the tool writes a single output file per config)
- `commands/` — custom slash commands (e.g. `/pr`); `create-pr-template.md` and `create-default-branch-protection.md` are build output generated from `commands-src/`
- `.github/PULL_REQUEST_TEMPLATE/` — `human.md` (shown when opening a PR by hand) and `ai.md` (the body-generation rules `/pr` follows)
- `.github/workflows/check-release.yml` — CI (reuses the Karasu-Lab JsWorkflows to format, type check and build on every push and pull request) and the release job

# Releasing

On a push to `main`, the `release` job in `check-release.yml` reads `version` from `.claude-plugin/plugin.json` and creates a GitHub Release tagged `v<version>-<short commit hash>` (for example `v0.1.0-52c6f18`) with generated notes, unless that tag already exists. Before tagging, the job also writes the same `<version>-<short commit hash>` string to `version` in `.claude-plugin/plugin.json` and `package.json` and commits it to `main`, so installed plugins can tell releases apart and update. Every merge to `main` therefore produces a release, and the base version (the part before the first `-`) only needs bumping when it should change.

To change the base version:

1. Bump `version` in `.claude-plugin/plugin.json` (and `package.json` to match) to the new base version without a hash suffix.
2. Run `pnpm run build` and commit the updated `hooks/*.mjs` output.
3. Merge to `main`. The release is published automatically.
