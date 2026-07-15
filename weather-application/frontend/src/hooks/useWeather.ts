import { useCallback, useRef } from 'react';
import { useWeatherStore } from '../store/weatherStore';
import { SEARCH_DEBOUNCE_MS } from '../constants';

export const useWeather = () => {
  const {
    weather,
    forecast,
    loading,
    error,
    lastSearchedCity,
    recentSearches,
    unit,
    theme,
    fetchWeather,
    fetchWeatherByCoords,
    setUnit,
    toggleTheme,
    clearError,
    clearWeather,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useWeatherStore();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  const debouncedSearch = useCallback(
    (city: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        if (city.trim()) {
          fetchWeather(city);
        }
      }, SEARCH_DEBOUNCE_MS);
    },
    [fetchWeather]
  );

  // Immediate search
  const searchCity = useCallback(
    (city: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (city.trim()) {
        fetchWeather(city);
      }
    },
    [fetchWeather]
  );

  // Geolocation search
  const searchByLocation = useCallback(() => {
    if (!navigator.geolocation) {
      useWeatherStore.setState({ error: 'Geolocation is not supported by your browser.' });
      return;
    }

    useWeatherStore.setState({ loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (err) => {
        let message = 'Unable to get your location.';
        if (err.code === err.PERMISSION_DENIED) {
          message = 'Location access denied. Please enable location permissions.';
        } else if (err.code === err.TIMEOUT) {
          message = 'Location request timed out. Please try again.';
        }
        useWeatherStore.setState({ loading: false, error: message });
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchWeatherByCoords]);

  const toggleUnit = useCallback(() => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  }, [unit, setUnit]);

  return {
    // State
    weather,
    forecast,
    loading,
    error,
    lastSearchedCity,
    recentSearches,
    unit,
    theme,

    // Actions
    searchCity,
    debouncedSearch,
    searchByLocation,
    toggleUnit,
    toggleTheme,
    clearError,
    clearWeather,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
};
