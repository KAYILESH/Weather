/**
 * weatherApi.ts
 * Calls OpenWeatherMap APIs directly from the frontend.
 * No backend required — works on any static host (Vercel, Netlify, etc.)
 */

import { WeatherData, CurrentWeather, ForecastDay, HourlyForecast, WeatherCondition } from '../types/weather.types';

// ── API Config ────────────────────────────────────────────────
// API key must be set via VITE_OPENWEATHER_API_KEY environment variable.
// Never hardcode secrets here — they will be exposed in the compiled JS bundle.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
if (!API_KEY) {
  console.error('Missing VITE_OPENWEATHER_API_KEY environment variable. Weather API calls will fail.');
}

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL  = 'https://api.openweathermap.org/geo/1.0';

// ── Types ─────────────────────────────────────────────────────
export interface CitySuggestion {
  name: string;
  country: string;
  state: string | null;
  lat: number;
  lon: number;
  displayName: string;
}

// ── Helpers ───────────────────────────────────────────────────
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmtCondition = (w: any): WeatherCondition => ({
  id: w.id,
  main: w.main,
  description: w.description,
  icon: w.icon,
});

const fmtTime = (dt: number, timezone: number): string => {
  const d = new Date((dt + timezone) * 1000);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

const fmtDate = (dt: number): string =>
  new Date(dt * 1000).toISOString().split('T')[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformCurrent = (d: any): CurrentWeather => ({
  city:        d.name,
  country:     d.sys.country,
  coord:       { lat: d.coord.lat, lon: d.coord.lon },
  temperature: Math.round(d.main.temp),
  feelsLike:   Math.round(d.main.feels_like),
  tempMin:     Math.round(d.main.temp_min),
  tempMax:     Math.round(d.main.temp_max),
  humidity:    d.main.humidity,
  pressure:    d.main.pressure,
  visibility:  Math.round((d.visibility ?? 0) / 1000),
  windSpeed:   Math.round(d.wind.speed * 3.6 * 10) / 10,
  windDeg:     d.wind.deg ?? 0,
  windGust:    d.wind.gust ? Math.round(d.wind.gust * 3.6 * 10) / 10 : undefined,
  clouds:      d.clouds.all,
  sunrise:     d.sys.sunrise,
  sunset:      d.sys.sunset,
  timezone:    d.timezone,
  dt:          d.dt,
  weather:     fmtCondition(d.weather[0]),
  description: cap(d.weather[0].description),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformForecast = (list: any[], timezone: number): ForecastDay[] => {
  const grouped = new Map<string, any[]>();
  const todayKey = fmtDate(Math.floor(Date.now() / 1000));

  for (const item of list) {
    const localMs  = (item.dt + timezone) * 1000;
    const dateKey  = new Date(localMs).toISOString().split('T')[0];
    if (dateKey === todayKey) continue;
    if (!grouped.has(dateKey)) grouped.set(dateKey, []);
    grouped.get(dateKey)!.push(item);
  }

  const forecast: ForecastDay[] = [];

  for (const [date, items] of grouped) {
    const temps   = items.map((i: any) => i.main.temp);
    const tempMin = Math.round(Math.min(...temps));
    const tempMax = Math.round(Math.max(...temps));
    const maxPop  = Math.max(...items.map((i: any) => i.pop));

    const rep =
      items.find((i: any) => {
        const h = new Date((i.dt + timezone) * 1000).getUTCHours();
        return h >= 11 && h <= 14;
      }) || items[0];

    const hourly: HourlyForecast[] = items.map((item: any) => ({
      dt:        item.dt,
      time:      fmtTime(item.dt, timezone),
      temp:      Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity:  item.main.humidity,
      windSpeed: Math.round(item.wind.speed * 3.6 * 10) / 10,
      pop:       Math.round(item.pop * 100),
      weather:   fmtCondition(item.weather[0]),
    }));

    forecast.push({
      date,
      dt:          rep.dt,
      tempMin,
      tempMax,
      humidity:    rep.main.humidity,
      pop:         Math.round(maxPop * 100),
      weather:     fmtCondition(rep.weather[0]),
      description: cap(rep.weather[0].description),
      hourly,
    });

    if (forecast.length >= 5) break;
  }

  return forecast;
};

// ── OWM fetch helper ─────────────────────────────────────────
const owmFetch = async (url: string): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg  = body?.message || res.statusText;
    if (res.status === 404) throw new Error(`City not found. Please check the spelling and try again.`);
    if (res.status === 401) throw new Error(`Invalid API key. Please check your configuration.`);
    throw new Error(`Weather API error: ${msg}`);
  }
  return res.json();
};

// ── Public API ────────────────────────────────────────────────
export const weatherApi = {
  /** Get weather + 5-day forecast by city name */
  async getWeatherByCity(city: string): Promise<WeatherData> {
    const params = `q=${encodeURIComponent(city.trim())}&units=metric&appid=${API_KEY}`;
    const [current, forecast] = await Promise.all([
      owmFetch(`${BASE_URL}/weather?${params}`),
      owmFetch(`${BASE_URL}/forecast?${params}&cnt=40`),
    ]);
    return {
      current:  transformCurrent(current),
      forecast: transformForecast(forecast.list, current.timezone),
    };
  },

  /** Get weather + 5-day forecast by coordinates */
  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const params = `lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const [current, forecast] = await Promise.all([
      owmFetch(`${BASE_URL}/weather?${params}`),
      owmFetch(`${BASE_URL}/forecast?${params}&cnt=40`),
    ]);
    return {
      current:  transformCurrent(current),
      forecast: transformForecast(forecast.list, current.timezone),
    };
  },

  /** Get city name autocomplete suggestions */
  async getCitySuggestions(query: string): Promise<CitySuggestion[]> {
    if (query.trim().length < 2) return [];
    try {
      const url  = `${GEO_URL}/direct?q=${encodeURIComponent(query.trim())}&limit=6&appid=${API_KEY}`;
      const data = await owmFetch(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data as any[]).map((item: any) => ({
        name:        item.name,
        country:     item.country,
        state:       item.state || null,
        lat:         item.lat,
        lon:         item.lon,
        displayName: item.state
          ? `${item.name}, ${item.state}, ${item.country}`
          : `${item.name}, ${item.country}`,
      }));
    } catch {
      return [];
    }
  },
};
