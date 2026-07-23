import { errorToast } from "@/components/toaster";
import { AUTH_REFRESH_TOKEN_COOKIE, AUTH_TOKEN_COOKIE } from "@/config/cookie";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosError,
} from "axios";
import axios from "axios";
import Cookies from "js-cookie";

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get(AUTH_TOKEN_COOKIE);
  if (!config.headers) config.headers = {} as AxiosRequestHeaders;

  if (token && !config.url?.includes(AUTH_REFRESH_TOKEN_COOKIE)) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    errorToast({
      title: "",
      description: message,
    });
    return Promise.reject(new Error(message));
  },
);

export default axiosInstance;
