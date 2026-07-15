// =============================================
// Frontend Weather Types
// These mirror the backend's transformed response
// =============================================

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  city: string;
  country: string;
  coord: {
    lat: number;
    lon: number;
  };
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
  weather: WeatherCondition;
  description: string;
}

export interface HourlyForecast {
  dt: number;
  time: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pop: number;
  weather: WeatherCondition;
}

export interface ForecastDay {
  date: string;
  dt: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pop: number;
  weather: WeatherCondition;
  description: string;
  hourly: HourlyForecast[];
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}

// =============================================
// API Response Types
// =============================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// =============================================
// Store Types
// =============================================

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type ThemeMode = 'dark' | 'light';

export interface WeatherStore {
  // State
  weather: CurrentWeather | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
  lastSearchedCity: string;
  recentSearches: string[];
  unit: TemperatureUnit;
  theme: ThemeMode;

  // Actions
  fetchWeather: (city: string) => Promise<void>;
  fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
  setUnit: (unit: TemperatureUnit) => void;
  toggleTheme: () => void;
  clearError: () => void;
  clearWeather: () => void;
  addRecentSearch: (city: string) => void;
  removeRecentSearch: (city: string) => void;
  clearRecentSearches: () => void;
}

// =============================================
// Component Props Types
// =============================================

export interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'cyan';
}

export interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
  onLocationSearch?: () => void;
}
