# kenku-games

Educational project with mini games

## Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Frontend | React + Vite + React Router |
| Sync | Zero (`@rocicorp/zero`) + zero-cache |
| Backend | Express (Node.js) |
| Database | PostgreSQL with `wal_level=logical` |
| ORM / migrations | Drizzle ORM + drizzle-kit |
| Game logic | Pure functions + XState |
| Language | TypeScript (strict) |

## Packages

| Package | Role |
|---|---|
| `packages/db` | Drizzle schema, migrations, drizzle.config.ts |
| `packages/zero-schema` | Zero schema (auto-generated), mutators, queries |
| `packages/shared-types` | Shared TypeScript types |
| `packages/game-logic` | Pure game logic, XState machines |
| `apps/server` | Express + Zero endpoints + DB client |
| `apps/web` | React frontend + Zero client |

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

## Database workflow

Schema lives in `packages/db/src/schema.ts`. After every schema change:

```bash
pnpm db:sync
```

This runs in sequence: generate SQL migration → apply to DB → regenerate Zero schema.

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

| Command | What it does |
|---|---|
| `pnpm db:sync` | Generate migration + apply + regenerate Zero schema |
| `pnpm typecheck` | `tsc --noEmit` across all packages |
| `pnpm lint` | ESLint across the whole repo |
| `pnpm test` | vitest (`game-logic` only for now) |
| `pnpm format` / `format:check` | Prettier |
