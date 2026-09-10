"use client";

import { useCallback, useEffect, useState } from "react";
import { getToken, onMessage, MessagePayload } from "firebase/messaging";
import { messaging } from "@/lib/firebase";

export const useFcm = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && typeof Notification !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPermission(Notification.permission);
      } catch (err) {
        console.warn("Notification permission check failed:", err);
      }
    }
  }, []);

  const generateToken = useCallback(async () => {
    try {
      if (!messaging) return;

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        return;
      }

      if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
        return;
      }

      const swUrl = `/firebase-messaging-sw.js?apiKey=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ""}&projectId=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ""}&messagingSenderId=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ""}&appId=${process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""}`;

      const registration = await navigator.serviceWorker.register(swUrl);

      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });
      if (token) {
        setFcmToken(token);
      }
    } catch (error) {
      console.error("Error generating FCM token:", error);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && typeof Notification !== "undefined") {
        const p = await Notification.requestPermission();
        setPermission(p);

        if (p === "granted") {
          await generateToken();
        } else {
          console.warn("Notification permission denied");
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  }, [generateToken]);

  const setupForegroundListener = useCallback(
    (onMessageReceived: (payload: MessagePayload) => void) => {
      if (!messaging) return () => {};

      try {
        const unsubscribe = onMessage(messaging, (payload) => {
          onMessageReceived(payload);
        });
        return unsubscribe;
      } catch {
        return () => {};
      }
    },
    [],
  );

  return {
    fcmToken,
    permission,
    requestPermission,
    setupForegroundListener,
  };
};
