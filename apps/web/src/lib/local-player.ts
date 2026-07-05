const KEY_PREFIX = "kenku:player-id:";

export function getLocalPlayerId(roomId: string): string | null {
  return localStorage.getItem(KEY_PREFIX + roomId);
}

export function setLocalPlayerId(roomId: string, playerId: string): void {
  localStorage.setItem(KEY_PREFIX + roomId, playerId);
}
