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
{{asset:PR_TEMPLATE.md}}
````

## 4. Create the pull request

Invoke the `claude-rules:pr` skill with the Skill tool to commit the change
and open the pull request. Follow the skill's instructions for branching,
commit message, and PR body, using the template in
`.github/PULL_REQUEST_TEMPLATE/ai.md`. If the template was kept and there is
nothing to commit, report that no pull request was needed and stop.
