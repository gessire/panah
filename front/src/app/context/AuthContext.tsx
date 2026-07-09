import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  loginRequest,
  registerRequest,
  fetchCurrentUser,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "../services/authService";

const TOKEN_KEY = "panaah_token";
const USER_KEY = "panaah_user";

type AuthContextValue = {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session on first load / page refresh.
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        // Confirm the token is still valid before trusting local storage.
        const { user } = await fetchCurrentUser(storedToken);
        setCurrentUser(user);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const persistSession = (token: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const login = async (payload: LoginPayload) => {
    const { token, user } = await loginRequest(payload);
    persistSession(token, user);
  };

  const register = async (payload: RegisterPayload) => {
    const { token, user } = await registerRequest(payload);
    persistSession(token, user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
  };

  const value: AuthContextValue = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
