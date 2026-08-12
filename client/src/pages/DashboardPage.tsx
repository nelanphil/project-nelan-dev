import { useOutletContext } from "react-router-dom";
import type { AuthUser } from "../types/auth";

export function DashboardPage() {
  const { user } = useOutletContext<{ user: AuthUser | null }>();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0a2540]">Dashboard</h1>
        <p className="mt-1 text-[#697386]">
          Welcome{user?.email ? `, ${user.email}` : ""}
          {user?.role && (
            <span className="ml-2 rounded bg-[#f6f5ff] px-2 py-0.5 text-xs font-medium text-[#635bff]">
              {user.role.name}
            </span>
          )}
        </p>
      </div>

      <section className="rounded-lg border border-[#e3e8ee] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0a2540]">Overview</h2>
        <p className="mt-2 text-[#697386]">
          Use the navigation on the left to manage users, roles and permissions, and site
          settings.
        </p>
      </section>
    </div>
  );
}
