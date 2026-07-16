import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import weatherRoutes from './routes/weather.routes';
import { weatherController } from './controllers/weather.controller';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';

const createApp = (): Application => {
  const app = express();

  // =============================================
  // Security Middleware
  // =============================================
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }));

  // =============================================
  // CORS Configuration
  // =============================================
  const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, mobile apps)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        // Allow any Vercel preview deployment of the same project
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`), false);
    },
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  // =============================================
  // Logging Middleware
  // =============================================
  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }));
  }

  // =============================================
  // Body Parsing
  // =============================================
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // =============================================
  // Global Rate Limiter
  // =============================================
  app.use(rateLimiter);

  // =============================================
  // Routes
  // =============================================
  app.get('/health', weatherController.healthCheck);
  app.use('/api/weather', weatherRoutes);

  // =============================================
  // Error Handling (must be last)
  // =============================================
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
