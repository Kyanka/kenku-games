# 01 — Project overview & workflow

## What this project is

**kenku-games** is an educational pet project.
The primary goal is **learning**, not shipping a product.
It is a collection of mini-games that serves as a playground for exploring:

- Real-time sync with Zero (Rocicorp)
- Auth flows (Better Auth, Bearer tokens, JWT)
- Monorepo architecture (pnpm workspaces + Turborepo)
- Full-stack TypeScript (Hono, React 19, Drizzle ORM)
- Production deployment on a Linux VPS (systemd, Caddy, Postgres)

## Workflow rule: plan first, execute second

**Claude must never silently apply changes.**

For every non-trivial task (anything beyond a one-line fix):

1. **Research** — read relevant files, docs, error messages.
2. **Write a detailed plan** — numbered steps, each step must be executable
   by a human or by Claude. Include:
   - files that will be created / modified / deleted
   - commands that will be run
   - expected outcome of each step
   - potential risks or rollback steps
3. **Present the plan** and wait for explicit approval.
4. **Execute** only after the user says "go ahead" or equivalent.

This is intentional — the learning value comes from understanding the plan,
not just seeing the result.

## What counts as "non-trivial"

- Adding a new package or dependency
- Changing the database schema
- Modifying auth or Zero sync logic
- Changing deployment configuration
- Anything that touches more than one file
- Any migration or destructive operation

## What can be done without approval

- Fixing a typo or formatting
- Adding a comment
- Reading / searching files
- Answering a question
