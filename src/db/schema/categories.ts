import { pgTable, text, decimal, boolean, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  name: varchar('name', { length: 255 }).notNull(),
  rate: decimal('rate', { precision: 10, scale: 2 }).notNull().default('0'),
  icon: varchar('icon', { length: 10 }).default('📦'),
  isActive: boolean('is_active').notNull().default(true),
});
