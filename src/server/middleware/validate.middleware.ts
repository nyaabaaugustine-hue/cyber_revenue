import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware.js';

type ValidationRule = {
  field: string;
  type: 'string' | 'number' | 'email' | 'boolean' | 'object';
  required?: boolean;
  min?: number;
  max?: number;
};

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    for (const rule of rules) {
      const value = req.body[rule.field];
      if (rule.required && (value === undefined || value === null || value === '')) {
        throw new AppError(`${rule.field} is required`, 400);
      }
      if (value !== undefined && value !== null && value !== '') {
        if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          throw new AppError(`${rule.field} must be a valid email`, 400);
        }
        if (rule.type === 'number' && (isNaN(Number(value)) || typeof value !== 'number')) {
          throw new AppError(`${rule.field} must be a number`, 400);
        }
        if (rule.type === 'string' && typeof value !== 'string') {
          throw new AppError(`${rule.field} must be a string`, 400);
        }
        if (rule.min !== undefined && typeof value === 'string' && value.length < rule.min) {
          throw new AppError(`${rule.field} must be at least ${rule.min} characters`, 400);
        }
        if (rule.max !== undefined && typeof value === 'string' && value.length > rule.max) {
          throw new AppError(`${rule.field} must be at most ${rule.max} characters`, 400);
        }
      }
    }
    next();
  };
};
