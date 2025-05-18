import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  size: integer("size").notNull(),
  mime: text("mime").notNull(),
  telegramFileId: text("telegram_file_id").notNull(),
  md5Hash: text("md5_hash").notNull().unique(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  downloads: integer("downloads").default(0).notNull(),
  source: text("source").notNull(), // "url" or "direct"
  originalUrl: text("original_url"),
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  downloads: true,
  uploadedAt: true,
});

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

// URL upload schema
export const urlUploadSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type UrlUpload = z.infer<typeof urlUploadSchema>;
