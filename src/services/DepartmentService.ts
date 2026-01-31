import axiosInstance from "../api/axiosinstance"

//get all departments
export const getAllDepartments = () => {
  return axiosInstance.get(`/department`)
  .then((response: any) => {
    return response.data;
    })
    .catch((error: any) => {
        console.error("Error fetching departments:", error);
        throw error;
    });
};