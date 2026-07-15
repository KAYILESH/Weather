import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, CloudRain } from 'lucide-react';
import { ForecastDay } from '../types/weather.types';
import { formatShortDay, getWeatherIconUrl, formatTemperature } from '../constants';

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: 'celsius' | 'fahrenheit';
  timezone?: number;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ day, index, unit, timezone = 0 }) => {
  const iconUrl = getWeatherIconUrl(day.weather.icon, '2x');
  const dayName = formatShortDay(day.dt, timezone);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1 + index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="glass-card p-5 flex flex-col items-center gap-3 cursor-default select-none min-w-[130px]"
      aria-label={`${dayName} forecast: ${day.description}, ${formatTemperature(day.tempMin, unit)} to ${formatTemperature(day.tempMax, unit)}`}
    >
      {/* Day Name */}
      <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">
        {dayName}
      </span>

      {/* Weather Icon */}
      <motion.div
        animate={{ rotate: [0, 3, -3, 0] }}
        transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={iconUrl}
          alt={day.description}
          className="w-14 h-14 object-contain drop-shadow-lg"
          loading="lazy"
        />
      </motion.div>

      {/* Description */}
      <span className="text-xs text-white/50 text-center leading-tight capitalize">
        {day.description}
      </span>

      {/* Temperature Range */}
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-blue-300">
          {formatTemperature(day.tempMin, unit).replace('°C', '°').replace('°F', '°')}
        </span>
        <span className="text-white/20 text-xs">/</span>
        <span className="text-orange-300">
          {formatTemperature(day.tempMax, unit).replace('°C', '°').replace('°F', '°')}
        </span>
      </div>

      {/* Stats Row */}
      <div className="w-full pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
        {/* Humidity */}
        <div className="flex items-center gap-1" title="Humidity">
          <Droplets size={11} className="text-blue-400" />
          <span>{day.humidity}%</span>
        </div>

        {/* Rain Chance */}
        <div className="flex items-center gap-1" title="Rain probability">
          <CloudRain size={11} className="text-indigo-400" />
          <span>{day.pop}%</span>
        </div>
      </div>

      {/* Rain Probability Bar */}
      {day.pop > 0 && (
        <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${day.pop}%` }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
            className={`h-full rounded-full ${
              day.pop > 70
                ? 'bg-blue-400'
                : day.pop > 40
                ? 'bg-indigo-400'
                : 'bg-violet-400'
            }`}
          />
        </div>
      )}
    </motion.div>
  );
};
