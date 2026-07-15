import React from 'react';
import { motion } from 'framer-motion';

const ShimmerBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

const WeatherCardSkeleton: React.FC = () => (
  <div className="glass-card-static p-8">
    <div className="flex items-start justify-between mb-6">
      <div className="space-y-2">
        <ShimmerBlock className="h-10 w-48 rounded-2xl" />
        <ShimmerBlock className="h-4 w-32 rounded-lg" />
      </div>
      <ShimmerBlock className="h-8 w-32 rounded-full" />
    </div>

    <div className="flex items-center justify-between mb-8">
      <div className="flex items-start gap-2">
        <ShimmerBlock className="h-32 w-40 rounded-2xl" />
      </div>
      <ShimmerBlock className="w-32 h-32 rounded-3xl" />
    </div>

    <div className="flex items-center gap-4 mb-8">
      <ShimmerBlock className="h-4 w-36 rounded-lg" />
      <ShimmerBlock className="h-4 w-28 rounded-lg" />
    </div>

    <div className="h-px bg-white/10 mb-6" />

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <ShimmerBlock className="h-3 w-16 rounded" />
          <ShimmerBlock className="h-7 w-20 rounded-lg" />
          <ShimmerBlock className="h-1 w-full rounded-full" />
        </div>
      ))}
    </div>

    <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-4">
      <ShimmerBlock className="h-12 flex-1 rounded-xl" />
      <ShimmerBlock className="h-12 flex-1 rounded-xl" />
    </div>
  </div>
);

const ForecastSkeleton: React.FC = () => (
  <div className="glass-card-static p-6">
    <ShimmerBlock className="h-5 w-36 rounded-lg mb-5" />
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 glass-card p-5 flex flex-col items-center gap-3 w-32">
          <ShimmerBlock className="h-4 w-16 rounded-lg" />
          <ShimmerBlock className="w-14 h-14 rounded-2xl" />
          <ShimmerBlock className="h-3 w-20 rounded" />
          <ShimmerBlock className="h-5 w-24 rounded-lg" />
          <ShimmerBlock className="h-4 w-full rounded-lg" />
          <ShimmerBlock className="h-1 w-full rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

const MetricGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="glass-card p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <ShimmerBlock className="h-3 w-20 rounded" />
          <ShimmerBlock className="w-8 h-8 rounded-xl" />
        </div>
        <ShimmerBlock className="h-9 w-28 rounded-xl" />
        <ShimmerBlock className="h-3 w-24 rounded" />
      </div>
    ))}
  </div>
);

interface LoadingSkeletonProps {
  type?: 'weather' | 'forecast' | 'metrics' | 'full';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'full' }) => {
  if (type === 'weather') return <WeatherCardSkeleton />;
  if (type === 'forecast') return <ForecastSkeleton />;
  if (type === 'metrics') return <MetricGridSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      aria-label="Loading weather data"
      aria-busy="true"
    >
      <WeatherCardSkeleton />
      <ForecastSkeleton />
      <MetricGridSkeleton />
    </motion.div>
  );
};
