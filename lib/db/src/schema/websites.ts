import { index, jsonb, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const websitesTable = pgTable(
  "websites",
  {
    id: serial("id").primaryKey(),
    ownerId: varchar("owner_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    templateSlug: varchar("template_slug", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 60 }).notNull(),
    draft: jsonb("draft").notNull(),
    published: jsonb("published"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (table) => [index("websites_owner_id_idx").on(table.ownerId)],
);

export type WebsiteRow = typeof websitesTable.$inferSelect;
