import { db } from '../../db/index.js';
import { dashboardMetrics, revenueTrends, categoryBreakdowns, financialSummaries, cashFlowEntries, activityLog } from '../../db/schema/index.js';
import { desc } from 'drizzle-orm';

export const getDashboardMetrics = async () => {
  const [metrics] = await db.select().from(dashboardMetrics).orderBy(desc(dashboardMetrics.snapshotDate)).limit(1);
  return metrics || null;
};

export const getRevenueTrends = async () => db.select().from(revenueTrends).orderBy(revenueTrends.date);
export const getCategoryBreakdown = async () => db.select().from(categoryBreakdowns);
export const getFinancialSummary = async () => {
  const [summary] = await db.select().from(financialSummaries).orderBy(desc(financialSummaries.snapshotDate)).limit(1);
  return summary || null;
};
export const getCashFlow = async () => db.select().from(cashFlowEntries).orderBy(cashFlowEntries.date);
export const getActivityLog = async ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => {
  const data = await db.select().from(activityLog).orderBy(desc(activityLog.timestamp)).limit(limit).offset((page - 1) * limit);
  return data;
};
