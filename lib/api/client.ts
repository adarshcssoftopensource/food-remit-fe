import { AUTH_REFRESH_TOKEN_COOKIE, AUTH_TOKEN_COOKIE } from "@/config/cookie";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import axios from "axios";
import Cookies from "js-cookie";

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

export default axiosInstance;
