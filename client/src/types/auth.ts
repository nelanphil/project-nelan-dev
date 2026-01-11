export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}






