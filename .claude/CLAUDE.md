# kenku-games — Claude context hub

This is an **educational pet project**: a collection of mini-games built primarily
to learn modern web technologies. Read the rules below before doing anything.

## How to work on this project

**Always plan before acting.**
For every non-trivial task, produce a detailed step-by-step plan (see
`.claude/rules/01-project-overview.md`) and wait for approval before executing.

## Rules index

| File | What it covers |
|------|----------------|
| [`rules/01-project-overview.md`](rules/01-project-overview.md) | Purpose, learning goals, workflow (plan → review → execute) |
| [`rules/02-tech-stack.md`](rules/02-tech-stack.md) | Every package, tool and why it was chosen |
| [`rules/03-local-setup.md`](rules/03-local-setup.md) | Running the project locally and in hybrid mode (local frontend + remote API) |
| [`rules/04-deployment.md`](rules/04-deployment.md) | Deploying to the VPS with systemd, Caddy, drizzle migrations |
| [`rules/05-git-workflow.md`](rules/05-git-workflow.md) | Commit conventions, branch names, PR rules |
| [`rules/06-dev-log.md`](rules/06-dev-log.md) | Research log — solved problems, decisions, what to avoid repeating |

## Quick reference

```
monorepo root     pnpm install && pnpm dev
schema change     pnpm db:sync   (generate + migrate + zero-schema generate)
server build      pnpm --filter @kenku/server build
deploy            ssh vps "cd /opt/kenku-games && ./deploy/deploy.sh"
logs              journalctl -u kenku-server -f
```
