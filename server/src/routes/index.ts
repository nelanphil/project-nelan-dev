import { Router, Request, Response } from 'express';

export const router = Router();

// Health check route
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Example route - replace with your actual routes
router.get('/example', (req: Request, res: Response) => {
  res.json({ message: 'This is an example route' });
});

// TODO: Add your routes here
// Example:
// router.use('/users', userRoutes);
// router.use('/services', serviceRoutes);

