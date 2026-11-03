import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const key = e.path.join('.');
      errors[key] = errors[key] ?? [];
      errors[key].push(e.message);
    });
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    } satisfies ApiResponse);
    return;
  }

  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    } satisfies ApiResponse);
    return;
  }

  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  } satisfies ApiResponse);
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  } satisfies ApiResponse);
}
