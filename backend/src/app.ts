import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import logger from './utils/logger';
import router from './routes';
import cors from 'cors';

const app: Application = express();

// Middleware
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://web.levelin.fun'  // Production frontend URL
    : 'http://localhost:3000',   // Development frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming request: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip
  });
  next();
});

// Routes
app.use('/api', router);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;