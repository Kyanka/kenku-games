# 02 — Tech stack

## Monorepo

| Tool                | Why                                                                   |
| ------------------- | --------------------------------------------------------------------- |
| **pnpm workspaces** | Fast installs, strict hoisting, workspace protocol for local packages |
| **Turborepo**       | Parallel task execution with caching across packages                  |

```
kenku-games/
├── packages/
│   ├── db/               @kenku/db        — Drizzle schema + migrations
│   └── zero-schema/      @kenku/zero-schema — Zero schema (generated) + mutators + custom queries
├── apps/
│   ├── server/           @kenku/server    — Hono API server
│   └── web/              @kenku/web       — React frontend
└── deploy/               systemd units + deploy.sh
```

## Database

- **PostgreSQL 16** — required by Zero (`wal_level=logical` for logical replication)
- **Drizzle ORM** — type-safe schema, SQL-like query builder, migration management
- **drizzle-kit** — generates SQL migrations from the Drizzle schema

Postgres user must have REPLICATION + SUPERUSER to create Zero publications:

```sql
ALTER USER kenku WITH REPLICATION SUPERUSER;
```

## Zero (Rocicorp) — version 1.7.0

Zero is the real-time sync layer. Clients hold a local SQLite replica; the
server streams row-level diffs over a WebSocket.

**Important version note:** Zero 1.7.0 uses `defineQuery` / `defineQueries`
for access control. The older `definePermissions` API is **deprecated** —
do not use it.

### Custom queries flow

1. Client: `useQuery(queries.profileByUser({ userId }))` → zero-cache
2. zero-cache: `POST /api/zero/query` with `{name, args}` to our server
3. Server: `mustGetQuery(queries, name).fn(...)` returns a ZQL expression
4. zero-cache executes ZQL, syncs matching rows to the client

`packages/zero-schema/src/queries.ts`:

```ts
export const queries = defineQueries({
  profileByUser: defineQuery(z.object({ userId: z.string() }), ({ args }) =>
    builder.profiles.where("id", args.userId),
  ),
});
```

**Never use `definePermissions`.** It requires deploying to a `zero.permissions`
Postgres table and returns 0 rows without a deployment step.

## Auth — Better Auth v1.7.x

- Email + password sign-up/sign-in
- `bearer()` plugin — returns a session token in `set-auth-token` response header
- Frontend stores the token in `localStorage["bearer_token"]`
- Frontend sends it via `Authorization: Bearer <token>` on every request
- Server validates with `auth.api.getSession({ headers })`

**Why Bearer tokens instead of cookies:**
Cross-origin cookies require `SameSite=None; Secure` and strict browser
policies make them unreliable across devices during development. Bearer tokens
in localStorage are simpler and predictable.

**CORS gotcha:** `auth.handler(c.req.raw)` returns a raw `Response` that Hono's
`cors()` middleware does not modify. CORS headers must be added manually via
`withCors()` in `apps/server/src/index.ts`.

## Zero auth wiring (CRITICAL — do not break)

When zero-cache uses `ZERO_QUERY_URL`, it calls our server to **validate every
WebSocket connection**. The `userID` returned by `handleQueryRequest` must
exactly match the `userID` the client passed to `ZeroProvider`.

`apps/web/src/zero/zero-provider.tsx`:

```tsx
const GUEST_ID = "guest";
const auth =
  userID === GUEST_ID
    ? undefined
    : () => localStorage.getItem("bearer_token") ?? "";

<ZeroProvider userID={userID} auth={auth} ... />
```

`apps/server/src/index.ts`:

```ts
app.post("/api/zero/query", async (c) => {
  let userID: string | null = null;
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    userID = session?.user?.id ?? null;
  } catch {
    /* unauthenticated */
  }

  const result = await handleQueryRequest({
    handler: (name, args) =>
      mustGetQuery(queries, name).fn({ args: args as never, ctx: undefined as never }),
    schema,
    userID: userID ?? "guest", // must match client's ZeroProvider userID
    request: c.req.raw,
  });
  return c.json(result);
});
```

If `userID: null` is passed → zero-cache gets `null` as the validated ID →
mismatch → `ProtocolError: Connection userID does not match validated server userID`.

## Frontend

| Tool                      | Why                                                        |
| ------------------------- | ---------------------------------------------------------- |
| **React 19**              | Latest stable, concurrent features                         |
| **Vite**                  | Fast HMR, ESM-native bundler                               |
| **React Router v7**       | File-system routing via `routes/`                          |
| **React Hook Form + Zod** | Type-safe forms with schema validation                     |
| **Tailwind CSS**          | Utility-first, no design system overhead for a pet project |
| **@rocicorp/zero/react**  | `useQuery`, `useZero` hooks for Zero sync                  |

## Server

| Tool                  | Why                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| **Hono**              | Lightweight, web-standard `Request`/`Response`, easy to test                                      |
| **@hono/node-server** | Adapts Hono to Node.js `http.Server`                                                              |
| **pino**              | Structured JSON logging; `pino-pretty` for dev, raw JSON for prod/journalctl                      |
| **tsup**              | Bundles the server to `dist/` with `noExternal: [/@kenku\/.*/]` so workspace packages are inlined |

## drizzle-zero code generation

`packages/zero-schema` is **generated** from the Drizzle schema:

```bash
pnpm --filter @kenku/zero-schema generate
# or from root:
pnpm db:sync
```

Never edit `schema.gen.ts` by hand. Config lives in `drizzle-zero.config.ts`.
