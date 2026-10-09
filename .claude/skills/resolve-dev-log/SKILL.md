---
name: resolve-dev-log
description: Resolve merge conflicts in .claude/notes/dev-log.md and tidy it after a merge or rebase (keep both developers' entries, dedupe, re-sort). Use when the user runs /resolve-dev-log or a merge/rebase/cherry-pick leaves the dev-log conflicted or messy.
disable-model-invocation: true
---

# /resolve-dev-log — merge two developers' dev-logs

The dev-log is append-only: **nobody's entry is ever dropped**. Format and sections are
defined in `.claude/rules/06-dev-log.md`.

`.gitattributes` sets `merge=union` for the dev-log, so most merges don't conflict — git
keeps both sides' lines. This skill handles what `union` can't: real conflicts (e.g. when
the attribute is missing on one branch, or after `cherry-pick`) and the cleanup after it.

## Steps

1. **State**
   - `git status` — are we mid-merge / rebase / cherry-pick? Which files are conflicted?
   - Only `.claude/notes/dev-log.md` is handled here. Other conflicted files: list them
     and leave them to the user — never auto-resolve code.

2. **Collect both sides**
   - If the file has conflict markers: take the `<<<<<<<` (ours) and `>>>>>>>` (theirs)
     blocks. Also look at `git show :1:.claude/notes/dev-log.md` (common base) to tell
     _new_ entries from _edited_ ones.
   - If there are no markers (union already merged): work on the file as is.

3. **Rebuild each section** — union of both sides:
   - **Change Log** — all lines from both sides, newest date first; same-date lines keep
     their relative order (ours, then theirs). Drop exact duplicates only.
   - **Solved Problems / Architecture Decisions / Research Log** — keep every `###` entry
     whole (heading → next heading). Same heading on both sides with different text:
     keep both and append ` (merged: <branch>)` to theirs — don't merge texts yourself.
   - **Things to Avoid** — union of table rows, drop exact duplicates, keep one header.
   - Entry edited on one side, untouched on the other (compare with base): take the edit.
     Edited differently on both sides: keep both versions and flag it to the user.

4. **Check**
   - No `<<<<<<<`, `=======`, `>>>>>>>` left; section order and headings as in rule 06.
   - Every entry present in either side is still present (count `###` and `- YYYY` lines:
     result ≥ max(ours, theirs) and every line from both sides is found).

5. **Show the diff** (`git diff` vs ours) and any flagged items. Wait for OK.

6. **Finish**: `git add .claude/notes/dev-log.md`, then continue the operation the user was in
   (`git merge --continue` / `git rebase --continue` / `git cherry-pick --continue`) only if
   no other files are still conflicted. Otherwise stop and say which ones remain.
