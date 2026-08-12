import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Menu, Settings2, Shield, Users, X } from "lucide-react";
import { Button } from "../ui/button";
import type { AuthUser } from "../../types/auth";
import { fetchCurrentUser, logout } from "../../lib/api";

interface NavItem {
  label: string;
  path: string;
  end: boolean;
  icon: typeof LayoutDashboard;
  permission?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", end: true, icon: LayoutDashboard },
  { label: "Users", path: "/dashboard/users", end: false, icon: Users, permission: "users.view" },
  { label: "Roles", path: "/dashboard/roles", end: false, icon: Shield, permission: "roles.manage" },
  {
    label: "Control Panel",
    path: "/dashboard/control-panel",
    end: false,
    icon: Settings2,
    permission: "settings.manage",
  },
];

export function AdminDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fc]">
        <div className="text-[#697386]">Loading...</div>
      </div>
    );
  }

  const permissions = user?.permissions ?? [];
  const hasAdminAccess = permissions.length > 0;
  const visibleNavItems = navItems.filter(
    (item) => !item.permission || permissions.includes(item.permission)
  );

  if (user && !hasAdminAccess) {
    if (location.pathname !== "/dashboard") {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <div className="min-h-screen bg-[#f6f9fc] px-4 py-12 text-[#30313d]">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0a2540]">Dashboard</h1>
              <p className="mt-1 text-[#697386]">
                Welcome{user.email ? `, ${user.email}` : ""}
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
          <div className="rounded-lg border border-[#e3e8ee] bg-white p-6 shadow-sm">
            <p className="text-[#697386]">
              Your account is signed in. Contact an administrator if you need additional access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-[#e3e8ee] bg-white">
      <div className="border-b border-[#e3e8ee] px-5 py-5">
        <Link to="/" className="text-lg font-semibold tracking-tight text-[#0a2540]">
          nelan.dev
        </Link>
        <p className="mt-1 text-xs text-[#8898aa]">Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#f6f5ff] text-[#635bff]"
                    : "text-[#425466] hover:bg-[#f6f9fc] hover:text-[#0a2540]"
                }`
              }
            >
              <Icon className="size-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-[#e3e8ee] p-4">
        <p className="truncate text-xs text-[#8898aa]">{user?.email}</p>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="mt-3 w-full"
          size="sm"
        >
          Sign Out
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#f6f9fc] text-[#30313d]">
      <div className="hidden md:block">{Sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full shadow-xl">{Sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[#e3e8ee] bg-white px-4 py-3 md:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
          <span className="font-semibold text-[#0a2540]">nelan.dev</span>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
