import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  console.error('[UNHANDLED ERROR]', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};
