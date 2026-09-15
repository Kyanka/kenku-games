import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/client.js";
import { user, session, account, verification, profiles } from "@kenku/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),

  // Разрешаем запросы с фронта (локально и прод через env)
  trustedOrigins: [process.env.FRONTEND_URL ?? "http://localhost:5173", "http://localhost:5173"],

  emailAndPassword: { enabled: true },

  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Автоматически создаём публичный профиль при регистрации
        after: async (newUser) => {
          await db.insert(profiles).values({
            id: newUser.id,
            username: newUser.name ?? newUser.email.split("@")[0],
            avatarUrl: newUser.image ?? null,
          });
        },
      },
    },
  },

  advanced: {
    useSecureCookies: true,
    cookies: {
      session_token: {
        attributes: {
          sameSite: "none",
          secure: true,
        },
      },
    },
  },
});

export type Auth = typeof auth;
