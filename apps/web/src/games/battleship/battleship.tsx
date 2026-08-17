import { useState } from "react";
import { cancelShipPlacment, findAllShips, positionShip } from "./shipsPlacment";
import type { Ship, ShipState, UserErrors } from "./data/types";

// type Ship = { size: number; count: number };
// type UserErrors = "undefined" | "ship playcment" | "ship in dock";

export function Battleship() {
  const [isDefenseBoardDisabled, setIsDefenseBoardDisabled] = useState(false);

  const [currentShip, setCurrentShip] = useState<number>(0);
  const [isHorisontal, setIsHorisontal] = useState(true);
  const [userError, setUserError] = useState<UserErrors>("undefined");
  const [shipsCounter, setShipsCounter] = useState<number>(10);
  const [shipsPool, setShipsPool] = useState<Ship[]>([
    { size: 4, count: 1 },
    { size: 3, count: 2 },
    { size: 2, count: 3 },
    { size: 1, count: 4 },
  ]);
  const [shipsState, setShipsState] = useState<ShipState[]>([]);

  const [attackSheet, setAttackSheet] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false)),
  );
  const [defenseSheet, setDefenseSheet] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false)),
  );

  const errorMessages: Record<UserErrors, string> = {
    undefined: "",
    "ship playcment": "You can't place ships in adjacent cells!",
    "ship in dock": "You have to place all ships!",
  };

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
                  disabled={isDefenseBoardDisabled || isMarked}
                  className={`w-8 h-8 border border-gray-500 ${getDefenseCellColor(isMarked, rowIndex, colIndex)}`}
                  onClick={() => {
                    positionShip(
                      rowIndex,
                      colIndex,
                      isHorisontal,
                      defenseSheet,
                      currentShip,
                      setUserError,
                      setShipsPool,
                      setDefenseSheet,
                      setCurrentShip,
                    );
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();

                    if (isDefenseBoardDisabled) return;

                    cancelShipPlacment(
                      rowIndex,
                      colIndex,
                      defenseSheet,
                      setShipsPool,
                      setDefenseSheet,
                    );
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
                  disabled={!isDefenseBoardDisabled || isMarked}
                  className={`w-8 h-8 border border-gray-500 ${getAttackCellColor(isMarked, rowIndex, colIndex)}`}
                  onClick={() => {
                    setAttackSheet((prev) =>
                      prev.map((row, r) =>
                        row.map((cell, c) => (r === rowIndex && c === colIndex ? !cell : cell)),
                      ),
                    );
                    if (defenseSheet[rowIndex]?.[colIndex]) {
                      shipsState.find((ship) => {
                        if (
                          ship.cells.some((cell) => cell.row == rowIndex && cell.col == colIndex)
                        ) {
                          ship.hits.push({ row: rowIndex, col: colIndex });
                        }

                        if (ship.cells.length == ship.hits.length) {
                          setShipsCounter(shipsCounter - 1);
                        }
                      });
                    }
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        <button
          className="border pointer bg-amber-300"
          onClick={() => {
            if (shipsPool.some((ship) => ship.count !== 0)) {
              setUserError("ship in dock");
              return;
            }
            setShipsState(findAllShips(defenseSheet));
            setIsDefenseBoardDisabled(true);
            console.log(shipsState);
          }}
        >
          START
        </button>
        {/* </div> */}
      </div>
      {/* Ship Dock */}
      <div className="flex flex-col">
        <p>Ship Dock</p>
        <p className={`text-red-600 ${userError == "undefined" ? "hidden" : "block"}`}>
          {errorMessages[userError]}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {shipsPool.map(({ size, count }) => (
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
