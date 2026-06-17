import { pgTable, text, timestamp, boolean, varchar, index } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const districts = pgTable('districts', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  region: varchar('region', { length: 255 }).notNull().default('Ashanti'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
