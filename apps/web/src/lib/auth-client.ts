import { createAuthClient } from "better-auth/react";

// Better Auth дефолтит на localhost:3000 когда baseURL не задан.
// Явно передаём window.location.origin → в dev запросы идут на 5173 → Vite proxy → 3000.
// В проде VITE_API_URL = реальный домен сервера (https://api.example.com).
export const authClient = createAuthClient({
  baseURL: (import.meta.env.VITE_API_URL as string | undefined) ?? window.location.origin,
});

export const { useSession, signIn, signUp, signOut } = authClient;
