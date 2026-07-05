export type GameType = "battleship" | "dice";

export type RoomStatus = "waiting" | "active" | "finished";

export type Seat = 0 | 1;

export type Coordinate = {
  row: number;
  col: number;
};

export type BattleshipPlaceShipPayload = {
  type: "place-ship";
  shipId: string;
  cells: Coordinate[];
};

export type BattleshipFireShotPayload = {
  type: "fire-shot";
  target: Coordinate;
};

export type BattleshipMovePayload = BattleshipPlaceShipPayload | BattleshipFireShotPayload;

export type DiceRollPayload = {
  type: "roll";
  values: number[];
};

export type MovePayload = BattleshipMovePayload | DiceRollPayload;
