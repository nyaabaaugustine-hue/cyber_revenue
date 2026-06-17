import { Response } from 'express';

export const successResponse = (res: Response, data: unknown, message = 'Success', statusCode = 200): void => {
  res.status(statusCode).json({ success: true, message, data });
};

export const errorResponse = (res: Response, message: string, statusCode = 400, errors?: unknown): void => {
  res.status(statusCode).json({ success: false, message, errors });
};

export const paginatedResponse = (res: Response, data: unknown[], total: number, page: number, limit: number, message = 'Success'): void => {
  res.json({
    success: true,
    message,
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};
