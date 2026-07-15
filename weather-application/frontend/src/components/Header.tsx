import React from 'react';
import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';
import { APP_NAME } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="relative z-10 py-6 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center gap-3"
      >
        {/* Logo Icon */}
        <div className="relative">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8))',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
            }}
          >
            <Cloud size={20} className="text-white" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-transparent"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          />
        </div>

        {/* Brand Name */}
        <div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">{APP_NAME}</span>
          <span className="hidden sm:block text-xs font-medium -mt-0.5 text-slate-500 dark:text-white/40">
            Real-time weather worldwide
          </span>
        </div>
      </motion.div>
    </header>
  );
};
