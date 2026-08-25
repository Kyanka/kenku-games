import { useEffect, useState } from "react";
import type { Position, Ship, ShipState, UserErrors } from "../data/types";
import { DefenceSheet } from "./defenceSheet";
import { AttackSheet } from "./attackSheet";

export function Battleship() {
  const [isDefenseBoardDisabled, setIsDefenseBoardDisabled] = useState(false);

  const [currentShip, setCurrentShip] = useState<number>(0);
  const [isHorisontal, setIsHorisontal] = useState(true);
  const [userError, setUserError] = useState<UserErrors>("undefined");
  const [opponentShipCounter, setOpponentShipCounter] = useState<number>(10);
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

  function findAllShips() {
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

  useEffect(() => {
    if (opponentShipCounter === 0) {
      console.log("WIN");
    }
  }, [opponentShipCounter]);

  return (
    <>
      <div className="flex flex-row gap-5">
        {/* <div className="flex flex-row gap-5 justify-center"> */}
        <div className="flex flex-col shadow-[8px_8px_20px_#3b86ba]">
          <DefenceSheet
            defenseSheet={defenseSheet}
            attackSheet={attackSheet}
            isDefenseBoardDisabled={isDefenseBoardDisabled}
            isHorisontal={isHorisontal}
            currentShip={currentShip}
            setUserError={setUserError}
            setShipsPool={setShipsPool}
            setDefenseSheet={setDefenseSheet}
            setCurrentShip={setCurrentShip}
          />
        </div>

        {/* Attack */}
        {/* <p>Attack</p> */}
        <div className="flex flex-col shadow-[8px_8px_20px_#3b86ba]">
          <AttackSheet
            attackSheet={attackSheet}
            defenseSheet={defenseSheet}
            isDefenseBoardDisabled={isDefenseBoardDisabled}
            shipsState={shipsState}
            setAttackSheet={setAttackSheet}
            setOpponentShipCounter={setOpponentShipCounter}
          />
        </div>

        <button
          className="border pointer bg-amber-300"
          onClick={() => {
            if (shipsPool.some((ship) => ship.count !== 0)) {
              setUserError("ship in dock");
              return;
            }
            setShipsState(findAllShips);
            setIsDefenseBoardDisabled(true);
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
