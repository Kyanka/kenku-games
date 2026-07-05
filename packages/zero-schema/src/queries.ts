import { defineQueries, defineQuery } from "@rocicorp/zero";
import { z } from "zod";
import { zql } from "./schema.js";

export const queries = defineQueries({
  rooms: {
    byId: defineQuery(z.string(), ({ args: roomId }) =>
      zql.room.where("id", roomId).related("players").related("moves").one(),
    ),
  },
});
