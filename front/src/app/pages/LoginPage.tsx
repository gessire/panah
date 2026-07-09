import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Heart, Loader2 } from "lucide-react";
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

type LocationState = { from?: { pathname: string } } | null;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!email.trim() || !password) {
      return "لطفاً ایمیل و رمز عبور را وارد کن";
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
      await login({ email: email.trim(), password });
      const state = location.state as LocationState;
      const redirectTo = state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود ناموفق بود. دوباره تلاش کنید.");
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
          <CardTitle className="text-2xl">خوش برگشتی</CardTitle>
          <CardDescription>برای ادامه وارد حساب کاربری خود شو</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
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
                autoComplete="current-password"
                placeholder="رمز عبور خود را وارد کن"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "در حال ورود..." : "ورود"}
            </Button>
            <p className="text-sm text-muted-foreground">
              هنوز حساب نساختی؟{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                ثبت‌نام کن
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
