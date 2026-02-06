import { jwtDecode } from "jwt-decode";


type JwtPayload = {
  sub: string;
  roles?: string[];
  exp: number;
};

export const getUserRoles = (): string[] => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return [];

  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    return decoded.roles || [];
  } catch {
    return [];
  }
};


export const isTokenExpired = (): boolean => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return true;

  const decoded = jwtDecode<JwtPayload>(accessToken);
  return decoded.exp * 1000 < Date.now();
};

