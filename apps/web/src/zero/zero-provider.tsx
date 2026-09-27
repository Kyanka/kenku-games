import { type ReactNode } from "react";
import { ZeroProvider } from "@rocicorp/zero/react";
import { schema, mutators } from "@kenku/zero-schema";
import { useSession } from "../lib/auth-client.js";

export function KenkuZeroProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  // null = anonymous/logged-out. Zero v1.7+: null/undefined means "not logged in".
  // Empty string "" would throw; "guest"/"anon" is deprecated.
  const userID = session?.user.id ?? null;

  // Pass the Better Auth bearer token so zero-cache can forward it to our
  // query server for userID validation. Re-read on reconnect via function form.
  // Anonymous users connect with null userID and no auth token.
  const auth = userID
    ? () => localStorage.getItem("bearer_token") ?? ""
    : undefined;

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
