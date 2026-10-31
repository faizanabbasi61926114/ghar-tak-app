import { sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable(
  "bookings",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    customerId: varchar("customer_id").notNull(),
    customerName: varchar("customer_name", { length: 255 }),
    providerId: varchar("provider_id").notNull(),
    providerName: varchar("provider_name", { length: 255 }).notNull(),
    serviceId: varchar("service_id").notNull(),
    serviceName: varchar("service_name", { length: 255 }).notNull(),
    priceRange: varchar("price_range", { length: 100 }),
    bookingDate: timestamp("booking_date", { withTimezone: true }).notNull(),
    timeSlot: varchar("time_slot", { length: 50 }).notNull(),
    address: text("address").notNull(),
    notes: text("notes"),
    status: varchar("status", { length: 50 }).notNull().default("pending"), // pending | confirmed | completed | cancelled
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_bookings_customer_id").on(table.customerId),
    index("idx_bookings_provider_id").on(table.providerId),
  ],
);

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
