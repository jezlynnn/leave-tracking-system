import { PublicUser } from './index';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    userRole: string;
  }
}

declare module 'express' {
  interface Request {
    currentUser?: PublicUser;
  }
}
