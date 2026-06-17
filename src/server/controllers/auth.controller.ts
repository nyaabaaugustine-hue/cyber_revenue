import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { successResponse } from '../utils/response.utils.js';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    successResponse(res, result, 'Login successful');
  } catch (e) { next(e); }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getProfile(req.user!.id);
    successResponse(res, user);
  } catch (e) { next(e); }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    successResponse(res, result);
  } catch (e) { next(e); }
};
