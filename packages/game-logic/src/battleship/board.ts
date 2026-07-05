import type { Coordinate } from "@kenku/shared-types";

export type Ship = {
  id: string;
  cells: Coordinate[];
};

export type Board = {
  size: number;
  ships: Ship[];
  hits: Coordinate[];
  misses: Coordinate[];
};

export type FireShotResult = "hit" | "sunk" | "miss" | "already-fired";

export function createEmptyBoard(size = 10): Board {
  return { size, ships: [], hits: [], misses: [] };
}

function coordEquals(a: Coordinate, b: Coordinate): boolean {
  return a.row === b.row && a.col === b.col;
}

function isWithinBounds(board: Board, cell: Coordinate): boolean {
  return cell.row >= 0 && cell.row < board.size && cell.col >= 0 && cell.col < board.size;
}

export function canPlaceShip(board: Board, ship: Ship): boolean {
  if (ship.cells.length === 0) return false;

  const allInBounds = ship.cells.every((cell) => isWithinBounds(board, cell));
  if (!allInBounds) return false;

  const occupied = board.ships.flatMap((existing) => existing.cells);
  const overlaps = ship.cells.some((cell) => occupied.some((taken) => coordEquals(taken, cell)));
  if (overlaps) return false;

  return true;
}

export function placeShip(board: Board, ship: Ship): Board {
  return { ...board, ships: [...board.ships, ship] };
}

function isShipSunk(board: Board, ship: Ship): boolean {
  return ship.cells.every((cell) => board.hits.some((hit) => coordEquals(hit, cell)));
}

export function isBoardFullySunk(board: Board): boolean {
  return board.ships.length > 0 && board.ships.every((ship) => isShipSunk(board, ship));
}

export function fireShot(
  board: Board,
  target: Coordinate,
): { result: FireShotResult; board: Board } {
  const alreadyFired =
    board.hits.some((hit) => coordEquals(hit, target)) ||
    board.misses.some((miss) => coordEquals(miss, target));
  if (alreadyFired) {
    return { result: "already-fired", board };
  }

  const struckShip = board.ships.find((ship) =>
    ship.cells.some((cell) => coordEquals(cell, target)),
  );

  if (!struckShip) {
    return { result: "miss", board: { ...board, misses: [...board.misses, target] } };
  }

  const nextBoard = { ...board, hits: [...board.hits, target] };
  const sunk = isShipSunk(nextBoard, struckShip);
  return { result: sunk ? "sunk" : "hit", board: nextBoard };
}
