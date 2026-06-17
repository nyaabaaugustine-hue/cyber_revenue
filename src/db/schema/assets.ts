import { pgTable, text, timestamp, boolean, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { assetTypes, assetConditions } from './enums';
import { users } from './users';

export const assets = pgTable('assets', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  type: varchar('type', { length: 50, enum: assetTypes }).notNull(),
  serialNumber: varchar('serial_number', { length: 100 }).notNull().unique(),
  assignedTo: text('assigned_to').references(() => users.id),
  assignedToName: varchar('assigned_to_name', { length: 255 }),
  assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow(),
  returnedAt: timestamp('returned_at', { withTimezone: true }),
  condition: varchar('condition', { length: 50, enum: assetConditions }).notNull().default('good'),
  notes: text('notes'),
}, (t) => [
  index('idx_asset_type').on(t.type),
  index('idx_asset_assigned').on(t.assignedTo),
]);
