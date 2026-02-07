import { createContext, useContext, useEffect, useState } from "react";
import { getUsername, getUserRoles, isTokenExpired } from "../utils/jwt";
import { logoutApi } from "../services/LoginService";

type AuthContextType = {
  isLoggedIn: boolean;
  username: string;
  roles: string[];
  login: (accessToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState<string[]>([]);

  // Runs once when app loads
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && !isTokenExpired()) {
      setIsLoggedIn(true);
      setUsername(getUsername());
      setRoles(getUserRoles());
    } else if (accessToken) {
      setIsLoggedIn(true);
      setUsername(getUsername());
      setRoles(getUserRoles());
    } else {
      setIsLoggedIn(false);
      setUsername("");
      setRoles([]);
    }
  }, []);

  const login = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    setIsLoggedIn(true);
    setUsername(getUsername());
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
    setUsername("");
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, roles, login, logout }}>
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
