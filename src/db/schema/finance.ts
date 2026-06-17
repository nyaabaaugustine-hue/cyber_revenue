import { pgTable, text, timestamp, boolean, integer, decimal, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { invoiceStatuses, remittanceStatuses, accountTypes, referenceTypes, reconciliationStatuses } from './enums';
import { businesses } from './businesses';
import { users } from './users';

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  businessName: varchar('business_name', { length: 255 }),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  amountPaid: decimal('amount_paid', { precision: 12, scale: 2 }).notNull().default('0'),
  balanceDue: decimal('balance_due', { precision: 12, scale: 2 }).notNull().default('0'),
  issueDate: timestamp('issue_date', { withTimezone: true }).notNull().defaultNow(),
  dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
  period: varchar('period', { length: 50 }),
  status: varchar('status', { length: 50, enum: invoiceStatuses }).notNull().default('draft'),
  items: jsonb('items').default([]).$type<{ description: string; quantity: number; unitPrice: number; amount: number }[]>(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('idx_inv_business').on(t.businessId),
  index('idx_inv_status').on(t.status),
  index('idx_inv_due').on(t.dueDate),
]);

export const remittances = pgTable('remittances', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  remittanceNumber: varchar('remittance_number', { length: 50 }).notNull().unique(),
  officerId: text('officer_id').notNull().references(() => users.id),
  officerName: varchar('officer_name', { length: 255 }),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  cashAmount: decimal('cash_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  mobileMoneyAmount: decimal('mobile_money_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  posAmount: decimal('pos_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  collectionCount: integer('collection_count').notNull().default(0),
  status: varchar('status', { length: 50, enum: remittanceStatuses }).notNull().default('pending'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  verifiedBy: text('verified_by').references(() => users.id),
  notes: text('notes'),
}, (t) => [
  index('idx_remit_officer').on(t.officerId),
  index('idx_remit_status').on(t.status),
]);

export const ledgerEntries = pgTable('ledger_entries', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  transactionId: varchar('transaction_id', { length: 100 }).notNull(),
  accountCode: varchar('account_code', { length: 50 }).notNull(),
  accountName: varchar('account_name', { length: 255 }),
  description: text('description'),
  debit: decimal('debit', { precision: 12, scale: 2 }).notNull().default('0'),
  credit: decimal('credit', { precision: 12, scale: 2 }).notNull().default('0'),
  balance: decimal('balance', { precision: 12, scale: 2 }).notNull().default('0'),
  entryDate: timestamp('entry_date', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by').references(() => users.id),
  reference: varchar('reference', { length: 100 }),
  referenceType: varchar('reference_type', { length: 50, enum: referenceTypes }),
}, (t) => [
  index('idx_ledger_account').on(t.accountCode),
  index('idx_ledger_date').on(t.entryDate),
  index('idx_ledger_ref').on(t.reference),
]);

export const accountCodes = pgTable('account_codes', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50, enum: accountTypes }).notNull(),
  category: varchar('category', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
});

export const budgetLines = pgTable('budget_lines', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  code: varchar('code', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  allocated: decimal('allocated', { precision: 14, scale: 2 }).notNull().default('0'),
  spent: decimal('spent', { precision: 14, scale: 2 }).notNull().default('0'),
  remaining: decimal('remaining', { precision: 14, scale: 2 }).notNull().default('0'),
  fiscalYear: integer('fiscal_year').notNull(),
  category: varchar('category', { length: 100 }),
});

export const reconciliationEntries = pgTable('reconciliation_entries', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  depositDate: timestamp('deposit_date', { withTimezone: true }).notNull(),
  depositAmount: decimal('deposit_amount', { precision: 12, scale: 2 }).notNull(),
  depositRef: varchar('deposit_ref', { length: 100 }).notNull(),
  collectedAmount: decimal('collected_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  variance: decimal('variance', { precision: 12, scale: 2 }).notNull().default('0'),
  status: varchar('status', { length: 50, enum: reconciliationStatuses }).notNull().default('unmatched'),
  matchingEntries: integer('matching_entries').notNull().default(0),
  notes: text('notes'),
}, (t) => [
  index('idx_recon_status').on(t.status),
  index('idx_recon_date').on(t.depositDate),
]);
