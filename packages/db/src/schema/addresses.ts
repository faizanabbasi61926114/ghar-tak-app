import { sql } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const addressesTable = pgTable(
  "addresses",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull(),
    label: varchar("label", { length: 50 }).notNull().default("Home"),
    line1: varchar("line1", { length: 500 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    instructions: text("instructions"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [index("idx_addresses_user_id").on(table.userId)],
);

export const insertAddressSchema = createInsertSchema(addressesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type Address = typeof addressesTable.$inferSelect;
