---
description: Create a pull request following this repo's commit message and PR body conventions
argument-hint: "[base-branch]"
allowed-tools: Bash(git:*), Bash(gh:*), Read, Write
---

Create a pull request for the current branch's changes, following this
repository's existing conventions end to end. The base branch is `$1` if
given, otherwise `main`.

## 1. Survey the current state

Run `git status`, `git diff`, and `git log --oneline -10` to understand what
changed and why. If the current branch is the base branch itself and there
are changes to ship, create a new branch first, named to match this repo's
existing style (e.g. `feat/<short-topic>`, `fix/<short-topic>`).

## 2. Commit any uncommitted changes

If there are uncommitted changes, commit them following this repo's
Conventional-Commits-style convention (see `git log` for real examples):

- English, imperative mood, `feat:` / `fix:` / etc. prefix.
- A short summary line, then (for non-trivial changes) a blank line and a
  body explaining *why*.
- Pass multi-line messages via a heredoc, e.g.
  `git commit -m "$(cat <<'EOF' ... EOF)"` — this keeps the message text
  from being misread as literal shell commands by this repo's Bash hooks.
- Append whatever attribution trailer (e.g. `Co-Authored-By:` /
  `Claude-Session:`) the active session's instructions currently require.
  Do not invent one if none is given.
- Never use `echo`/`printf` as a visual separator between commands, and
  never loop over files printing a filename with `echo` followed by
  `cat`/`head`/`tail` — this repo's hooks block both patterns. Use the Read
  tool to inspect files instead of dumping them through Bash.
- Stage specific files by name; avoid `git add -A`/`git add .` unless you've
  confirmed via `git status` that everything staged is meant to be
  committed.

## 3. Push the branch

If the branch has no upstream yet, `git push -u origin <branch>`; otherwise
`git push`. Do not force-push. If the branch already has commits on the
remote that need history rewriting (amended/reworded commits), stop and
confirm with the user before doing anything destructive — this command's
default flow does not force-push.

## 4. Compose the PR body

Read `.github/PULL_REQUEST_TEMPLATE/ai.md` in this repository and follow it
exactly for structure, tone, title rules, and the attribution footer. Write
the rendered body to a file in your scratchpad directory (not `/tmp`
directly), then create the PR with:

```
gh pr create --title "<title>" --body-file <scratchpad-file> --base <base-branch>
```

Use `--body-file`, not `-f body=@file` via `gh api` — the latter sends the
`@file` string literally instead of reading the file.

## 5. Verify and report

Run `gh pr view <number> --json body -q .body` to confirm the body was set
as intended. Report the PR URL to the user. Do not ask whether they want to
commit, verify further, or test on a real device — state that the work is
done and stop.
