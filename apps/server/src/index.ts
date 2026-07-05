import express from "express";
import cors from "cors";
import { PushProcessor, handleQueryRequest } from "@rocicorp/zero/server";
import { mustGetQuery } from "@rocicorp/zero";
import { schema, mutators, queries } from "@kenku/zero-schema";
import { dbProvider } from "./db-provider.js";

const app = express();
app.use(cors());
app.use(express.raw({ type: "*/*" }));

const pushProcessor = new PushProcessor(dbProvider);

function toWebRequest(req: express.Request): Request {
  const url = `${req.protocol}://${req.get("host") ?? "localhost"}${req.originalUrl}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  return new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? (req.body as Buffer) : undefined,
  });
}

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/zero/mutate", async (req, res) => {
  const result = await pushProcessor.process(mutators, toWebRequest(req));
  res.json(result);
});

app.post("/api/zero/query", async (req, res) => {
  const result = await handleQueryRequest({
    handler: (name, args) => mustGetQuery(queries, name).fn({ args }),
    schema,
    request: toWebRequest(req),
    userID: null,
  });
  res.json(result);
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`kenku server listening on :${port}`);
});
