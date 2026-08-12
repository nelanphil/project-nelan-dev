import { Router, Request, Response } from 'express';
import { authenticateRequest, requirePermission } from '../middleware/auth';
import { PermissionModel } from '../models/Permission';

const router = Router();

router.get('/', authenticateRequest, requirePermission('roles.manage'), async (_req: Request, res: Response) => {
  try {
    const permissions = await PermissionModel.find().sort({ category: 1, key: 1 });

    return res.json({
      success: true,
      data: permissions.map((permission) => ({
        key: permission.key,
        label: permission.label,
        description: permission.description,
        category: permission.category,
      })),
    });
  } catch (error) {
    console.error('List permissions error:', error);
    return res.status(500).json({ success: false, error: 'Failed to load permissions' });
  }
});

export { router as permissionsRoutes };
