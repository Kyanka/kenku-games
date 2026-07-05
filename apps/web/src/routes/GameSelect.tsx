import { useNavigate } from "react-router-dom";

const GAMES = [
  { id: "battleship", title: "Battleship", path: "/battleship" },
  { id: "dice", title: "Dice", path: "/dice" },
] as const;

export function GameSelect() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Kenku Games</h1>
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
