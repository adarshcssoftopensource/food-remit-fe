"use client";

import { useEffect, useState } from "react";
import { getToken, onMessage, MessagePayload } from "firebase/messaging";
import { messaging } from "@/lib/firebase";

export const useFcm = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
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
  };

  const generateToken = async () => {
    try {
      if (!messaging) return;

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.warn("VAPID key not found in environment variables");
        return;
      }

      // Register the service worker with dynamic environment variables
      const swUrl = `/firebase-messaging-sw.js?apiKey=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}&projectId=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}&messagingSenderId=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}&appId=${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}`;

      const registration = await navigator.serviceWorker.register(swUrl);

      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });
      if (token) {
        setFcmToken(token);
        // Here you would typically send this token to your backend
        // console.log("FCM Token:", token);
      } else {
        console.warn("Failed to generate FCM token");
      }
    } catch (error) {
      console.error("Error generating FCM token:", error);
    }
  };

  const setupForegroundListener = (onMessageReceived: (payload: MessagePayload) => void) => {
    if (!messaging) return () => {};

    const unsubscribe = onMessage(messaging, (payload) => {
      // console.log("Foreground message received:", payload);
      onMessageReceived(payload);
    });

    return unsubscribe;
  };

  return {
    fcmToken,
    permission,
    requestPermission,
    setupForegroundListener,
  };
};
