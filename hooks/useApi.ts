import axiosInstance from "@/lib/api/client";
import type { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

interface FetcherArgs<TBody = unknown> {
  method: "get" | "post" | "put" | "patch" | "delete";
  url: string;
  body?: TBody;
  timeout?: number;
  skipErrorToast?: boolean;
}

export interface ApiResponse<T = unknown> {
  status: boolean;
  path: string;
  message?: string;
  statusCode: number;
  data?: T;
  timestamp: string;
}

export async function fetcher<TResponse, TBody = unknown>({
  method,
  url,
  body,
  timeout = 20000,
  skipErrorToast = false,
}: FetcherArgs<TBody>): Promise<TResponse> {
  const response = await axiosInstance.request<ApiResponse<TResponse>>({
    method,
    url,
    data: body,
    timeout,
    headers: skipErrorToast ? { "x-skip-error-toast": "true" } : undefined,
  });
  return response.data as TResponse;
}

// GET Hook
export function useApiQuery<TResponse>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<TResponse, Error>, "queryKey" | "queryFn"> & {
    timeout?: number;
    skipErrorToast?: boolean;
  },
) {
  const { timeout, skipErrorToast, ...queryOptions } = options || {};
  return useQuery<TResponse, Error>({
    queryKey: key,
    queryFn: () => fetcher<TResponse>({ method: "get", url, timeout, skipErrorToast }),
    ...queryOptions,
  });
}

// POST / PUT / DELETE Hook
export function useApiMutation<TResponse, TBody = unknown>(
  method: "post" | "put" | "patch" | "delete",
  url: string | ((body: TBody) => string),
  options?: UseMutationOptions<TResponse, Error, TBody>,
) {
  return useMutation<TResponse, Error, TBody>({
    mutationFn: (body: TBody) =>
      fetcher<TResponse, TBody>({
        method,
        url: typeof url === "function" ? url(body) : url,
        body,
        timeout: 120000,
      }),

    ...options,
  });
}
