import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send, Play, Pause, SkipBack, SkipForward, Volume2,
  Heart, Headphones, MessageCircle, Wind, Star,
  Phone, ChevronDown, RefreshCw, Moon, Sun,
  BookOpen, Shield, Music2,
} from "lucide-react";

type Message = { id: string; role: "user" | "ai"; content: string; time: string };
type TrackCategory = "music" | "podcast" | "meditation";
type Track = { id: string; title: string; artist: string; duration: string; category: TrackCategory; color: string; img: string };
type BreathPhase = "idle" | "inhale" | "hold" | "exhale";


const TRACKS: Track[] = [
  { id: "1", title: "باران آرامش", artist: "صدای طبیعت", duration: "٤٥:٠٠", category: "meditation", color: "#3a82c8", img: "photo-1501630834273-4b5604d2ee31" },
  { id: "2", title: "مدیتیشن شبانه", artist: "استودیو آرامش", duration: "٣٠:٠٠", category: "meditation", color: "#5b99d6", img: "photo-1518020382113-a7e8fc38eac9" },
  { id: "3", title: "گفتگو درباره اضطراب", artist: "دکتر مریم احمدی", duration: "٥٢:١٨", category: "podcast", color: "#d4a820", img: "photo-1478737270239-2f02b77fc618" },
  { id: "4", title: "موسیقی آرام برای خواب", artist: "کوارتت ماه", duration: "٥٨:٤٠", category: "music", color: "#4090c0", img: "photo-1511379938547-c1f69419868d" },
  { id: "5", title: "تنفس آگاهانه", artist: "یوگا و ذهن‌آگاهی", duration: "٢٠:٠٠", category: "meditation", color: "#2878b8", img: "photo-1506905925346-21bda4d32df4" },
  { id: "6", title: "چطور با غم کنار بیاییم", artist: "دکتر علی رضایی", duration: "٤٨:٣٠", category: "podcast", color: "#c8921a", img: "photo-1474631245212-32dc3c8310c6" },
  { id: "7", title: "امواج دریا", artist: "طبیعت بی‌کران", duration: "١:٠٠:٠٠", category: "music", color: "#3888c4", img: "photo-1505118380757-91f5f5632de0" },
  { id: "8", title: "ذهن‌آگاهی روزانه", artist: "مرکز رفاه ذهنی", duration: "١٥:٠٠", category: "podcast", color: "#b87e10", img: "photo-1500534314209-a25ddb2bd429" },
];

const AFFIRMATIONS = [
  "تو قوی‌تر از چیزی هستی که فکر می‌کنی",
  "این لحظه می‌گذرد و تو باقی می‌مانی",
  "ارزش مراقبت از خودت را داری",
  "هر قدم کوچکی پیشرفت است",
  "آرامش در درون توست، کافیه فقط پیداش کنی",
  "امروز را یک روز در یک روز طی می‌کنی",
  "تو لایق آرامش و خوشبختی هستی",
];

const TIPS = [
  { icon: "🌊", title: "تنفس ۴-۴-۶", desc: "۴ ثانیه نفس بکش، ۴ ثانیه نگه دار، ۶ ثانیه بده بیرون." },
  { icon: "🌿", title: "قانون ۵-۴-۳-۲-۱", desc: "۵ چیز می‌بینی، ۴ چیز لمس می‌کنی، ۳ چیز می‌شنوی، ۲ چیز بو می‌کنی، ۱ چیز مزه می‌کنی." },
  { icon: "💧", title: "آب بخور", desc: "یک لیوان آب سرد بنوش. این ساده‌ترین کاری است که بدنت الان نیاز دارد." },
  { icon: "🤲", title: "دستانت را ببین", desc: "به کف دستانت نگاه کن. با آرامش ۵ انگشت را نام ببر. این لحظه واقعی است." },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [darkMode, setDarkMode] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Music state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [trackProgress, setTrackProgress] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<"all" | TrackCategory>("all");
  const [volume, setVolume] = useState(75);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Breathing state
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("idle");
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathRounds, setBreathRounds] = useState(0);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Affirmation state
  const [affIdx, setAffIdx] = useState(0);
  const [affVisible, setAffVisible] = useState(true);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Music progress
  useEffect(() => {
    if (playingId) {
      progressRef.current = setInterval(() => {
        setTrackProgress(prev => ({ ...prev, [playingId]: Math.min((prev[playingId] ?? 0) + 0.18, 100) }));
      }, 400);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [playingId]);

  // Breathing engine
  const stopBreath = useCallback(() => {
    if (breathRef.current) clearInterval(breathRef.current);
    setBreathPhase("idle");
  }, []);

  const startBreath = useCallback(() => {
    setBreathRounds(0);
    let phase: BreathPhase = "inhale";
    let tLeft = 4;
    setBreathPhase("inhale");
    setBreathTimer(4);

    breathRef.current = setInterval(() => {
      tLeft -= 1;
      if (tLeft <= 0) {
        if (phase === "inhale") { phase = "hold"; tLeft = 4; }
        else if (phase === "hold") { phase = "exhale"; tLeft = 6; }
        else { phase = "inhale"; tLeft = 4; setBreathRounds(r => r + 1); }
        setBreathPhase(phase);
        setBreathTimer(tLeft);
      } else {
        setBreathTimer(tLeft);
      }
    }, 1000);
  }, []);

  // Affirmation rotation
  useEffect(() => {
    const t = setInterval(() => {
      setAffVisible(false);
      setTimeout(() => { setAffIdx(i => (i + 1) % AFFIRMATIONS.length); setAffVisible(true); }, 400);
    }, 7000);
    return () => clearInterval(t);
  }, []);

const sendMessage = async () => {
  const text = inputText.trim();
  if (!text || isTyping) return;

  const time = new Date().toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: text,
    time,
  };

  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  setInputText("");
  setIsTyping(true);

  try {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages.map((m) => ({
          role: m.role === "ai" ? "assistant" : m.role,
          content: m.content,
        })),
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: data.reply || "پاسخی دریافت نشد.",
      time: new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "خطا در ارتباط با سرور",
        time: new Date().toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    console.error(error);
  } finally {
    setIsTyping(false);
  }
};

  const toggleTrack = (id: string) => setPlayingId(p => p === id ? null : id);

  const filteredTracks = activeCategory === "all" ? TRACKS : TRACKS.filter(t => t.category === activeCategory);
  const currentTrack = TRACKS.find(t => t.id === playingId);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  const breathLabel: Record<BreathPhase, string> = {
    idle: "شروع تمرین تنفس",
    inhale: "نفس بکش...",
    hold: "نگه دار...",
    exhale: "آروم بده بیرون...",
  };

  const catLabel: Record<"all" | TrackCategory, string> = { all: "همه", music: "موسیقی", meditation: "مدیتیشن", podcast: "پادکست" };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">آرامِش</span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            {[
              { id: "home", label: "خانه" },
              { id: "chat", label: "چت هوشمند" },
              { id: "music", label: "موسیقی" },
              { id: "breathing", label: "تنفس" },
              { id: "tips", label: "راهکارها" },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`transition-colors hover:text-primary ${activeSection === item.id ? "text-primary" : "text-muted-foreground"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(d => !d)}
              className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => scrollTo("emergency")}
              className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-accent/30"
            >
              کمک فوری
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format"
            alt="منظره آرام کوهستانی"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>

        {/* Soft glow blobs */}
        <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-60 h-60 rounded-full bg-accent/20 blur-3xl pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Heart className="w-3.5 h-3.5" fill="currentColor" />
            <span>کنارت هستیم</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground">
            پناه، آرامش را
            <br />
            <span className="text-primary">پیدا کن</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            در سخت‌ترین لحظات، تنها نیستی. اینجا یک فضای امن برای شنیده شدن، آرام شدن، و قدم برداشتن ساخته‌ایم.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollTo("chat")}
              className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
            >
              شروع گفتگو
            </button>
            <button
              onClick={() => scrollTo("music")}
              className="px-8 py-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm text-foreground font-semibold text-base hover:border-primary/40 transition-all"
            >
              موسیقی آرامش
            </button>
          </div>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 mt-20 flex flex-wrap gap-3 justify-center">
          {[
            { icon: MessageCircle, label: "پناه " },
            { icon: Headphones, label: "موسیقی و پادکست" },
            { icon: Wind, label: "تمرین تنفس" },
            { icon: Star, label: "تأییدیه‌های روزانه" },
            { icon: BookOpen, label: "راهکارهای بحران" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border text-sm text-muted-foreground shadow-sm">
              <Icon className="w-3.5 h-3.5 text-primary" />
              {label}
            </div>
          ))}
        </div>

        <button onClick={() => scrollTo("chat")} className="relative z-10 mt-12 text-muted-foreground animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* ─── CHAT ─── */}
      <section id="chat" className="py-24 px-6 bg-secondary/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <MessageCircle className="w-4 h-4" />
              پشتیبان احساسی هوشمند
            </div>
            <h2 className="text-4xl font-bold mb-4">با دوست روانشناست صحبت کن</h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              هر چیزی که ذهنت رو درگیر کرده، آزادانه بگو. اینجا فضای قضاوت نیست — فقط گوش دادن.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Info sidebar */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-primary/12 flex items-center justify-center mb-4">
                  <Heart className="w-7 h-7 text-primary" fill="currentColor" />
                </div>
                <h3 className="font-bold text-lg mb-2">پشتیبان احساسی</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  این دستیار هوشمند فقط درباره احساسات، اضطراب، غم، و چالش‌های روانی صحبت می‌کند. با همدلی و بدون قضاوت.
                </p>
              </div>

              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium mb-4">می‌تونی درباره اینها صحبت کنی:</p>
                <div className="space-y-2.5">
                  {["اضطراب و نگرانی", "غم و دلتنگی", "استرس روزانه", "بی‌خوابی و افکار منفی", "روابط و احساسات", "احساس تنهایی"].map(t => (
                    <div key={t} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-accent/15 border border-accent/30 rounded-2xl p-4">
                <p className="text-sm leading-relaxed text-foreground/80">
                  در بحران حاد با اورژانس اجتماعی{" "}
                  <span className="text-primary font-bold">۱۲۳</span>{" "}
                  تماس بگیرید.
                </p>
              </div>
            </div>

            {/* Chat window */}
            <div className="md:col-span-3 bg-card border border-border rounded-3xl flex flex-col shadow-md" style={{ height: "560px" }}>
              {/* Header */}
              <div className="px-5 py-4 border-b border-border flex items-center gap-3 flex-shrink-0">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" fill="currentColor" />
                  </div>
                  <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-card" />
                </div>
                <div>
                  <p className="font-semibold text-sm">دوست روانشناس</p>
                  <p className="text-xs text-green-500 font-medium">آنلاین · آماده شنیدن</p>
                </div>
              </div>

              {/* Messages — LTR container so flex alignment works correctly, text stays RTL */}
              <div dir="ltr" className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-primary/12 flex items-center justify-center flex-shrink-0 mb-1">
                        <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1" style={{ maxWidth: "72%", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      <div
                        dir="rtl"
                        className={`px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-secondary text-foreground rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-xs text-muted-foreground px-1">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div dir="ltr" className="flex items-end gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/12 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3.5 flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-border flex-shrink-0">
                <div className="flex items-end gap-3 bg-secondary rounded-2xl px-4 py-3">
                  <textarea
                    ref={textareaRef}
                    dir="rtl"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="هر چیزی که دوست داری بگو..."
                    rows={1}
                    className="flex-1 bg-transparent text-sm resize-none outline-none text-foreground placeholder:text-muted-foreground leading-relaxed"
                    style={{ minHeight: "24px", maxHeight: "88px" }}
                    onInput={e => {
                      const el = e.target as HTMLTextAreaElement;
                      el.style.height = "auto";
                      el.style.height = Math.min(el.scrollHeight, 88) + "px";
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-35 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" style={{ transform: "scaleX(-1)" }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MUSIC & PODCAST ─── */}
      <section id="music" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/25 text-accent-foreground text-sm font-medium mb-4">
              <Headphones className="w-4 h-4" />
              موسیقی و پادکست
            </div>
            <h2 className="text-4xl font-bold mb-4">لحظه‌ای برای نفس کشیدن</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              موسیقی‌ها و پادکست‌هایی که به آرام شدن ذهن و کاهش اضطراب کمک می‌کنند.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex gap-3 justify-center mb-10 flex-wrap">
            {(["all", "music", "meditation", "podcast"] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {catLabel[cat]}
              </button>
            ))}
          </div>

          {/* Now playing bar */}
          {currentTrack && (
            <div
              className="mb-8 rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-5 border"
              style={{ background: `linear-gradient(135deg, ${currentTrack.color}18, ${currentTrack.color}06)`, borderColor: `${currentTrack.color}30` }}
            >
              <img
                src={`https://images.unsplash.com/${currentTrack.img}?w=80&h=80&fit=crop&auto=format`}
                alt={currentTrack.title}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                style={{ backgroundColor: currentTrack.color + "40" }}
              />
              <div className="flex-1 min-w-0 text-center sm:text-right">
                <p className="font-semibold text-sm truncate">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{currentTrack.artist}</p>
                <div className="mt-2.5 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${trackProgress[currentTrack.id] ?? 0}%`, backgroundColor: currentTrack.color }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/40 transition-colors">
                  <SkipForward className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => toggleTrack(currentTrack.id)}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: currentTrack.color }}
                >
                  <Pause className="w-5 h-5" />
                </button>
                <button className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/40 transition-colors">
                  <SkipBack className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(+e.target.value)} className="w-20 accent-primary cursor-pointer" />
              </div>
            </div>
          )}

          {/* Track grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTracks.map(track => (
              <div
                key={track.id}
                onClick={() => toggleTrack(track.id)}
                className={`group bg-card border rounded-3xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                  playingId === track.id ? "ring-2 border-transparent" : "border-border"
                }`}
                style={playingId === track.id ? { ringColor: track.color, borderColor: track.color + "50" } : {}}
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${track.img}?w=280&h=160&fit=crop&auto=format`}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundColor: track.color + "30" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: track.color + "dd" }}>
                    {{ music: "موسیقی", podcast: "پادکست", meditation: "مدیتیشن" }[track.category]}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: track.color }}
                    >
                      {playingId === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 mr-[-1px]" />}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className="font-semibold text-sm truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{track.artist}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{track.duration}</span>
                    {playingId === track.id && (
                      <div className="flex items-end gap-0.5 h-3.5">
                        {[6, 10, 7, 12, 8].map((h, i) => (
                          <div key={i} className="w-0.5 rounded-full animate-bounce" style={{ height: h, backgroundColor: track.color, animationDelay: `${i * 0.12}s`, animationDuration: "0.7s" }} />
                        ))}
                      </div>
                    )}
                  </div>
                  {playingId === track.id && (
                    <div className="mt-2.5 h-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${trackProgress[track.id] ?? 0}%`, backgroundColor: track.color }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BREATHING ─── */}
      <section id="breathing" className="py-24 px-6 bg-secondary/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Wind className="w-4 h-4" />
              تمرین تنفس
            </div>
            <h2 className="text-4xl font-bold mb-4">یک نفس عمیق بکش</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              تنفس عمیق یکی از سریع‌ترین راه‌های آرام کردن سیستم عصبی است. ۵ دقیقه کافیه.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-14">
            {/* Animated circle */}
            <div className="relative flex items-center justify-center w-72 h-72 flex-shrink-0">
              {breathPhase !== "idle" && (
                <>
                  <div
                    className="absolute rounded-full border-2 border-primary/15 transition-all ease-in-out"
                    style={{
                      width: breathPhase === "inhale" ? 288 : breathPhase === "exhale" ? 152 : 232,
                      height: breathPhase === "inhale" ? 288 : breathPhase === "exhale" ? 152 : 232,
                      transitionDuration: breathPhase === "inhale" ? "4s" : breathPhase === "hold" ? "0.3s" : "6s",
                    }}
                  />
                  <div
                    className="absolute rounded-full border border-primary/8 transition-all ease-in-out"
                    style={{
                      width: breathPhase === "inhale" ? 316 : breathPhase === "exhale" ? 128 : 256,
                      height: breathPhase === "inhale" ? 316 : breathPhase === "exhale" ? 128 : 256,
                      transitionDuration: breathPhase === "inhale" ? "4s" : breathPhase === "hold" ? "0.3s" : "6s",
                    }}
                  />
                </>
              )}
              <div
                className="rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all ease-in-out"
                style={{
                  width: breathPhase === "inhale" ? 200 : breathPhase === "exhale" ? 128 : breathPhase === "hold" ? 176 : 156,
                  height: breathPhase === "inhale" ? 200 : breathPhase === "exhale" ? 128 : breathPhase === "hold" ? 176 : 156,
                  background: "linear-gradient(135deg, #5aa0e0, #2c70b8)",
                  transitionDuration: breathPhase === "inhale" ? "4s" : breathPhase === "hold" ? "0.3s" : "6s",
                  boxShadow: "0 0 60px rgba(58,130,200,0.35), 0 0 100px rgba(58,130,200,0.15)",
                }}
              >
                <span className="text-4xl font-bold">{breathPhase !== "idle" ? breathTimer : "۴"}</span>
                <span className="text-xs mt-1 opacity-75">ثانیه</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 w-full">
              <div className="bg-card border border-border rounded-3xl p-8 mb-5 shadow-sm">
                <h3 className="font-bold text-xl mb-2">
                  {breathPhase === "idle" ? "تکنیک ۴–۴–۶" : breathLabel[breathPhase]}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {breathPhase === "idle"
                    ? "این تکنیک به کاهش استرس حاد و آرام کردن سیستم عصبی کمک می‌کند. ۴ ثانیه نفس بکش، ۴ ثانیه نگه دار، ۶ ثانیه بده بیرون."
                    : `دور ${breathRounds + 1} · ${breathPhase === "inhale" ? "آرام از طریق بینی نفس بکش" : breathPhase === "hold" ? "نفست رو نگه دار و آروم باش" : "آرام از طریق دهان بده بیرون"}`}
                </p>

                {breathPhase !== "idle" && (
                  <div className="flex gap-2 mb-6">
                    {([
                      { phase: "inhale", label: "نفس", s: 4 },
                      { phase: "hold", label: "نگه دار", s: 4 },
                      { phase: "exhale", label: "بده بیرون", s: 6 },
                    ] as const).map(step => (
                      <div
                        key={step.phase}
                        className={`flex-1 rounded-2xl p-3 text-center border transition-all ${breathPhase === step.phase ? "bg-primary/12 border-primary/30" : "bg-secondary border-transparent"}`}
                      >
                        <p className="text-xs text-muted-foreground">{step.label}</p>
                        <p className="font-bold text-primary text-lg">{step.s}s</p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={breathPhase !== "idle" ? stopBreath : startBreath}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.01] ${
                    breathPhase !== "idle"
                      ? "bg-secondary border border-border text-foreground"
                      : "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  }`}
                >
                  {breathPhase !== "idle" ? "توقف تمرین" : "شروع تمرین تنفس"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm">
                  <p className="text-3xl font-bold text-primary">{breathRounds}</p>
                  <p className="text-xs text-muted-foreground mt-1">دور کامل</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm">
                  <p className="text-3xl font-bold text-accent">{breathRounds * 14}</p>
                  <p className="text-xs text-muted-foreground mt-1">ثانیه تمرین</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AFFIRMATION ─── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-8">
            <Star className="w-4 h-4" fill="currentColor" />
            یادآور روزانه
          </div>

          <div className="bg-card border border-border rounded-3xl p-12 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-accent/8 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <div className="text-5xl mb-6">✨</div>
              <p
                className="text-2xl md:text-3xl font-bold leading-relaxed transition-all duration-400"
                style={{ opacity: affVisible ? 1 : 0, transform: affVisible ? "translateY(0)" : "translateY(12px)" }}
              >
                {AFFIRMATIONS[affIdx]}
              </p>
              <button
                onClick={() => { setAffVisible(false); setTimeout(() => { setAffIdx(i => (i + 1) % AFFIRMATIONS.length); setAffVisible(true); }, 300); }}
                className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                یکی دیگه
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TIPS ─── */}
      <section id="tips" className="py-20 px-6 bg-secondary/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              راهکارهای فوری
            </div>
            <h2 className="text-3xl font-bold mb-3">وقتی اضطراب میاد سراغت</h2>
            <p className="text-muted-foreground max-w-md mx-auto">این تکنیک‌ها در لحظات بحران کمک می‌کنند.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIPS.map(tip => (
              <div key={tip.title} className="bg-card border border-border rounded-3xl p-6 hover:border-primary/30 hover:shadow-md transition-all shadow-sm">
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h4 className="font-bold mb-2 text-sm">{tip.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EMERGENCY ─── */}
      <section id="emergency" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
              <Phone className="w-4 h-4" />
              کمک فوری
            </div>
            <h2 className="text-3xl font-bold mb-3">اگه بحران داری، تنها نمون</h2>
            <p className="text-muted-foreground">این خطوط ۲۴ ساعته آماده کمک هستند.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { number: "۱۲۳", label: "اورژانس اجتماعی", desc: "بحران‌های اجتماعی و خانوادگی", color: "#3a82c8" },
              { number: "۱۴۸۰", label: "مشاوره سلامت روان", desc: "مشاوره روانشناسی رایگان", color: "#2a9a6a" },
              { number: "۱۱۵", label: "اورژانس", desc: "خطر جانی فوری", color: "#d43b3b" },
            ].map(item => (
              <div key={item.number} className="bg-card border border-border rounded-3xl p-6 text-center hover:shadow-lg transition-all shadow-sm">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-black"
                  style={{ backgroundColor: item.color + "18", color: item.color }}
                >
                  {item.number}
                </div>
                <p className="font-bold mb-1 text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground mb-5">{item.desc}</p>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: item.color }}
                >
                  تماس بگیر
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-right">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            </div>
            <span className="font-bold text-lg">آرامِش</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            این سایت جایگزین خدمات درمانی حرفه‌ای نیست. در صورت نیاز با متخصص مشورت کنید.
          </p>
          <p className="text-sm text-muted-foreground">ساخته شده با ❤️ برای آرامش شما</p>
        </div>
      </footer>
    </div>
  );
}
