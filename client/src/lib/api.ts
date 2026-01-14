import type { AuthUser } from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const AUTH_TOKEN_KEY = "nelan_dev_auth_token";

interface ApiRequestOptions {
  auth?: boolean;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: ApiRequestOptions = {}
): Promise<T> {
  const { auth = true } = options;
  const headers = new Headers(init.headers || {});

  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  let payload: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const errorMessage =
      payload?.error || payload?.message || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }

  return payload as T;
}

export async function login(email: string, password: string) {
  const data = await apiRequest<{ success: boolean; data: LoginResponse }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    { auth: false }
  );

  setAuthToken(data.data.token);
  return data.data;
}

export async function logout() {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } finally {
    clearAuthToken();
  }
}

export async function fetchCurrentUser() {
  const data = await apiRequest<{ success: boolean; data: AuthUser }>("/auth/me");
  return data.data;
}

export async function submitContactForm(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return apiRequest<{ success: boolean; message: string }>(
    "/contact",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { auth: false }
  );
}






