# Development Log

Running memory of the project: solved problems, architectural decisions, pitfalls and a
per-commit change log. How and when to read/update it: [`../rules/06-dev-log.md`](../rules/06-dev-log.md).

---

## Change Log

<!-- Newest first. One line per commit: YYYY-MM-DD · type(scope): summary — why -->

- 2026-10-09 · chore: format codebase with prettier + eslint --fix — one-time baseline so later diffs show only real changes
- 2026-10-09 · feat(web): theme tokens, per-font type scale, restyled auth forms + lint tooling — groundwork for a light theme, one visual system for auth forms, ESLint + Prettier on every commit (husky + lint-staged, `pnpm check` / `pnpm fix`), dev-log moved to `notes/` with per-commit rule, `/git-update` and `/resolve-dev-log` skills, `merge=union` for the dev-log

---

## Solved Problems

### Zero auth: `ProtocolError: Connection userID does not match validated server userID`

**Date:** 2025-09  
**Symptom:** Zero real-time sync failed with the error above in both authenticated and guest sessions.  
**Root cause:** `ZERO_QUERY_URL` makes zero-cache call our server to validate each WebSocket connection. Our `/api/zero/query` handler returned `userID: null` → zero-cache compared it to the real user's ID from the client's `ZeroProvider` → mismatch → error.  
**Fix (two parts):**

1. **Client** (`apps/web/src/zero/zero-provider.tsx`): pass the Better Auth bearer token as an `auth` function when authenticated, `undefined` for guests.
   ```tsx
   const GUEST_ID = "guest";
   const auth = userID === GUEST_ID ? undefined : () => localStorage.getItem("bearer_token") ?? "";
   ```
2. **Server** (`apps/server/src/index.ts`): validate the Better Auth session in `/api/zero/query` and return the real `userID` (or `"guest"` for unauthenticated) to `handleQueryRequest`.
   ```ts
   const session = await auth.api.getSession({ headers: c.req.raw.headers });
   userID: session?.user?.id ?? "guest",
   ```

**Key rule:** The `userID` returned by `handleQueryRequest` must exactly match the `userID` the client passed to `ZeroProvider`. Use `"guest"` as the shared constant for unauthenticated users on both sides.

---

### Username not showing on first profile visit

**Date:** 2025-09  
**Symptom:** Profile form showed empty username on first page load even though the DB had data.  
**Root cause:** `useQuery` from Zero is async — rows arrive after Zero syncs. The form rendered before data was ready.  
**Rejected approach:** Using `session?.user?.name` as a fallback. **Do not do this.** At password registration, Better Auth does not populate `user.name` with the username — there is no username there to fall back to.  
**Fix:** Expose `isLoading` from `useProfile`, derived from `details.type !== "complete"` (Zero's `useQuery` returns `[rows, details]`). Show "Loading profile…" and disable the form until loading is done.

---

### Zero `definePermissions` deprecated in 1.7.0

**Date:** 2025-09  
**Symptom:** TypeScript errors on `definePermissions` import.  
**Fix:** Zero 1.7.0 replaced `definePermissions` with `defineQuery`/`defineQueries` in `@rocicorp/zero`. Server exposes queries via `handleQueryRequest`; client consumes them via `useQuery(queries.profileByUser({userId}))`.

---

## Architecture Decisions

### Colors: semantic tokens + `data-theme` (2026-10-09)

Hex values live only in `:root` / `[data-theme="…"]` in `apps/web/src/index.css` as role
variables (`--surface`, `--fg`, `--muted`, `--line`, `--accent`, `--on-accent`, `--secondary`,
`--danger`, `--info`). `@theme inline` maps them to Tailwind colors, so markup uses roles
(`bg-surface`, `text-muted`, `border-line`…), never palette names. Light theme = fill the
TODO block, no markup changes. `inline` is required: without it utilities read the variable
resolved once on `:root` and a theme switch on a subtree would not apply.

### Typography: one size scale per font (2026-10-09)

`font-main` (Press Start 2P) and `font-second` (Space Mono) are `@utility` classes that set
`--fs-*` variables; `text-*` (via `@theme inline`) reads `var(--fs-*)`. Same class, different
size per font: `font-main text-sm` = 16px, `font-second text-sm` = 14px. Press Start 2P steps
are multiples of 8px — anything else renders blurry; that is why no fluid `clamp()` sizes.

### Why Zero (Rocicorp)?

Chosen to learn real-time sync without manual WebSocket code. Zero handles optimistic updates, conflict resolution, and offline support automatically. The learning value outweighs the complexity of setup.

### Why Better Auth over NextAuth / Lucia?

Better Auth provides a Hono adapter out of the box (we use Hono, not Next.js). It has a bearer token plugin that integrates cleanly with Zero's `auth` prop — the token is stored in `localStorage["bearer_token"]` and passed on each Zero connection.

### Why Hono over Express?

Runs on the edge, has first-class TypeScript support, and works well in a pnpm monorepo. Hono's `Context` type makes middleware authoring predictable. Better Auth has an official Hono adapter.

### Why pino for logging?

`console.log` is unstructured and noisy in production (journalctl). Pino writes structured JSON in prod (parseable by log aggregators) and uses `pino-pretty` in dev for readable output. Low overhead, widely adopted.

### Why systemd over Docker / PM2?

This is a single VPS educational project. systemd is already there, handles restarts, log rotation (journald), and service dependencies with zero extra tooling. PM2 adds a process manager on top of what the OS already provides; Docker adds image build complexity that isn't useful here yet.

### Drizzle migration strategy

Migrations run as a **oneshot systemd service** (`kenku-migrate.service`) that must succeed before the server starts (`Requires=kenku-migrate.service`). This avoids running migrations in the app startup code (which could cause race conditions on restart) while keeping them automatic on every deploy.

---

## Things to Avoid

| Pitfall                                                                                         | Why                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setting `color` / `border-color` in `@layer base` for elements that have Tailwind color classes | Utilities layer always wins over base. Use `outline`, or put the rule in `@layer utilities` with higher specificity (see focus styles in `index.css`) |
| `text-md` and other size names outside the scale                                                | Scale is `xs sm base lg xl 2xl 3xl`; `md` is only a breakpoint → "Cannot apply unknown utility class"                                                 |
| Tailwind default palette classes (`slate-*`, `red-*`…)                                          | `--color-*: initial` removed them; they silently render nothing. Use role colors                                                                      |
| Styling the browser autofill _preview_ font                                                     | Chrome renders the suggestion preview with its own UA styles; not overridable from CSS. Style `:autofill` (after selection) only                      |
| `session?.user?.name` as username fallback                                                      | Name is not populated at password registration in Better Auth                                                                                         |
| `userID: null` in `handleQueryRequest`                                                          | Causes ProtocolError in zero-cache auth validation                                                                                                    |
| Calling `definePermissions` (Zero 1.7.0+)                                                       | Removed; use `defineQuery`/`defineQueries`                                                                                                            |
| Committing `.env` files                                                                         | Contains secrets; `.gitignore` must cover `.env*`                                                                                                     |
| Running migrations inside app startup code                                                      | Race conditions; use the migrate service instead                                                                                                      |

---

## Research Log

### 2025-09 — Zero auth chain investigation

Spent time debugging why zero-cache raised `ProtocolError` even after removing the `auth` prop from `ZeroProvider`. Discovered via Zero docs that `ZERO_QUERY_URL` causes zero-cache to call the server on every WebSocket connection handshake — not just for data queries. The server's response includes a `userID` that zero-cache stores and compares to every subsequent connection attempt. Returning `null` meant no real user could ever authenticate. Solution required fixing both ends simultaneously.

### 2025-09 — pino setup

Tried `pino-http` middleware for automatic request logging. Found that it logs before the response is ready (no status code). Switched to a manual middleware that runs `await next()` first, then logs with status + duration. Used `logger.error` for 5xx, `logger.warn` for 4xx, `logger.info` for the rest.
