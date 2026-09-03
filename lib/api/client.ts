import { errorToast } from "@/components/toaster";
import { AUTH_TOKEN_COOKIE } from "@/config/cookie";
import { ROUTES } from "@/config/routes";
import { clearAuthSession, setAuthSession } from "@/lib/auth-client";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
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
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
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
  const token = typeof window !== "undefined" ? Cookies.get(AUTH_TOKEN_COOKIE) : null;
  if (!config.headers) config.headers = {} as AxiosRequestHeaders;

  if (token) {
    if (!config.url?.includes(AUTH_ENDPOINTS.REFRESH_TOKEN)) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    if (config.method && config.method.toLowerCase() !== "get") {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded?.isReadOnly) {
          return Promise.reject(new Error("ACTION_NOT_ALLOWED_READ_ONLY"));
        }
      } catch (e) {}
    }
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

      const token = typeof window !== "undefined" ? Cookies.get(AUTH_TOKEN_COOKIE) : null;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          },
        );

        const { access_token } = response.data;
        if (access_token) {
          setAuthSession({ accessToken: access_token });
        }

        processQueue(null, access_token);
        originalRequest.headers.Authorization = "Bearer " + access_token;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearAuthSession();
        if (typeof window !== "undefined") {
          window.location.href = ROUTES.AUTH.LOGIN;
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.message === "ACTION_NOT_ALLOWED_READ_ONLY") {
      errorToast({
        description: "You are in View Only mode. Actions are disabled.",
      });
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    // Suppress the generic toast for errors that are handled locally by the caller
    // (e.g. MAX_SESSIONS_REACHED is handled by the login form's ConfirmationDialog)
    const errorCode = (error.response?.data as { errorCode?: string })?.errorCode;
    const isHandledLocally = errorCode === "MAX_SESSIONS_REACHED";

    if (!isHandledLocally && (error.response?.status !== 401 || originalRequest?._retry)) {
      errorToast({
        description: message,
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
