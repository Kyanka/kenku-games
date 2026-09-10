import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { PushProcessor } from "@rocicorp/zero/server";
import { mutators } from "@kenku/zero-schema";
import { dbProvider } from "./db-provider.js";
import { auth } from "./auth.js";

const app = new Hono();

const FRONTEND_ORIGIN = process.env.FRONTEND_URL ?? "http://localhost:5173";

// Вспомогательная функция: добавляет CORS-заголовки к raw Response от Better Auth.
// Hono cors() middleware не работает с raw Response, поэтому добавляем вручную.
function withCors(response: Response, origin: string | null): Response {
  if (!origin || origin !== FRONTEND_ORIGIN) return response;
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

// CORS preflight + все /api/auth/* маршруты
app.on(["GET", "POST", "OPTIONS"], "/api/auth/**", async (c) => {
  const origin = c.req.header("Origin") ?? null;

  // Preflight
  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Vary": "Origin",
      },
    });
  }

  const response = await auth.handler(c.req.raw);
  return withCors(response, origin);
});

const pushProcessor = new PushProcessor(dbProvider);

// CORS для Zero-эндпоинтов
app.use(
  "/api/zero/*",
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.get("/healthz", (c) => c.json({ ok: true }));

app.post("/api/zero/mutate", async (c) => {
  const result = await pushProcessor.process(mutators, c.req.raw);
  return c.json(result);
});

const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, () => {
  console.log(`kenku server listening on :${port}`);
});
