import { db } from '../../db/index.js';
import { collections, visits, dueCollections, levyBills, arrearsRecords, businesses } from '../../db/schema/index.js';
import { eq, and, desc, count, ilike, sql, gte } from 'drizzle-orm';
import { AppError } from '../middleware/error.middleware.js';

export const list = async ({ page = 1, limit = 20, officerId, dateFrom, dateTo, search }: {
  page?: number; limit?: number; officerId?: string; dateFrom?: string; dateTo?: string; search?: string;
}) => {
  const filters = [];
  if (officerId) filters.push(eq(collections.officerId, officerId));
  if (search) filters.push(ilike(collections.businessName, `%${search}%`));
  const where = filters.length ? and(...filters) : undefined;
  const [{ total }] = await db.select({ total: count() }).from(collections).where(where);
  const data = await db.select().from(collections).where(where).orderBy(desc(collections.collectionDate)).limit(limit).offset((page - 1) * limit);
  return { data, total, page, limit };
};

export const listByOfficer = async (officerId: string, { page = 1, limit = 50, today = false }: { page?: number; limit?: number; today?: boolean }) => {
  const filters = [eq(collections.officerId, officerId)];
  if (today) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    filters.push(gte(collections.collectionDate, todayStart));
  }
  const where = and(...filters);
  const [{ total }] = await db.select({ total: count() }).from(collections).where(where);
  const data = await db.select().from(collections).where(where).orderBy(desc(collections.collectionDate)).limit(limit).offset((page - 1) * limit);
  return { data, total, page, limit };
};

export const create = async (body: any) => {
  const receiptNumber = `RCP-${Date.now().toString(36).toUpperCase()}`;
  const [col] = await db.insert(collections).values({ ...body, receiptNumber }).returning();

  // Auto-update business levy status and outstanding
  if (body.businessId) {
    const amt = parseFloat(body.amount || '0');
    const [biz] = await db.select().from(businesses).where(eq(businesses.id, body.businessId));
    if (biz) {
      const newOutstanding = Math.max(0, Number(biz.totalOutstanding) - amt)
      const newLevyStatus = newOutstanding <= 0 ? 'paid' : 'partial'
      await db.update(businesses).set({
        totalOutstanding: String(newOutstanding),
        levyStatus: newLevyStatus,
        lastAmountPaid: String(amt),
        lastPaymentDate: new Date().toISOString(),
        lastVisitedAt: new Date().toISOString(),
      }).where(eq(businesses.id, body.businessId))
    }
  }

  return col;
};

export const listVisits = async ({ page = 1, limit = 20, officerId }: { page?: number; limit?: number; officerId?: string }) => {
  const filters = officerId ? [eq(visits.officerId, officerId)] : [];
  const where = filters.length ? and(...filters) : undefined;
  const [{ total }] = await db.select({ total: count() }).from(visits).where(where);
  const data = await db.select().from(visits).where(where).orderBy(desc(visits.date)).limit(limit).offset((page - 1) * limit);
  return { data, total, page, limit };
};

export const createVisit = async (body: any) => {
  const [visit] = await db.insert(visits).values(body).returning();
  return visit;
};

export const getZoneBusinesses = async (zoneId: string, search?: string) => {
  const filters = [eq(businesses.zoneId, zoneId)];
  if (search) filters.push(ilike(businesses.name, `%${search}%`));
  return db.select().from(businesses).where(and(...filters)).orderBy(businesses.name);
};

export const listDue = async () => db.select().from(dueCollections).orderBy(desc(dueCollections.daysOverdue));
export const listLevyBills = async () => db.select().from(levyBills).orderBy(desc(levyBills.dueDate));
export const listArrears = async () => db.select().from(arrearsRecords).orderBy(desc(arrearsRecords.totalArrears));
