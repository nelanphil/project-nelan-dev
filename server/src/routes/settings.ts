import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateRequest, requirePermission } from '../middleware/auth';
import {
  DEFAULT_EMAIL_SETTINGS,
  EmailSettingsModel,
} from '../models/EmailSettings';
import { encryptSecret } from '../utils/encryption';
import { getEmailSettingsDoc, sendTestEmail } from '../utils/mailer';

const router = Router();

const emailSettingsSchema = z.object({
  host: z.string().min(1).default(DEFAULT_EMAIL_SETTINGS.host),
  port: z.coerce.number().int().min(1).max(65535).default(DEFAULT_EMAIL_SETTINGS.port),
  secure: z.boolean().default(DEFAULT_EMAIL_SETTINGS.secure),
  username: z.string().min(1),
  fromAddress: z.string().email(),
  password: z.string().optional(),
});

router.use(authenticateRequest, requirePermission('settings.manage'));

router.get('/email', async (_req: Request, res: Response) => {
  try {
    const settings = await getEmailSettingsDoc();

    if (!settings) {
      return res.json({
        success: true,
        data: {
          host: DEFAULT_EMAIL_SETTINGS.host,
          port: DEFAULT_EMAIL_SETTINGS.port,
          secure: DEFAULT_EMAIL_SETTINGS.secure,
          username: '',
          fromAddress: '',
          configured: false,
          hasPassword: false,
        },
      });
    }

    return res.json({
      success: true,
      data: {
        host: settings.host,
        port: settings.port,
        secure: settings.secure,
        username: settings.username,
        fromAddress: settings.fromAddress,
        configured: Boolean(settings.passwordEncrypted),
        hasPassword: Boolean(settings.passwordEncrypted),
      },
    });
  } catch (error) {
    console.error('Get email settings error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load email settings',
    });
  }
});

router.put('/email', async (req: Request, res: Response) => {
  try {
    const result = emailSettingsSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: result.error.flatten(),
      });
    }

    const existing = await getEmailSettingsDoc();
    const password = result.data.password?.trim();

    if (!existing && !password) {
      return res.status(400).json({
        success: false,
        error: 'SMTP password is required when configuring email for the first time',
      });
    }

    const payload: Record<string, unknown> = {
      host: result.data.host,
      port: result.data.port,
      secure: result.data.secure,
      username: result.data.username,
      fromAddress: result.data.fromAddress,
    };

    if (password) {
      payload.passwordEncrypted = encryptSecret(password);
    }

    let settings;
    if (existing) {
      Object.assign(existing, payload);
      settings = await existing.save();
    } else {
      settings = await EmailSettingsModel.create(payload);
    }

    return res.json({
      success: true,
      data: {
        host: settings.host,
        port: settings.port,
        secure: settings.secure,
        username: settings.username,
        fromAddress: settings.fromAddress,
        configured: Boolean(settings.passwordEncrypted),
        hasPassword: Boolean(settings.passwordEncrypted),
      },
      message: 'Email settings saved',
    });
  } catch (error) {
    console.error('Update email settings error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save email settings',
    });
  }
});

router.post('/email/test', async (req: Request, res: Response) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }

    const settings = await getEmailSettingsDoc();
    if (!settings?.passwordEncrypted) {
      return res.status(400).json({
        success: false,
        error: 'Configure and save SMTP settings before sending a test email',
      });
    }

    await sendTestEmail(req.user.email);

    return res.json({
      success: true,
      message: `Test email sent to ${req.user.email}`,
    });
  } catch (error) {
    console.error('Test email error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send test email',
    });
  }
});

export { router as settingsRoutes };
