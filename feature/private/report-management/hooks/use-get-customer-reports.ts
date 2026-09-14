import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useQuery } from "@tanstack/react-query";
import type { CustomerReportRow } from "@/constants/report-management";

export interface GetCustomerReportsParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  city?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CustomerReportsResponse {
  message: string;
  status: boolean;
  data: CustomerReportRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useGetCustomerReports(params?: GetCustomerReportsParams) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.CUSTOMER_REPORTS, params],
    queryFn: async () => {
      const { data } = await apiClient.get<CustomerReportsResponse>(
        REPORT_ENDPOINTS.GET_CUSTOMER_REPORTS,
        { params },
      );
      return data;
    },
  });
}
