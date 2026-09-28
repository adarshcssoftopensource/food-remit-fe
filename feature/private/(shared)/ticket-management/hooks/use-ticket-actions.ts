import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { TICKET_ENDPOINTS } from "@/lib/api/endpoints/ticket.endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSendTicketReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) => {
      const { data } = await apiClient.post(TICKET_ENDPOINTS.REPLY(id), { message });
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Reply sent successfully");
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.TICKET_BY_ID(variables.id) });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.TICKETS });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to send reply");
    },
  });
}

export function useCloseTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(TICKET_ENDPOINTS.CLOSE(id));
      return data;
    },
    onSuccess: (_, id) => {
      toast.success("Ticket closed successfully");
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.TICKET_BY_ID(id) });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.TICKETS });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to close ticket");
    },
  });
}
