import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import type { AuthUser } from "../types/auth";
import { fetchCurrentUser, logout } from "../lib/api";

export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
        navigate("/client-portal", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/client-portal");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome{user?.email ? `, ${user.email}` : ""}
              {user?.role === "admin" && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  Admin
                </span>
              )}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Dashboard content will be added here.
          </p>
        </div>
      </div>
    </div>
  );
}
