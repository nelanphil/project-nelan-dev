import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { router } from './routes';
import { connectToDatabase, disconnectFromDatabase } from './config/mongodb';
import { NODE_ENV } from './config/env';
import { seedRbac } from './utils/seedRbac';

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN =
  process.env.CORS_ORIGIN || (NODE_ENV === 'production' ? '' : 'http://localhost:3000');

if (NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
  console.warn(
    '⚠️  WARNING: CORS_ORIGIN environment variable is not set in production. This may cause CORS errors.'
  );
}

const allowedOrigins = CORS_ORIGIN
  ? CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : undefined,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api', router);

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : undefined,
  });
});

let server: ReturnType<typeof app.listen> | null = null;

async function startServer() {
  try {
    await connectToDatabase();
    await seedRbac();
    server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📦 Environment: ${NODE_ENV}`);
      if (allowedOrigins.length > 0) {
        console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
      } else {
        console.log(`⚠️  CORS: No allowed origins configured`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log('🛑 Shutting down server...');
  await disconnectFromDatabase();
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();

