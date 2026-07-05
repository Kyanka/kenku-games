import { setup, assign } from "xstate";
import type { Coordinate, Seat } from "@kenku/shared-types";
import { fireShot, isBoardFullySunk, type Board } from "./board.js";

function otherSeat(seat: Seat): Seat {
  return seat === 0 ? 1 : 0;
}

export interface BattleshipContext {
  boards: [Board, Board];
  readyToBattle: [boolean, boolean];
  currentTurn: Seat;
  winner: Seat | null;
}

export type BattleshipEvent =
  { type: "PLAYER_READY"; seat: Seat } | { type: "FIRE"; seat: Seat; target: Coordinate };

export const battleshipMachine = setup({
  types: {
    context: {} as BattleshipContext,
    events: {} as BattleshipEvent,
    input: {} as { firstTurn: Seat },
  },
  guards: {
    bothPlayersReady: ({ context }) => context.readyToBattle[0] && context.readyToBattle[1],
    isPlayersTurn: ({ context, event }) =>
      event.type === "FIRE" && context.currentTurn === event.seat,
    someBoardSunk: ({ context }) => context.boards.some((board) => isBoardFullySunk(board)),
  },
  actions: {
    markReady: assign(({ context, event }) => {
      if (event.type !== "PLAYER_READY") return {};
      const readyToBattle: [boolean, boolean] = [...context.readyToBattle];
      readyToBattle[event.seat] = true;
      return { readyToBattle };
    }),
    applyFire: assign(({ context, event }) => {
      if (event.type !== "FIRE") return {};
      const targetSeat = otherSeat(event.seat);
      const boards: [Board, Board] = [...context.boards];
      boards[targetSeat] = fireShot(boards[targetSeat], event.target).board;
      return { boards, currentTurn: otherSeat(context.currentTurn) };
    }),
    declareWinner: assign(({ context }) => {
      const sunkSeat = context.boards.findIndex((board) => isBoardFullySunk(board)) as Seat;
      return { winner: otherSeat(sunkSeat) };
    }),
  },
}).createMachine({
  id: "battleship",
  context: ({ input }) => ({
    boards: [
      { size: 10, ships: [], hits: [], misses: [] },
      { size: 10, ships: [], hits: [], misses: [] },
    ],
    readyToBattle: [false, false],
    currentTurn: input.firstTurn,
    winner: null,
  }),
  initial: "placement",
  states: {
    placement: {
      on: {
        PLAYER_READY: [
          { guard: "bothPlayersReady", target: "battle", actions: "markReady" },
          { actions: "markReady" },
        ],
      },
    },
    battle: {
      always: { guard: "someBoardSunk", target: "gameOver", actions: "declareWinner" },
      on: {
        FIRE: { guard: "isPlayersTurn", actions: "applyFire" },
      },
    },
    gameOver: { type: "final" },
  },
});
