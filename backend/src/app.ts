import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { sessionMiddleware } from './config/session';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFound } from './middleware/errorHandler';
import { logger } from './utils/logger';
import routes from './routes';

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: env.NODE_ENV === 'production',
  })
);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(sessionMiddleware);

app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

app.use('/api', apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
