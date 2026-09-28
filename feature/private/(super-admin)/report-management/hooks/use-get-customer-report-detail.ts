import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useQuery } from "@tanstack/react-query";

export interface CustomerReportDetailData {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    profileImage: string | null;
    city: string;
    state: string;
    country: string;
    countryCode: string;
    address: string;
    userStatus: "ACTIVE" | "INACTIVE" | "PENDING" | "DENIED";
    emailVerifyStatus: "VERIFIED" | "UNVERIFIED";
    createdAt: string;
  };
  stats: {
    totalOrders: number;
    ordersSent: number;
    ordersRequested: number;
    completedOrders: number;
    cancelledOrders: number;
    totalSpent: string;
    totalSpentVal: number;
  };
}

export interface CustomerReportDetailResponse {
  message: string;
  status: boolean;
  data: CustomerReportDetailData;
}

export function useGetCustomerReportDetail(customerId: string) {
  return useQuery({
    queryKey: API_CACHE_KEYS.CUSTOMER_REPORT_DETAIL(customerId),
    queryFn: async () => {
      const { data } = await apiClient.get<CustomerReportDetailResponse>(
        REPORT_ENDPOINTS.GET_CUSTOMER_REPORT_DETAIL(customerId),
      );
      return data;
    },
    enabled: Boolean(customerId),
  });
}
