import { createContext, useContext, useEffect, useState } from "react";
import { getUserRoles, isTokenExpired } from "../utils/jwt";
import { logoutApi } from "../services/LoginService";

type AuthContextType = {
  isLoggedIn: boolean;
  roles: string[];
  login: (accessToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  // Runs once when app loads
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && !isTokenExpired()) {
      // Access token is valid
      setIsLoggedIn(true);
      setRoles(getUserRoles());
    } else if (accessToken) {
      // Access token expired but HttpOnly refresh cookie may exist
      // Stay logged in — the interceptor will handle refreshing
      setIsLoggedIn(true);
      setRoles(getUserRoles());
    } else {
      // No access token at all → logged out
      setIsLoggedIn(false);
      setRoles([]);
    }
  }, []);

  const login = (accessToken: string,) => {
    localStorage.setItem("accessToken", accessToken);
    
    setIsLoggedIn(true);
    setRoles(getUserRoles());
  };

  const logout = async () => {
    try {
      await logoutApi(); // Tell backend to clear the HttpOnly refresh cookie
    } catch (error) {
      console.error("Logout API failed:", error);
    }
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
