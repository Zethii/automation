import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

// Initialize logger
const logger = pino(
  process.env.NODE_ENV === 'production'
    ? undefined
    : { transport: { target: 'pino-pretty' } }
);

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 3001;

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (to be implemented)
app.use('/api/auth', (req: Request, res: Response) => {
  res.json({ message: 'Auth routes - coming soon' });
});

app.use('/api/content', (req: Request, res: Response) => {
  res.json({ message: 'Content routes - coming soon' });
});

app.use('/api/social', (req: Request, res: Response) => {
  res.json({ message: 'Social media routes - coming soon' });
});

app.use('/api/affiliate', (req: Request, res: Response) => {
  res.json({ message: 'Affiliate routes - coming soon' });
});

app.use('/api/ecommerce', (req: Request, res: Response) => {
  res.json({ message: 'E-commerce routes - coming soon' });
});

app.use('/api/analytics', (req: Request, res: Response) => {
  res.json({ message: 'Analytics routes - coming soon' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
  });
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

export { app, pool, logger };
