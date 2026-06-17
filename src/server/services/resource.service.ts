import { db } from '../../db/index.js';
import { users, invoices, remittances, assets, notifications, ledgerEntries, budgetLines } from '../../db/schema/index.js';
import { eq, desc, count } from 'drizzle-orm';
import { AppError } from '../middleware/error.middleware.js';

export const listUsers = async () => {
  const data = await db.select().from(users).orderBy(desc(users.createdAt));
  return data.map(({ passwordHash, ...u }) => u);
};

export const listInvoices = async () => db.select().from(invoices).orderBy(desc(invoices.createdAt));
export const listRemittances = async () => db.select().from(remittances).orderBy(desc(remittances.submittedAt));
export const updateRemittance = async (id: string, body: any) => {
  const [r] = await db.update(remittances).set(body).where(eq(remittances.id, id)).returning();
  if (!r) throw new AppError('Remittance not found', 404);
  return r;
};

export const listAssets = async () => db.select().from(assets).orderBy(desc(assets.assignedAt));

export const listNotifications = async (userId: string) =>
  db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));

export const markNotificationRead = async (id: string) => {
  const [n] = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
  if (!n) throw new AppError('Notification not found', 404);
  return n;
};

export const listLedgerEntries = async () => db.select().from(ledgerEntries).orderBy(desc(ledgerEntries.entryDate));
export const listBudgets = async () => db.select().from(budgetLines).orderBy(desc(budgetLines.fiscalYear));
