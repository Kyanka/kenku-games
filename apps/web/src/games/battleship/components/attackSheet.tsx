import type React from "react";
import type { Position, ShipState } from "../data/types";
import { MISS, SHOT_SHIP } from "../data/visualSettings";

type AttackSheetProps = {
  attackSheet: boolean[][];
  defenseSheet: boolean[][];
  isDefenseBoardDisabled: boolean;
  shipsState: ShipState[];

  setAttackSheet: React.Dispatch<React.SetStateAction<boolean[][]>>;
  setOpponentShipCounter: React.Dispatch<React.SetStateAction<number>>;
};

export function AttackSheet({
  attackSheet,
  isDefenseBoardDisabled,
  defenseSheet,
  shipsState,
  setAttackSheet,
  setOpponentShipCounter,
}: AttackSheetProps) {
  function getAttackCellColor(isMarked: boolean, rowIndex: number, colIndex: number) {
    if (!isMarked) return "bg-white";

    return defenseSheet[rowIndex]?.[colIndex] ? "bg-amber-300" : "bg-blue-500";
    // return defenseSheet[rowIndex]?.[colIndex] ? `bg-[${SHOT_SHIP}]` : `bg-[${MISS}]`;
  }

  function colourSurroundingCells(cells: Position[]) {
    const startCell = [cells[0]!.row - 1, cells[0]!.col - 1];
    const lastCell = [cells[cells.length - 1]!.row + 1, cells[cells.length - 1]!.col + 1];

    setAttackSheet((prev) => {
      const newBoard = prev.map((row) => [...row]);

      for (let x = startCell[0]!; x <= lastCell[0]!; x++) {
        for (let y = startCell[1]!; y <= lastCell[1]!; y++) {
          if (cells.some((cell) => cell.row === x && cell.col === y)) {
            continue;
          }

          if (x < 0 || x >= 10 || y < 0 || y >= 10) {
            continue;
          }

          newBoard[x]![y] = true;
        }
      }

      return newBoard;
    });
  }

  return (
    <>
      {attackSheet.map((row, rowIndex) => (
        <div className="flex">
          {row.map((isMarked, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              disabled={!isDefenseBoardDisabled || isMarked}
              className={`w-8 h-8 border border-gray-500 ${getAttackCellColor(isMarked, rowIndex, colIndex)}`}
              onClick={() => {
                setAttackSheet((prev) =>
                  prev.map((row, r) =>
                    row.map((cell, c) => (r === rowIndex && c === colIndex ? !cell : cell)),
                  ),
                );
                if (defenseSheet[rowIndex]?.[colIndex]) {
                  const ship = shipsState.find((ship) =>
                    ship.cells.some((cell) => cell.row === rowIndex && cell.col === colIndex),
                  );
                  if (ship) {
                    ship.hits.push({ row: rowIndex, col: colIndex });

                    if (ship.cells.length === ship.hits.length) {
                      setOpponentShipCounter((prev) => prev - 1);
                      colourSurroundingCells(ship.cells);
                    }
                  }
                }
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
}
