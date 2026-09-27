import { type ReactNode } from "react";
import { ZeroProvider } from "@rocicorp/zero/react";
import { schema, mutators } from "@kenku/zero-schema";
import { useSession } from "../lib/auth-client.js";

const GUEST_ID = "guest";

export function KenkuZeroProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userID = session?.user.id ?? GUEST_ID;

  // Pass the Better Auth bearer token so zero-cache can forward it to our
  // query server for userID validation. Wrapping in a function lets Zero
  // re-read the token on reconnection (e.g. after a silent token refresh).
  // Guests have no token — they connect as GUEST_ID with no auth.
  const auth =
    userID === GUEST_ID
      ? undefined
      : () => localStorage.getItem("bearer_token") ?? "";

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
