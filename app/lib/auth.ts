const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

// ─── Token Management ───────────────────────────────────────

const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ─── Auth Actions ────────────────────────────────────────────

/** Redireciona para o backend Google OAuth */
export function redirectToGoogleLogin(): void {
  window.location.href = `${BACKEND_URL}/auth/google/login`;
}

/** Busca os dados do usuário autenticado */
export async function fetchCurrentUser(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // Token inválido ou expirado
      if (res.status === 401) {
        removeToken();
      }
      return null;
    }

    const data = await res.json();
    return data as User;
  } catch {
    return null;
  }
}

/** Logout: remove token e redireciona para login */
export function logout(): void {
  removeToken();
  window.location.href = "/";
}

/** Fetch autenticado genérico */
export async function authFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}
