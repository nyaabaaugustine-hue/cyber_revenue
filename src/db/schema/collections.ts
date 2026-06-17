import { pgTable, text, timestamp, boolean, integer, decimal, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { paymentMethods, levyBillStatuses, arrearsStatuses } from './enums';
import { businesses } from './businesses';
import { users } from './users';

export const visits = pgTable('visits', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  businessId: text('business_id').notNull().references(() => businesses.id),
  officerId: text('officer_id').notNull().references(() => users.id),
  officerName: varchar('officer_name', { length: 255 }),
  date: timestamp('date', { withTimezone: true }).notNull().defaultNow(),
  status: varchar('status', { length: 50 }).notNull().default('completed'),
  notes: text('notes'),
  collectionAmount: decimal('collection_amount', { precision: 12, scale: 2 }),
  paymentMethod: varchar('payment_method', { length: 50, enum: paymentMethods }),
  gpsVerified: boolean('gps_verified').notNull().default(false),
  photos: jsonb('photos').default([]).$type<string[]>(),
  signature: text('signature'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('idx_visit_business').on(t.businessId),
  index('idx_visit_officer').on(t.officerId),
  index('idx_visit_date').on(t.date),
]);

export const collections = pgTable('collections', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  receiptNumber: varchar('receipt_number', { length: 50 }).notNull().unique(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  businessName: varchar('business_name', { length: 255 }),
  businessCode: varchar('business_code', { length: 50 }),
  visitId: text('visit_id').references(() => visits.id),
  officerId: text('officer_id').notNull().references(() => users.id),
  officerName: varchar('officer_name', { length: 255 }),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50, enum: paymentMethods }).notNull(),
  mobileMoneyRef: varchar('mobile_money_ref', { length: 100 }),
  collectionDate: timestamp('collection_date', { withTimezone: true }).notNull().defaultNow(),
  gpsVerified: boolean('gps_verified').notNull().default(false),
  collectionLat: decimal('collection_lat', { precision: 10, scale: 7 }),
  collectionLng: decimal('collection_lng', { precision: 10, scale: 7 }),
  isSynced: boolean('is_synced').notNull().default(true),
  receiptUrl: varchar('receipt_url', { length: 500 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('idx_col_business').on(t.businessId),
  index('idx_col_officer').on(t.officerId),
  index('idx_col_date').on(t.collectionDate),
  index('idx_col_method').on(t.paymentMethod),
  index('idx_col_synced').on(t.isSynced),
]);

export const levyBills = pgTable('levy_bills', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  businessId: text('business_id').notNull().references(() => businesses.id),
  businessName: varchar('business_name', { length: 255 }),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
  status: varchar('status', { length: 50, enum: levyBillStatuses }).notNull().default('pending'),
  period: varchar('period', { length: 50 }),
  generatedAt: timestamp('generated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('idx_levy_business').on(t.businessId),
  index('idx_levy_status').on(t.status),
  index('idx_levy_due').on(t.dueDate),
]);

export const dueCollections = pgTable('due_collections', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  businessId: text('business_id').notNull().references(() => businesses.id),
  businessName: varchar('business_name', { length: 255 }),
  amountDue: decimal('amount_due', { precision: 12, scale: 2 }).notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
  daysOverdue: integer('days_overdue').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('due'),
  zone: varchar('zone', { length: 255 }),
  ownerName: varchar('owner_name', { length: 255 }),
  ownerPhone: varchar('owner_phone', { length: 50 }),
}, (t) => [
  index('idx_due_status').on(t.status),
  index('idx_due_business').on(t.businessId),
]);

export const arrearsRecords = pgTable('arrears_records', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  businessId: text('business_id').notNull().references(() => businesses.id),
  businessName: varchar('business_name', { length: 255 }),
  totalArrears: decimal('total_arrears', { precision: 12, scale: 2 }).notNull().default('0'),
  oldestBillDate: timestamp('oldest_bill_date', { withTimezone: true }),
  status: varchar('status', { length: 50, enum: arrearsStatuses }).notNull().default('active'),
  lastPaymentDate: timestamp('last_payment_date', { withTimezone: true }),
  lastPaymentAmount: decimal('last_payment_amount', { precision: 12, scale: 2 }),
}, (t) => [
  index('idx_arr_business').on(t.businessId),
  index('idx_arr_status').on(t.status),
]);
