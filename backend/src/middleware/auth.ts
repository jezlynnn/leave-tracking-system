import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from './errorHandler';
import { UserRole } from '../types';

const userRepo = new UserRepository();

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.session.userId;
    if (!userId) {
      throw new AppError(401, 'Authentication required');
    }

    const user = await userRepo.findById(userId);
    if (!user || !user.isActive) {
      req.session.destroy(() => {});
      throw new AppError(401, 'Session invalid or user deactivated');
    }

    req.currentUser = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.currentUser) {
      return next(new AppError(401, 'Authentication required'));
    }
    if (!roles.includes(req.currentUser.role as UserRole)) {
      return next(new AppError(403, 'Insufficient permissions'));
    }
    next();
  };
}
