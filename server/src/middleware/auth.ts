import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { UserModel } from '../models/User';
import { RoleModel } from '../models/Role';

/**
 * Middleware to authenticate requests using JWT stored in the Authorization header.
 * Expects Authorization header: Bearer <token>
 *
 * Populates `req.user` with the user's role and permissions, read fresh from
 * the database on every request, so permission/role changes apply
 * immediately without requiring re-login.
 */
export async function authenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    const user = await UserModel.findById(payload.userId).select('_id email isActive roleId');

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, error: 'This account has been deactivated' });
    }

    const role = await RoleModel.findById(user.roleId).select('_id name slug permissions');

    if (!role) {
      return res.status(401).json({ success: false, error: 'Role not found for this account' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      isActive: user.isActive,
      role: {
        id: role._id.toString(),
        name: role.name,
        slug: role.slug,
      },
      permissions: role.permissions,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    next();
  };
}

export function requireAnyPermission(permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }

    const hasAny = permissions.some((permission) => req.user!.permissions.includes(permission));

    if (!hasAny) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    next();
  };
}
