import 'dotenv/config';
import app from './app';
import { env } from './config/env';
import { testConnection } from './config/database';
import { logger } from './utils/logger';

async function bootstrap(): Promise<void> {
  await testConnection();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err: Error) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});
