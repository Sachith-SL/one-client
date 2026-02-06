import { createContext, useContext, useEffect, useState } from "react";
import { getUserRoles, isTokenExpired } from "../utils/jwt";

type AuthContextType = {
  isLoggedIn: boolean;
  roles: string[];
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  // Runs once when app loads
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && !isTokenExpired()) {
      // Access token is valid
      setIsLoggedIn(true);
      setRoles(getUserRoles());
    } else if (refreshToken) {
      // Access token expired but refresh token exists → stay logged in
      // The axios interceptor will handle refreshing on the next API call
      setIsLoggedIn(true);
      setRoles(getUserRoles());
    } else {
      // No tokens at all → logged out
      setIsLoggedIn(false);
      setRoles([]);
    }
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    
    setIsLoggedIn(true);
    setRoles(getUserRoles());
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
