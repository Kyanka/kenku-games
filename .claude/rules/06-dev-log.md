# Rule 06 — Development Log

The log itself lives in [`../notes/dev-log.md`](../notes/dev-log.md). It is **not** loaded
automatically — read it on demand.

## When to read it

- **Before proposing a solution** to a bug or design question, search the log
  (Solved Problems, Things to Avoid) so failed approaches are not repeated.
- Before changing anything listed under Architecture Decisions — the "why" is there.

## When to update it — every commit

Every commit **includes** its dev-log update, staged in the **same commit**
(updating after the commit would leave a dirty tree and need a second commit).

1. **Change Log** (always): add one line at the top —
   `YYYY-MM-DD · type(scope): summary — why`
   (same `type(scope)` as the commit message, see `05-git-workflow.md`).
2. **Additionally, if it applies**, add an entry at the top of the matching section:
   - **Solved Problems** — a non-obvious bug: symptom, root cause, fix, rejected approaches.
   - **Architecture Decisions** — a choice between alternatives and why.
   - **Things to Avoid** — a pitfall worth one table row.
   - **Research Log** — investigation that took real time, even if inconclusive.

Use `/git-update` to commit — it does both steps.

## Merges

`.gitattributes` sets `merge=union` for the dev-log: on merge/rebase git keeps lines from
both sides instead of a conflict. Afterwards (or if a conflict still happens) run
`/resolve-dev-log` — it dedupes, re-sorts by date and checks nothing was lost.
Never resolve a dev-log conflict by picking one side: entries from both developers stay.

## Style

- Newest entries first in every section.
- Short and concrete: file paths, error messages, the actual fix. No narration.
- Don't rewrite old entries; if something changed, add a new entry that supersedes it.
