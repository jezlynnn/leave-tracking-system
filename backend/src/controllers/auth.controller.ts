import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../types';

const authService = new AuthService();

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(['admin', 'manager', 'employee']).optional(),
});

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = loginSchema.parse(req.body);
      const ipAddress = req.ip;

      const user = await authService.login(input, ipAddress);

      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.status(200).json({
        success: true,
        data: user,
        message: 'Login successful',
      } satisfies ApiResponse);
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = registerSchema.parse(req.body);
      const user = await authService.register(input);

      res.status(201).json({
        success: true,
        data: user,
        message: 'Account created successfully',
      } satisfies ApiResponse);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.session.userId;
      if (userId) {
        await authService.logout(userId, req.ip);
      }

      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie('lms.sid');
        res.status(200).json({
          success: true,
          message: 'Logged out successfully',
        } satisfies ApiResponse);
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: req.currentUser,
      } satisfies ApiResponse);
    } catch (err) {
      next(err);
    }
  }
}
