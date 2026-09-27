import { useQuery, useZero } from "@rocicorp/zero/react";
import { queries, mutators } from "@kenku/zero-schema";

export type ProfileUpdateArgs = {
  username?: string;
  avatarUrl?: string | null;
};

export function useProfile() {
  const z = useZero();
  const userID = z.userID;

  const isRealUser = !!userID && userID !== "guest";

  // Only subscribe when we have a real user ID — querying with "" creates a
  // useless subscription that zero-cache tracks, and switching it to the real
  // ID later causes a new subscription, breaking real-time updates.
  const [profileRows, details] = useQuery(
    queries.profileByUser({ userId: userID ?? "" }),
    { enabled: isRealUser },
  );
  const profile = profileRows[0] ?? null;

  // True while zero-cache hasn't returned the first snapshot yet.
  // Also true when the user isn't logged in (no subscription).
  const isLoading = isRealUser && details.type !== "complete";

  async function updateProfile(args: ProfileUpdateArgs) {
    if (!userID) return;
    await z.mutate(mutators.profile.update({ id: userID, ...args }));
  }

  return { profile, userID, isLoading, updateProfile };
}
