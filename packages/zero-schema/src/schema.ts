import {
  createSchema,
  createBuilder,
  table,
  string,
  number,
  json,
  enumeration,
  relationships,
} from "@rocicorp/zero";
import type { GameType, RoomStatus, MovePayload } from "@kenku/shared-types";
import type { Board } from "@kenku/game-logic";

const room = table("room")
  .columns({
    id: string(),
    gameType: enumeration<GameType>(),
    status: enumeration<RoomStatus>(),
    // Seat is 0 | 1: Zero's enumeration() only supports string literal unions,
    // so seats are stored as plain numbers and narrowed to Seat in app code.
    currentTurn: number(),
    createdAt: number(),
  })
  .primaryKey("id");

const player = table("player")
  .columns({
    id: string(),
    roomId: string(),
    seat: number(),
    name: string(),
    board: json<Board>().optional(),
    connectedAt: number(),
  })
  .primaryKey("id");

const move = table("move")
  .columns({
    id: string(),
    roomId: string(),
    playerId: string(),
    seq: number(),
    payload: json<MovePayload>(),
    createdAt: number(),
  })
  .primaryKey("id");

const roomRelationships = relationships(room, ({ many }) => ({
  players: many({ sourceField: ["id"], destSchema: player, destField: ["roomId"] }),
  moves: many({ sourceField: ["id"], destSchema: move, destField: ["roomId"] }),
}));

const moveRelationships = relationships(move, ({ one }) => ({
  player: one({ sourceField: ["playerId"], destSchema: player, destField: ["id"] }),
}));

export const schema = createSchema({
  tables: [room, player, move],
  relationships: [roomRelationships, moveRelationships],
});

export type Schema = typeof schema;

export const zql = createBuilder(schema);

declare module "@rocicorp/zero" {
  interface DefaultTypes {
    schema: Schema;
  }
}
