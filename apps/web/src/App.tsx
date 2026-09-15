import { Route, Routes } from "react-router-dom";
import { GameSelect } from "./routes/GameSelect.js";
import { BattleshipPlaceholder } from "./routes/BattleshipPlaceholder.js";

import { DicePlaceholder } from "./routes/DicePlaceholder.js";
import { Login } from "./routes/(beta)/Login.js";
import { Signup } from "./routes/(beta)/Signup.js";
import { AuthGuard } from "./components/AuthGuard.js";
import { LoginPage } from "./routes/LoginPage.js";
import { SignupPage } from "./routes/SignupPage.js";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <GameSelect />
          </AuthGuard>
        }
      />
      <Route
        path="/battleship"
        element={
          <AuthGuard>
            <BattleshipPlaceholder />
          </AuthGuard>
        }
      />
      <Route
        path="/dice"
        element={
          <AuthGuard>
            <DicePlaceholder />
          </AuthGuard>
        }
      />
    </Routes>
  );
}
