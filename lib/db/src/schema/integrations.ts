import { boolean, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const integrationCredentialsTable = pgTable("integration_credentials", {
  id: serial("id").primaryKey(),
  providerId: varchar("provider_id", { length: 80 }).notNull().unique(),
  ciphertext: text("ciphertext").notNull(),
  iv: varchar("iv", { length: 32 }).notNull(),
  authTag: varchar("auth_tag", { length: 32 }).notNull(),
  senderEmail: varchar("sender_email", { length: 320 }),
  enabled: boolean("enabled").notNull().default(false),
  connectionStatus: varchar("connection_status", { length: 24 }).notNull().default("unverified"),
  lastTestedAt: timestamp("last_tested_at", { withTimezone: true }),
  updatedBy: varchar("updated_by", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
