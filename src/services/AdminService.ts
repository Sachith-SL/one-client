import axiosInstance from "../api/axiosinstance";

export const getAllUsersApi = async () => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

export const assignRoleApi = async (userId: number, role: string) => {
  await axiosInstance.post(`/admin/users/${userId}/role`, null, {
    params: { role },
  });
};
