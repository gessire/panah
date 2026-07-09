import { useNavigate, Link } from "react-router";
import { Heart, LogOut, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";

// A minimal example of a protected page. Wrap any route that should
// require login the same way this one is wrapped in AppRoutes.tsx.
export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-background text-foreground px-6 py-16"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
          </div>
          <CardTitle className="text-2xl">حساب کاربری من</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="bg-secondary/60 rounded-2xl p-5 space-y-2 text-center">
            <p className="font-bold text-lg">{currentUser?.name}</p>
            <p dir="ltr" className="text-sm text-muted-foreground">
              {currentUser?.email}
            </p>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            بازگشت به خانه
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            خروج از حساب
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
