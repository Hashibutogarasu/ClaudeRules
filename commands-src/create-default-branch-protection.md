---
description: Protect the default branch so it only accepts changes merged through pull requests
allowed-tools: Bash(gh:*), Read, Write
---

Create a branch protection ruleset for the current repository's default
branch. The ruleset allows updating the default branch only through merged
pull requests: direct pushes, force pushes, and deletion are all rejected.

If the `gh` command is available, use it for every GitHub operation below.

## 1. Check that `gh` is usable

Run `gh auth status`. If `gh` is not installed or not authenticated, do not
try to work around it. Instead, tell the user the ruleset could not be
created automatically and show them the template in step 5 together with the
manual route: repository **Settings → Rules → Rulesets → New ruleset →
Import a ruleset**. Then stop.

## 2. Compare the repository owner with the `gh` account

Run:

```
gh repo view --json owner,name,defaultBranchRef,viewerPermission
gh api user --jq .login
```

If the repository owner login differs from the authenticated account login,
**stop** and tell the user:

- which account owns the repository and which account `gh` is using, and
- that switching to the owner's account is recommended
  (`gh auth switch`, or `gh auth login` if it is not registered yet).

When the owner is an organization, the logins always differ, so compare the
`viewerPermission` instead: continue only if it is `ADMIN`; otherwise stop and
give the same recommendation.

Continue past this check only if the user explicitly asks to proceed with the
current account. `AskUserQuestion` is disabled in this environment, so present
the situation as plain text and wait for the reply. If the user insists on
continuing, proceed without further objection.

## 3. Check for an equivalent or stronger existing rule

Fetch the rules that currently apply to the default branch, whether they come
from rulesets or from classic branch protection:

```
gh api repos/<owner>/<repo>/rules/branches/<default-branch>
gh api repos/<owner>/<repo>/rulesets
gh api repos/<owner>/<repo>/branches/<default-branch>/protection
```

The last call returns 404 when no classic protection exists; that is not an
error. Inspect individual rulesets with `gh api repos/<owner>/<repo>/rulesets/<id>`
when the first call is not enough to judge.

The existing protection is **equivalent or stronger** when all of the
following hold, regardless of how it is configured:

- it is active (a ruleset with `enforcement: "active"`, or classic protection),
- it requires changes to go through a pull request,
- it blocks force pushes (`non_fast_forward` / `allow_force_pushes: false`),
- it blocks deletion of the branch, and
- it has no bypass actors that would let someone push directly.

If it is, report which rule already covers the default branch and **stop**
without creating anything. There is no need to overwrite it.

If only part of this is covered, continue and create the ruleset; do not
modify or delete the existing rules.

## 4. Create the ruleset

Write the template below verbatim to a file in your scratchpad directory (not
`/tmp` directly), then create the ruleset from it:

```
gh api repos/<owner>/<repo>/rulesets --method POST --input <scratchpad-file>
```

The template targets the repository's default branch through
`~DEFAULT_BRANCH`, so it needs no per-repository editing.

## 5. Ruleset template

````json
#include "assets/protect_default_branch.json"
````

## 6. Verify and report

Run `gh api repos/<owner>/<repo>/rules/branches/<default-branch>` and confirm
that the `deletion`, `non_fast_forward`, and `pull_request` rules now apply.
Report the ruleset name and its URL
(`https://github.com/<owner>/<repo>/rules`) and stop.
