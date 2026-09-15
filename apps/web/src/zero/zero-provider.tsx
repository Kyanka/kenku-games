import { type ReactNode } from "react";
import { ZeroProvider } from "@rocicorp/zero/react";
import { schema, mutators } from "@kenku/zero-schema";
import { useSession } from "../lib/auth-client.js";

// Гостевой ID для Zero пока пользователь не авторизован.
// Zero требует непустой userID даже для публичных запросов.
const GUEST_ID = "guest";

export function KenkuZeroProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userID = session?.user.id ?? GUEST_ID;

  return (
    <ZeroProvider
      userID={userID}
      auth={userID}
      schema={schema}
      mutators={mutators}
      cacheURL={import.meta.env.VITE_ZERO_CACHE_URL}
    >
      {children}
    </ZeroProvider>
  );
}
