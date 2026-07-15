import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WeatherStore, TemperatureUnit, ThemeMode } from '../types/weather.types';
import { weatherApi } from '../services/weatherApi';
import { MAX_RECENT_SEARCHES } from '../constants';

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ──
      weather: null,
      forecast: [],
      loading: false,
      error: null,
      lastSearchedCity: '',
      recentSearches: [],
      unit: 'celsius' as TemperatureUnit,
      theme: 'dark' as ThemeMode,

      // ── Actions ──

      fetchWeather: async (city: string) => {
        if (!city.trim()) {
          set({ error: 'Please enter a city name.' });
          return;
        }

        set({ loading: true, error: null });

        try {
          const data = await weatherApi.getWeatherByCity(city);
          const currentCity = data.current.city;

          set({
            weather: data.current,
            forecast: data.forecast,
            loading: false,
            error: null,
            lastSearchedCity: currentCity,
          });

          // Add to recent searches
          get().addRecentSearch(currentCity);
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred. Please try again.';

          set({
            loading: false,
            error: message,
            weather: null,
            forecast: [],
          });
        }
      },

      fetchWeatherByCoords: async (lat: number, lon: number) => {
        set({ loading: true, error: null });

        try {
          const data = await weatherApi.getWeatherByCoords(lat, lon);
          const currentCity = data.current.city;

          set({
            weather: data.current,
            forecast: data.forecast,
            loading: false,
            error: null,
            lastSearchedCity: currentCity,
          });

          get().addRecentSearch(currentCity);
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to get weather for your location.';

          set({
            loading: false,
            error: message,
            weather: null,
            forecast: [],
          });
        }
      },

      setUnit: (unit: TemperatureUnit) => {
        set({ unit });
      },

      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'dark' ? 'light' : 'dark';
        set({ theme: next });

        // Apply theme class to document
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      clearError: () => set({ error: null }),

      clearWeather: () =>
        set({ weather: null, forecast: [], error: null }),

      addRecentSearch: (city: string) => {
        const { recentSearches } = get();
        const normalized = city.trim();
        const filtered = recentSearches.filter(
          (s) => s.toLowerCase() !== normalized.toLowerCase()
        );
        const updated = [normalized, ...filtered].slice(0, MAX_RECENT_SEARCHES);
        set({ recentSearches: updated });
      },

      removeRecentSearch: (city: string) => {
        const { recentSearches } = get();
        set({ recentSearches: recentSearches.filter((s) => s !== city) });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'weather-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lastSearchedCity: state.lastSearchedCity,
        recentSearches: state.recentSearches,
        unit: state.unit,
        theme: state.theme,
        // Don't persist weather data — always fetch fresh
      }),
    }
  )
);
