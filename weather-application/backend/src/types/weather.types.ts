// =============================================
// OpenWeatherMap API Response Types
// =============================================

export interface OWMCoord {
  lon: number;
  lat: number;
}

export interface OWMWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OWMMainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface OWMWindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface OWMCloudsData {
  all: number;
}

export interface OWMSysData {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface OWMCurrentWeatherResponse {
  coord: OWMCoord;
  weather: OWMWeatherCondition[];
  base: string;
  main: OWMMainData;
  visibility: number;
  wind: OWMWindData;
  clouds: OWMCloudsData;
  dt: number;
  sys: OWMSysData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface OWMForecastItem {
  dt: number;
  main: OWMMainData;
  weather: OWMWeatherCondition[];
  clouds: OWMCloudsData;
  wind: OWMWindData;
  visibility: number;
  pop: number;
  rain?: { '3h': number };
  sys: { pod: string };
  dt_txt: string;
}

export interface OWMForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: OWMForecastItem[];
  city: {
    id: number;
    name: string;
    coord: OWMCoord;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// =============================================
// Transformed API Response Types (What we send to frontend)
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

export interface WeatherApiResponse {
  success: boolean;
  data: {
    current: CurrentWeather;
    forecast: ForecastDay[];
  };
}

export interface ApiErrorResponse {
  success: boolean;
  error: {
    message: string;
    code: string;
    statusCode: number;
  };
}

// =============================================
// Custom Error Types
// =============================================

export class WeatherApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'WeatherApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
