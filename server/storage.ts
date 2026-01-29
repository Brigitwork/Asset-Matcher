import { type Signup, type InsertSignup, type TelegramPayload, signups } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createSignup(data: TelegramPayload): Promise<Signup>;
  getSignups(): Promise<Signup[]>;
}

export class DatabaseStorage implements IStorage {
  async createSignup(data: TelegramPayload): Promise<Signup> {
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
    return await db.select().from(signups);
  }
}

export const storage = new DatabaseStorage();
