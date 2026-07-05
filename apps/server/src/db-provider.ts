import { zeroNodePg } from "@rocicorp/zero/server/adapters/pg";
import { Pool } from "pg";
import { schema } from "@kenku/zero-schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const dbProvider = zeroNodePg(schema, pool);

declare module "@rocicorp/zero" {
  interface DefaultTypes {
    dbProvider: typeof dbProvider;
  }
}
