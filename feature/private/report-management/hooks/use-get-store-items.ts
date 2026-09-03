import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useQuery } from "@tanstack/react-query";

export interface StoreItemRow {
  id: string;
  productName: string;
  description: string;
  upcCode: string;
  unit: string;
  productImage: string | null;
  categoryName: string;
  departmentName: string;
  price: number;
  currency: string;
  status: string;
  totalUnitsSold: number;
  totalTransactionsCount: number;
  totalSalesAmount: string;
}

export interface GetStoreItemsParams {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface StoreItemsResponse {
  message: string;
  status: boolean;
  data: StoreItemRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useGetStoreItems(storeId: string, params?: GetStoreItemsParams) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.STORE_ITEMS(storeId), params],
    queryFn: async () => {
      const { data } = await apiClient.get<StoreItemsResponse>(
        REPORT_ENDPOINTS.GET_STORE_ITEMS(storeId),
        { params },
      );
      return data;
    },
    enabled: Boolean(storeId),
  });
}
