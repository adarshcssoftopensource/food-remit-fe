importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

// Extract config dynamically from the URL query parameters
const urlParams = new URLSearchParams(self.location.search);

const firebaseConfig = {
  apiKey: urlParams.get("apiKey"),
  projectId: urlParams.get("projectId"),
  messagingSenderId: urlParams.get("messagingSenderId"),
  appId: urlParams.get("appId"),
};

// Initialize the Firebase app only if config exists
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "null") {
  firebase.initializeApp(firebaseConfig);

  // Retrieve an instance of Firebase Messaging
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    // eslint-disable-next-line no-console
    console.log("[firebase-messaging-sw.js] Received background message ", payload);

    const notificationTitle = payload.notification.title || "Food Remit Notification";
    const notificationOptions = {
      body: payload.notification.body || "You have a new message.",
      icon: "/favicon.ico",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} else {
  console.warn("Firebase SW: Missing config parameters in URL.");
}
