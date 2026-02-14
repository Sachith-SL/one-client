import axiosInstance from "../api/axiosinstance";

//get all departments
export const getAllDepartmentsApi = async () => {
  try {
    const response = await axiosInstance
      .get(`/department`);
    return response.data.data.content;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};
