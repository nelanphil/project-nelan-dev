import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { UserModel } from '../models/User';

/**
 * Middleware to authenticate requests using JWT stored in the Authorization header.
 * Expects Authorization header: Bearer <token>
 */
export async function authenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    const user = await UserModel.findById(payload.userId).select('_id email role');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

