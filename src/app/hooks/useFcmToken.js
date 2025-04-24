"use client";

import { useEffect, useRef, useState } from "react";
import { getToken, onMessage, Unsubscribe } from "firebase/messaging";
import { fetchToken, messaging } from "@/firebase/firebase";
import { useRouter, usePathname } from "next/navigation";
import { sendFCMtoken } from "../services/notificationService";

async function getNotificationPermissionAndToken() {
  if (!("Notification" in window)) {
    console.info("This browser does not support desktop notification");
    return null;
  }

  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  }

  console.log("Notification permission not granted.");
  return null;
}

const useFcmToken = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState(null); 
  const [token, setToken] = useState(null); 
  const retryLoadToken = useRef(0); 
  const isLoading = useRef(false);
  
  const isHomePage = pathname === "/" || pathname === "/home";

  const loadToken = async () => {
    if (isLoading.current) return;

    isLoading.current = true; 
    const token = await getNotificationPermissionAndToken(); 
    console.log("Token fetched:", token);
    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      console.info(
        "%cPush Notifications issue - permission denied",
        "color: green; background: #c7c7c7; padding: 8px; font-size: 20px"
      );
      isLoading.current = false;
      return;
    }

    if (!token) {
      if (retryLoadToken.current >= 3) {
        alert("Unable to load token, refresh the browser");
        console.info(
          "%cPush Notifications issue - unable to load token after 3 retries",
          "color: green; background: #c7c7c7; padding: 8px; font-size: 20px"
        );
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.error("An error occurred while retrieving token. Retrying...");
      isLoading.current = false;
      await loadToken();
      return;
    }

    try {
      await sendFCMtoken(token);
      console.log("FCM token successfully sent to the backend");
    } catch (error) {
      console.error("Failed to send FCM token to the backend:", error);
    }

    setNotificationPermissionStatus(Notification.permission);
    setToken(token);
    isLoading.current = false;
  };

  useEffect(() => {
    if ("Notification" in window && isHomePage) {
      loadToken();
    }
  }, [pathname]);

  useEffect(() => {
    if (!token || !isHomePage) return;

    const setupListener = async () => {
      if (!token) return; 

      console.log(`onMessage registered with token ${token}`);
      const m = await messaging();
      if (!m) return;

      const unsubscribe = onMessage(m, (payload) => {
        if (Notification.permission !== "granted") return;

        console.log("Foreground push notification received:", payload);
        const link = payload.fcmOptions?.link || payload.data?.link;

        const n = new Notification(
          payload.notification?.title || "New message",
          {
            body: payload.notification?.body || "This is a new message",
            data: link ? { url: link } : undefined,
          }
        );

        n.onclick = (event) => {
          event.preventDefault();
          const link = event.target?.data?.url;
          if (link) {
            router.push(link);
          } else {
            console.log("No link found in the notification payload");
          }
        };
      });

      return unsubscribe;
    };

    let unsubscribe = null;

    setupListener().then((unsub) => {
      if (unsub) {
        unsubscribe = unsub;
      }
    });

    return () => unsubscribe?.();
  }, [token, router, pathname]);

  return { token, notificationPermissionStatus }; 
};

export default useFcmToken;
