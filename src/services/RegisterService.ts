import axiosInstance from "../api/axiosinstance";

export const register = async (
  username: string,
  password: string
) => {
  await axiosInstance.post("/auth/register", {
    username,
    password,
  });
};
