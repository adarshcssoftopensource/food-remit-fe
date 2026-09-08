"use client";

import { useEffect, useState } from "react";
import { useFcm } from "@/hooks/use-fcm";
import { toast } from "sonner";

export function FcmProvider({ children }: { children: React.ReactNode }) {
  const { requestPermission, setupForegroundListener } = useFcm();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    // Attempt to request permission and get token
    requestPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Listen for foreground messages
    const unsubscribe = setupForegroundListener((payload) => {
      const title = payload?.notification?.title || "New Notification";
      const body = payload?.notification?.body || "";

      toast(title, {
        description: body,
        position: "top-right",
      });
    });

    return () => {
      unsubscribe();
    };
  }, [isMounted, setupForegroundListener]);

  // Optional: You could expose the fcmToken via context here if needed by other components,
  // but for now we just handle the side effects.

  return <>{children}</>;
}
