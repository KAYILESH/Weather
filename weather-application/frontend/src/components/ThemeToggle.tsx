import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../types/weather.types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="p-2.5 rounded-xl transition-all duration-200 border bg-white/25 dark:bg-white/10 border-slate-350/40 dark:border-white/15 hover:bg-white/35 dark:hover:bg-white/20 backdrop-blur-md shadow-sm"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {theme === 'dark' ? (
          <Moon size={16} className="text-violet-300" />
        ) : (
          <Sun size={16} className="text-yellow-400" />
        )}
      </motion.div>
    </motion.button>
  );
};
