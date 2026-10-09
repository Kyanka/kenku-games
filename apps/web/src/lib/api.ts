export const API_BASE: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const res = await fetch(
    `${API_BASE}/api/check-username?username=${encodeURIComponent(username)}`,
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.available === true;
}
