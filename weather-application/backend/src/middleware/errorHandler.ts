import { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';
import { sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { WeatherApiError } from '../types/weather.types';

export const errorHandler = (
  err: Error | WeatherApiError | AxiosError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`[Error Handler] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    ip: req.ip,
  });

  // Handle custom WeatherApiError
  if (err instanceof WeatherApiError) {
    sendError(res, err.message, err.statusCode, err.code);
    return;
  }

  // Handle Axios errors (external API errors)
  if ((err as AxiosError).isAxiosError) {
    const axiosError = err as AxiosError;
    const status = axiosError.response?.status;

    if (status === 404) {
      sendError(res, 'City not found. Please check the city name and try again.', 404, 'CITY_NOT_FOUND');
      return;
    }

    if (status === 401) {
      sendError(res, 'Weather API authentication failed. Please contact support.', 500, 'API_AUTH_ERROR');
      return;
    }

    if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
      sendError(res, 'Weather service is taking too long to respond. Please try again.', 504, 'GATEWAY_TIMEOUT');
      return;
    }

    if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
      sendError(res, 'Unable to reach the weather service. Please check your connection.', 503, 'SERVICE_UNAVAILABLE');
      return;
    }

    sendError(res, 'An error occurred with the weather service.', 502, 'EXTERNAL_API_ERROR');
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    sendError(res, err.message, 400, 'VALIDATION_ERROR');
    return;
  }

  // Generic server error
  sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message,
    500,
    'INTERNAL_SERVER_ERROR'
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(
    res,
    `Route ${req.method} ${req.path} not found.`,
    404,
    'ROUTE_NOT_FOUND'
  );
};
