export type Ship = { size: number; count: number };
export type UserErrors = "undefined" | "ship playcment" | "ship in dock";
export type Position = { row: number; col: number };
export type ShipState = { id: number; cells: Position[]; hits: Position[] };
