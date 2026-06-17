import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service.js';
import { successResponse } from '../utils/response.utils.js';

export const dashboard = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await analyticsService.getDashboardMetrics()); } catch (e) { next(e); }
};
export const revenueTrends = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await analyticsService.getRevenueTrends()); } catch (e) { next(e); }
};
export const categoryBreakdown = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await analyticsService.getCategoryBreakdown()); } catch (e) { next(e); }
};
export const financialSummary = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await analyticsService.getFinancialSummary()); } catch (e) { next(e); }
};
export const cashFlow = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await analyticsService.getCashFlow()); } catch (e) { next(e); }
};
export const activity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    successResponse(res, await analyticsService.getActivityLog({ page: Number(page), limit: Number(limit) }));
  } catch (e) { next(e); }
};
