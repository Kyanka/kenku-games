import { Route, Routes } from "react-router-dom";
import { GameSelect } from "./routes/GameSelect.js";
import { BattleshipPlaceholder } from "./routes/BattleshipPlaceholder.js";

import { DicePlaceholder } from "./routes/DicePlaceholder.js";
import { Login } from "./routes/(beta)/Login.js";
import { Signup } from "./routes/(beta)/Signup.js";
import { Profile } from "./routes/(beta)/Profile.js";
import { AuthGuard } from "./components/AuthGuard.js";
import { LoginPage } from "./routes/LoginPage.js";
import { SignupPage } from "./routes/SignupPage.js";
import { ProfilePage } from "./routes/ProfilePage.js";
import { MainPage } from "./routes/MainPage.js";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <MainPage />
          </AuthGuard>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <ProfilePage />
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
