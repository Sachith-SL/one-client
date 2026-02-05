import { createContext, useContext, useEffect, useState } from "react";
import { getUserRoles } from "../utils/jwt";

type AuthContextType = {
  isLoggedIn: boolean;
  roles: string[];
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  // Runs once when app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setRoles(token ? getUserRoles() : []);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setRoles(getUserRoles());
  };

  const logout = () => {
    localStorage.removeItem("token");
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
