import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
  } from "axios";
  
  export const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        // const supabase = await createClient();
        // const {
        //   data: { session },
        // } = await supabase.auth.getSession();
  
        // if (session?.access_token) {
        //   config.headers = config.headers || {};
        //   config.headers["Authorization"] = `Bearer ${session.access_token}`;
        // }
  
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