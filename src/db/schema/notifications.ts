import { pgTable, text, timestamp, boolean, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { notificationTypes, activitySeverities } from './enums';
import { users } from './users';

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  userId: text('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  type: varchar('type', { length: 50, enum: notificationTypes }).notNull().default('info'),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  actionUrl: varchar('action_url', { length: 500 }),
}, (t) => [
  index('idx_notif_user').on(t.userId),
  index('idx_notif_read').on(t.isRead),
]);

export const activityLog = pgTable('activity_log', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  actorId: text('actor_id').references(() => users.id),
  actorName: varchar('actor_name', { length: 255 }),
  actorRole: varchar('actor_role', { length: 50 }),
  action: varchar('action', { length: 255 }).notNull(),
  resourceType: varchar('resource_type', { length: 100 }),
  resourceId: varchar('resource_id', { length: 100 }),
  resourceName: varchar('resource_name', { length: 255 }),
  details: text('details'),
  severity: varchar('severity', { length: 50, enum: activitySeverities }).notNull().default('info'),
}, (t) => [
  index('idx_activity_actor').on(t.actorId),
  index('idx_activity_resource').on(t.resourceType),
  index('idx_activity_timestamp').on(t.timestamp),
]);
