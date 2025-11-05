import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || (NODE_ENV === 'production' ? '' : 'http://localhost:3000');

// Validate CORS_ORIGIN in production
if (NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
  console.warn('⚠️  WARNING: CORS_ORIGIN environment variable is not set in production. This may cause CORS errors.');
}

// Parse allowed origins (support comma-separated list)
const allowedOrigins = CORS_ORIGIN 
  ? CORS_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
  : [];

// Middleware
app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : undefined,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', router);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}`);
  if (allowedOrigins.length > 0) {
    console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
  } else {
    console.log(`⚠️  CORS: No allowed origins configured`);
  }
});

