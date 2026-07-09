// Thin API layer for authentication. Keeps fetch/HTTP details out of
// components and the AuthContext, matching how the existing chat
// feature talks to the backend (see App.tsx's sendMessage).

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

const API_BASE = import.meta.env.VITE_API_URL || "";

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data && (data as { error?: string }).error) ||
      "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
    throw new Error(message);
  }

  return data as T;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AuthResponse>(res);
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AuthResponse>(res);
}

export async function fetchCurrentUser(token: string): Promise<{ user: AuthUser }> {
  const res = await fetch(`${API_BASE}api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return parseJsonResponse<{ user: AuthUser }>(res);
}
