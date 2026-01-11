import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { ContactMessageModel } from '../models/ContactMessage';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

router.post('/', async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input',
      details: parsed.error.flatten(),
    });
  }

  try {
    await ContactMessageModel.create(parsed.data);

    return res.status(201).json({
      success: true,
      message: 'Message received',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  }
});

export { router as contactRoutes };






