import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { weatherService } from '../services/weather.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { WeatherApiError } from '../types/weather.types';
import { logger } from '../utils/logger';
import { env } from '../config/env';

// =============================================
// Validation Helpers
// =============================================

const validateCityParam = (city: unknown): string | null => {
  if (!city || typeof city !== 'string') return null;
  const trimmed = city.trim();
  if (trimmed.length < 1 || trimmed.length > 100) return null;
  if (!/^[a-zA-Z\s\-,.']+$/.test(trimmed)) return null;
  return trimmed;
};

const validateCoordsParams = (lat: unknown, lon: unknown): { lat: number; lon: number } | null => {
  const latNum = parseFloat(String(lat));
  const lonNum = parseFloat(String(lon));

  if (isNaN(latNum) || isNaN(lonNum)) return null;
  if (latNum < -90 || latNum > 90) return null;
  if (lonNum < -180 || lonNum > 180) return null;

  return { lat: latNum, lon: lonNum };
};

// =============================================
// Controller Methods
// =============================================

export const weatherController = {
  async getWeatherByCity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { city } = req.query;
      const validatedCity = validateCityParam(city);

      if (!validatedCity) {
        sendError(
          res,
          'Invalid city name. Please provide a valid city name (letters, spaces, and hyphens only).',
          400,
          'INVALID_CITY'
        );
        return;
      }

      logger.info(`[Controller] Weather request for city: ${validatedCity}`);
      const weatherData = await weatherService.getWeatherByCity(validatedCity);

      sendSuccess(res, weatherData);
    } catch (error) {
      if (error instanceof WeatherApiError) {
        sendError(res, error.message, error.statusCode, error.code);
        return;
      }
      next(error);
    }
  },

  async getWeatherByCoords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lat, lon } = req.query;
      const coords = validateCoordsParams(lat, lon);

      if (!coords) {
        sendError(
          res,
          'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.',
          400,
          'INVALID_COORDINATES'
        );
        return;
      }

      logger.info(`[Controller] Weather request for coords: ${coords.lat}, ${coords.lon}`);
      const weatherData = await weatherService.getWeatherByCoords(coords.lat, coords.lon);

      sendSuccess(res, weatherData);
    } catch (error) {
      if (error instanceof WeatherApiError) {
        sendError(res, error.message, error.statusCode, error.code);
        return;
      }
      next(error);
    }
  },

  async getCitySuggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        sendSuccess(res, []);
        return;
      }

      const query = q.trim();
      logger.info(`[Controller] City suggestions request for: ${query}`);

      const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: query,
          limit: 6,
          appid: env.OPENWEATHER_API_KEY,
        },
        timeout: 5000,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const suggestions = (response.data as any[]).map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.state || null,
        lat: item.lat,
        lon: item.lon,
        displayName: item.state
          ? `${item.name}, ${item.state}, ${item.country}`
          : `${item.name}, ${item.country}`,
      }));

      sendSuccess(res, suggestions);
    } catch (error) {
      // On geocoding failure, return empty list silently
      logger.warn('[Controller] City suggestions lookup failed', error);
      sendSuccess(res, []);
    }
  },

  healthCheck(_req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      message: 'Weather API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  },
};
