import type { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/client";

interface FetcherArgs<TBody = unknown> {
  method: "get" | "post" | "put" | "delete";
  url: string;
  body?: TBody;
  timeout?: number;
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
  timeout = 10000,
}: FetcherArgs<TBody>): Promise<TResponse> {
  const response = await axiosInstance.request<ApiResponse<TResponse>>({
    method,
    url,
    data: body,
    timeout,
  });
  return response.data as TResponse;
}

// GET Hook
export function useApiQuery<TResponse>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<TResponse, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<TResponse, Error>({
    queryKey: key,
    queryFn: () => fetcher<TResponse>({ method: "get", url }),
    ...options,
  });
}

// POST / PUT / DELETE Hook
export function useApiMutation<TResponse, TBody = unknown>(
  method: "post" | "put" | "delete",
  url: string,
  options?: UseMutationOptions<TResponse, Error, TBody>,
) {
  return useMutation<TResponse, Error, TBody>({
    mutationFn: (body: TBody) =>
      fetcher<TResponse, TBody>({
        method,
        url,
        body,
        timeout: 120000,
      }),

    ...options,
  });
}
