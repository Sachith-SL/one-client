import axiosInstance from "../api/axiosinstance";

//get all departments
export const getAllDepartmentsApi = () => {
  return axiosInstance
    .get(`/department`)
    .then((response: any) => {
      return response.data.data.content;
    })
    .catch((error: any) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
};
