import { describe, expect, it } from "vitest";
import { canPlaceShip, createEmptyBoard, fireShot, placeShip, type Ship } from "./board.js";

describe("canPlaceShip", () => {
  it("allows a ship fully within bounds with no overlap", () => {
    const board = createEmptyBoard(10);
    const ship: Ship = {
      id: "carrier",
      cells: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ],
    };
    expect(canPlaceShip(board, ship)).toBe(true);
  });

  it("rejects a ship with cells out of bounds", () => {
    const board = createEmptyBoard(10);
    const ship: Ship = {
      id: "carrier",
      cells: [
        { row: 9, col: 9 },
        { row: 9, col: 10 },
      ],
    };
    expect(canPlaceShip(board, ship)).toBe(false);
  });

  it("rejects a ship with no cells", () => {
    const board = createEmptyBoard(10);
    expect(canPlaceShip(board, { id: "empty", cells: [] })).toBe(false);
  });

  it("rejects a ship that overlaps an already placed ship", () => {
    let board = createEmptyBoard(10);
    board = placeShip(board, {
      id: "carrier",
      cells: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ],
    });
    const overlapping: Ship = {
      id: "destroyer",
      cells: [
        { row: 0, col: 1 },
        { row: 1, col: 1 },
      ],
    };
    expect(canPlaceShip(board, overlapping)).toBe(false);
  });
});

describe("fireShot", () => {
  function boardWithDestroyer() {
    return placeShip(createEmptyBoard(10), {
      id: "destroyer",
      cells: [
        { row: 2, col: 2 },
        { row: 2, col: 3 },
      ],
    });
  }

  it("reports a miss and records it", () => {
    const board = boardWithDestroyer();
    const { result, board: nextBoard } = fireShot(board, { row: 5, col: 5 });
    expect(result).toBe("miss");
    expect(nextBoard.misses).toContainEqual({ row: 5, col: 5 });
  });

  it("reports a hit when a ship cell is struck but the ship isn't fully sunk", () => {
    const board = boardWithDestroyer();
    const { result, board: nextBoard } = fireShot(board, { row: 2, col: 2 });
    expect(result).toBe("hit");
    expect(nextBoard.hits).toContainEqual({ row: 2, col: 2 });
  });

  it("reports sunk once every cell of a ship has been hit", () => {
    let board = boardWithDestroyer();
    board = fireShot(board, { row: 2, col: 2 }).board;
    const { result } = fireShot(board, { row: 2, col: 3 });
    expect(result).toBe("sunk");
  });

  it("reports already-fired for a cell that was already targeted", () => {
    let board = boardWithDestroyer();
    board = fireShot(board, { row: 5, col: 5 }).board;
    const { result, board: unchangedBoard } = fireShot(board, { row: 5, col: 5 });
    expect(result).toBe("already-fired");
    expect(unchangedBoard.misses).toHaveLength(1);
  });
});
