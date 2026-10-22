import { sql } from "drizzle-orm";
import { index, jsonb, numeric, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable(
  "orders",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    customerId: varchar("customer_id").notNull(),
    customerName: varchar("customer_name", { length: 255 }),
    providerId: varchar("provider_id").notNull(),
    providerName: varchar("provider_name", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull().default("cash_on_delivery"),
    deliveryAddress: text("delivery_address"),
    notes: text("notes"),
    items: jsonb("items").notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_orders_customer_id").on(table.customerId),
    index("idx_orders_provider_id").on(table.providerId),
  ],
);

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
