import { db } from '../../db/index.js';
import { businesses, categories, zones, districts } from '../../db/schema/index.js';
import { eq, ilike, and, desc, count, sql } from 'drizzle-orm';
import { AppError } from '../middleware/error.middleware.js';

export const list = async ({ page = 1, limit = 20, search, status, zoneId, categoryId }: {
  page?: number; limit?: number; search?: string; status?: string; zoneId?: string; categoryId?: string;
}) => {
  const filters = [];
  if (search) filters.push(ilike(businesses.name, `%${search}%`));
  if (status) filters.push(eq(businesses.status, status as any));
  if (zoneId) filters.push(eq(businesses.zoneId, zoneId));
  if (categoryId) filters.push(eq(businesses.categoryId, categoryId));
  const where = filters.length ? and(...filters) : undefined;
  const [{ total }] = await db.select({ total: count() }).from(businesses).where(where);
  const data = await db.select().from(businesses).where(where).orderBy(desc(businesses.createdAt)).limit(limit).offset((page - 1) * limit);
  return { data, total, page, limit };
};

export const getById = async (id: string) => {
  const [biz] = await db.select().from(businesses).where(eq(businesses.id, id));
  if (!biz) throw new AppError('Business not found', 404);
  return biz;
};

export const create = async (body: any) => {
  const [biz] = await db.insert(businesses).values(body).returning();
  return biz;
};

export const update = async (id: string, body: any) => {
  const [biz] = await db.update(businesses).set({ ...body, updatedAt: new Date() }).where(eq(businesses.id, id)).returning();
  if (!biz) throw new AppError('Business not found', 404);
  return biz;
};

export const listZones = async () => db.select().from(zones);
export const listCategories = async () => db.select().from(categories);
export const listDistricts = async () => db.select().from(districts);
