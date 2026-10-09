import { type ReactNode } from "react";
import { ZeroProvider } from "@rocicorp/zero/react";
import { schema, mutators } from "@kenku/zero-schema";
import { useSession } from "../lib/auth-client.js";

export function KenkuZeroProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  // null = anonymous/logged-out. Zero v1.7+: null/undefined means "not logged in".
  // Empty string "" would throw; "guest"/"anon" is deprecated.
  const userID = session?.user.id ?? null;

  // auth MUST be a string (not a function) — Zero serialises it via JSON.stringify
  // inside encodeSecProtocols for the Sec-WebSocket-Protocol header. Functions
  // are silently dropped by JSON.stringify, so a function auth never reaches
  // zero-cache. Read the token at render time; useSession() re-renders on
  // login/logout, so the value is always fresh.
  const auth = userID ? (localStorage.getItem("bearer_token") ?? undefined) : undefined;

  return (
    <ZeroProvider
      userID={userID}
      auth={auth}
      schema={schema}
      mutators={mutators}
      cacheURL={import.meta.env.VITE_ZERO_CACHE_URL}
    >
      {children}
    </ZeroProvider>
  );
}
