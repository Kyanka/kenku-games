import { useState } from "react";

type Ship = [id: number, cells: [], health: number];

export function Battleship() {
  const [isDefenseBoardDisabled, setIsDefenseBoardDisabled] = useState(true);

  const [attackSheet, setAttackSheet] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false)),
  );
  const [defenseSheet, setDefenseSheet] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false)),
  );
  // attackSheet[row][col]
  //   console.log(attackSheet);

  function getAttackCellColor(marked: boolean, rowIndex: number, colIndex: number) {
    if (!marked) return "bg-white";

    return defenseSheet[rowIndex]?.[colIndex] ? "bg-amber-300" : "bg-blue-500";
  }

  function getDefenseCellColor(marked: boolean, rowIndex: number, colIndex: number) {
    if (marked && attackSheet[rowIndex]?.[colIndex]) return "bg-red-300";
    if (marked) return "bg-green-500";

    if (!marked && attackSheet[rowIndex]?.[colIndex]) return "bg-blue-500";
    if (!marked) return "bg-white";
  }

  return (
    <>
      {/* <div className="flex flex-row gap-5 justify-center"> */}
      {/* Deffence */}
      {/* <p>Deffence</p> */}
      <div className="flex flex-row shadow-[8px_8px_20px_#3b86ba]">
        {defenseSheet.map((row, rowIndex) => (
          <div className="flex flex-col">
            {row.map((marked, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                disabled={!isDefenseBoardDisabled || marked}
                className={`w-8 h-8 border border-gray-500 ${getDefenseCellColor(marked, rowIndex, colIndex)}`}
                onClick={() => {
                  setDefenseSheet((prev) =>
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

      {/* Attack */}
      {/* <p>Attack</p> */}
      <div className="flex flex-row shadow-[8px_8px_20px_#3b86ba]">
        {attackSheet.map((row, rowIndex) => (
          <div className="flex flex-col">
            {row.map((marked, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                disabled={isDefenseBoardDisabled || marked}
                className={`w-8 h-8 border border-gray-500 ${getAttackCellColor(marked, rowIndex, colIndex)}`}
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
    </>
  );
}
