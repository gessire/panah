import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Heart, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      return "نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد";
    }
    if (!email.trim()) {
      return "لطفاً ایمیل خود را وارد کنید";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "فرمت ایمیل معتبر نیست";
    }
    if (password.length < 6) {
      return "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }
    if (password !== confirmPassword) {
      return "رمز عبور و تکرار آن یکسان نیستند";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setFieldError(validationError);
      return;
    }
    setFieldError(null);

    setLoading(true);
    try {
      await register({ fullName: fullName.trim(), email: email.trim(), password });
      setSuccess(true);
      setTimeout(() => navigate("/", { replace: true }), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت‌نام ناموفق بود. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-background text-foreground px-6 py-16 relative overflow-hidden"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-60 h-60 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 shadow-lg border-border">
        <CardHeader className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">آرامِش</span>
          </Link>
          <CardTitle className="text-2xl">ساخت حساب کاربری</CardTitle>
          <CardDescription>برای شروع، اطلاعات خود را وارد کن</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">نام و نام خانوادگی</Label>
              <Input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="مثلاً سارا محمدی"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                dir="ltr"
                autoComplete="new-password"
                placeholder="حداقل ۶ کاراکتر"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
              <Input
                id="confirmPassword"
                type="password"
                dir="ltr"
                autoComplete="new-password"
                placeholder="رمز عبور را دوباره وارد کن"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {fieldError && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                {fieldError}
              </p>
            )}
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                ثبت‌نام با موفقیت انجام شد! در حال انتقال...
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading || success}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </Button>
            <p className="text-sm text-muted-foreground">
              قبلاً حساب ساخته‌ای؟{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                وارد شو
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
