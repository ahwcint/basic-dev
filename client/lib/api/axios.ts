import axios, { type AxiosRequestConfig } from "axios";

type RetryAbleAxiosRequestConfig = {
  _retry?: boolean;
} & AxiosRequestConfig;

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      const isUnauthorized = data?.statusCode === 401;
      const isUnauthorizedWithAccessToken = data?.statusCode === 422;
      const originalRequestConfig: RetryAbleAxiosRequestConfig =
        error.config || {};

      if (isUnauthorized && typeof window !== "undefined") {
        window.location.href = "/auth/login";
        return new Promise(() => {});
      }

      // retry send api one more time if Unauthorized with access_token went wrong
      if (
        isUnauthorizedWithAccessToken &&
        !originalRequestConfig?._retry &&
        typeof window !== "undefined"
      ) {
        console.warn("Unauthorized. Retrying request one time.");
        try {
          originalRequestConfig._retry = true;
          return await api(originalRequestConfig);
        } catch (err) {
          // stop chain promises
          return Promise.reject(err);
        }
      }

      console.warn(`[${status || error.code}]`, data || error.message);
      return Promise.reject(data ?? { message: "Unknown Axios error" });
    }

    console.warn("Unexpected Error:", error);
    return Promise.reject({ message: "Unexpected error occurred" });
  }
);

export default api;
