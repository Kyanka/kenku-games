# kenku-games — Claude rules

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend**: React + Vite + React Router + Zero client (`@rocicorp/zero`)
- **Backend**: Express + Zero push/query endpoints (`@rocicorp/zero/server`)
- **Sync**: zero-cache (separate process, port 4848)
- **Database**: PostgreSQL with `wal_level=logical` (required by Zero)
- **ORM / migrations**: Drizzle ORM + drizzle-kit (`packages/db`)
- **Zero schema**: auto-generated from Drizzle via `drizzle-zero` (`packages/zero-schema`)
- **Game logic**: pure functions + XState machines (`packages/game-logic`)
- **Shared types**: `packages/shared-types`

## Package responsibilities

| Package | Role |
|---|---|
| `packages/db` | Drizzle schema, migrations, drizzle.config.ts |
| `packages/zero-schema` | Zero schema (auto-generated), mutators, queries |
| `packages/shared-types` | Shared TypeScript types (game payloads, etc.) |
| `packages/game-logic` | Pure game logic, XState machines |
| `apps/server` | Express server, Zero push/query endpoints, DB client |
| `apps/web` | React frontend, Zero client |

## Database rules

### Schema changes
All database schema changes go through `packages/db/src/schema.ts`.
Never modify schema in any other place.

After every schema change, run the full sync:
```bash
pnpm db:sync
```
This runs in sequence: `db:generate` → `db:migrate` → zero-schema `generate`.

### Migrations
- Migrations live in `packages/db/drizzle/`
- Run via `pnpm --filter @kenku/db db:generate` (generate SQL) and `pnpm --filter @kenku/db db:migrate` (apply)
- Or use `pnpm db:sync` from the root to do everything at once

### Zero schema
- `packages/zero-schema/src/schema.gen.ts` is auto-generated — never edit manually
- `packages/zero-schema/drizzle-zero.config.ts` controls which tables/columns are synced to the client
- When adding a new table, explicitly add it to `drizzle-zero.config.ts` before running `generate`

### DB client
- The Drizzle client lives in `apps/server/src/db/client.ts`
- Zero uses its own `pg.Pool` via `zeroNodePg` adapter (in `apps/server/src/db-provider.ts`)
- These are two separate database connections — Drizzle for custom queries, Zero for sync

### Never
- Never import Drizzle schema from `apps/server` in other packages — use `@kenku/db`
- Never edit `schema.gen.ts` by hand
- Never commit a migration without also committing the updated `schema.gen.ts`
