import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/client.js";
import { user, session, account, verification, profiles } from "@kenku/db";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  plugins: [bearer()],
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
        before: async (newUser) => {
          // newUser.name carries the username chosen at signup (transport mechanism)
          const username = newUser.name;
          if (!username) return { data: newUser };
          const existing = await db.select({ id: profiles.id })
            .from(profiles)
            .where(eq(profiles.username, username))
            .limit(1);
          if (existing.length > 0) {
            throw new Error("Username is already taken");
          }
          return { data: newUser };
        },
        after: async (newUser) => {
          // Use name as username if provided, otherwise fall back to email prefix
          const username = newUser.name || newUser.email.split("@")[0];
          await db.insert(profiles).values({
            id: newUser.id,
            username,
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
