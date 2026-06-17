import { Request, Response, NextFunction } from 'express';
import * as collectionService from '../services/collection.service.js';
import { successResponse, paginatedResponse } from '../utils/response.utils.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, officerId, dateFrom, dateTo, search } = req.query;
    const result = await collectionService.list({
      page: Number(page), limit: Number(limit), officerId: officerId as string,
      dateFrom: dateFrom as string, dateTo: dateTo as string, search: search as string,
    });
    paginatedResponse(res, result.data, result.total, result.page, result.limit);
  } catch (e) { next(e); }
};

export const listMyCollections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 50, today } = req.query;
    const result = await collectionService.listByOfficer(req.user!.id, {
      page: Number(page), limit: Number(limit), today: today === 'true',
    });
    paginatedResponse(res, result.data, result.total, result.page, result.limit);
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const col = await collectionService.create({ ...req.body, officerId: req.user!.id });
    successResponse(res, col, 'Collection created', 201);
  } catch (e) { next(e); }
};

export const createVisit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const visit = await collectionService.createVisit({ ...req.body, officerId: req.user!.id });
    successResponse(res, visit, 'Visit recorded', 201);
  } catch (e) { next(e); }
};

export const getZoneBusinesses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { zoneId } = req.params;
    const { search } = req.query;
    successResponse(res, await collectionService.getZoneBusinesses(String(zoneId), search as string));
  } catch (e) { next(e); }
};

export const listVisits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, officerId } = req.query;
    const result = await collectionService.listVisits({ page: Number(page), limit: Number(limit), officerId: officerId as string });
    paginatedResponse(res, result.data, result.total, result.page, result.limit);
  } catch (e) { next(e); }
};

export const listDue = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await collectionService.listDue()); } catch (e) { next(e); }
};
export const listLevyBills = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await collectionService.listLevyBills()); } catch (e) { next(e); }
};
export const listArrears = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await collectionService.listArrears()); } catch (e) { next(e); }
};
