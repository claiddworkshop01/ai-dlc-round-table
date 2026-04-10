import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const equipments = pgTable("equipments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  defaultReturnDays: integer("default_return_days").notNull().default(7),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id")
    .notNull()
    .references(() => equipments.id),
  borrowerName: text("borrower_name").notNull(),
  borrowedAt: timestamp("borrowed_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  dueDate: timestamp("due_date", { mode: "date", withTimezone: true }).notNull(),
  returnedAt: timestamp("returned_at", { mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});
