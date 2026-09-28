import { defineQueries, defineQuery } from "@rocicorp/zero";
import { z } from "zod";
import { builder } from "./schema.gen.js";

/**
 * Custom server-side queries for Zero.
 *
 * These replace the deprecated `definePermissions` approach. Each query is a
 * named, server-executed filter that controls which rows are synced to the
 * client for a given request.
 *
 * Usage on the client:
 *   useQuery(queries.profileByUser({ userId: z.userID }))
 */
export const queries = defineQueries({
  /**
   * Returns the profile row for the given userId.
   * Profiles are public — any authenticated client can read any profile.
   */
  profileByUser: defineQuery(
    z.object({ userId: z.string() }),
    ({ args }) => builder.profiles.where("id", args.userId),
  ),
});
