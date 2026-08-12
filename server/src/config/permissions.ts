export type PermissionCategory = 'Users' | 'Roles' | 'Settings';

export interface PermissionDefinition {
  key: string;
  label: string;
  description: string;
  category: PermissionCategory;
}

/**
 * Canonical permission catalog. This is the single source of truth for what
 * actions exist in the system — it's synced into the `Permission` collection
 * on every server boot (see `seedRbac`) so the Roles UI can read it from the
 * database, but the set of possible permissions is version-controlled here.
 */
export const PERMISSIONS: PermissionDefinition[] = [
  {
    key: 'users.view',
    label: 'View users',
    description: 'See the list of user accounts.',
    category: 'Users',
  },
  {
    key: 'users.manage',
    label: 'Manage users',
    description: 'Create users, change their role, and activate/deactivate accounts.',
    category: 'Users',
  },
  {
    key: 'roles.manage',
    label: 'Manage roles',
    description: 'Create, edit, and delete roles and assign their permissions.',
    category: 'Roles',
  },
  {
    key: 'settings.manage',
    label: 'Manage settings',
    description: 'View and edit email/SMTP settings and send test emails.',
    category: 'Settings',
  },
];

export const PERMISSION_KEYS = PERMISSIONS.map((permission) => permission.key);

export interface SystemRoleDefinition {
  name: string;
  slug: 'admin' | 'user';
  description: string;
  permissions: string[];
}

/**
 * Seeded, locked roles. `admin` always gets the full current catalog (kept in
 * sync on every boot); `user` starts with no admin-area permissions.
 */
export const SYSTEM_ROLES: SystemRoleDefinition[] = [
  {
    name: 'Admin',
    slug: 'admin',
    description: 'Full access to all admin features.',
    permissions: PERMISSION_KEYS,
  },
  {
    name: 'User',
    slug: 'user',
    description: 'Standard authenticated user with no admin access.',
    permissions: [],
  },
];
