// =============================================
// Application Constants
// =============================================

export const APP_NAME = 'Atmos';
export const APP_VERSION = '1.0.0';

// =============================================
// API Constants
// =============================================

export const API_BASE_URL = '/api';
export const WEATHER_ENDPOINT = `${API_BASE_URL}/weather`;
export const WEATHER_COORDS_ENDPOINT = `${API_BASE_URL}/weather/coords`;

// =============================================
// OpenWeatherMap Icon Base URL
// =============================================

export const OWM_ICON_BASE_URL = 'https://openweathermap.org/img/wn';

export const getWeatherIconUrl = (icon: string, size: '1x' | '2x' | '4x' = '2x'): string =>
  `${OWM_ICON_BASE_URL}/${icon}@${size}.png`;

// =============================================
// Local Storage Keys
// =============================================

export const STORAGE_KEYS = {
  LAST_CITY: 'weather_last_city',
  RECENT_SEARCHES: 'weather_recent_searches',
  UNIT: 'weather_unit',
  THEME: 'weather_theme',
} as const;

// =============================================
// Configuration
// =============================================

export const MAX_RECENT_SEARCHES = 8;
export const SEARCH_DEBOUNCE_MS = 500;
export const REQUEST_TIMEOUT_MS = 12000;

// =============================================
// Weather Condition Backgrounds
// =============================================

export const WEATHER_BG_GRADIENTS: Record<string, string> = {
  // Clear
  clear: 'from-blue-900 via-indigo-900 to-violet-900',
  // Clouds
  clouds: 'from-slate-800 via-gray-800 to-zinc-900',
  // Rain
  rain: 'from-slate-900 via-blue-950 to-indigo-950',
  // Drizzle
  drizzle: 'from-slate-800 via-blue-900 to-indigo-900',
  // Thunderstorm
  thunderstorm: 'from-gray-950 via-slate-900 to-zinc-950',
  // Snow
  snow: 'from-slate-700 via-blue-800 to-indigo-800',
  // Atmosphere (mist, fog, haze)
  mist: 'from-gray-800 via-slate-700 to-gray-800',
  fog: 'from-gray-800 via-slate-700 to-gray-800',
  haze: 'from-amber-900 via-orange-900 to-yellow-900',
  smoke: 'from-gray-900 via-zinc-800 to-gray-900',
  // Default
  default: 'from-indigo-950 via-violet-950 to-purple-950',
};

export const getWeatherBackground = (weatherMain: string): string => {
  const key = weatherMain.toLowerCase();
  return WEATHER_BG_GRADIENTS[key] || WEATHER_BG_GRADIENTS.default;
};

// =============================================
// Wind Direction Labels
// =============================================

export const getWindDirection = (deg: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};

// =============================================
// Temperature Conversion
// =============================================

export const celsiusToFahrenheit = (celsius: number): number =>
  Math.round((celsius * 9) / 5 + 32);

export const formatTemperature = (celsius: number, unit: 'celsius' | 'fahrenheit'): string => {
  if (unit === 'fahrenheit') {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${celsius}°C`;
};

// =============================================
// Date / Time Formatters
// =============================================

export const formatDayName = (dt: number, timezone: number = 0): string => {
  const date = new Date((dt + timezone) * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
};

export const formatShortDay = (dt: number, timezone: number = 0): string => {
  const date = new Date((dt + timezone) * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
};

export const formatTime = (timestamp: number, timezone: number = 0): string => {
  const localMs = (timestamp + timezone) * 1000;
  const d = new Date(localMs);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

export const formatFullDate = (dt: number, timezone: number = 0): string => {
  const date = new Date((dt + timezone) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

// =============================================
// UV Index Labels
// =============================================

export const getUVLabel = (uvi: number): { label: string; color: string } => {
  if (uvi <= 2) return { label: 'Low', color: 'text-green-400' };
  if (uvi <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
  if (uvi <= 7) return { label: 'High', color: 'text-orange-400' };
  if (uvi <= 10) return { label: 'Very High', color: 'text-red-400' };
  return { label: 'Extreme', color: 'text-purple-400' };
};

// =============================================
// Visibility Labels
// =============================================

export const getVisibilityLabel = (km: number): string => {
  if (km >= 10) return 'Excellent';
  if (km >= 5) return 'Good';
  if (km >= 2) return 'Moderate';
  if (km >= 1) return 'Poor';
  return 'Very Poor';
};
