import { AxiosError } from 'axios';
import { weatherApiClient } from '../config/axios';
import {
  OWMCurrentWeatherResponse,
  OWMForecastResponse,
  OWMForecastItem,
  CurrentWeather,
  ForecastDay,
  HourlyForecast,
  WeatherCondition,
  WeatherApiError,
} from '../types/weather.types';
import { logger } from '../utils/logger';

// =============================================
// Helper Functions
// =============================================

const formatWeatherCondition = (weather: OWMCurrentWeatherResponse['weather'][0]): WeatherCondition => ({
  id: weather.id,
  main: weather.main,
  description: weather.description,
  icon: weather.icon,
});

const capitalizeDescription = (desc: string): string =>
  desc.charAt(0).toUpperCase() + desc.slice(1);

const formatDate = (dt: number): string => {
  const date = new Date(dt * 1000);
  return date.toISOString().split('T')[0];
};

const formatTime = (dt: number, timezone: number = 0): string => {
  const utcMs = dt * 1000;
  const localMs = utcMs + timezone * 1000;
  const d = new Date(localMs);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

// =============================================
// Transform Functions
// =============================================

const transformCurrentWeather = (data: OWMCurrentWeatherResponse): CurrentWeather => ({
  city: data.name,
  country: data.sys.country,
  coord: {
    lat: data.coord.lat,
    lon: data.coord.lon,
  },
  temperature: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  tempMin: Math.round(data.main.temp_min),
  tempMax: Math.round(data.main.temp_max),
  humidity: data.main.humidity,
  pressure: data.main.pressure,
  visibility: Math.round(data.visibility / 1000), // Convert meters to km
  windSpeed: Math.round(data.wind.speed * 3.6 * 10) / 10, // m/s to km/h
  windDeg: data.wind.deg,
  windGust: data.wind.gust ? Math.round(data.wind.gust * 3.6 * 10) / 10 : undefined,
  clouds: data.clouds.all,
  sunrise: data.sys.sunrise,
  sunset: data.sys.sunset,
  timezone: data.timezone,
  dt: data.dt,
  weather: formatWeatherCondition(data.weather[0]),
  description: capitalizeDescription(data.weather[0].description),
});

const groupForecastByDay = (
  items: OWMForecastItem[],
  timezone: number
): Map<string, OWMForecastItem[]> => {
  const grouped = new Map<string, OWMForecastItem[]>();

  items.forEach((item) => {
    const utcMs = item.dt * 1000;
    const localMs = utcMs + timezone * 1000;
    const localDate = new Date(localMs);
    const dateKey = localDate.toISOString().split('T')[0];

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(item);
  });

  return grouped;
};

const transformForecast = (
  data: OWMForecastResponse,
  timezone: number
): ForecastDay[] => {
  const grouped = groupForecastByDay(data.list, timezone);
  const today = formatDate(Math.floor(Date.now() / 1000));
  const forecast: ForecastDay[] = [];

  for (const [date, items] of grouped) {
    if (date === today) continue; // Skip today

    const temps = items.map((i) => i.main.temp);
    const tempMin = Math.round(Math.min(...temps));
    const tempMax = Math.round(Math.max(...temps));
    const maxPop = Math.max(...items.map((i) => i.pop));

    // Use midday item for representative weather, or first item
    const representativeItem =
      items.find((i) => {
        const h = new Date((i.dt + timezone) * 1000).getUTCHours();
        return h >= 11 && h <= 14;
      }) || items[0];

    const hourly: HourlyForecast[] = items.map((item) => ({
      dt: item.dt,
      time: formatTime(item.dt, timezone),
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed * 3.6 * 10) / 10,
      pop: Math.round(item.pop * 100),
      weather: formatWeatherCondition(item.weather[0]),
    }));

    forecast.push({
      date,
      dt: representativeItem.dt,
      tempMin,
      tempMax,
      humidity: representativeItem.main.humidity,
      pop: Math.round(maxPop * 100),
      weather: formatWeatherCondition(representativeItem.weather[0]),
      description: capitalizeDescription(representativeItem.weather[0].description),
      hourly,
    });

    if (forecast.length >= 5) break; // Limit to 5 days
  }

  return forecast;
};

// =============================================
// Service Functions
// =============================================

const handleApiError = (error: unknown, city: string): never => {
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;

    if (status === 404) {
      throw new WeatherApiError(
        `City "${city}" not found. Please check the spelling and try again.`,
        404,
        'CITY_NOT_FOUND'
      );
    }

    if (status === 401) {
      logger.warn('OpenWeatherMap API key not yet activated — returning mock data for development.');
      throw new WeatherApiError(
        'API_KEY_PENDING',
        401,
        'API_KEY_PENDING'
      );
    }

    if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
      throw new WeatherApiError(
        'Weather service timeout. Please try again.',
        504,
        'GATEWAY_TIMEOUT'
      );
    }
  }

  logger.error('Unexpected error in weather service', error);
  throw new WeatherApiError(
    'An unexpected error occurred while fetching weather data.',
    500,
    'INTERNAL_SERVER_ERROR'
  );
};

// =============================================
// Mock Data (used while API key is activating)
// =============================================

const getMockWeatherData = (city: string): { current: CurrentWeather; forecast: ForecastDay[] } => {
  const now = Math.floor(Date.now() / 1000);
  const cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  const current: CurrentWeather = {
    city: cityName,
    country: 'IN',
    coord: { lat: 9.9252, lon: 78.1198 },
    temperature: 32,
    feelsLike: 38,
    tempMin: 28,
    tempMax: 35,
    humidity: 72,
    pressure: 1008,
    visibility: 8,
    windSpeed: 14,
    windDeg: 215,
    clouds: 40,
    sunrise: now - 21600,
    sunset: now + 21600,
    timezone: 19800,
    dt: now,
    weather: { id: 801, main: 'Clouds', description: 'Partly cloudy', icon: '02d' },
    description: 'Partly cloudy',
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const icons = ['01d', '02d', '10d', '03d', '01d'];
  const mains = ['Clear', 'Clouds', 'Rain', 'Clouds', 'Clear'];
  const descs = ['Sunny', 'Partly cloudy', 'Light rain', 'Overcast', 'Clear sky'];
  const pops  = [5, 20, 75, 30, 10];

  const forecast: ForecastDay[] = days.map((_, i) => ({
    date: new Date(Date.now() + (i + 1) * 86400000).toISOString().split('T')[0],
    dt: now + (i + 1) * 86400,
    tempMin: 26 + i,
    tempMax: 33 + i,
    humidity: 65 + i * 3,
    pop: pops[i],
    weather: { id: 800, main: mains[i], description: descs[i], icon: icons[i] },
    description: descs[i],
    hourly: Array.from({ length: 6 }).map((_, h) => ({
      dt: now + h * 3600,
      time: `${(h * 3).toString().padStart(2, '0')}:00`,
      temp: 28 + h,
      feelsLike: 32 + h,
      humidity: 70,
      windSpeed: 12,
      pop: Math.round(pops[i] / 2),
      weather: { id: 800, main: mains[i], description: descs[i], icon: icons[i] },
    })),
  }));

  return { current, forecast };
};

export const weatherService = {
  async getWeatherByCity(city: string): Promise<{
    current: CurrentWeather;
    forecast: ForecastDay[];
  }> {
    logger.info(`Fetching weather for city: ${city}`);

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        weatherApiClient.get<OWMCurrentWeatherResponse>('/weather', {
          params: { q: city },
        }),
        weatherApiClient.get<OWMForecastResponse>('/forecast', {
          params: { q: city, cnt: 40 },
        }),
      ]);

      const current = transformCurrentWeather(currentResponse.data);
      const forecast = transformForecast(forecastResponse.data, currentResponse.data.timezone);

      logger.info(`Successfully fetched weather for: ${current.city}, ${current.country}`);

      return { current, forecast };
    } catch (error) {
      // If API key is still activating, serve mock data so the UI works
      if (error instanceof WeatherApiError && error.code === 'API_KEY_PENDING') {
        logger.warn(`[MOCK] Serving mock weather data for city: ${city}`);
        return getMockWeatherData(city);
      }
      handleApiError(error, city);
      throw error; // unreachable — satisfies TypeScript control flow
    }
  },

  async getWeatherByCoords(lat: number, lon: number): Promise<{
    current: CurrentWeather;
    forecast: ForecastDay[];
  }> {
    logger.info(`Fetching weather for coordinates: ${lat}, ${lon}`);

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        weatherApiClient.get<OWMCurrentWeatherResponse>('/weather', {
          params: { lat, lon },
        }),
        weatherApiClient.get<OWMForecastResponse>('/forecast', {
          params: { lat, lon, cnt: 40 },
        }),
      ]);

      const current = transformCurrentWeather(currentResponse.data);
      const forecast = transformForecast(forecastResponse.data, currentResponse.data.timezone);

      logger.info(`Successfully fetched weather for coords: ${lat}, ${lon}`);

      return { current, forecast };
    } catch (error) {
      if (error instanceof WeatherApiError && error.code === 'API_KEY_PENDING') {
        logger.warn(`[MOCK] Serving mock weather data for coords: ${lat},${lon}`);
        return getMockWeatherData(`${lat},${lon}`);
      }
      handleApiError(error, `${lat},${lon}`);
      throw error; // unreachable — satisfies TypeScript control flow
    }
  },
};
