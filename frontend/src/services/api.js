const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const USER_COOKIE = "roxiler_user";
const COOKIE_MAX_AGE = 60 * 60 * 24;

function setUserCookie(user) {
  document.cookie = `roxiler_user=${encodeURIComponent(JSON.stringify(user))}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}
function getUserCookie() {
  const entry = document.cookie.split("; ").find(cookie => cookie.startsWith(`${USER_COOKIE}=`));
  return entry ? decodeURIComponent(entry.slice(USER_COOKIE.length + 1)) : null;
}
function deleteUserCookie() {
  document.cookie = `${USER_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) window.dispatchEvent(new Event("roxiler:logout"));
    throw new Error(data.error || data.message || "Request failed");
  }
  return data;
}
export function saveSession(session) { setUserCookie(session.user); }
export function currentUser() { try { const user = getUserCookie(); return user ? JSON.parse(user) : null; } catch { return null; } }
export function clearSession() { deleteUserCookie(); }
