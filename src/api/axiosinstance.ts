import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/one/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Dedicated refresh client (NO interceptors)
const refreshClient = axios.create({
  baseURL: "http://localhost:8080/api/one/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the accessToken in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  //(error) => Promise.reject(error),
);

// Handle expired token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Do not intercept refresh endpoint
    if (originalRequest?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Step 1: Check if error is 401 and this is the first attempt
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Mark request so we don't retry it infinitely
      originalRequest._retry = true;

      // Step 2: Get refresh token from storage
      const refreshToken = localStorage.getItem("refreshToken");

      // Step 3: If no refresh token exists, redirect to login
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Step 4: Call refresh endpoint to get a new access token
        const res = await refreshClient.post("/auth/refresh", null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        // Step 5: Extract new access token from response
        const newAccessToken =
          res.data.accessToken ?? res.data.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No accessToken in refresh response");
        }

        // Step 6: Save new access token to storage
        localStorage.setItem("accessToken", newAccessToken);

        // Step 7: Retry the original failed request with the new token
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Step 8: If refresh also fails, clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
