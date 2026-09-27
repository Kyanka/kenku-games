import { useNavigate } from "react-router-dom";
import { signOut, useSession } from "../lib/auth-client.js";

const GAMES = [
  { id: "battleship", title: "Battleship", path: "/battleship" },
  { id: "dice", title: "Dice", path: "/dice" },
] as const;

export function GameSelect() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  async function handleLogout() {
    localStorage.removeItem("bearer_token");
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kenku Games</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
      {session?.user && (
        <p className="text-sm text-slate-500">{session.user.email}</p>
      )}
      <p className="text-slate-600">Choose a game</p>
      <div className="flex flex-col gap-3">
        {GAMES.map((game) => (
          <button
            key={game.id}
            className="rounded border border-slate-300 px-4 py-3 text-left hover:bg-slate-50"
            onClick={() => navigate(game.path)}
          >
            {game.title}
          </button>
        ))}
      </div>
    </main>
  );
}
