import React from 'react';
import { motion } from 'framer-motion';
import { MetricCardProps } from '../types/weather.types';

const COLOR_MAP = {
  purple: {
    icon: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    glow: 'shadow-violet-500/10',
  },
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/10',
  },
  green: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/10',
  },
  orange: {
    icon: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    glow: 'shadow-orange-500/10',
  },
  red: {
    icon: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    glow: 'shadow-red-500/10',
  },
  cyan: {
    icon: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    glow: 'shadow-cyan-500/10',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  unit,
  subtitle,
  color = 'purple',
}) => {
  const colors = COLOR_MAP[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`glass-card p-5 flex flex-col gap-3 border shadow-lg ${colors.glow}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2 rounded-xl ${colors.bg} border ${colors.border}`}>
          <div className={colors.icon}>{icon}</div>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-white tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-white/50">{unit}</span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <span className="text-xs text-white/40 font-medium">
          {subtitle}
        </span>
      )}
    </motion.div>
  );
};
