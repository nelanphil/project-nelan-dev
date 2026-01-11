import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { UserModel } from '../models/User';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { authenticateRequest } from '../middleware/auth';

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const result = credentialsSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: result.error.flatten(),
      });
    }

    const existingUser = await UserModel.findOne({ email: result.data.email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
      });
    }

    const passwordHash = await hashPassword(result.data.password);

    const user = await UserModel.create({
      email: result.data.email,
      passwordHash,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create user',
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const result = credentialsSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: result.error.flatten(),
      });
    }

    const user = await UserModel.findOne({ email: result.data.email });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValid = await comparePassword(result.data.password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to login',
    });
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  return res.json({ success: true, message: 'Logged out' });
});

router.get('/me', authenticateRequest, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthenticated' });
  }

  return res.json({
    success: true,
    data: req.user,
  });
});

export { router as authRoutes };

