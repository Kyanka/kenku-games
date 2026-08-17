import type { Position, Ship, ShipState, UserErrors } from "./data/types";

function canPlaceShip(
  rowIndex: number,
  colIndex: number,
  isHorisontal: boolean,
  defenseSheet: boolean[][],
  currentShip: number,
) {
  const rowStart = Math.max(0, rowIndex - 1);
  const rowEnd = isHorisontal ? Math.min(9, rowIndex + 1) : Math.min(9, rowIndex + currentShip);

  const colStart = Math.max(0, colIndex - 1);
  const colEnd = isHorisontal ? Math.min(9, colIndex + currentShip) : Math.min(9, colIndex + 1);

  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      if (defenseSheet[row]?.[col]) {
        console.log("Знайшов корабель:", row, col);
        return true;
      }
    }
  }
}

export function positionShip(
  rowIndex: number,
  colIndex: number,
  isHorisontal: boolean,
  defenseSheet: boolean[][],
  currentShip: number,
  setUserError: React.Dispatch<React.SetStateAction<UserErrors>>,
  setShipsPool: React.Dispatch<React.SetStateAction<Ship[]>>,
  setDefenseSheet: React.Dispatch<React.SetStateAction<boolean[][]>>,
  setCurrentShip: React.Dispatch<React.SetStateAction<number>>,
) {
  const newBoard = defenseSheet.map((row) => [...row]);

  const startRow = isHorisontal ? rowIndex : Math.min(rowIndex, 10 - currentShip);
  const startCol = isHorisontal ? Math.min(colIndex, 10 - currentShip) : colIndex;

  if (canPlaceShip(startRow, startCol, isHorisontal, defenseSheet, currentShip)) {
    setUserError("ship playcment");
    return;
  }

  for (let i = 0; i < currentShip; i++) {
    const r = isHorisontal ? startRow : startRow + i;
    const c = isHorisontal ? startCol + i : startCol;

    newBoard[r]![c] = true;
  }

  setShipsPool((prev) =>
    prev.map((ship) => (ship.size === currentShip ? { ...ship, count: ship.count - 1 } : ship)),
  );

  setDefenseSheet(newBoard);
  setCurrentShip(0);
  setUserError("undefined");
}

export function findShip(rowIndex: number, colIndex: number, defenseSheet: boolean[][]) {
  const visited = new Set<string>();
  const ship: Position[] = [];

  function dfs(row: number, col: number) {
    if (row < 0 || row > 10 || col < 0 || col > 10) {
      return;
    }

    const key = `${row} - ${col}`;

    if (visited.has(key)) {
      return;
    }

    visited.add(key);

    if (!defenseSheet[row]?.[col]) {
      return;
    }

    ship.push({ row, col });

    dfs(row - 1, col);
    dfs(row + 1, col);
    dfs(row, col - 1);
    dfs(row, col + 1);
  }

  dfs(rowIndex, colIndex);

  console.log(ship);

  return ship;
}

export function cancelShipPlacment(
  rowIndex: number,
  colIndex: number,
  defenseSheet: boolean[][],
  setShipsPool: React.Dispatch<React.SetStateAction<Ship[]>>,
  setDefenseSheet: React.Dispatch<React.SetStateAction<boolean[][]>>,
) {
  const ship = findShip(rowIndex, colIndex, defenseSheet);
  const newBoard = defenseSheet.map((row) => [...row]);
  const shipSize = ship.length;

  ship.forEach(({ row, col }) => {
    newBoard[row]![col] = false;
  });

  setShipsPool((prev) =>
    prev.map((ship) => (ship.size === shipSize ? { ...ship, count: ship.count + 1 } : ship)),
  );

  setDefenseSheet(newBoard);
  return;
}

export function findAllShips(defenseSheet: boolean[][]) {
  const visited = new Set<string>();
  const ships: ShipState[] = [];

  function dfs(row: number, col: number, ship: Position[]) {
    if (row < 0 || row >= 10 || col < 0 || col >= 10) {
      return;
    }

    const key = `${row} - ${col}`;

    if (visited.has(key)) {
      return;
    }

    visited.add(key);

    if (!defenseSheet[row]?.[col]) {
      return;
    }

    ship.push({ row, col });

    dfs(row - 1, col, ship);
    dfs(row + 1, col, ship);
    dfs(row, col - 1, ship);
    dfs(row, col + 1, ship);
  }

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (defenseSheet[row]?.[col] && !visited.has(`${row}-${col}`)) {
        const cells: Position[] = [];

        dfs(row, col, cells);

        if (cells.length > 0) {
          ships.push({ id: ships.length + 1, cells, hits: [] });
        }
      }
    }
  }

  return ships;
}
