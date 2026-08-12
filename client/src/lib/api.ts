import type { AuthUser, ManagedUser, PermissionDefinition, RoleSummary } from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const AUTH_TOKEN_KEY = "nelan_dev_auth_token";

interface ApiRequestOptions {
  auth?: boolean;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface EmailSettings {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  fromAddress: string;
  configured: boolean;
  hasPassword: boolean;
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

  let payload: any = null;
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

export async function registerUser(payload: {
  email: string;
  password: string;
  roleId?: string;
}) {
  const data = await apiRequest<{
    success: boolean;
    data: ManagedUser;
  }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function fetchRoles() {
  const data = await apiRequest<{ success: boolean; data: RoleSummary[] }>("/roles");
  return data.data;
}

export async function createRole(payload: {
  name: string;
  description?: string;
  permissions: string[];
}) {
  const data = await apiRequest<{ success: boolean; data: RoleSummary }>("/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function updateRole(
  id: string,
  payload: { name: string; description?: string; permissions: string[] }
) {
  const data = await apiRequest<{ success: boolean; data: RoleSummary }>(`/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function deleteRole(id: string) {
  return apiRequest<{ success: boolean; message: string }>(`/roles/${id}`, {
    method: "DELETE",
  });
}

export async function fetchPermissionsCatalog() {
  const data = await apiRequest<{ success: boolean; data: PermissionDefinition[] }>(
    "/permissions"
  );
  return data.data;
}

export async function fetchUsers() {
  const data = await apiRequest<{ success: boolean; data: ManagedUser[] }>("/users");
  return data.data;
}

export async function updateUser(
  id: string,
  payload: { roleId?: string; isActive?: boolean }
) {
  const data = await apiRequest<{ success: boolean; data: ManagedUser }>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function forgotPassword(email: string) {
  return apiRequest<{ success: boolean; message: string }>(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
    { auth: false }
  );
}

export async function verifyResetToken(email: string, token: string) {
  return apiRequest<{ success: boolean; message: string }>(
    "/auth/verify-reset-token",
    {
      method: "POST",
      body: JSON.stringify({ email, token }),
    },
    { auth: false }
  );
}

export async function resetPassword(email: string, token: string, password: string) {
  return apiRequest<{ success: boolean; message: string }>(
    "/auth/reset-password",
    {
      method: "POST",
      body: JSON.stringify({ email, token, password }),
    },
    { auth: false }
  );
}

export async function fetchEmailSettings() {
  const data = await apiRequest<{ success: boolean; data: EmailSettings }>(
    "/settings/email"
  );
  return data.data;
}

export async function saveEmailSettings(payload: {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  fromAddress: string;
  password?: string;
}) {
  const data = await apiRequest<{
    success: boolean;
    data: EmailSettings;
    message?: string;
  }>("/settings/email", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.data;
}

export async function sendTestEmailSettings() {
  return apiRequest<{ success: boolean; message: string }>(
    "/settings/email/test",
    { method: "POST" }
  );
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
