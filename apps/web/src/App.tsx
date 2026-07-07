import { Route, Routes } from "react-router-dom";
import { GameSelect } from "./routes/GameSelect.js";
import { BattleshipPlaceholder } from "./routes/BattleshipPlaceholder.js";
import { DicePlaceholder } from "./routes/DicePlaceholder.js";
import { BattleshipPage } from "./games/battleship/battleshipPage.js";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<GameSelect />} />
      <Route path="/battleship" element={<BattleshipPage />} />
      <Route path="/dice" element={<DicePlaceholder />} />
    </Routes>
  );
}
