import { drizzleZeroConfig } from "drizzle-zero";
// Relative import — bypasses tsx module isolation that occurs with @kenku/db workspace import.
// When drizzle-zero runs this config via tsx, both this file and schema.ts
// share the same tsx-namespace, so drizzle-orm's is(table, Table) check works correctly.
// Source of truth for DB types stays in packages/db/src/schema.ts.
import { profiles } from "../db/src/schema.js";

export default drizzleZeroConfig(
  { profiles },
  {
    tables: {
      // Explicitly list which columns to expose through Zero (client-side).
      // Add a column here after adding it to packages/db/src/schema.ts + running db:sync.
      profiles: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    },
  }
);
