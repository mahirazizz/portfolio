import type { NextApiRequest, NextApiResponse } from "next";

type HealthResponse = {
  ok: boolean;
  mongodb: boolean;
  telegram: boolean;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      ok: false,
      mongodb: false,
      telegram: false,
      message: "Method not allowed.",
    });
  }

  return res.status(200).json({
    ok: true,
    mongodb: Boolean(process.env.MONGODB_URI),
    telegram: Boolean(
      process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
    ),
    message: "Portfolio API is running",
  });
}
