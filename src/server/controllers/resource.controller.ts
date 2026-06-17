import { Request, Response, NextFunction } from 'express';
import * as resourceService from '../services/resource.service.js';
import { successResponse } from '../utils/response.utils.js';

export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await resourceService.listUsers()); } catch (e) { next(e); }
};
export const listInvoices = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await resourceService.listInvoices()); } catch (e) { next(e); }
};
export const listRemittances = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await resourceService.listRemittances()); } catch (e) { next(e); }
};
export const updateRemittance = async (req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await resourceService.updateRemittance(String(req.params.id), req.body)); } catch (e) { next(e); }
};
export const listAssets = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await resourceService.listAssets()); } catch (e) { next(e); }
};
export const listNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await resourceService.listNotifications(req.user!.id)); } catch (e) { next(e); }
};
export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await resourceService.markNotificationRead(String(req.params.id))); } catch (e) { next(e); }
};
export const listLedgerEntries = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await resourceService.listLedgerEntries()); } catch (e) { next(e); }
};
export const listBudgets = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await resourceService.listBudgets()); } catch (e) { next(e); }
};
