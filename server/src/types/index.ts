export interface AuthenticatedRole {
  id: string;
  name: string;
  slug: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  isActive: boolean;
  role: AuthenticatedRole;
  permissions: string[];
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Example types for services
export interface Service {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
