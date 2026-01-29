import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const signups = pgTable("signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  location: text("location"),
  commitment: text("commitment"),
  event: text("event").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSignupSchema = createInsertSchema(signups).pick({
  email: true,
  location: true,
  commitment: true,
  event: true,
  payload: true,
});

export type InsertSignup = z.infer<typeof insertSignupSchema>;
export type Signup = typeof signups.$inferSelect;

export const telegramPayloadSchema = z.object({
  event: z.string(),
  payload: z.object({
    email: z.string().email(),
    location: z.string().optional(),
    commitment: z.string().optional(),
  }).passthrough(),
});

export type TelegramPayload = z.infer<typeof telegramPayloadSchema>;
