import { createAuthClient } from "better-auth/react";
import { API_BASE } from "./api.js";

export const authClient = createAuthClient({
  baseURL: API_BASE,
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
