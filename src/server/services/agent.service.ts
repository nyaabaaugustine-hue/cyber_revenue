import { db } from '../../db/index.js';
import { agents, collections, visits, businesses } from '../../db/schema/index.js';
import { eq, desc, and, gte, sql } from 'drizzle-orm';
import { AppError } from '../middleware/error.middleware.js';

export const list = async () => db.select().from(agents).orderBy(desc(agents.performanceScore));

export const getById = async (id: string) => {
  const [agent] = await db.select().from(agents).where(eq(agents.id, id));
  if (!agent) throw new AppError('Agent not found', 404);
  return agent;
};

export const update = async (id: string, body: any) => {
  const [agent] = await db.update(agents).set(body).where(eq(agents.id, id)).returning();
  if (!agent) throw new AppError('Agent not found', 404);
  return agent;
};

export const updateLocation = async (userId: string, lat: number, lng: number) => {
  const [agent] = await db.update(agents)
    .set({ lastLat: String(lat), lastLng: String(lng), lastActiveAt: new Date(), status: 'online' })
    .where(eq(agents.userId, userId))
    .returning();
  if (!agent) throw new AppError('Agent profile not found', 404);
  return agent;
};

export const getAllLocations = async () => {
  return db.select({
    id: agents.id,
    userId: agents.userId,
    officerName: agents.officerName,
    officerId: agents.officerId,
    zone: agents.zone,
    status: agents.status,
    lastLat: agents.lastLat,
    lastLng: agents.lastLng,
    lastActiveAt: agents.lastActiveAt,
    todayCollections: agents.todayCollections,
    todayAmount: agents.todayAmount,
  }).from(agents).where(sql`${agents.lastLat} IS NOT NULL`);
};

export const getAgentDashboard = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [agent] = await db.select().from(agents).where(eq(agents.userId, userId));
  if (!agent) throw new AppError('Agent profile not found', 404);

  const todayCollections = await db.select({
    count: sql<number>`count(*)::int`,
    total: sql<string>`coalesce(sum(${collections.amount}), '0')`,
  }).from(collections).where(
    and(eq(collections.officerId, userId), gte(collections.collectionDate, today))
  );

  const todayVisits = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(visits).where(
    and(eq(visits.officerId, userId), gte(visits.date, today))
  );

  const assignedBusinesses = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(businesses).where(eq(businesses.zoneId, agent.zone || ''));

  return {
    agent,
    todayCollections: todayCollections[0]?.count || 0,
    todayRevenue: todayCollections[0]?.total || '0',
    todayVisits: todayVisits[0]?.count || 0,
    assignedBusinesses: assignedBusinesses[0]?.count || 0,
  };
};
