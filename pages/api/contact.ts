import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ServerApiVersion } from "mongodb";

type ContactData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

type ResponseData = { success: boolean; message: string };

type GlobalWithMongo = typeof globalThis & {
  portfolioMongo?: Promise<MongoClient>;
};

const globalWithMongo = globalThis as GlobalWithMongo;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value.trim().replace(/[<>]/g, "").slice(0, maxLength)
    : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function getMongoClient(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) throw new Error("MongoDB is not configured");
  if (!globalWithMongo.portfolioMongo) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: ServerApiVersion.v1,
    });
    globalWithMongo.portfolioMongo = client.connect().then(() => client);
  }
  return globalWithMongo.portfolioMongo;
}

async function notifyTelegram(data: ContactData): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram is not configured");

  const text = `📩 New Portfolio Contact\n\n👤 Name: ${escapeHtml(data.name)}\n📧 Email: ${escapeHtml(data.email)}\n📝 Subject: ${escapeHtml(data.subject || "No subject")}\n\n💬 Message:\n${escapeHtml(data.message)}\n\n🕒 Time: ${escapeHtml(data.createdAt)}`;
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    },
  );
  const result = await response.json();
  if (!response.ok || !result.ok)
    throw new Error(result.description || "Telegram failed");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed." });
  }

  try {
    const name = clean(req.body?.name, 100);
    const email = clean(req.body?.email, 150);
    const subject = clean(req.body?.subject, 200);
    const message = clean(req.body?.message, 2000);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const data: ContactData = {
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };
    const client = await getMongoClient();
    await client
      .db(process.env.MONGODB_DB || "portfolio")
      .collection("messages")
      .insertOne(data);

    try {
      await notifyTelegram(data);
    } catch (error) {
      console.error("Telegram notification failed:", error);
    }

    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact submission failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now.",
    });
  }
}
