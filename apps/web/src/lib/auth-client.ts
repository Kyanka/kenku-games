import { createAuthClient } from "better-auth/react";

// VITE_API_URL подтягивается из .env в корне монорепы через vite.config.ts (envDir).
// Bearer token хранится в localStorage — работает cross-origin без всяких куков.
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL as string,
  fetchOptions: {
    onSuccess: (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) {
        localStorage.setItem("bearer_token", token);
      }
    },
    auth: {
      type: "Bearer",
      token: () => localStorage.getItem("bearer_token") ?? "",
    },
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;
