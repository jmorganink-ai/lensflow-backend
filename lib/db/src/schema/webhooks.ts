import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const webhooksTable = pgTable("webhooks", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  events: text("events").array().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  secret: text("secret"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWebhookSchema = createInsertSchema(webhooksTable).omit({ createdAt: true });
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type Webhook = typeof webhooksTable.$inferSelect;
