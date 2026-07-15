import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  OPENWEATHER_API_KEY: string;
  OPENWEATHER_BASE_URL: string;
  FRONTEND_URL: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

function validateEnv(): EnvConfig {
  const {
    PORT,
    NODE_ENV,
    OPENWEATHER_API_KEY,
    OPENWEATHER_BASE_URL,
    FRONTEND_URL,
    RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_REQUESTS,
  } = process.env;

  if (!OPENWEATHER_API_KEY) {
    throw new Error('OPENWEATHER_API_KEY is required. Please add it to your .env file.');
  }

  return {
    PORT: parseInt(PORT || '5000', 10),
    NODE_ENV: NODE_ENV || 'development',
    OPENWEATHER_API_KEY,
    OPENWEATHER_BASE_URL: OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
    FRONTEND_URL: FRONTEND_URL || 'http://localhost:5173',
    RATE_LIMIT_WINDOW_MS: parseInt(RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(RATE_LIMIT_MAX_REQUESTS || '100', 10),
  };
}

export const env = validateEnv();
