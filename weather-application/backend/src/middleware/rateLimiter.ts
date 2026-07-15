import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, _next: NextFunction) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    sendError(
      res,
      'Too many requests. Please slow down and try again later.',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  },
  skip: (req: Request) => {
    // Skip rate limiting for health check endpoint
    return req.path === '/health';
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    sendError(
      res,
      'API rate limit exceeded. Please wait a moment before searching again.',
      429,
      'API_RATE_LIMIT_EXCEEDED'
    );
  },
});
