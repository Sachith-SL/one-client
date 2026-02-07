import axiosInstance from "../api/axiosinstance";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export const loginApi = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  const res = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    request,
    { withCredentials: true }, // Include cookies — backend sets refresh token as httpOnly cookie
  );
  return res.data;
};

export const logoutApi = async () => {
  await axiosInstance.post("/auth/logout");
};
