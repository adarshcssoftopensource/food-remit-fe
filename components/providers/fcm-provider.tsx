"use client";

import { useEffect } from "react";
import { useFcm } from "@/hooks/use-fcm";
import { toast } from "sonner";

export function FcmProvider({ children }: { children: React.ReactNode }) {
  const { requestPermission, setupForegroundListener } = useFcm();

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
      });

      return () => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      };
    } catch (err) {
      console.warn("FCM foreground listener setup failed:", err);
    }
  }, [requestPermission, setupForegroundListener]);

  return <>{children}</>;
}
