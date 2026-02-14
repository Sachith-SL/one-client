import axiosInstance from "../api/axiosinstance";

export const registerApi = async (username: string, password: string) => {
  await axiosInstance.post("/auth/register", {
    username,
    password,
  });
};
