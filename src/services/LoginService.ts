import axiosInstance from "../api/axiosinstance";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const res = await axiosInstance.post<LoginResponse>("/auth/login", request);

  return res.data;
};
