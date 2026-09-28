import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { TICKET_ENDPOINTS } from "@/lib/api/endpoints/ticket.endpoints";
import { useQuery } from "@tanstack/react-query";

export interface TicketRowData {
  id: string;
  ticketId: string;
  orderId: string;
  refrenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  storeName: string;
  subject: string;
  description: string;
  status: string;
  ticketStatus: string;
  date: string;
  closedBy: string;
}

export interface GetTicketsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetTicketsResponse {
  message: string;
  status: boolean;
  data: TicketRowData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useGetTickets(params?: GetTicketsParams, enabled = true) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.TICKETS, params],
    queryFn: async () => {
      const { data } = await apiClient.get<GetTicketsResponse>(TICKET_ENDPOINTS.BASE, {
        params,
      });
      return data;
    },
    enabled,
  });
}
