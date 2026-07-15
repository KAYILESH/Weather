import axios from 'axios';
import { WeatherData, ApiSuccessResponse } from '../types/weather.types';
import { WEATHER_ENDPOINT, WEATHER_COORDS_ENDPOINT, REQUEST_TIMEOUT_MS, API_BASE_URL } from '../constants';

export interface CitySuggestion {
  name: string;
  country: string;
  state: string | null;
  lat: number;
  lon: number;
  displayName: string;
}

const apiClient = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      // Extract error message from API response
      const apiError = error.response?.data?.error;
      if (apiError?.message) {
        throw new Error(apiError.message);
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect. Please check your internet connection.');
      }

      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }

      if (error.response?.status === 503) {
        throw new Error('Weather service is temporarily unavailable. Please try again later.');
      }
    }
    throw error;
  }
);

export const weatherApi = {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    const response = await apiClient.get<ApiSuccessResponse<WeatherData>>(WEATHER_ENDPOINT, {
      params: { city: city.trim() },
    });
    return response.data.data;
  },

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const response = await apiClient.get<ApiSuccessResponse<WeatherData>>(WEATHER_COORDS_ENDPOINT, {
      params: { lat, lon },
    });
    return response.data.data;
  },

  async getCitySuggestions(query: string): Promise<CitySuggestion[]> {
    if (query.trim().length < 2) return [];
    try {
      const response = await apiClient.get<ApiSuccessResponse<CitySuggestion[]>>(
        `${API_BASE_URL}/weather/suggestions`,
        {
          params: { q: query.trim() },
          timeout: 5000,
        }
      );
      return response.data.data;
    } catch {
      return [];
    }
  },
};
