import { Request, Response, NextFunction } from 'express';
import * as businessService from '../services/business.service.js';
import { successResponse, paginatedResponse } from '../utils/response.utils.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, search, status, zoneId, categoryId } = req.query;
    const result = await businessService.list({
      page: Number(page), limit: Number(limit), search: search as string,
      status: status as string, zoneId: zoneId as string, categoryId: categoryId as string,
    });
    paginatedResponse(res, result.data, result.total, result.page, result.limit);
  } catch (e) { next(e); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const biz = await businessService.getById(String(req.params.id));
    successResponse(res, biz);
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const biz = await businessService.create(req.body);
    successResponse(res, biz, 'Business created', 201);
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const biz = await businessService.update(String(req.params.id), req.body);
    successResponse(res, biz, 'Business updated');
  } catch (e) { next(e); }
};

export const listZones = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await businessService.listZones()); } catch (e) { next(e); }
};
export const listCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await businessService.listCategories()); } catch (e) { next(e); }
};
export const getCollectionsByBusiness = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await businessService.getCollectionsByBusiness(String(req.params.id));
    successResponse(res, data);
  } catch (e) { next(e); }
};

export const listDistricts = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await businessService.listDistricts()); } catch (e) { next(e); }
};
