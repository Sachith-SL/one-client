import axiosInstance from "../api/axiosinstance"


export const getWelcomeMessage = async () => {
  try {
    const response = await axiosInstance.get(`/health`);
    return response.data;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    throw error;
  }
};