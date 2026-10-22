import { sql } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { providersTable } from "./providers";

export const conversations = pgTable(
  "conversations",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    providerId: varchar("provider_id")
      .notNull()
      .references(() => providersTable.id, { onDelete: "cascade" }),
    userId: varchar("user_id").notNull(),
    userName: varchar("user_name", { length: 255 }),
    userEmail: varchar("user_email", { length: 255 }),
    userAvatar: text("user_avatar"),
    providerName: varchar("provider_name", { length: 255 }),
    providerAvatar: text("provider_avatar"),
    lastMessage: text("last_message"),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull().defaultNow(),
    unreadCountUser: integer("unread_count_user").notNull().default(0),
    unreadCountProvider: integer("unread_count_provider").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_conversations_provider_id").on(table.providerId),
    index("idx_conversations_user_id").on(table.userId),
    index("idx_conversations_last_message_at").on(table.lastMessageAt),
    uniqueIndex("idx_conversations_provider_user_unique").on(table.providerId, table.userId),
  ],
);

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
