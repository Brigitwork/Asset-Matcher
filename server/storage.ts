import { type Signup, type InsertSignup, type TelegramPayload, signups } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createSignup(data: TelegramPayload): Promise<Signup | null>;
  getSignups(): Promise<Signup[]>;
}

export class DatabaseStorage implements IStorage {
  async createSignup(data: TelegramPayload): Promise<Signup | null> {
    if (!db) {
      console.log("Database not configured, skipping signup storage");
      return null;
    }
    const [signup] = await db
      .insert(signups)
      .values({
        event: data.event,
        email: data.payload.email,
        location: data.payload.location,
        commitment: data.payload.commitment,
        payload: data.payload, // Store raw payload too just in case
      })
      .returning();
    return signup;
  }

  async getSignups(): Promise<Signup[]> {
    if (!db) {
      console.log("Database not configured, returning empty signups");
      return [];
    }
    return await db.select().from(signups);
  }
}

export const storage = new DatabaseStorage();
