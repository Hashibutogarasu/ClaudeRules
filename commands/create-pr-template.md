---
description: Create an AI-oriented PR template for this repository, then open a pull request with the pr skill
allowed-tools: Bash(git:*), Bash(gh:*), Read, Write, Skill
---

Create an AI-oriented pull request template for the current repository, then
open a pull request that contains it by using the `claude-rules:pr` skill.

The template is written to `.github/PULL_REQUEST_TEMPLATE/ai.md`, the path the
`pr` skill reads when composing a PR body.

## 1. Check for an existing template

Read `.github/PULL_REQUEST_TEMPLATE/ai.md` in the current repository. If it
does not exist, go to step 3.

## 2. Existing template: propose overwrite or keep

If the file already exists, show the user a short summary of its current
content and propose two options:

- **Overwrite** — replace it with the default template below.
- **Keep** — leave the existing file untouched.

`AskUserQuestion` is disabled in this environment, so present the options as
plain text and wait for the user's reply before continuing. Recommend
**Keep** if the existing template already has a `## Summary` section and a
`## Check List` section; otherwise recommend **Overwrite**.

- If the user chooses **Keep**, do not modify the file and skip to step 4
  without creating a commit for the template.
- If the user chooses **Overwrite**, continue to step 3.

## 3. Write the default template

Create `.github/PULL_REQUEST_TEMPLATE/` if needed and write the following
content to `.github/PULL_REQUEST_TEMPLATE/ai.md` verbatim:

````markdown
<!--
This template is for Claude (or another AI agent) to follow when composing a
pull request body for this repository. It is not meant to be filled in by
hand.
-->

## Rules for the generated PR body

- Use exactly two sections, in this order: `## Summary` and `## Check List`.
  Do not add, rename, or reorder sections.
- `## Summary` is 2-4 bullet points. Focus on *why* the change was made, not
  a line-by-line restatement of the diff.
- `## Check List` is a checklist (`- [ ]` / `- [x]`) of what was actually
  verified, or what still needs verification. Use `[x]` only for checks that
  were actually run in this session.
- Title: under 70 characters, English, a plain imperative summary of the
  change. Do not prefix it with a Conventional-Commits type (`feat:`,
  `fix:`, etc.).
- Body language: English, even when the conversation with the user is in
  another language.
- End the body with the attribution footer required by the current session's
  instructions, if any. Do not hardcode a specific link or session id in this
  file — pull those values from the active session at the time the PR is
  created.
- Never include secrets, credentials, or literal file contents that were
  meant to stay local (e.g. `.env` values).

## Body skeleton

```markdown
## Summary

- <why the change was made>

## Check List

- [ ] <verification step>
```
````

## 4. Create the pull request

Invoke the `claude-rules:pr` skill with the Skill tool to commit the change
and open the pull request. Follow the skill's instructions for branching,
commit message, and PR body, using the template in
`.github/PULL_REQUEST_TEMPLATE/ai.md`. If the template was kept and there is
nothing to commit, report that no pull request was needed and stop.
