export interface AuthRole {
  id: string;
  name: string;
  slug: string;
}

export interface AuthUser {
  id: string;
  email: string;
  isActive: boolean;
  role: AuthRole;
  permissions: string[];
}

export interface PermissionDefinition {
  key: string;
  label: string;
  description: string;
  category: string;
}

export interface RoleSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface ManagedUser {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  role: AuthRole | null;
}
