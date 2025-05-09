import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
  } from "axios";
  
  export const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        return config;
      } catch (error) {
        console.error("Error in request interceptor:", error);
        return config;
      }
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
  
  export default api;