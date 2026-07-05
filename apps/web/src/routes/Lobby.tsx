import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useZero } from "@rocicorp/zero/react";
import { mutators } from "@kenku/zero-schema";
import { setLocalPlayerId } from "../lib/local-player.js";

export function Lobby() {
  const zero = useZero();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");

  async function handleCreateRoom() {
    const roomId = crypto.randomUUID();
    const playerId = crypto.randomUUID();
    await zero.mutate(mutators.room.create({ id: roomId, gameType: "battleship" }));
    await zero.mutate(mutators.room.join({ id: playerId, roomId, name: name || "Player 1" }));
    setLocalPlayerId(roomId, playerId);
    navigate(`/room/${roomId}`);
  }

  async function handleJoinRoom() {
    if (!joinRoomId) return;
    const playerId = crypto.randomUUID();
    await zero.mutate(
      mutators.room.join({ id: playerId, roomId: joinRoomId, name: name || "Player 2" }),
    );
    setLocalPlayerId(joinRoomId, playerId);
    navigate(`/room/${joinRoomId}`);
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Kenku Games — Battleship</h1>
      <input
        className="rounded border px-3 py-2"
        placeholder="Your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={handleCreateRoom}>
        Create room
      </button>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Room ID"
          value={joinRoomId}
          onChange={(event) => setJoinRoomId(event.target.value)}
        />
        <button className="rounded bg-slate-600 px-4 py-2 text-white" onClick={handleJoinRoom}>
          Join
        </button>
      </div>
    </main>
  );
}
