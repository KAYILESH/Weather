import createApp from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  try {
    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`
╔══════════════════════════════════════════╗
║       Weather API Server Started         ║
╠══════════════════════════════════════════╣
║  Environment : ${env.NODE_ENV.padEnd(25)}║
║  Port        : ${String(env.PORT).padEnd(25)}║
║  API Endpoint: http://localhost:${env.PORT}/api ║
╚══════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(() => {
        logger.info('Server closed. Exiting process.');
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Promise Rejection:', reason);
    });

    // Uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error.message);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
