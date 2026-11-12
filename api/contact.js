const MAX = { name: 100, email: 150, subject: 150, message: 2000 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Қийматни матнга айлантириб, бўшлиқларни олиб, узунликни чеклаш
const clean = (value, max) => String(value || "").trim().slice(0, max);

const safeParse = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return {};
  }
};

module.exports = async (req, res) => {
  // Фақат POST сўровлар қабул қилинади
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};

  // Honeypot: одам кўрмайдиган майдонни бот тўлдирган бўлса, жим ўтказиб юборамиз
  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const subject = clean(body.subject, MAX.subject);
  const message = clean(body.message, MAX.message);

  // Сервер томонда ҳам текшириш (браузер текширувига ишониб бўлмайди)
  if (
    name.length < 2 ||
    !emailPattern.test(email) ||
    subject.length < 3 ||
    message.length < 10
  ) {
    return res.status(400).json({ ok: false, error: "Invalid data" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram environment variables are missing");
    return res.status(500).json({ ok: false, error: "Server is not configured" });
  }

  const text = [
    "📩 New message from portfolio",
    "",
    `👤 Name: ${name}`,
    `📧 Email: ${email}`,
    `📌 Subject: ${subject}`,
    "",
    "💬 Message:",
    message,
  ].join("\n");

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      }
    );

    if (!telegramResponse.ok) {
      console.error("Telegram API error, status:", telegramResponse.status);
      return res.status(502).json({ ok: false, error: "Telegram error" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Telegram request failed");
    return res.status(502).json({ ok: false, error: "Telegram request failed" });
  }
};