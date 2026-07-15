import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HomePage } from './pages/Home';
import { useWeatherStore } from './store/weatherStore';
import './index.css';

const App: React.FC = () => {
  const { theme } = useWeatherStore();

  // Apply theme class on mount and when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <HomePage />
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
