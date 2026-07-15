import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sparkles } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
      aria-label="Empty state - search for a city"
    >
      {/* Illustration */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-10"
      >
        {/* Outer glow rings */}
        <div className="absolute inset-0 -m-8 rounded-full bg-violet-500/10 blur-2xl animate-pulse-slow" />
        <div className="absolute inset-0 -m-4 rounded-full bg-indigo-500/10 blur-xl" />

        {/* Icon container */}
        <div className="relative w-36 h-36 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
          <Cloud size={72} className="text-violet-300 drop-shadow-2xl" strokeWidth={1} />

          {/* Sparkle */}
          <motion.div
            className="absolute -top-3 -right-2"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles size={20} className="text-yellow-300" />
          </motion.div>
        </div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
          Discover the Weather
        </h2>
        <p className="text-white/50 text-base leading-relaxed max-w-sm">
          Search any city to see the latest weather updates, 5-day forecasts, and detailed conditions.
        </p>
      </motion.div>

      {/* Decorative dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 mt-10"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-violet-400/50"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      </motion.div>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap justify-center gap-2 mt-8"
      >
        {['Real-time Data', '5-Day Forecast', 'Hourly Updates', 'Global Coverage'].map((feature) => (
          <span
            key={feature}
            className="px-3 py-1.5 text-xs font-medium text-white/50 rounded-full border border-white/10 bg-white/5"
          >
            {feature}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
};
