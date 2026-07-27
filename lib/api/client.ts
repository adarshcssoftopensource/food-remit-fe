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
import { AUTH_ENDPOINTS } from "./endpoints/auth.endpoints";
interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get(AUTH_TOKEN_COOKIE);
  if (!config.headers) config.headers = {} as AxiosRequestHeaders;

  if (token && !config.url?.includes(AUTH_ENDPOINTS.REFRESH_TOKEN)) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`,
          {},
          { withCredentials: true },
        );

        const { access_token } = response.data;
        Cookies.set(AUTH_TOKEN_COOKIE, access_token, { path: "/" });

        processQueue(null, access_token);
        originalRequest.headers.Authorization = "Bearer " + access_token;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        Cookies.remove(AUTH_TOKEN_COOKIE);
        Cookies.remove(AUTH_REFRESH_TOKEN_COOKIE);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    if (error.response?.status !== 401 || originalRequest?._retry) {
      errorToast({
        title: "",
        description: message,
      });
    }

    return Promise.reject(new Error(message));
  },
);

export default axiosInstance;
