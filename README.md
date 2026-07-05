# kenku-games

Educational project with mini games

## Requirements

- Node.js ≥ 22 (`corepack enable` so the right pnpm version gets picked up)
- Postgres with `wal_level=logical` (required for Zero replication) — either
  locally via Docker **or** remotely (Neon, Supabase, Railway, etc.)

## Install

```bash
pnpm install
cp .env.example .env
```

### Postgres: local or remote

By default `.env.example` points at the local Postgres from
`docker-compose.yml`. If you're using a remote database instead, replace
`DATABASE_URL`, `ZERO_UPSTREAM_DB`, `ZERO_CVR_DB`, `ZERO_CHANGE_DB` in `.env`
with the connection string from your provider (usually with
`?sslmode=require`), and make sure logical replication is enabled on their
side (enabled by default on Neon). In that case the local
`docker-compose.yml` simply isn't used.

## Running the frontend on its own

The frontend (Vite on `:5173`) can be started by itself — the game-select
screen and the `/battleship`, `/dice` placeholders don't need a backend:

```bash
pnpm --filter @kenku/web dev
```

Once a page starts doing real work through Zero (rooms, moves), it'll also
need the backend below — otherwise it'll hang trying to connect to
`zero-cache`.

## Running the backend on its own

The backend is Postgres + `zero-cache` + an Express server
(`/api/zero/mutate`, `/api/zero/query`). Postgres comes from `.env` (local or
remote — see above); the rest starts in order, each in its own terminal:

```bash
# 1. Postgres — only if you're using the local docker-compose setup;
#    skip this step with a remote database
docker-compose up -d postgres

# 2. zero-cache — listens on :4848
pnpm dev:zero-cache

# 3. Express server — listens on :3000
pnpm --filter @kenku/server dev
```

## Running everything at once

```bash
docker-compose up -d postgres   # skip with a remote database
pnpm dev:zero-cache             # separate terminal
pnpm dev                        # web + server via Turborepo
```

## Other commands

| Command                        | What it does                       |
| ------------------------------- | ----------------------------------- |
| `pnpm typecheck`               | `tsc --noEmit` across all packages  |
| `pnpm lint`                    | ESLint across the whole repo        |
| `pnpm test`                    | vitest (`game-logic` only for now)  |
| `pnpm format` / `format:check` | Prettier                            |
