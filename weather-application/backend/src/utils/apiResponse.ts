import { Response } from 'express';
import { WeatherApiResponse, ApiErrorResponse } from '../types/weather.types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string
): Response => {
  const response: WeatherApiResponse & { message?: string } = {
    success: true,
    data: data as typeof response.data,
    ...(message && { message }),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_SERVER_ERROR'
): Response => {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      message,
      code,
      statusCode,
    },
  };
  return res.status(statusCode).json(response);
};

export const createSuccessResponse = <T>(data: T, message?: string) => ({
  success: true,
  ...(message && { message }),
  data,
});
