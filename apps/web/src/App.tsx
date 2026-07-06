import { Route, Routes } from "react-router-dom";
import { GameSelect } from "./routes/GameSelect.js";
import { BattleshipPlaceholder } from "./routes/BattleshipPlaceholder.js";
import { DicePlaceholder } from "./routes/DicePlaceholder.js";
import { Battleship } from "./games/battleship/battleship.js";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<GameSelect />} />
      <Route path="/battleship" element={<Battleship />} />
      <Route path="/dice" element={<DicePlaceholder />} />
    </Routes>
  );
}
