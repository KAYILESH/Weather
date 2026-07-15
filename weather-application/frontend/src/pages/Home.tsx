import React, { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Droplets, Wind, Eye, Gauge, Thermometer, CloudRain
} from 'lucide-react';

// Components
import { AnimatedBackground } from '../components/AnimatedBackground';
import { SearchBar } from '../components/SearchBar';
import { WeatherCard } from '../components/WeatherCard';
import { ForecastCard } from '../components/ForecastCard';
import { MetricCard } from '../components/MetricCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ThemeToggle } from '../components/ThemeToggle';
import { TopCities } from '../components/TopCities';

// Hooks & Store
import { useWeather } from '../hooks/useWeather';

// Constants
import { getWindDirection, getVisibilityLabel, formatTemperature } from '../constants';

export const HomePage: React.FC = () => {
  const {
    weather,
    forecast,
    loading,
    error,
    lastSearchedCity,
    unit,
    theme,
    searchCity,
    searchByLocation,
    toggleUnit,
    toggleTheme,
    clearError,
  } = useWeather();

  // Auto-load last searched city on mount
  useEffect(() => {
    if (lastSearchedCity && !weather) {
      searchCity(lastSearchedCity);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (city: string) => {
      clearError();
      searchCity(city);
    },
    [searchCity, clearError]
  );

  const handleRetry = useCallback(() => {
    if (lastSearchedCity) {
      clearError();
      searchCity(lastSearchedCity);
    }
  }, [lastSearchedCity, searchCity, clearError]);

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <AnimatedBackground weatherMain={weather?.weather.main} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4">
          <Header />

          {/* Controls: Unit Toggle + Theme Toggle */}
          <div className="flex items-center gap-2 pt-4">
            {/* Temperature Unit Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleUnit}
              className="px-3 py-2 rounded-xl text-sm font-semibold transition-all border bg-white/25 dark:bg-white/10 border-slate-350/40 dark:border-white/15 text-slate-800 dark:text-white hover:bg-white/35 dark:hover:bg-white/20 backdrop-blur-md shadow-sm"
              aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
            >
              °{unit === 'celsius' ? 'F' : 'C'}
            </motion.button>

            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>

        {/* Search Section */}
        <section
          className="px-4 sm:px-6 py-8"
          aria-label="City search"
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-8"
          >
            {!weather && !loading && (
              <>
                <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 tracking-tight text-shadow">
                  <span className="text-gradient">Atmos</span>
                </h1>
                <p className="text-white/50 text-base sm:text-lg">
                  Real-time weather data for any city in the world
                </p>
              </>
            )}
          </motion.div>

          <SearchBar
            onSearch={handleSearch}
            loading={loading}
            onLocationSearch={searchByLocation}
          />
        </section>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <div className="px-4 sm:px-6 mb-4">
              <ErrorState
                message={error}
                onRetry={lastSearchedCity ? handleRetry : undefined}
                onDismiss={clearError}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 pb-4" aria-label="Weather information">
          <AnimatePresence mode="wait">
            {/* Loading State */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl mx-auto"
              >
                <LoadingSkeleton type="full" />
              </motion.div>
            )}

            {/* Empty State */}
             {!loading && !weather && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <EmptyState />
                <TopCities onSearch={handleSearch} unit={unit} />
              </motion.div>
            )}

            {/* Weather Data */}
            {!loading && weather && (
              <motion.div
                key="weather"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl mx-auto space-y-6"
              >
                {/* Current Weather Card */}
                <WeatherCard
                  weather={weather}
                  unit={unit}
                  onToggleUnit={toggleUnit}
                />

                {/* Metric Cards Grid */}
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4"
                  >
                    Detailed Conditions
                  </motion.h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                    <MetricCard
                      icon={<Droplets size={18} />}
                      label="Humidity"
                      value={weather.humidity}
                      unit="%"
                      subtitle={weather.humidity > 70 ? 'High moisture' : weather.humidity < 30 ? 'Low moisture' : 'Comfortable'}
                      color="blue"
                    />
                    <MetricCard
                      icon={<Wind size={18} />}
                      label="Wind Speed"
                      value={weather.windSpeed}
                      unit="km/h"
                      subtitle={`${getWindDirection(weather.windDeg)} · ${
                        weather.windGust ? `Gusts: ${weather.windGust} km/h` : 'No gusts'
                      }`}
                      color="cyan"
                    />
                    <MetricCard
                      icon={<Eye size={18} />}
                      label="Visibility"
                      value={weather.visibility}
                      unit="km"
                      subtitle={getVisibilityLabel(weather.visibility)}
                      color="purple"
                    />
                    <MetricCard
                      icon={<Gauge size={18} />}
                      label="Pressure"
                      value={weather.pressure}
                      unit="hPa"
                      subtitle={
                        weather.pressure > 1013
                          ? 'Above normal'
                          : weather.pressure < 1000
                          ? 'Below normal'
                          : 'Normal'
                      }
                      color="orange"
                    />
                    <MetricCard
                      icon={<Thermometer size={18} />}
                      label="Feels Like"
                      value={formatTemperature(weather.feelsLike, unit)}
                      subtitle={
                        weather.feelsLike < weather.temperature - 2
                          ? 'Feels colder'
                          : weather.feelsLike > weather.temperature + 2
                          ? 'Feels warmer'
                          : 'Feels accurate'
                      }
                      color="red"
                    />
                    <MetricCard
                      icon={<CloudRain size={18} />}
                      label="Cloud Cover"
                      value={weather.clouds}
                      unit="%"
                      subtitle={
                        weather.clouds < 20
                          ? 'Clear skies'
                          : weather.clouds < 50
                          ? 'Partly cloudy'
                          : weather.clouds < 80
                          ? 'Mostly cloudy'
                          : 'Overcast'
                      }
                      color="green"
                    />
                  </div>
                </div>

                {/* 5-Day Forecast */}
                {forecast.length > 0 && (
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4"
                    >
                      5-Day Forecast
                    </motion.h2>

                    <div className="glass-card-static p-6">
                      <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                        style={{ scrollbarWidth: 'thin' }}>
                        {forecast.map((day, i) => (
                          <div key={day.date} className="flex-shrink-0">
                            <ForecastCard
                              day={day}
                              index={i}
                              unit={unit}
                              timezone={weather.timezone}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Hourly Forecast for first day */}
                {forecast.length > 0 && forecast[0].hourly.length > 0 && (
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4"
                    >
                      Hourly · {new Date((forecast[0].dt + weather.timezone) * 1000).toLocaleDateString('en-US', {
                        weekday: 'long', timeZone: 'UTC'
                      })}
                    </motion.h2>

                    <div className="glass-card-static p-6">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {forecast[0].hourly.map((hour, i) => (
                          <motion.div
                            key={hour.dt}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors min-w-[72px]"
                          >
                            <span className="text-xs text-white/50 font-medium">{hour.time}</span>
                            <img
                              src={`https://openweathermap.org/img/wn/${hour.weather.icon}.png`}
                              alt={hour.weather.description}
                              className="w-8 h-8"
                              loading="lazy"
                            />
                            <span className="text-sm font-semibold text-white">
                              {unit === 'celsius' ? `${hour.temp}°` : `${Math.round(hour.temp * 9/5 + 32)}°`}
                            </span>
                            {hour.pop > 0 && (
                              <span className="text-xs text-blue-300">{hour.pop}%</span>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
};
