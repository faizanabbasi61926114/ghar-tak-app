import { sql } from "drizzle-orm";
import { boolean, check, index, numeric, pgTable, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const providersTable = pgTable(
  "providers",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }).notNull().default("store"), // store | service | restaurant
    description: text("description"),
    address: varchar("address", { length: 500 }),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    avatarUrl: text("avatar_url"),
    coverUrl: text("cover_url"),
    isOpen: boolean("is_open").notNull().default(true),
    openingHours: varchar("opening_hours", { length: 100 }),
    // Old free text ("5 km"), replaced by delivery_radius_km and no longer read or written.
    // Kept until every database has been through backfill-delivery-radius.
    deliveryRadius: varchar("delivery_radius", { length: 50 }),
    deliveryRadiusKm: numeric("delivery_radius_km", { precision: 4, scale: 1 }),
    lat: numeric("lat", { precision: 10, scale: 7 }),
    lng: numeric("lng", { precision: 10, scale: 7 }),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
    reviewCount: integer("review_count").notNull().default(0),
    planId: varchar("plan_id", { length: 50 }),
    category: varchar("category", { length: 100 }),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_providers_user_id").on(table.userId),
    // "Near me" first narrows to a box around the customer, which this index answers.
    index("idx_providers_lat_lng").on(table.lat, table.lng),
    // The API checks these too; here they also hold for rows written by hand or by a seed.
    // A radius outside 0.5–50 km (or NaN, which Postgres sorts above every number) would
    // otherwise list a shop to customers anywhere.
    check("providers_lat_range", sql`${table.lat} IS NULL OR ${table.lat} BETWEEN -90 AND 90`),
    check("providers_lng_range", sql`${table.lng} IS NULL OR ${table.lng} BETWEEN -180 AND 180`),
    check("providers_pin_complete", sql`(${table.lat} IS NULL) = (${table.lng} IS NULL)`),
    check(
      "providers_radius_range",
      sql`${table.deliveryRadiusKm} IS NULL OR ${table.deliveryRadiusKm} BETWEEN 0.5 AND 50`,
    ),
  ],
);

export const insertProviderSchema = createInsertSchema(providersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providersTable.$inferSelect;
