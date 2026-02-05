import { jwtDecode } from "jwt-decode";


type JwtPayload = {
  sub: string;
  roles?: string[];
  exp: number;
};

export const getUserRoles = (): string[] => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.roles || [];
  } catch {
    return [];
  }
};
