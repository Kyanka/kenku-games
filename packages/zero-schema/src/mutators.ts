import { defineMutators, defineMutator } from "@rocicorp/zero";
import { z } from "zod";
import {
  canPlaceShip,
  createEmptyBoard,
  fireShot as applyFireShot,
  isBoardFullySunk,
  type Board,
  type Ship,
} from "@kenku/game-logic";
import type { Seat } from "@kenku/shared-types";
import { zql } from "./schema.js";

function otherSeat(seat: Seat): Seat {
  return seat === 0 ? 1 : 0;
}

const coordinateSchema = z.object({ row: z.number().int(), col: z.number().int() });

export const mutators = defineMutators({
  room: {
    create: defineMutator(
      z.object({ id: z.string(), gameType: z.enum(["battleship", "dice"]) }),
      async ({ tx, args }) => {
        await tx.mutate.room.insert({
          id: args.id,
          gameType: args.gameType,
          status: "waiting",
          currentTurn: 0,
          createdAt: Date.now(),
        });
      },
    ),
    join: defineMutator(
      z.object({ id: z.string(), roomId: z.string(), name: z.string().min(1).max(40) }),
      async ({ tx, args }) => {
        const existing = await tx.run(zql.player.where("roomId", args.roomId));
        if (existing.length >= 2) throw new Error("room is full");
        const seat = existing.length as Seat;

        await tx.mutate.player.insert({
          id: args.id,
          roomId: args.roomId,
          seat,
          name: args.name,
          board: null,
          connectedAt: Date.now(),
        });

        if (seat === 1) {
          await tx.mutate.room.update({ id: args.roomId, status: "active" });
        }
      },
    ),
  },
  battleship: {
    placeShip: defineMutator(
      z.object({
        roomId: z.string(),
        playerId: z.string(),
        moveId: z.string(),
        shipId: z.string(),
        cells: z.array(coordinateSchema),
      }),
      async ({ tx, args }) => {
        const player = await tx.run(zql.player.where("id", args.playerId).one());
        if (!player) throw new Error("unknown player");

        const board: Board = player.board ?? createEmptyBoard();
        const ship: Ship = { id: args.shipId, cells: args.cells };
        if (!canPlaceShip(board, ship)) throw new Error("invalid ship placement");

        const nextBoard: Board = { ...board, ships: [...board.ships, ship] };
        await tx.mutate.player.update({ id: args.playerId, board: nextBoard });
        await tx.mutate.move.insert({
          id: args.moveId,
          roomId: args.roomId,
          playerId: args.playerId,
          seq: Date.now(),
          payload: { type: "place-ship", shipId: args.shipId, cells: args.cells },
          createdAt: Date.now(),
        });
      },
    ),
    fireShot: defineMutator(
      z.object({
        roomId: z.string(),
        playerId: z.string(),
        moveId: z.string(),
        target: coordinateSchema,
      }),
      async ({ tx, args }) => {
        const room = await tx.run(zql.room.where("id", args.roomId).one());
        if (!room) throw new Error("unknown room");

        const players = await tx.run(zql.player.where("roomId", args.roomId));
        const me = players.find((p) => p.id === args.playerId);
        if (!me) throw new Error("unknown player");
        if (room.currentTurn !== me.seat) throw new Error("not your turn");

        const opponent = players.find((p) => p.id !== args.playerId);
        if (!opponent?.board) throw new Error("opponent has no board yet");

        const { result, board: nextBoard } = applyFireShot(opponent.board, args.target);
        if (result === "already-fired") throw new Error("cell already targeted");

        await tx.mutate.player.update({ id: opponent.id, board: nextBoard });
        await tx.mutate.move.insert({
          id: args.moveId,
          roomId: args.roomId,
          playerId: args.playerId,
          seq: Date.now(),
          payload: { type: "fire-shot", target: args.target },
          createdAt: Date.now(),
        });

        const gameOver = isBoardFullySunk(nextBoard);
        await tx.mutate.room.update({
          id: args.roomId,
          status: gameOver ? "finished" : room.status,
          currentTurn: gameOver ? room.currentTurn : otherSeat(me.seat as Seat),
        });
      },
    ),
  },
});
