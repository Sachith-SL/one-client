import axiosInstance from "../api/axiosinstance";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginApi = async (request: LoginRequest): Promise<LoginResponse> => {
  const res = await axiosInstance.post<LoginResponse>("/auth/login", request);

  return res.data;
};
