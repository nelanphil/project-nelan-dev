import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchCurrentUser, clearAuthToken, getAuthToken } from "../lib/api";
import type { AuthUser } from "../types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        clearAuthToken();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/client-portal" replace />;
  }

  return <>{children}</>;
}
