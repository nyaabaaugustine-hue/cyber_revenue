import { pgTable, text, timestamp, boolean, integer, decimal, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { anomalyTypes, anomalySeverities, disputeTypes, disputeStatuses, complianceStatuses, commissionStatuses, alertTypes } from './enums';
import { users } from './users';
import { businesses } from './businesses';

export const anomalies = pgTable('anomalies', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  type: varchar('type', { length: 100, enum: anomalyTypes }).notNull(),
  severity: varchar('severity', { length: 50, enum: anomalySeverities }).notNull().default('warning'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  officerId: text('officer_id').references(() => users.id),
  officerName: varchar('officer_name', { length: 255 }),
  businessId: text('business_id').references(() => businesses.id),
  businessName: varchar('business_name', { length: 255 }),
  collectionId: text('collection_id'),
  metadata: jsonb('metadata').default({}).$type<Record<string, string | number | null>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  detectedAt: timestamp('detected_at', { withTimezone: true }).notNull().defaultNow(),
  isResolved: boolean('is_resolved').notNull().default(false),
  resolvedBy: text('resolved_by').references(() => users.id),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
}, (t) => [
  index('idx_anomaly_type').on(t.type),
  index('idx_anomaly_severity').on(t.severity),
  index('idx_anomaly_resolved').on(t.isResolved),
]);

export const disputes = pgTable('disputes', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  businessId: text('business_id').notNull().references(() => businesses.id),
  businessName: varchar('business_name', { length: 255 }),
  collectorId: text('collector_id').references(() => users.id),
  collectorName: varchar('collector_name', { length: 255 }),
  type: varchar('type', { length: 50, enum: disputeTypes }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50, enum: disputeStatuses }).notNull().default('open'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  resolvedBy: text('resolved_by').references(() => users.id),
  resolution: text('resolution'),
}, (t) => [
  index('idx_disp_business').on(t.businessId),
  index('idx_disp_status').on(t.status),
]);

export const commissions = pgTable('commissions', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  officerId: text('officer_id').notNull().references(() => users.id),
  officerName: varchar('officer_name', { length: 255 }),
  period: varchar('period', { length: 50 }).notNull(),
  baseCollection: decimal('base_collection', { precision: 12, scale: 2 }).notNull().default('0'),
  bonusAmount: decimal('bonus_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  penaltyAmount: decimal('penalty_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  totalCommission: decimal('total_commission', { precision: 12, scale: 2 }).notNull().default('0'),
  status: varchar('status', { length: 50, enum: commissionStatuses }).notNull().default('pending'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  breakdown: jsonb('breakdown').default([]).$type<{ label: string; amount: number }[]>(),
}, (t) => [
  index('idx_comm_officer').on(t.officerId),
  index('idx_comm_period').on(t.period),
]);

export const complianceChecks = pgTable('compliance_checks', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  officerId: text('officer_id').notNull().references(() => users.id),
  officerName: varchar('officer_name', { length: 255 }),
  checkType: varchar('check_type', { length: 100 }).notNull(),
  status: varchar('status', { length: 50, enum: complianceStatuses }).notNull().default('pending'),
  checkedAt: timestamp('checked_at', { withTimezone: true }).defaultNow(),
  checkedBy: text('checked_by').references(() => users.id),
  details: text('details'),
  score: integer('score').default(0),
  requiredActions: jsonb('required_actions').default([]).$type<string[]>(),
}, (t) => [
  index('idx_comp_officer').on(t.officerId),
  index('idx_comp_status').on(t.status),
]);

export const alerts = pgTable('alerts', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  type: varchar('type', { length: 50, enum: alertTypes }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  isRead: boolean('is_read').notNull().default(false),
  priority: varchar('priority', { length: 20 }).notNull().default('medium'),
  actionRequired: boolean('action_required').notNull().default(false),
  userId: text('userId').references(() => users.id),
}, (t) => [
  index('idx_alert_type').on(t.type),
  index('idx_alert_read').on(t.isRead),
  index('idx_alert_priority').on(t.priority),
]);
