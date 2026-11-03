import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './database';
import { env } from './env';

const PgSession = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: 'sessions',
    createTableIfMissing: false,
  }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'lms.sid',
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: env.SESSION_MAX_AGE,
  },
});
