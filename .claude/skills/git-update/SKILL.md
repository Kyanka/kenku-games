---
name: git-update
description: Commit the current changes following the project's git conventions and add the dev-log entry in the same commit. Use when the user runs /git-update or explicitly asks to commit.
disable-model-invocation: true
argument-hint: "[optional hint: what this commit is about]"
---

# /git-update — commit + dev-log

Rules this follows: `.claude/rules/05-git-workflow.md` (message format, branches)
and `.claude/rules/06-dev-log.md` (dev-log update). Hint from the user: $ARGUMENTS

## Steps

1. **Look at the state**
   - `git branch --show-current`, `git status --short`, `git diff --stat` (+ `--staged`).
   - On `main` with a non-trivial change → stop and propose a branch name
     (`feature/`, `fix/`, `chore/`) per rule 05.
   - Nothing to commit → say so and stop.

2. **Split if needed.** If the diff mixes unrelated changes (e.g. a styling refactor and
   an auth fix), propose separate commits and which files go into each. Ask before splitting.

3. **Write the commit message** per rule 05: `type(scope): short imperative description`,
   optional body with _what & why_. Read the actual diff — don't guess from file names.

4. **Update `.claude/notes/dev-log.md`** per rule 06:
   - Always: one line at the top of **Change Log** —
     `YYYY-MM-DD · type(scope): summary — why` (today's date).
   - If the change solved a non-obvious bug, made a design choice, revealed a pitfall or
     took real investigation, also add an entry to the matching section.

5. **Show the user** the message, the file list and the dev-log diff. Wait for OK.

6. **Commit**
   - Stage the specific files plus `.claude/notes/dev-log.md` — never `git add -A` blindly.
   - Never stage `.env*`, `*.local`, `.claude/settings.local.json`, build output.
   - `git commit` with the agreed message. One commit = code + its dev-log line.
   - The pre-commit hook runs ESLint + Prettier on staged files and may reformat them.
     If it fails on lint errors: fix them, re-stage, commit again. Never `--no-verify`.

7. **Don't push** unless the user asked. Report the short hash and subject.
