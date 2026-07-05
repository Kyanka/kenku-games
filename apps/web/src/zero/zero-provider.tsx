import { useMemo, type ReactNode } from "react";
import { ZeroProvider } from "@rocicorp/zero/react";
import { schema, mutators } from "@kenku/zero-schema";

const USER_ID_KEY = "kenku:anonymous-user-id";

function getOrCreateUserId(): string {
  const existing = localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(USER_ID_KEY, id);
  return id;
}

export function KenkuZeroProvider({ children }: { children: ReactNode }) {
  const userID = useMemo(() => getOrCreateUserId(), []);

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
