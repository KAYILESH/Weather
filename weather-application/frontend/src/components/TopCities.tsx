import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { weatherApi } from '../services/weatherApi';
import { CurrentWeather } from '../types/weather.types';
import { formatTemperature, getWeatherIconUrl } from '../constants';

interface TopCitiesProps {
  onSearch: (city: string) => void;
  unit: 'celsius' | 'fahrenheit';
}

const CITIES = ['Chennai', 'Madurai', 'Coimbatore'];

export const TopCities: React.FC<TopCitiesProps> = ({ onSearch, unit }) => {
  const [data, setData] = useState<CurrentWeather[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchTopCities = async () => {
      try {
        const promises = CITIES.map((city) => weatherApi.getWeatherByCity(city));
        const results = await Promise.all(promises);
        
        if (active) {
          setData(results.map(res => res.current));
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load top cities weather data:', err);
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchTopCities();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <Loader2 className="animate-spin text-violet-400 mb-2" size={24} />
        <span className="text-sm text-slate-500 dark:text-white/40">Loading regional weather...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-white/45 mb-4 text-center">
        Popular Locations
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.map((cityWeather, index) => {
          const iconUrl = getWeatherIconUrl(cityWeather.weather.icon, '2x');
          
          return (
            <motion.div
              key={cityWeather.city}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSearch(cityWeather.city)}
              className="glass-card cursor-pointer p-5 flex items-center justify-between gap-4"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-bold text-slate-800 dark:text-white truncate">
                  {cityWeather.city}
                </span>
                <span className="text-xs text-slate-500 dark:text-white/50 truncate capitalize">
                  {cityWeather.weather.description}
                </span>
                <span className="text-xs text-slate-500 dark:text-white/40 mt-1">
                  Humidity: {cityWeather.humidity}%
                </span>
              </div>

              <div className="flex flex-col items-end flex-shrink-0">
                <img
                  src={iconUrl}
                  alt={cityWeather.weather.main}
                  className="w-12 h-12 -my-2"
                  loading="lazy"
                />
                <span className="text-2xl font-semibold text-slate-800 dark:text-white mt-1">
                  {formatTemperature(cityWeather.temperature, unit)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
