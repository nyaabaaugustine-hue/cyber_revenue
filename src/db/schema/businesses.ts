import { pgTable, text, timestamp, boolean, decimal, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { businessStatuses, levyStatuses } from './enums';
import { categories } from './categories';
import { districts } from './districts';
import { zones } from './zones';
import { users } from './users';

export const businesses = pgTable('businesses', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  businessId: varchar('business_id', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  categoryId: text('category_id').references(() => categories.id),
  categoryName: varchar('category_name', { length: 255 }),
  ownerName: varchar('owner_name', { length: 255 }).notNull(),
  ownerPhone: varchar('owner_phone', { length: 50 }),
  lat: decimal('lat', { precision: 10, scale: 7 }),
  lng: decimal('lng', { precision: 10, scale: 7 }),
  locationDescription: text('location_description'),
  districtId: text('district_id').references(() => districts.id),
  zoneId: text('zone_id').references(() => zones.id),
  zoneName: varchar('zone_name', { length: 255 }),
  photos: jsonb('photos').default([]).$type<string[]>(),
  status: varchar('status', { length: 50, enum: businessStatuses }).notNull().default('active'),
  levyStatus: varchar('levy_status', { length: 50, enum: levyStatuses }).notNull().default('due'),
  totalOutstanding: decimal('total_outstanding', { precision: 12, scale: 2 }).notNull().default('0'),
  lastAmountPaid: decimal('last_amount_paid', { precision: 12, scale: 2 }),
  lastPaymentDate: timestamp('last_payment_date', { withTimezone: true }),
  registeredBy: text('registered_by').references(() => users.id),
  registeredByName: varchar('registered_by_name', { length: 255 }),
  registeredAt: timestamp('registered_at', { withTimezone: true }).notNull().defaultNow(),
  lastVisitedAt: timestamp('last_visited_at', { withTimezone: true }),
  lastVisitedBy: text('last_visited_by').references(() => users.id),
  lastCollectionAmount: decimal('last_collection_amount', { precision: 12, scale: 2 }),
  totalCollected: decimal('total_collected', { precision: 12, scale: 2 }).notNull().default('0'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('idx_biz_status').on(t.status),
  index('idx_biz_zone').on(t.zoneId),
  index('idx_biz_district').on(t.districtId),
  index('idx_biz_category').on(t.categoryId),
  index('idx_biz_levy_status').on(t.levyStatus),
]);
