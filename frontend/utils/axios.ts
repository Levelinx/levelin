import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

export function getApi(accessToken?: string): AxiosInstance {
    const api: AxiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003/",
        headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
        },
        withCredentials: true,
    });

    api.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            // Ensure credentials are included in every request
            config.withCredentials = true;
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    return api;
}

export default getApi;