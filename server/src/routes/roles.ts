import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateRequest, requireAnyPermission, requirePermission } from '../middleware/auth';
import { RoleModel } from '../models/Role';
import { UserModel } from '../models/User';
import { PERMISSION_KEYS } from '../config/permissions';

const router = Router();

router.use(authenticateRequest);

const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().default(''),
  permissions: z.array(z.string()).optional().default([]),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

function serializeRole(role: InstanceType<typeof RoleModel>) {
  return {
    id: role._id.toString(),
    name: role.name,
    slug: role.slug,
    description: role.description,
    permissions: role.permissions,
    isSystem: role.isSystem,
  };
}

router.get('/', requireAnyPermission(['users.manage', 'roles.manage']), async (_req: Request, res: Response) => {
  try {
    const roles = await RoleModel.find().sort({ isSystem: -1, name: 1 });
    return res.json({ success: true, data: roles.map(serializeRole) });
  } catch (error) {
    console.error('List roles error:', error);
    return res.status(500).json({ success: false, error: 'Failed to load roles' });
  }
});

router.post('/', requirePermission('roles.manage'), async (req: Request, res: Response) => {
  try {
    const result = roleSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: result.error.flatten(),
      });
    }

    const slug = slugify(result.data.name);

    if (!slug) {
      return res.status(400).json({ success: false, error: 'Role name must contain letters or numbers' });
    }

    const existing = await RoleModel.findOne({ slug });
    if (existing) {
      return res.status(409).json({ success: false, error: 'A role with this name already exists' });
    }

    const permissions = result.data.permissions.filter((key) => PERMISSION_KEYS.includes(key));

    const role = await RoleModel.create({
      name: result.data.name,
      slug,
      description: result.data.description,
      permissions,
      isSystem: false,
    });

    return res.status(201).json({ success: true, data: serializeRole(role) });
  } catch (error) {
    console.error('Create role error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create role' });
  }
});

router.put('/:id', requirePermission('roles.manage'), async (req: Request, res: Response) => {
  try {
    const role = await RoleModel.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }

    if (role.isSystem) {
      return res.status(400).json({ success: false, error: 'System roles cannot be edited' });
    }

    const result = roleSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: result.error.flatten(),
      });
    }

    role.name = result.data.name;
    role.description = result.data.description;
    role.permissions = result.data.permissions.filter((key) => PERMISSION_KEYS.includes(key));
    await role.save();

    return res.json({ success: true, data: serializeRole(role) });
  } catch (error) {
    console.error('Update role error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update role' });
  }
});

router.delete('/:id', requirePermission('roles.manage'), async (req: Request, res: Response) => {
  try {
    const role = await RoleModel.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }

    if (role.isSystem) {
      return res.status(400).json({ success: false, error: 'System roles cannot be deleted' });
    }

    const usersWithRole = await UserModel.countDocuments({ roleId: role._id });
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete a role that is assigned to one or more users',
      });
    }

    await role.deleteOne();

    return res.json({ success: true, message: 'Role deleted' });
  } catch (error) {
    console.error('Delete role error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete role' });
  }
});

export { router as rolesRoutes };
