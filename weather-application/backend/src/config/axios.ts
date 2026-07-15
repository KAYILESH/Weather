import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from './env';
import { logger } from '../utils/logger';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: env.OPENWEATHER_BASE_URL,
    timeout: 10000,
    params: {
      appid: env.OPENWEATHER_API_KEY,
      units: 'metric',
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      logger.info(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error: AxiosError) => {
      logger.error(`[API Request Error] ${error.message}`);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      logger.info(`[API Response] ${response.status} ${response.config.url}`);
      return response;
    },
    (error: AxiosError) => {
      logger.error(`[API Response Error] ${error.response?.status} ${error.message}`);
      return Promise.reject(error);
    }
  );

  return instance;
};

export const weatherApiClient = createAxiosInstance();
