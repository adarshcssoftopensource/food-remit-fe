"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useFcm } from "@/hooks/use-fcm";
import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { NOTIFICATION_ENDPOINTS } from "@/lib/api/endpoints/notification.endpoints";
import { playNotificationSound } from "@/lib/utils/notification-sound";

type NotificationCountResponse = {
  status: boolean;
  data?: {
    notificationCount?: number;
    latestNotification?: {
      id: string;
      title: string;
      message: string;
      createdAt: string;
    } | null;
  };
};

export function FcmProvider({ children }: { children: React.ReactNode }) {
  const { requestPermission, setupForegroundListener } = useFcm();
  const queryClient = useQueryClient();

  // Fast 5-second real-time polling for unread notifications and latest notification item
  const { data } = useApiQuery<NotificationCountResponse>(
    API_CACHE_KEYS.NOTIFICATION_COUNT,
    NOTIFICATION_ENDPOINTS.COUNT,
    {
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
      skipErrorToast: true,
    },
  );

  const mountedAtRef = useRef<number | null>(null);
  const lastSeenIdRef = useRef<string | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);
  const previousCountRef = useRef<number>(0);

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  // Request browser Notification permission on mount if supported
  useEffect(() => {
    if (typeof window !== "undefined" && typeof Notification !== "undefined") {
      requestPermission().catch(() => {});
    }
  }, [requestPermission]);

  // Setup Firebase foreground listener (if FCM configured)
  useEffect(() => {
    try {
      const unsubscribe = setupForegroundListener(() => {
        playNotificationSound();

        void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.NOTIFICATION_COUNT });
        void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.NOTIFICATIONS });
      });

      return () => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      };
    } catch (err) {
      console.warn("FCM foreground listener setup failed:", err);
    }
  }, [setupForegroundListener, queryClient]);

  // Handle live polling notification alerts
  useEffect(() => {
    if (!data?.data) return;

    const count = Number(data.data.notificationCount || 0);
    const latest = data.data.latestNotification;

    // First time data arrives: record baseline without firing alerts for past notifications
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      previousCountRef.current = count;
      lastSeenIdRef.current = latest?.id || null;
      return;
    }

    // Check if a new unread notification has arrived
    if (
      latest?.id &&
      latest.id !== lastSeenIdRef.current &&
      count > 0 &&
      count >= previousCountRef.current
    ) {
      const createdTime = latest.createdAt ? new Date(latest.createdAt).getTime() : Date.now();
      const baseTime = mountedAtRef.current ?? Date.now();
      if (createdTime >= baseTime - 60000) {
        playNotificationSound();

        // Live refresh the notifications inbox list immediately!
        void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.NOTIFICATIONS });
      }
    }

    lastSeenIdRef.current = latest?.id || null;
    previousCountRef.current = count;
  }, [data, queryClient]);

  return <>{children}</>;
}
