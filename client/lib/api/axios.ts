import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      const isUnauthorized = data?.statusCode === 401;

      if (isUnauthorized && typeof window !== "undefined") {
        window.location.href = "/auth/login";
        return;
      }

      console.warn(`[${status}]`, data);
      return Promise.reject(data ?? { message: "Unknown Axios error" });
    }

    console.warn("Unexpected Error:", error);
    return Promise.reject({ message: "Unexpected error occurred" });
  }
);

export default api;
