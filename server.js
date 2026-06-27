import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GAPGPT_API_KEY,
  baseURL: process.env.GAPGPT_BASE_URL || "https://api.gapgpt.app/v1",
});

const SYSTEM_PROMPT = `
تو یک همراه حمایت روانی فارسی‌زبان هستی.
با لحن آرام، مهربان، همدلانه و طبیعی صحبت کن.

قوانین:
- فقط فارسی روان و طبیعی بنویس.
- نقش تو حمایت عاطفی و گفت‌وگوی همدلانه است، نه تشخیص پزشکی یا روان‌پزشکی.
- اگر کاربر گفت «می‌ترسم / مضطربم / حالم بده / گیجم / ناراحتم»، اول همان احساس را دقیق و همدلانه تأیید کن.
- کوتاه جواب بده: ۳ تا ۶ جمله.
- از نصیحت طولانی، لحن خشک، کلیشه‌ای یا قضاوت‌گر پرهیز کن.
- در صورت مناسب بودن فقط یک پیشنهاد کوچک و عملی برای آرام‌سازی بده.
- آخر پاسخ فقط یک سؤال کوتاه و ملایم بپرس.
- اگر نشانه خطر فوری، خودآسیبی، خودکشی یا آسیب به دیگران وجود داشت:
  بگو تنها نماند، با یک فرد مورد اعتماد تماس بگیرد، و فوراً با اورژانس یا ۱۲۳ تماس بگیرد.
- هیچ وقت ادعا نکن روانشناس واقعی یا درمانگر دارای مجوز هستی.
`;

app.post("/chat", async (req, res) => {
  try {
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
    ];

    for (const msg of req.body.messages) {
      let role = msg.role;

      if (role === "ai") {
        role = "assistant";
      }

      if (!["user", "assistant", "system"].includes(role)) {
        role = "user";
      }

      messages.push({
        role,
        content: msg.content,
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.3,
      max_tokens: 300,
    });

    res.json({
      reply: response.choices[0].message.content.trim(),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});