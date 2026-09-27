import { defineMutator, defineMutators } from "@rocicorp/zero";
import { z as zod } from "zod";

export const UpdateProfileSchema = zod.object({
  id: zod.string(),
  username: zod
    .string()
    .min(3, "At least 3 characters")
    .max(20, "At most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscores only")
    .optional(),
  avatarUrl: zod.string().url("Must be a valid URL").nullable().optional(),
});

export const mutators = defineMutators({
  profile: {
    update: defineMutator(
      UpdateProfileSchema,
      async ({ tx, args }) => {
        if (!args) return;
        const { id, username, avatarUrl } = args;

        if (username !== undefined) {
          // upsert so a missing profile row is created automatically
          await tx.mutate.profiles.upsert({
            id,
            username,
            ...(avatarUrl !== undefined && { avatarUrl }),
          });
        } else {
          // avatar-only update — row must already exist
          await tx.mutate.profiles.update({
            id,
            ...(avatarUrl !== undefined && { avatarUrl }),
          });
        }
      },
    ),
  },
});
