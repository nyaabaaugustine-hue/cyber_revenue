import { pgTable, text, timestamp, boolean, integer, decimal, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { districts } from './districts';
import { users } from './users';

export const zones = pgTable('zones', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  name: varchar('name', { length: 255 }).notNull(),
  districtId: text('district_id').notNull().references(() => districts.id),
  supervisorId: text('supervisor_id').references(() => users.id),
  businessCount: integer('business_count').notNull().default(0),
  revenue: decimal('revenue', { precision: 12, scale: 2 }).notNull().default('0'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('idx_zones_district').on(t.districtId),
]);
