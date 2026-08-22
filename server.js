require("dotenv").config();

const express = require("express");
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;
const inMemoryMessages = [];

let mongoClient;
let messagesCollection;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(value, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>]/g, "").slice(0, maxLength);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    console.log(
      "MONGODB_URI not set. Running in demo mode with in-memory storage.",
    );
    return;
  }

  mongoClient = new MongoClient(process.env.MONGODB_URI, {
    serverApi: ServerApiVersion.v1,
  });

  await mongoClient.connect();
  const db = mongoClient.db(process.env.MONGODB_DB || "portfolio");
  messagesCollection = db.collection("messages");
  console.log("MongoDB connected successfully.");
}

connectMongo().catch((error) => {
  console.error("MongoDB connection failed:", error.message);
});

async function sendTelegramNotification({
  name,
  email,
  subject,
  message,
  timestamp,
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return { sent: false, reason: "Telegram not configured" };
  }

  const text = `📩 New Portfolio Contact\n\n👤 Name: ${escapeHtml(name)}\n📧 Email: ${escapeHtml(email)}\n📝 Subject: ${escapeHtml(subject || "No subject")}\n\n💬 Message:\n${escapeHtml(message)}\n\n🕒 Time: ${escapeHtml(timestamp)}`;

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.description || "Telegram message sending failed");
  }

  return { sent: true };
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const allowedOrigins = new Set([
    "http://localhost:8000",
    "http://127.0.0.1:8000",
  ]);
  const requestOrigin = req.headers.origin;

  if (allowedOrigins.has(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    mongodb: Boolean(messagesCollection),
    telegram: Boolean(
      process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
    ),
    message: "Portfolio API is running",
  });
});

app.post("/api/contact", async (req, res) => {
  try {
    const payload = req.body || {};
    const name = sanitizeText(payload.name, 100);
    const email = sanitizeText(payload.email, 150);
    const subject = sanitizeText(payload.subject || "", 200);
    const message = sanitizeText(payload.message, 2000);

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

    const timestamp = new Date().toISOString();
    const record = {
      name,
      email,
      subject,
      message,
      createdAt: timestamp,
    };

    if (messagesCollection) {
      await messagesCollection.insertOne(record);
    } else {
      inMemoryMessages.unshift(record);
    }

    try {
      await sendTelegramNotification({ ...record, timestamp });
    } catch (telegramError) {
      console.error("Telegram notification failed:", telegramError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact submission failed:", error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while sending your message. Please try again later.",
    });
  }
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "index.html"));
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Portfolio app running at http://localhost:${PORT}`);
  });
}

module.exports = app;
