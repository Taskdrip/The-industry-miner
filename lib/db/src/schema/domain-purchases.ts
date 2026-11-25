import { sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./auth";
import { ordersTable } from "./orders";
import { websitesTable } from "./websites";

export const domainPurchasesTable = pgTable(
  "domain_purchases",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => ordersTable.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    websiteId: integer("website_id").references(() => websitesTable.id, {
      onDelete: "set null",
    }),
    domainName: varchar("domain_name", { length: 253 }).notNull(),
    registrarPriceCents: integer("registrar_price_cents").notNull(),
    registrarCurrency: varchar("registrar_currency", { length: 8 }).notNull(),
    amountKobo: integer("amount_kobo").notNull(),
    renewalPriceCents: integer("renewal_price_cents"),
    renewalAmountKobo: integer("renewal_amount_kobo"),
    status: varchar("status", { length: 32 })
      .notNull()
      .default("awaiting_payment"),
    statusMessage: varchar("status_message", { length: 320 }),
    contactCiphertext: text("contact_ciphertext"),
    contactIv: varchar("contact_iv", { length: 32 }),
    contactAuthTag: varchar("contact_auth_tag", { length: 32 }),
    registrarOrderId: varchar("registrar_order_id", { length: 120 }),
    registeredAt: timestamp("registered_at", { withTimezone: true }),
    expiresOn: date("expires_on", { mode: "string" }),
    refundReference: varchar("refund_reference", { length: 120 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("domain_purchases_user_id_idx").on(table.userId),
    index("domain_purchases_order_id_idx").on(table.orderId),
    uniqueIndex("domain_purchases_active_domain_idx")
      .on(table.domainName)
      .where(
        sql`${table.status} in ('awaiting_payment', 'registering', 'pending_confirmation', 'registered', 'refund_pending')`,
      ),
  ],
);

export type DomainPurchaseRow = typeof domainPurchasesTable.$inferSelect;
