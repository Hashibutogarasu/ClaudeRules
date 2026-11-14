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
