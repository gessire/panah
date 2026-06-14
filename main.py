from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from openai import AsyncOpenAI  # استفاده از نسخه آسنکرون برای بهبود چشمگیر کارایی
import os

app = FastAPI(title="GapGPT Mental Support API")

# تنظیمات CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# خواندن کلید امنیتی و آدرس پایه از متغیرهای محیطی با مقدار پیش‌فرض شما
GAPGPT_API_KEY = os.getenv("GAPGPT_API_KEY", "sk-qcZPR3a7hyjsnHy73moPdbdY4D4W4GjbyNIqTrIzMY7K2HVh")
GAPGPT_BASE_URL = os.getenv("GAPGPT_BASE_URL", "https://api.gapgpt.app/v1")

# مقداردهی اولیه کلاینت آسنکرون GapGPT
client = AsyncOpenAI(
    base_url=GAPGPT_BASE_URL,
    api_key=GAPGPT_API_KEY
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

SYSTEM_PROMPT = """
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
"""

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # ساختن لیست پیام‌ها با تزریق پرامپت سیستمی
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        for msg in request.messages:
            role = msg.role
            # مپ کردن نقش هوش مصنوعی فرانت‌اند به ساختار استاندارد assistant
            if role == "ai":
                role = "assistant"
            if role not in ("user", "assistant", "system"):
                role = "user"

            messages.append({
                "role": role,
                "content": msg.content
            })

        # ارسال درخواست غیرهمزمان به مدل اختصاصی GapGPT
        response = await client.chat.completions.create(
            model="gpt-4o",  # استفاده از شناسه مدل اختصاصی GapGPT
            messages=messages,
            temperature=0.3,
            max_tokens=300
        )

        ai_reply = response.choices[0].message.content.strip()
        return {"reply": ai_reply}

    except Exception as e:
        print("ERROR:", e)
        raise e


if __name__ == "__main__":
    import uvicorn
    # توصیه می‌شود در محیط توسعه پارامتر reload=True فعال باشد
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
