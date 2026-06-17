import { db } from '../../db/index.js';
import { anomalies, disputes, complianceChecks, reconciliationEntries, commissions, alerts } from '../../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import { AppError } from '../middleware/error.middleware.js';

export const listAnomalies = async () => db.select().from(anomalies).orderBy(desc(anomalies.createdAt));
export const resolveAnomaly = async (id: string, resolvedBy: string) => {
  const [a] = await db.update(anomalies).set({ isResolved: true, resolvedBy, resolvedAt: new Date() }).where(eq(anomalies.id, id)).returning();
  if (!a) throw new AppError('Anomaly not found', 404);
  return a;
};

export const listDisputes = async () => db.select().from(disputes).orderBy(desc(disputes.createdAt));
export const updateDispute = async (id: string, body: any) => {
  const [d] = await db.update(disputes).set(body).where(eq(disputes.id, id)).returning();
  if (!d) throw new AppError('Dispute not found', 404);
  return d;
};

export const listComplianceChecks = async () => db.select().from(complianceChecks).orderBy(desc(complianceChecks.checkedAt));
export const listReconciliation = async () => db.select().from(reconciliationEntries).orderBy(desc(reconciliationEntries.depositDate));
export const listCommissions = async () => db.select().from(commissions).orderBy(desc(commissions.period));
export const listAlerts = async () => db.select().from(alerts).orderBy(desc(alerts.timestamp));
