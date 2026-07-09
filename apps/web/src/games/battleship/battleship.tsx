import { useState } from "react";

type Ship = [id: number, cells: [], health: number];
type UserErrors = "undefined" | "ship playcment" | "ship in dock";

export function Battleship() {
  const [isDefenseBoardDisabled, setIsDefenseBoardDisabled] = useState(true);

  const [currentShip, setCurrentShip] = useState<number>(0);
  const [isHorisontal, setIsHorisontal] = useState(true);
  const [userError, setUserError] = useState<UserErrors>("undefined");
  const ships = [
    { size: 4, count: 1 },
    { size: 3, count: 2 },
    { size: 2, count: 3 },
    { size: 1, count: 4 },
  ];

  const [attackSheet, setAttackSheet] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false)),
  );
  const [defenseSheet, setDefenseSheet] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false)),
  );
  // attackSheet[row][col]
  //   console.log(attackSheet);

  function getAttackCellColor(isMarked: boolean, rowIndex: number, colIndex: number) {
    if (!isMarked) return "bg-white";

    return defenseSheet[rowIndex]?.[colIndex] ? "bg-amber-300" : "bg-blue-500";
  }

  function getDefenseCellColor(isMarked: boolean, rowIndex: number, colIndex: number) {
    if (isMarked && attackSheet[rowIndex]?.[colIndex]) return "bg-red-300";
    if (isMarked) return "bg-green-500";

    if (!isMarked && attackSheet[rowIndex]?.[colIndex]) return "bg-blue-500";
    if (!isMarked) return "bg-white";
  }

  function canPlaceShip(rowIndex: number, colIndex: number) {
    const rowStart = Math.max(0, rowIndex - 1);
    const rowEnd = isHorisontal ? Math.min(9, rowIndex + 1) : Math.min(9, rowIndex + currentShip);
    // rowEnd = false ? min(9, 7+2) : (9, 7+1)

    const colStart = Math.max(0, colIndex - 1);
    const colEnd = isHorisontal ? Math.min(9, colIndex + currentShip) : Math.min(9, colIndex + 1);
    // colEnd = false ? min(9, 2 + 1) : man(9, 2 + 2)

    console.log({
      rowStart,
      rowEnd,
      colStart,
      colEnd,
    });

    for (let row = rowStart; row <= rowEnd; row++) {
      for (let col = colStart; col <= colEnd; col++) {
        if (defenseSheet[row]?.[col]) {
          console.log("Знайшов корабель:", row, col);
          return true;
        }
      }
    }
  }

  function positionShip(rowIndex: number, colIndex: number) {
    const newBoard = defenseSheet.map((row) => [...row]);

    const startRow = isHorisontal ? Math.min(rowIndex, 10 - currentShip) : rowIndex;
    const startCol = isHorisontal ? colIndex : Math.min(colIndex, 10 - currentShip);

    console.log({
      startRow,
      startCol,
      currentShip,
      isHorisontal,
    });

    if (canPlaceShip(startRow, startCol)) {
      setUserError("ship playcment");
      return;
    }

    for (let i = 0; i < currentShip; i++) {
      const r = isHorisontal ? startRow : startRow + i;
      const c = isHorisontal ? startCol + i : startCol;

      newBoard[r]![c] = true;
    }

    setDefenseSheet(newBoard);
    setCurrentShip(0);
    setUserError("undefined");
    console.log(defenseSheet);
  }

  return (
    <>
      <div className="flex flex-row gap-5">
        {/* <div className="flex flex-row gap-5 justify-center"> */}
        {/* Deffence */}
        {/* <p>Deffence</p> */}
        <div className="flex flex-col shadow-[8px_8px_20px_#3b86ba]">
          {defenseSheet.map((row, rowIndex) => (
            <div className="flex">
              {row.map((isMarked, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  disabled={!isDefenseBoardDisabled || isMarked}
                  className={`w-8 h-8 border border-gray-500 ${getDefenseCellColor(isMarked, rowIndex, colIndex)}`}
                  onClick={() => {
                    positionShip(rowIndex, colIndex);
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Attack */}
        {/* <p>Attack</p> */}
        <div className="flex flex-col shadow-[8px_8px_20px_#3b86ba]">
          {attackSheet.map((row, rowIndex) => (
            <div className="flex">
              {row.map((isMarked, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  disabled={isDefenseBoardDisabled || isMarked}
                  className={`w-8 h-8 border border-gray-500 ${getAttackCellColor(isMarked, rowIndex, colIndex)}`}
                  onClick={() => {
                    setAttackSheet((prev) =>
                      prev.map((row, r) =>
                        row.map((cell, c) => (r === rowIndex && c === colIndex ? !cell : cell)),
                      ),
                    );
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        <button
          className="border pointer bg-amber-300"
          onClick={() => setIsDefenseBoardDisabled(false)}
        >
          STOP
        </button>
        {/* </div> */}
      </div>
      {/* Ship Dock */}
      <div className="flex flex-col">
        <p>Ship Dock</p>
        <p className={`text-red-600 ${userError == "ship playcment" ? "block" : "hidden"}`}>
          You can't place ships in adjacent cells!
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ships.map(({ size, count }) => (
            <div key={size}>
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  className="border border-gray-500 m-1"
                  style={{
                    width: isHorisontal ? `${size * 32}px` : "32px",
                    height: isHorisontal ? "32px" : `${size * 32}px`,
                    backgroundColor: currentShip === size ? "#9333ea" : "#3b82f6",
                  }}
                  onClick={() => (currentShip == 0 ? setCurrentShip(size) : setCurrentShip(0))}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setIsHorisontal(!isHorisontal);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
