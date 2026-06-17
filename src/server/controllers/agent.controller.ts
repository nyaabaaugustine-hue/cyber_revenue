import { Request, Response, NextFunction } from 'express';
import * as agentService from '../services/agent.service.js';
import { successResponse } from '../utils/response.utils.js';

export const list = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await agentService.list()); } catch (e) { next(e); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await agentService.getById(String(req.params.id))); } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await agentService.update(String(req.params.id), req.body)); } catch (e) { next(e); }
};

export const updateLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng } = req.body;
    successResponse(res, await agentService.updateLocation(req.user!.id, lat, lng), 'Location updated');
  } catch (e) { next(e); }
};

export const getAllLocations = async (_req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await agentService.getAllLocations()); } catch (e) { next(e); }
};

export const dashboard = async (req: Request, res: Response, next: NextFunction) => {
  try { successResponse(res, await agentService.getAgentDashboard(req.user!.id)); } catch (e) { next(e); }
};
