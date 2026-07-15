import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Eye, Gauge, Thermometer, Sunrise, Sunset } from 'lucide-react';
import { CurrentWeather } from '../types/weather.types';
import { formatTemperature, formatTime, getWindDirection, getWeatherIconUrl } from '../constants';

interface WeatherCardProps {
  weather: CurrentWeather;
  unit: 'celsius' | 'fahrenheit';
  onToggleUnit?: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, unit, onToggleUnit }) => {
  const iconUrl = getWeatherIconUrl(weather.weather.icon, '4x');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card-static p-8 relative overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Location & Date */}
      <motion.div variants={itemVariants} className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight" id="city-name">
            {weather.city}
          </h1>
          <p className="text-white/60 text-sm mt-1 font-medium tracking-wide uppercase">
            {weather.country} · {new Date((weather.dt + weather.timezone) * 1000).toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC'
            })}
          </p>
        </div>

        {/* Weather Condition Badge */}
        <div className="text-right">
          <span className="inline-block px-3 py-1.5 text-xs font-semibold text-white/80 bg-white/10 rounded-full border border-white/15 backdrop-blur-sm">
            {weather.description}
          </span>
        </div>
      </motion.div>

      {/* Main Temperature Display */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
        {/* Temperature */}
        <div className="flex items-start">
          <span
            className="temp-display text-white font-thin cursor-pointer select-none"
            onClick={onToggleUnit}
            title={`Click to switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
            aria-label={`Current temperature: ${formatTemperature(weather.temperature, unit)}. Click to toggle unit.`}
          >
            {unit === 'celsius' ? weather.temperature : Math.round((weather.temperature * 9) / 5 + 32)}
          </span>
          <span
            className="text-5xl font-extralight text-violet-300 mt-4 cursor-pointer select-none"
            onClick={onToggleUnit}
          >
            {unit === 'celsius' ? '°C' : '°F'}
          </span>
        </div>

        {/* Weather Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <img
            src={iconUrl}
            alt={weather.description}
            className="w-32 h-32 object-contain drop-shadow-2xl icon-glow"
            loading="eager"
          />
        </motion.div>
      </motion.div>

      {/* Feels Like & Min/Max */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2 text-white/60">
          <Thermometer size={14} className="text-violet-400" />
          <span className="text-sm">
            Feels like <span className="text-white/80 font-medium">{formatTemperature(weather.feelsLike, unit)}</span>
          </span>
        </div>
        <span className="text-white/20">·</span>
        <div className="text-sm text-white/60">
          <span className="text-blue-300 font-medium">↓ {formatTemperature(weather.tempMin, unit)}</span>
          <span className="mx-1 text-white/30">/</span>
          <span className="text-orange-300 font-medium">↑ {formatTemperature(weather.tempMax, unit)}</span>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div
        variants={itemVariants}
        className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6"
      />

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Humidity */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium uppercase tracking-wider">
            <Droplets size={12} className="text-blue-400" />
            Humidity
          </div>
          <span className="text-white font-semibold text-lg">{weather.humidity}%</span>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${weather.humidity}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-blue-400 rounded-full"
            />
          </div>
        </div>

        {/* Wind */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium uppercase tracking-wider">
            <Wind size={12} className="text-teal-400" />
            Wind
          </div>
          <span className="text-white font-semibold text-lg">{weather.windSpeed} <span className="text-sm font-normal text-white/60">km/h</span></span>
          <span className="text-xs text-white/40">{getWindDirection(weather.windDeg)}</span>
        </div>

        {/* Visibility */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium uppercase tracking-wider">
            <Eye size={12} className="text-purple-400" />
            Visibility
          </div>
          <span className="text-white font-semibold text-lg">{weather.visibility} <span className="text-sm font-normal text-white/60">km</span></span>
          <span className="text-xs text-white/40">{weather.visibility >= 10 ? 'Excellent' : weather.visibility >= 5 ? 'Good' : 'Moderate'}</span>
        </div>

        {/* Pressure */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium uppercase tracking-wider">
            <Gauge size={12} className="text-orange-400" />
            Pressure
          </div>
          <span className="text-white font-semibold text-lg">{weather.pressure} <span className="text-sm font-normal text-white/60">hPa</span></span>
          <span className="text-xs text-white/40">{weather.pressure > 1013 ? 'High' : weather.pressure < 1000 ? 'Low' : 'Normal'}</span>
        </div>
      </motion.div>

      {/* Sunrise / Sunset */}
      <motion.div
        variants={itemVariants}
        className="mt-4 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/15"
      >
        <div className="flex items-center gap-3 flex-1">
          <Sunrise size={22} className="text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Sunrise</p>
            <p className="text-white font-semibold">{formatTime(weather.sunrise, weather.timezone)}</p>
          </div>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="text-right">
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Sunset</p>
            <p className="text-white font-semibold">{formatTime(weather.sunset, weather.timezone)}</p>
          </div>
          <Sunset size={22} className="text-orange-400 flex-shrink-0" />
        </div>
      </motion.div>
    </motion.div>
  );
};
