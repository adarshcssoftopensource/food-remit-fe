import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { FAQ_ENDPOINTS } from "@/lib/api/endpoints/content-pages.endpoints";
import type { FaqFormValues } from "../schema/content.schema";
import type { FaqData } from "../types";

type FaqsResponse = {
  message: string;
  data: FaqData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type FaqResponse = {
  message: string;
  data: FaqData;
};

export function useGetFaqs(
  search?: string,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
  page = 1,
  limit = 10,
) {
  return useApiQuery<FaqsResponse>(
    [
      ...API_CACHE_KEYS.FAQS,
      search ?? "",
      sortBy ?? "",
      sortOrder ?? "",
      String(page),
      String(limit),
    ],
    FAQ_ENDPOINTS.ADMIN_LIST(search, sortBy, sortOrder, page, limit),
  );
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: FaqFormValues) => {
      const { data } = await apiClient.post<FaqResponse>(FAQ_ENDPOINTS.ADMIN_CREATE, values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.FAQS });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.FAQS_PUBLIC });
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: FaqFormValues }) => {
      const { data } = await apiClient.put<FaqResponse>(FAQ_ENDPOINTS.ADMIN_UPDATE(id), values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.FAQS });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.FAQS_PUBLIC });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(FAQ_ENDPOINTS.ADMIN_DELETE(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.FAQS });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.FAQS_PUBLIC });
    },
  });
}
