import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "./token";

type JwtPayload = {
  sub: string;
  roles?: string[];
  exp: number;
};

export const getUserRoles = (): string[] => {
  const accessToken = getAccessToken();
  if (!accessToken) return [];

  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    return decoded.roles || [];
  } catch {
    return [];
  }
};

export const getUsername = (): string => {
  const accessToken = getAccessToken();
  if (!accessToken) return "";

  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    return decoded.sub || "";
  } catch {
    return "";
  }
};

export const isTokenExpired = (): boolean => {
  const accessToken = getAccessToken();
  if (!accessToken) return true;

  const decoded = jwtDecode<JwtPayload>(accessToken);
  return decoded.exp * 1000 < Date.now();
};
