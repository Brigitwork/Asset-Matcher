import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.telegram.submit.path, async (req, res) => {
    try {
      const input = api.telegram.submit.input.parse(req.body);

      // Save to DB
      await storage.createSignup(input);

      // Send to Telegram if configured
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (token && chatId) {
        console.log(`Attempting to send Telegram message to chat ${chatId}`);
        const message = `
🚀 *New Founder Signup*
Event: ${input.event}
Email: ${input.payload.email}
Location: ${input.payload.location || 'N/A'}
Commitment: ${input.payload.commitment || 'N/A'}
        `.trim();

        try {
          const url = `https://api.telegram.org/bot${token}/sendMessage`;
          console.log(`Calling Telegram API: ${url}`);
          const tgRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'Markdown',
            }),
          });
          
          const responseText = await tgRes.text();
          if (!tgRes.ok) {
             console.error("Telegram API error:", responseText);
          } else {
             console.log("Telegram message sent successfully:", responseText);
          }
        } catch (tgError) {
          console.error("Telegram send failed (network/fetch error):", tgError);
        }
      } else {
        console.log("Telegram credentials missing. BOT_TOKEN exists:", !!token, "CHAT_ID exists:", !!chatId);
      }

      res.status(200).json({ success: true, message: "Signup recorded" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
        });
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return httpServer;
}
