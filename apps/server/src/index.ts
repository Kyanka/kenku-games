import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { PushProcessor, handleQueryRequest } from "@rocicorp/zero/server";
import { mustGetQuery } from "@rocicorp/zero";
import { mutators, schema, queries } from "@kenku/zero-schema";
import { dbProvider } from "./db-provider.js";
import { db } from "./db/client.js";
import { profiles } from "@kenku/db";
import { eq } from "drizzle-orm";
import { auth } from "./auth.js";
import { logger } from "./logger.js";

const app = new Hono();

const ALLOWED_ORIGINS = (
  process.env.CORS_ORIGINS ??
  process.env.FRONTEND_URL ??
  "http://localhost:5173"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// ─── HTTP request logging middleware ───────────────────────────────────────
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  const status = c.res.status;
  const log =
    status >= 500
      ? logger.error.bind(logger)
      : status >= 400
        ? logger.warn.bind(logger)
        : logger.info.bind(logger);
  log(
    { method: c.req.method, path: c.req.path, status, ms },
    `${c.req.method} ${c.req.path} ${status} ${ms}ms`,
  );
});

function withCors(response: Response, origin: string | null): Response {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return response;
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Vary", "Origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

app.on(["GET", "POST", "OPTIONS"], "/api/auth/**", async (c) => {
  const origin = c.req.header("Origin") ?? null;

  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin":
          origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        Vary: "Origin",
      },
    });
  }

  const response = await auth.handler(c.req.raw);
  return withCors(response, origin);
});

const pushProcessor = new PushProcessor(dbProvider);

const apiCors = cors({
  origin: (o) => (ALLOWED_ORIGINS.includes(o) ? o : ALLOWED_ORIGINS[0]),
  credentials: true,
});
app.use("/api/zero/*", apiCors);
app.use("/api/check-username", apiCors);

app.get("/healthz", (c) => c.json({ ok: true }));

app.post("/api/zero/mutate", async (c) => {
  try {
    const result = await pushProcessor.process(mutators, c.req.raw);
    return c.json(result);
  } catch (err) {
    logger.error({ err }, "mutate error");
    return c.json({ error: "mutate failed" }, 500);
  }
});

app.post("/api/zero/query", async (c) => {
  // Validate the Better Auth bearer token that zero-cache forwarded from the
  // client's `auth` prop. The userID we return here becomes the "validated
  // server userID" that zero-cache compares against the connection's userID.
  let userID: string | null = null;
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    userID = session?.user?.id ?? null;
  } catch (err) {
    logger.warn({ err }, "auth.getSession failed — treating as guest");
  }

  logger.debug({ userID }, "zero query request");

  try {
    const result = await handleQueryRequest({
      handler: (name, args) => {
        logger.debug({ name, args }, "running custom query");
        const q = mustGetQuery(queries, name);
        return q.fn({ args: args as never, ctx: undefined as never });
      },
      schema,
      // For unauthenticated connections, pass null. zero-cache compares this
      // against connection.user.id which is also null when no userID was sent.
      userID: userID, // null for anonymous — Zero v1.7+ expects null/undefined for logged-out
      request: c.req.raw,
    });
    return c.json(result);
  } catch (err) {
    logger.error({ err, userID }, "handleQueryRequest error");
    return c.json({ error: "query failed" }, 500);
  }
});

app.get("/api/check-username", async (c) => {
  const username = c.req.query("username");
  if (!username) return c.json({ available: false, error: "username required" }, 400);
  const rows = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);
  return c.json({ available: rows.length === 0 });
});

const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, () => {
  logger.info({ port }, `kenku server listening`);
});
