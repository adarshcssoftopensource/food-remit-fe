import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export interface AvailableOption {
  key: "orderEmails" | "broadcastEmails" | "leadEmails" | "ticketEmails";
  label: string;
  description: string;
  enabled: boolean;
}

export interface EmailNotificationPreferenceData {
  userId: string;
  userType: string;
  roleTitle: string;
  emailNotifications: boolean;
  orderEmails: boolean;
  broadcastEmails: boolean;
  leadEmails: boolean;
  ticketEmails: boolean;
  availableOptions: AvailableOption[];
}

export interface EmailNotificationResponse {
  message: string;
  status: boolean;
  data: EmailNotificationPreferenceData;
}

export interface UpdateEmailNotificationPayload {
  emailNotifications?: boolean;
  orderEmails?: boolean;
  broadcastEmails?: boolean;
  leadEmails?: boolean;
  ticketEmails?: boolean;
}

export function useGetEmailNotifications() {
  return useApiQuery<EmailNotificationResponse>(
    API_CACHE_KEYS.SETTINGS_EMAIL_NOTIFICATIONS,
    SETTINGS_ENDPOINTS.GET_EMAIL_NOTIFICATIONS,
  );
}

export function useUpdateEmailNotifications() {
  const queryClient = useQueryClient();

  return useApiMutation<EmailNotificationResponse, UpdateEmailNotificationPayload>(
    "patch",
    SETTINGS_ENDPOINTS.UPDATE_EMAIL_NOTIFICATIONS,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.SETTINGS_EMAIL_NOTIFICATIONS,
        });
      },
    },
  );
}
