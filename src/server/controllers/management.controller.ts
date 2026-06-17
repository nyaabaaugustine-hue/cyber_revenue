import { Request, Response, NextFunction } from 'express';
import * as managementService from '../services/management.service.js';
import { successResponse } from '../utils/response.utils.js';

export const listAnomalies = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await managementService.listAnomalies()); } catch (e) { next(e); }
};
export const resolveAnomaly = async (req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await managementService.resolveAnomaly(req.params.id, req.user!.id)); } catch (e) { next(e); }
};
export const listDisputes = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await managementService.listDisputes()); } catch (e) { next(e); }
};
export const updateDispute = async (req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await managementService.updateDispute(req.params.id, req.body)); } catch (e) { next(e); }
};
export const listComplianceChecks = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await managementService.listComplianceChecks()); } catch (e) { next(e); }
};
export const listReconciliation = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await managementService.listReconciliation()); } catch (e) { next(e); }
};
export const listCommissions = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await managementService.listCommissions()); } catch (e) { next(e); }
};
export const listAlerts = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await managementService.listAlerts()); } catch (e) { next(e); }
};
