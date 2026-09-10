import { Route, Routes } from "react-router-dom";
import { GameSelect } from "./routes/GameSelect.js";
import { BattleshipPlaceholder } from "./routes/BattleshipPlaceholder.js";
import { DicePlaceholder } from "./routes/DicePlaceholder.js"; 
import { LoginPage } from "./routes/LoginPage.js";


export function App() {
  return (
    <Routes>
      <Route path="/" element={<GameSelect />} />
      <Route path="/battleship" element={<BattleshipPlaceholder />} />
      <Route path="/dice" element={<DicePlaceholder />} />
      <Route path= "/login" element={<LoginPage />} />


    </Routes>
  );
}
