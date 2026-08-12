import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import type { PermissionDefinition, RoleSummary } from "../types/auth";
import {
  createRole,
  deleteRole,
  fetchPermissionsCatalog,
  fetchRoles,
  updateRole,
} from "../lib/api";

interface RoleFormState {
  name: string;
  description: string;
  permissions: string[];
}

const EMPTY_FORM: RoleFormState = { name: "", description: "", permissions: [] };

export function RolesPage() {
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [permissions, setPermissions] = useState<PermissionDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleSummary | null>(null);
  const [form, setForm] = useState<RoleFormState>(EMPTY_FORM);

  const loadData = async () => {
    try {
      const [rolesData, permissionsData] = await Promise.all([
        fetchRoles(),
        fetchPermissionsCatalog(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, PermissionDefinition[]>();
    for (const permission of permissions) {
      const list = groups.get(permission.category) ?? [];
      list.push(permission);
      groups.set(permission.category, list);
    }
    return Array.from(groups.entries());
  }, [permissions]);

  const openCreateDialog = () => {
    setEditingRole(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (role: RoleSummary) => {
    setEditingRole(role);
    setForm({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setDialogOpen(true);
  };

  const togglePermission = (key: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Role name is required");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        permissions: form.permissions,
      };

      if (editingRole) {
        await updateRole(editingRole.id, payload);
        toast.success("Role updated");
      } else {
        await createRole(payload);
        toast.success("Role created");
      }

      setDialogOpen(false);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save role");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async (role: RoleSummary) => {
    if (!window.confirm(`Delete the "${role.name}" role? This cannot be undone.`)) {
      return;
    }

    setDeletingId(role.id);
    try {
      await deleteRole(role.id);
      toast.success("Role deleted");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete role");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <div className="text-[#697386]">Loading roles...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0a2540]">Roles</h1>
          <p className="mt-1 text-[#697386]">
            Create custom roles and control exactly what each one can do.
          </p>
        </div>
        <Button onClick={openCreateDialog} className="bg-[#635bff] hover:bg-[#5851ea]">
          New role
        </Button>
      </div>

      <section className="rounded-lg border border-[#e3e8ee] bg-white shadow-sm">
        <div className="divide-y divide-[#e3e8ee]">
          {roles.map((role) => (
            <div key={role.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[#1a1f36]">{role.name}</p>
                  {role.isSystem && (
                    <span className="rounded bg-[#f6f9fc] px-2 py-0.5 text-xs font-medium text-[#697386]">
                      System
                    </span>
                  )}
                </div>
                {role.description && (
                  <p className="mt-0.5 text-sm text-[#697386]">{role.description}</p>
                )}
                <p className="mt-1 text-xs text-[#8898aa]">
                  {role.permissions.length === 0
                    ? "No permissions"
                    : `${role.permissions.length} permission${role.permissions.length === 1 ? "" : "s"}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={role.isSystem}
                  onClick={() => openEditDialog(role)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={role.isSystem || deletingId === role.id}
                  onClick={() => onDelete(role)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit role" : "New role"}</DialogTitle>
            <DialogDescription>
              Choose a name and select the permissions this role should grant.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="role-name">Name</Label>
              <Input
                id="role-name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Support Agent"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              {groupedPermissions.map(([category, items]) => (
                <div key={category} className="rounded-md border border-[#e3e8ee] p-3">
                  <p className="mb-2 text-sm font-medium text-[#0a2540]">{category}</p>
                  <div className="space-y-2">
                    {items.map((permission) => (
                      <label
                        key={permission.key}
                        className="flex items-start gap-2 text-sm text-[#425466]"
                      >
                        <Checkbox
                          checked={form.permissions.includes(permission.key)}
                          onCheckedChange={() => togglePermission(permission.key)}
                          className="mt-0.5"
                        />
                        <span>
                          <span className="font-medium text-[#1a1f36]">{permission.label}</span>
                          <br />
                          <span className="text-xs text-[#8898aa]">{permission.description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSaving} className="bg-[#635bff] hover:bg-[#5851ea]">
                {isSaving ? "Saving..." : editingRole ? "Save changes" : "Create role"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
