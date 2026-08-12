import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { UserModel } from '../models/User';
import { RoleModel } from '../models/Role';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { authenticateRequest, requirePermission } from '../middleware/auth';
import { getSystemRoleId } from '../utils/seedRbac';
import { isEmailConfigured, sendPasswordResetEmail } from '../utils/mailer';

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  roleId: z.string().optional(),
});

const emailOnlySchema = z.object({
  email: z.string().email(),
});

const verifyResetSchema = z.object({
  email: z.string().email(),
  token: z.string().min(6),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(6),
  password: z.string().min(6),
});

function hashResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateResetToken() {
  // 8-char hex code, easy to type from an email
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

function serializeRoleRef(role: InstanceType<typeof RoleModel> | null) {
  if (!role) return null;
  return { id: role._id.toString(), name: role.name, slug: role.slug };
}

async function findUserWithValidResetToken(email: string, token: string) {
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user || !user.passwordResetTokenHash || !user.passwordResetExpires) {
    return null;
  }

  if (user.passwordResetExpires.getTime() < Date.now()) {
    return null;
  }

  const tokenHash = hashResetToken(token.trim().toUpperCase());
  if (tokenHash !== user.passwordResetTokenHash) {
    return null;
  }

  return user;
}

router.post(
  '/register',
  authenticateRequest,
  requirePermission('users.manage'),
  async (req: Request, res: Response) => {
    try {
      const result = registerSchema.safeParse(req.body);

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

      let roleId = result.data.roleId;

      if (roleId) {
        const role = await RoleModel.findById(roleId);
        if (!role) {
          return res.status(400).json({ success: false, error: 'Role not found' });
        }
      } else {
        roleId = (await getSystemRoleId('user')).toString();
      }

      const passwordHash = await hashPassword(result.data.password);

      const user = await UserModel.create({
        email: result.data.email,
        passwordHash,
        roleId,
      });

      const role = await RoleModel.findById(user.roleId);

      return res.status(201).json({
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
      console.error('Register error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create user',
      });
    }
  }
);

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

    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'This account has been deactivated' });
    }

    const isValid = await comparePassword(result.data.password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const role = await RoleModel.findById(user.roleId);

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          isActive: user.isActive,
          role: serializeRoleRef(role),
          permissions: role ? role.permissions : [],
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

router.post('/forgot-password', async (req: Request, res: Response) => {
  const genericMessage =
    'If an account exists for that email, a reset code has been sent.';

  try {
    const result = emailOnlySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
      });
    }

    const user = await UserModel.findOne({ email: result.data.email.toLowerCase() });

    if (user) {
      const configured = await isEmailConfigured();

      if (!configured) {
        console.error('Forgot password requested but email settings are not configured');
      } else {
        const token = generateResetToken();
        user.passwordResetTokenHash = hashResetToken(token);
        user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();

        try {
          await sendPasswordResetEmail(user.email, token);
        } catch (mailError) {
          console.error('Failed to send password reset email:', mailError);
        }
      }
    }

    return res.json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.json({
      success: true,
      message: genericMessage,
    });
  }
});

router.post('/verify-reset-token', async (req: Request, res: Response) => {
  try {
    const result = verifyResetSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
      });
    }

    const user = await findUserWithValidResetToken(result.data.email, result.data.token);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset code',
      });
    }

    return res.json({
      success: true,
      message: 'Reset code verified',
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify reset code',
    });
  }
});

router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const result = resetPasswordSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: result.error.flatten(),
      });
    }

    const user = await findUserWithValidResetToken(result.data.email, result.data.token);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset code',
      });
    }

    user.passwordHash = await hashPassword(result.data.password);
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password',
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
