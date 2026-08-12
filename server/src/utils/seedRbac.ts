import { PermissionModel } from '../models/Permission';
import { RoleModel } from '../models/Role';
import { PERMISSIONS, PERMISSION_KEYS, SYSTEM_ROLES } from '../config/permissions';

/**
 * Idempotently syncs the permission catalog and seeds the locked system
 * roles (`admin`, `user`). Safe to run on every server boot: the Admin
 * role's permission set is re-synced to the full current catalog each time,
 * so newly added permissions automatically flow to Admin without a manual
 * migration.
 */
export async function seedRbac() {
  await Promise.all(
    PERMISSIONS.map((permission) =>
      PermissionModel.findOneAndUpdate(
        { key: permission.key },
        {
          $set: {
            label: permission.label,
            description: permission.description,
            category: permission.category,
          },
        },
        { upsert: true, new: true }
      )
    )
  );

  for (const roleDef of SYSTEM_ROLES) {
    const permissions = roleDef.slug === 'admin' ? PERMISSION_KEYS : roleDef.permissions;
    const existing = await RoleModel.findOne({ slug: roleDef.slug });

    if (!existing) {
      await RoleModel.create({
        name: roleDef.name,
        slug: roleDef.slug,
        description: roleDef.description,
        permissions,
        isSystem: true,
      });
    } else if (roleDef.slug === 'admin') {
      existing.name = roleDef.name;
      existing.description = roleDef.description;
      existing.permissions = permissions;
      existing.isSystem = true;
      await existing.save();
    } else if (!existing.isSystem) {
      existing.isSystem = true;
      await existing.save();
    }
  }

  console.log('✅ RBAC catalog seeded (permissions + system roles)');
}

export async function getSystemRoleId(slug: 'admin' | 'user') {
  const role = await RoleModel.findOne({ slug });

  if (!role) {
    throw new Error(`System role "${slug}" not found — did seedRbac() run?`);
  }

  return role._id;
}
