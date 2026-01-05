import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('User', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    username: text('username').notNull().unique(),
    email: text('email'),
    name: text('name'),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull().$onUpdate(() => new Date()),
}, (table) => ({
    usernameIdx: index('User_username_idx').on(table.username),
}));

export const moments = sqliteTable('Moment', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    theme: text('theme').notNull().default("dark-void"),
    atmosphere: text('atmosphere').notNull().default("void"),
    typography: text('typography').notNull().default("serif"),
    message: text('message'),
    targetYear: integer('targetYear').notNull().default(2026),
    isPublic: integer('isPublic', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull().$onUpdate(() => new Date()),
    userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => ({
    userIdIdx: index('Moment_userId_idx').on(table.userId),
}));

import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
    moments: many(moments),
}));

export const momentsRelations = relations(moments, ({ one }) => ({
    user: one(users, {
        fields: [moments.userId],
        references: [users.id],
    }),
}));
