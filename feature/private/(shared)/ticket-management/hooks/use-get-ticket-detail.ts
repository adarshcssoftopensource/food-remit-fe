import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { TICKET_ENDPOINTS } from "@/lib/api/endpoints/ticket.endpoints";
import { useQuery } from "@tanstack/react-query";

export interface TicketChatMessage {
  id: string;
  ticketId: string;
  subject?: string;
  userId?: string;
  userMessage?: string;
  supportMessage?: string;
  addedOn?: string;
  addedOnTimestamp?: number | null;
}

export interface TicketDetailData {
  id: string;
  ticketId: string;
  orderId: string;
  refrenceNumber: string;
  subject: string;
  description: string;
  ticketStatus: string;
  status: string;
  addedOn: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    country?: string;
    city?: string;
  } | null;
  store?: {
    id: string;
    storeName: string;
    storeAddress?: string;
  } | null;
  productName?: string;
  chats: TicketChatMessage[];
}

export interface GetTicketDetailResponse {
  message: string;
  status: boolean;
  data: TicketDetailData;
}

export function useGetTicketDetail(id?: string | null) {
  return useQuery({
    queryKey: API_CACHE_KEYS.TICKET_BY_ID(id || ""),
    queryFn: async () => {
      if (!id) return null;
      const { data } = await apiClient.get<GetTicketDetailResponse>(TICKET_ENDPOINTS.GET_BY_ID(id));
      return data.data;
    },
    enabled: Boolean(id),
  });
}
