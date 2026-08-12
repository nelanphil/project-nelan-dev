import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import type { AuthUser, ManagedUser, RoleSummary } from "../types/auth";
import { fetchRoles, fetchUsers, registerUser, updateUser } from "../lib/api";

interface CreateUserFormData {
  email: string;
  password: string;
  roleId: string;
}

export function UsersPage() {
  const { user: currentUser } = useOutletContext<{ user: AuthUser | null }>();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    defaultValues: { email: "", password: "", roleId: "" },
  });

  const loadData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([fetchUsers(), fetchRoles()]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateUser = async (data: CreateUserFormData) => {
    setIsCreating(true);
    try {
      const created = await registerUser({
        email: data.email,
        password: data.password,
        roleId: data.roleId || undefined,
      });
      toast.success(`Created user ${created.email}`);
      reset({ email: "", password: "", roleId: "" });
      loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const onChangeRole = async (userId: string, roleId: string) => {
    setUpdatingId(userId);
    try {
      await updateUser(userId, { roleId });
      toast.success("Role updated");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const onToggleActive = async (targetUser: ManagedUser) => {
    setUpdatingId(targetUser.id);
    try {
      await updateUser(targetUser.id, { isActive: !targetUser.isActive });
      toast.success(targetUser.isActive ? "User deactivated" : "User activated");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <div className="text-[#697386]">Loading users...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0a2540]">Users</h1>
        <p className="mt-1 text-[#697386]">Create accounts and manage roles.</p>
      </div>

      <section className="mb-8 rounded-lg border border-[#e3e8ee] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0a2540]">Create user</h2>
        <p className="mt-1 mb-6 text-sm text-[#697386]">
          Only admins can create accounts. New users can sign in on the Client Portal.
        </p>

        <form onSubmit={handleSubmit(onCreateUser)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-password">Temporary password</Label>
              <Input
                id="create-password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="create-role">Role</Label>
            <select
              id="create-role"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              {...register("roleId")}
            >
              <option value="">Default (User)</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={isCreating} className="bg-[#635bff] hover:bg-[#5851ea]">
            {isCreating ? "Creating..." : "Create user"}
          </Button>
        </form>
      </section>

      <section className="rounded-lg border border-[#e3e8ee] bg-white shadow-sm">
        <div className="border-b border-[#e3e8ee] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0a2540]">All users</h2>
        </div>
        <div className="divide-y divide-[#e3e8ee]">
          {users.length === 0 && (
            <p className="px-6 py-6 text-sm text-[#697386]">No users yet.</p>
          )}
          {users.map((u) => {
            const isSelf = u.id === currentUser?.id;
            const isUpdating = updatingId === u.id;
            return (
              <div
                key={u.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div>
                  <p className="font-medium text-[#1a1f36]">{u.email}</p>
                  <p className="text-xs text-[#8898aa]">
                    {u.isActive ? "Active" : "Deactivated"} · Joined{" "}
                    {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="h-9 rounded-md border border-[#e3e8ee] bg-white px-2 text-sm disabled:opacity-50"
                    value={u.role?.id || ""}
                    disabled={isSelf || isUpdating}
                    onChange={(e) => onChangeRole(u.id, e.target.value)}
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isSelf || isUpdating}
                    onClick={() => onToggleActive(u)}
                  >
                    {u.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
