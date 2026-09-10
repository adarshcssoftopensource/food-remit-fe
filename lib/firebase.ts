import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, Messaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
);

// Initialize Firebase only on the client side when valid config exists
const app =
  typeof window !== "undefined" && hasFirebaseConfig
    ? !getApps().length
      ? initializeApp(firebaseConfig)
      : getApp()
    : null;

let messaging: Messaging | null = null;

// Initialize messaging only if supported (some browsers like Safari/iOS might block it or not support it)
if (typeof window !== "undefined" && app) {
  try {
    isSupported()
      .then((supported) => {
        if (supported && app) {
          messaging = getMessaging(app);
        }
      })
      .catch((err) => {
        console.warn("Firebase messaging not supported on this browser:", err);
      });
  } catch (err) {
    console.warn("Failed to check Firebase messaging support:", err);
  }
}

export { app, messaging };
