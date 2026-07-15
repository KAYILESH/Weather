import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-2xl mx-auto"
      role="alert"
      aria-live="polite"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-5 flex items-start gap-4"
        style={{
          background: 'rgba(239, 68, 68, 0.08)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)',
        }}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />

        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
          <AlertTriangle size={18} className="text-red-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-300 mb-1">Something went wrong</h3>
          <p className="text-sm text-white/60 leading-relaxed">{message}</p>

          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-300 hover:text-red-200 transition-colors py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/15 border border-red-500/20"
              aria-label="Retry search"
            >
              <RefreshCw size={12} />
              Try again
            </motion.button>
          )}
        </div>

        {/* Dismiss */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1.5 text-white/30 hover:text-white/60 transition-colors rounded-lg hover:bg-white/5"
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};
