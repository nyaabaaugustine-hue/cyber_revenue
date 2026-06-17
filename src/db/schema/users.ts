import { pgTable, text, timestamp, boolean, varchar, decimal, integer, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { userRoles } from './enums';
import { districts } from './districts';
import { zones } from './zones';

export const users = pgTable('users', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  role: varchar('role', { length: 50, enum: userRoles }).notNull().default('field_officer'),
  districtId: text('district_id').references(() => districts.id),
  districtName: varchar('district_name', { length: 255 }),
  zoneId: text('zone_id').references(() => zones.id),
  zoneName: varchar('zone_name', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  isActive: boolean('is_active').notNull().default(true),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('idx_users_role').on(t.role),
  index('idx_users_district').on(t.districtId),
]);

export const agents = pgTable('agents', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  userId: text('user_id').notNull().unique().references(() => users.id),
  officerId: varchar('officer_id', { length: 50 }).notNull().unique(),
  officerName: varchar('officer_name', { length: 255 }).notNull(),
  officerPhone: varchar('officer_phone', { length: 50 }),
  zone: varchar('zone', { length: 255 }),
  isActive: boolean('is_active').notNull().default(true),
  status: varchar('status', { length: 50 }).notNull().default('offline'),
  lastLat: decimal('last_lat', { precision: 10, scale: 7 }),
  lastLng: decimal('last_lng', { precision: 10, scale: 7 }),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }).defaultNow(),
  todayCollections: integer('today_collections').notNull().default(0),
  todayAmount: decimal('today_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  todayVisits: integer('today_visits').notNull().default(0),
  weekCollections: integer('week_collections').notNull().default(0),
  weekAmount: decimal('week_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  monthCollections: integer('month_collections').notNull().default(0),
  monthAmount: decimal('month_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  targetAmount: decimal('target_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  targetPercent: decimal('target_percent', { precision: 5, scale: 2 }).notNull().default('0'),
  performanceScore: integer('performance_score').notNull().default(0),
  businessesVisited: integer('businesses_visited').notNull().default(0),
  avgCollectionTime: integer('avg_collection_time').notNull().default(0),
  avatarUrl: varchar('avatar_url', { length: 500 }),
}, (t) => [
  index('idx_agents_status').on(t.status),
  index('idx_agents_zone').on(t.zone),
]);
