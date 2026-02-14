import axiosInstance from "../api/axiosinstance";

//get all employees
export const getAllEmployeesApi = async () => {
  try {
        const response = await axiosInstance
            .get(`/employee`);
        return response.data.data.content;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};

//get employee by id
export const getEmployeeByIdApi = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/employee/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    throw error;
  }
};

//create new employee
export const createEmployeeApi = async (employeeData: any) => {
  try {
    const response = await axiosInstance.post(`/employee`, employeeData);
    return response.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

//update employee
export const updateEmployeeApi = async (id: number, employeeData: any) => {
  try {
    const response = await axiosInstance.put(`/employee/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error);
    throw error;
  }
};

//delete employee
export const deleteEmployeeApi = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    throw error;
  }
};
