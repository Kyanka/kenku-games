# 03 — Local setup & running the project

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Docker (for local Postgres via docker-compose)
- `npx zero-cache-dev` available (installed via `pnpm install`)

## First-time setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start Postgres (docker-compose in root)
docker-compose up -d

# 3. Copy env and fill in secrets
cp .env.example .env
# Edit .env — see required variables below

# 4. Run migrations and generate Zero schema
pnpm db:sync
# Equivalent to: db:generate → db:migrate → zero-schema generate

# 5. Start everything
pnpm dev
# Starts: web (Vite :5173) + server (Node :3000) + zero-cache (:4848) in parallel
```

## Local `.env` (root of monorepo)

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Better Auth
BETTER_AUTH_SECRET=any-long-random-string
BETTER_AUTH_URL=http://localhost:3000

# Postgres (docker-compose default)
ZERO_UPSTREAM_DB=postgres://kenku:kenku@localhost:5432/kenku
ZERO_CVR_DB=postgres://kenku:kenku@localhost:5432/kenku
ZERO_CHANGE_DB=postgres://kenku:kenku@localhost:5432/kenku

# Zero-cache
ZERO_REPLICA_FILE=/tmp/kenku-zero-replica.db
ZERO_QUERY_URL=http://localhost:3000/api/zero/query
ZERO_MUTATE_URL=http://localhost:3000/api/zero/mutate
ZERO_QUERY_FORWARD_COOKIES=true

# Frontend (Vite injects these at build time)
VITE_API_URL=http://localhost:3000
VITE_ZERO_CACHE_URL=http://localhost:4848
```

## Hybrid mode — local frontend + remote API

Use this when you want to test against the production database without
deploying the frontend (useful for debugging prod-only issues).

```bash
# 1. Open SSH tunnel to the VPS Postgres
ssh -L 5432:localhost:5432 kyanka-prod.exe.xyz

# 2. Set frontend to point to the remote API
# In .env (or create .env.local for Vite):
VITE_API_URL=https://api.kenku.me
VITE_ZERO_CACHE_URL=https://zero.kenku.me

# 3. Run only the frontend
pnpm --filter @kenku/web dev

# BETTER_AUTH_SECRET must match the value on the VPS.
```

## Running individual services

```bash
# Only Hono server (auto-restarts with --watch)
pnpm --filter @kenku/server dev

# Only Vite frontend
pnpm --filter @kenku/web dev

# Only zero-cache (reads .env from root)
pnpm dev:zero-cache
```

## Schema changes during development

```bash
# 1. Edit packages/db/src/schema.ts

# 2. Generate migration SQL + update Zero schema
pnpm db:sync

# 3. Restart the server (zero-cache picks up schema changes on restart)
```

## Common issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ProtocolError: Connection userID does not match` | `auth` prop in ZeroProvider is wrong | See `rules/02-tech-stack.md` — Zero auth wiring |
| `No rows will be returned` warning from zero-cache | Using deprecated `definePermissions` | Switch to `defineQuery` / `defineQueries` |
| zero-cache fails to start | Postgres lacks REPLICATION rights | `ALTER USER kenku WITH REPLICATION SUPERUSER;` |
| Bearer token not sent | `VITE_API_URL` points to wrong origin | Check `.env` and restart Vite |
| `Loading profile…` never resolves | Zero connection failed silently | Check browser console for ProtocolError |
