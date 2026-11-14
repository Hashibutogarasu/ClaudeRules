---
description: Create a pull request following this repo's commit message and PR body conventions
argument-hint: "[base-branch]"
allowed-tools: Bash(git:*), Bash(gh:*), Read, Write
---

Create a pull request for the current branch's changes, following this repository's existing conventions. The base branch is `$1` if given, otherwise `main`.

## Survey

- Run `git status`, `git diff`, and `git log --oneline -10` to understand what changed and why.
- If the current branch is the base branch itself and there are changes to ship, create a new branch first.
- Name branches to match this repo's existing style (e.g. `feat/<short-topic>`, `fix/<short-topic>`).

## Commit

- Commit any uncommitted changes following this repo's Conventional-Commits-style convention (see `git log` for real examples).
- Write messages in English, imperative mood, with a `feat:` / `fix:` / etc. prefix.
- Use a short summary line, then (for non-trivial changes) a blank line and a body explaining why.
- Pass multi-line messages via a heredoc, e.g. `git commit -m "$(cat <<'EOF' ... EOF)"`, so this repo's Bash hooks do not misread the message text as shell commands.
- Append whatever attribution trailer (e.g. `Co-Authored-By:` / `Claude-Session:`) the active session's instructions currently require. Do not invent one if none is given.
- Never use `echo`/`printf` as a visual separator between commands.
- Never loop over files printing a filename with `echo` followed by `cat`/`head`/`tail`. Use the Read tool to inspect files instead.
- Stage specific files by name. Avoid `git add -A` / `git add .` unless `git status` confirms everything staged is meant to be committed.

## Push

- Before pushing, run `git fetch origin` and `gh pr list --head <branch> --state merged --json number` to check whether the current branch has already been merged. A non-empty result means it was merged.
- If it was merged, do not push to it. Create a new branch from the latest `origin/<base-branch>`, cherry-pick the commits not yet in the base branch (`git log origin/<base-branch>..<old-branch>`), and push the new branch instead.
- If the branch has no upstream yet, use `git push -u origin <branch>`; otherwise use `git push`.
- Do not force-push.
- If the remote branch has commits that need history rewriting (amended/reworded commits), stop and confirm with the user first.

## PR body

- Read `.github/PULL_REQUEST_TEMPLATE/ai.md` in this repository and follow it for structure, tone, title rules, and the attribution footer.
- Write the rendered body to a file in the scratchpad directory, not `/tmp` directly.
- Create the PR with `gh pr create --title "<title>" --body-file <scratchpad-file> --base <base-branch>`.
- Use `--body-file`, not `-f body=@file` via `gh api`, which sends the `@file` string literally.

## Report

- Run `gh pr view <number> --json body -q .body` to confirm the body was set as intended.
- Report the PR URL to the user.
- Do not mention whether a Conventional-Commits prefix was added to or left off the PR title.
- Do not report whether changes were committed.
- Do not report that changes have not been committed yet, or that anything was left uncommitted or unpushed.
- Do not ask whether the user wants to commit, verify further, or test on a real device.
- State that the work is done and stop.
