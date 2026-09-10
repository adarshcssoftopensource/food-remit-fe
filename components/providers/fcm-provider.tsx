"use client";

import { useEffect } from "react";
import { useFcm } from "@/hooks/use-fcm";
import { toast } from "sonner";

import { useQueryClient } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

export function FcmProvider({ children }: { children: React.ReactNode }) {
  const { requestPermission, setupForegroundListener } = useFcm();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only attempt permission if supported on this browser/device
    if (typeof window !== "undefined" && typeof Notification !== "undefined") {
      requestPermission().catch(() => {});
    }

    try {
      const unsubscribe = setupForegroundListener((payload) => {
        const title = payload?.notification?.title || "New Notification";
        const body = payload?.notification?.body || "";

        toast(title, {
          description: body,
          position: "top-right",
        });

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
  }, [requestPermission, setupForegroundListener, queryClient]);

  return <>{children}</>;
}
