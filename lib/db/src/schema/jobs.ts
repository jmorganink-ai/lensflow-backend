import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobsTable = pgTable("jobs", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  listingUrl: text("listing_url").notNull(),
  listingTitle: text("listing_title"),
  status: text("status").notNull().default("queued"),
  videoUrl: text("video_url"),
  voiceId: text("voice_id"),
  voiceName: text("voice_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({ createdAt: true, updatedAt: true });
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobsTable.$inferSelect;

export const pipelineStepsTable = pgTable("pipeline_steps", {
  id: text("id").primaryKey(),
  jobId: text("job_id").notNull().references(() => jobsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull().default("pending"),
  order: integer("order").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  errorMessage: text("error_message"),
  outputUrl: text("output_url"),
  outputData: text("output_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPipelineStepSchema = createInsertSchema(pipelineStepsTable).omit({ createdAt: true });
export type InsertPipelineStep = z.infer<typeof insertPipelineStepSchema>;
export type PipelineStep = typeof pipelineStepsTable.$inferSelect;
