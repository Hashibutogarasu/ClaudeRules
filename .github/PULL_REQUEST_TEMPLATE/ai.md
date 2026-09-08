<!--
This template is for Claude (or another AI agent) to follow when composing a
pull request body for this repository. It is not meant to be filled in by
hand — a human opening a PR manually should pick `human.md` instead.
-->

## Rules for the generated PR body

- Use the exact same section headings as `human.md`: `## Summary` and
  `## Test plan`. Do not add, rename, or reorder sections.
- `## Summary` is 2-4 bullet points. Focus on *why* the change was made, not
  a line-by-line restatement of the diff.
- `## Test plan` is a checklist (`- [ ]` / `- [x]`) of what was actually
  verified, or what still needs verification. Use `[x]` only for checks that
  were actually run in this session.
- Title: under 70 characters, English, a plain imperative summary of the
  change. Do not prefix it with a Conventional-Commits type (`feat:`,
  `fix:`, etc.) — that prefix belongs on commit messages, and on a PR title
  it's redundant with the branch name.
- Body language: English, matching this repo's existing commit messages and
  PR bodies — even when the conversation with the user is in another
  language.
- End the body with the attribution footer required by the current session's
  instructions (e.g. a "Generated with Claude Code" line and a session
  link). Do not hardcode a specific link or session id in this file — pull
  those values from the active session at the time the PR is created.
- Never include secrets, credentials, or literal file contents that were
  meant to stay local (e.g. `.env` values).
