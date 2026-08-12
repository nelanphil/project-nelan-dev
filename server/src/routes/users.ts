import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateRequest, requirePermission } from '../middleware/auth';
import { UserModel } from '../models/User';
import { RoleModel } from '../models/Role';

const router = Router();

router.use(authenticateRequest);

function serializeRoleRef(role: InstanceType<typeof RoleModel> | null) {
  if (!role) return null;
  return { id: role._id.toString(), name: role.name, slug: role.slug };
}

router.get('/', requirePermission('users.view'), async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    const roleIds = [...new Set(users.map((user) => user.roleId.toString()))];
    const roles = await RoleModel.find({ _id: { $in: roleIds } });
    const roleMap = new Map(roles.map((role) => [role._id.toString(), role]));

    return res.json({
      success: true,
      data: users.map((user) => ({
        id: user._id.toString(),
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
        role: serializeRoleRef(roleMap.get(user.roleId.toString()) ?? null),
      })),
    });
  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({ success: false, error: 'Failed to load users' });
  }
});

const updateUserSchema = z.object({
  roleId: z.string().optional(),
  isActive: z.boolean().optional(),
});

router.patch('/:id', requirePermission('users.manage'), async (req: Request, res: Response) => {
  try {
    if (req.params.id === req.user!.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot modify your own account from this page',
      });
    }

    const result = updateUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: result.error.flatten(),
      });
    }

    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (result.data.roleId) {
      const role = await RoleModel.findById(result.data.roleId);
      if (!role) {
        return res.status(400).json({ success: false, error: 'Role not found' });
      }
      user.roleId = role._id;
    }

    if (typeof result.data.isActive === 'boolean') {
      user.isActive = result.data.isActive;
    }

    await user.save();

    const role = await RoleModel.findById(user.roleId);

    return res.json({
      success: true,
      data: {
        id: user._id.toString(),
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
        role: serializeRoleRef(role),
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

export { router as usersRoutes };
