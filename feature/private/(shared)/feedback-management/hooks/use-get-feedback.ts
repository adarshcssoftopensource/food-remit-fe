import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { FEEDBACK_ENDPOINTS } from "@/lib/api/endpoints/feedback.endpoints";
import { useQuery } from "@tanstack/react-query";

export interface FeedbackRowData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  countryId?: string | null;
  cityId?: string | null;
  rating: number;
  useApplicationAgain: string;
  recommend: string;
  subject: string;
  message: string;
  submittedOn: string;
  status: "Pending" | "Reviewed" | "Resolved";
}

export interface GetFeedbackParams {
  page?: number;
  limit?: number;
  search?: string;
  rating?: string;
  countryId?: string;
  cityId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetFeedbackResponse {
  message: string;
  status: boolean;
  data: FeedbackRowData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useGetFeedback(params?: GetFeedbackParams, enabled = true) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.FEEDBACK, params],
    queryFn: async () => {
      const { data } = await apiClient.get<GetFeedbackResponse>(FEEDBACK_ENDPOINTS.BASE, {
        params,
      });
      return data;
    },
    enabled,
  });
}
