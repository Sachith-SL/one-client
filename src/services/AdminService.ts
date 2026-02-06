import axiosInstance from "../api/axiosinstance";

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

export const assignRole = async (userId: number, role: string) => {
  await axiosInstance.post(`/admin/users/${userId}/role`, null, {
    params: { role },
  });
};
