import { pgTable, text, timestamp, integer, decimal, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const dashboardMetrics = pgTable('dashboard_metrics', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  snapshotDate: timestamp('snapshot_date', { withTimezone: true }).notNull().defaultNow(),
  revenueToday: decimal('revenue_today', { precision: 12, scale: 2 }).notNull().default('0'),
  revenueYesterday: decimal('revenue_yesterday', { precision: 12, scale: 2 }).notNull().default('0'),
  revenueThisWeek: decimal('revenue_this_week', { precision: 12, scale: 2 }).notNull().default('0'),
  revenueLastWeek: decimal('revenue_last_week', { precision: 12, scale: 2 }).notNull().default('0'),
  revenueThisMonth: decimal('revenue_this_month', { precision: 12, scale: 2 }).notNull().default('0'),
  revenueLastMonth: decimal('revenue_last_month', { precision: 12, scale: 2 }).notNull().default('0'),
  revenueTarget: decimal('revenue_target', { precision: 12, scale: 2 }).notNull().default('0'),
  revenueTargetPercent: decimal('revenue_target_percent', { precision: 5, scale: 2 }).notNull().default('0'),
  collectionsToday: integer('collections_today').notNull().default(0),
  collectionsThisWeek: integer('collections_this_week').notNull().default(0),
  collectionsThisMonth: integer('collections_this_month').notNull().default(0),
  collectionsPending: integer('collections_pending').notNull().default(0),
  businessesTotal: integer('businesses_total').notNull().default(0),
  businessesActive: integer('businesses_active').notNull().default(0),
  businessesInactive: integer('businesses_inactive').notNull().default(0),
  businessesFlagged: integer('businesses_flagged').notNull().default(0),
  businessesPaid: integer('businesses_paid').notNull().default(0),
  businessesDue: integer('businesses_due').notNull().default(0),
  businessesOverdue: integer('businesses_overdue').notNull().default(0),
  agentsTotal: integer('agents_total').notNull().default(0),
  agentsActive: integer('agents_active').notNull().default(0),
  agentsInField: integer('agents_in_field').notNull().default(0),
  agentsOffline: integer('agents_offline').notNull().default(0),
  agentsAvgPerformance: decimal('agents_avg_performance', { precision: 5, scale: 2 }).notNull().default('0'),
});

export const revenueTrends = pgTable('revenue_trends', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  date: varchar('date', { length: 20 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull().default('0'),
  target: decimal('target', { precision: 12, scale: 2 }).notNull().default('0'),
}, (t) => [
  index('idx_trend_date').on(t.date),
]);

export const categoryBreakdowns = pgTable('category_breakdowns', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  category: varchar('category', { length: 255 }).notNull(),
  revenue: decimal('revenue', { precision: 12, scale: 2 }).notNull().default('0'),
  count: integer('count').notNull().default(0),
  percentage: decimal('percentage', { precision: 5, scale: 2 }).notNull().default('0'),
});

export const cashFlowEntries = pgTable('cash_flow_entries', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  date: timestamp('date', { withTimezone: true }).notNull(),
  inflows: decimal('inflows', { precision: 14, scale: 2 }).notNull().default('0'),
  outflows: decimal('outflows', { precision: 14, scale: 2 }).notNull().default('0'),
  netCashFlow: decimal('net_cash_flow', { precision: 14, scale: 2 }).notNull().default('0'),
  balance: decimal('balance', { precision: 14, scale: 2 }).notNull().default('0'),
});

export const financialSummaries = pgTable('financial_summaries', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  totalRevenue: decimal('total_revenue', { precision: 14, scale: 2 }).notNull().default('0'),
  totalCollections: decimal('total_collections', { precision: 14, scale: 2 }).notNull().default('0'),
  totalOutstanding: decimal('total_outstanding', { precision: 14, scale: 2 }).notNull().default('0'),
  collectionRate: decimal('collection_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  periodRevenue: decimal('period_revenue', { precision: 14, scale: 2 }).notNull().default('0'),
  previousPeriodRevenue: decimal('previous_period_revenue', { precision: 14, scale: 2 }).notNull().default('0'),
  revenueGrowth: decimal('revenue_growth', { precision: 5, scale: 2 }).notNull().default('0'),
  activeInvoices: integer('active_invoices').notNull().default(0),
  overdueInvoices: integer('overdue_invoices').notNull().default(0),
  pendingRemittances: integer('pending_remittances').notNull().default(0),
  pendingRemittanceAmount: decimal('pending_remittance_amount', { precision: 14, scale: 2 }).notNull().default('0'),
  snapshotDate: timestamp('snapshot_date', { withTimezone: true }).notNull().defaultNow(),
});
