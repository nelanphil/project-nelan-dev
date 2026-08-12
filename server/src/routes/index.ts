import { Router, Request, Response } from 'express';
import { authRoutes } from './auth';
import { contactRoutes } from './contact';
import { settingsRoutes } from './settings';
import { rolesRoutes } from './roles';
import { usersRoutes } from './users';
import { permissionsRoutes } from './permissions';
import { authenticateRequest } from '../middleware/auth';

export const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);
router.use('/roles', rolesRoutes);
router.use('/users', usersRoutes);
router.use('/permissions', permissionsRoutes);

router.get('/dashboard', authenticateRequest, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      message: 'Protected dashboard data',
      user: req.user,
    },
  });
});
