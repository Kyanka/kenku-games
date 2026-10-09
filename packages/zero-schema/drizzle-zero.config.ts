import { drizzleZeroConfig } from "drizzle-zero";
import { profiles } from "../db/src/schema.js";

export default drizzleZeroConfig(
  { profiles },
  {
    tables: {
      profiles: {
        id: true,
        username: true,
        avatarUrl: true,
        isAdmin: true,
        createdAt: true,
      },
    },
  },
);
