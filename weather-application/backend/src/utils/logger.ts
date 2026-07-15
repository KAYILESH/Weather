import { env } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const colors = {
  info: '\x1b[36m',   // Cyan
  warn: '\x1b[33m',   // Yellow
  error: '\x1b[31m',  // Red
  debug: '\x1b[35m',  // Magenta
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const formatTimestamp = (): string => {
  return new Date().toISOString();
};

const log = (level: LogLevel, message: string, meta?: unknown): void => {
  const timestamp = formatTimestamp();
  const color = colors[level];
  const isDev = env.NODE_ENV === 'development';

  const prefix = isDev
    ? `${color}${colors.bold}[${level.toUpperCase()}]${colors.reset} ${colors.bold}[${timestamp}]${colors.reset}`
    : `[${level.toUpperCase()}] [${timestamp}]`;

  const metaString = meta
    ? `\n${isDev ? colors.debug : ''}${JSON.stringify(meta, null, 2)}${isDev ? colors.reset : ''}`
    : '';

  console[level === 'debug' ? 'log' : level](`${prefix} ${message}${metaString}`);
};

export const logger = {
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
  debug: (message: string, meta?: unknown) => {
    if (env.NODE_ENV === 'development') {
      log('debug', message, meta);
    }
  },
};
