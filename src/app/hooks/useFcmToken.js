"use client";

import { useEffect, useRef, useState } from "react";
import { getToken, onMessage, Unsubscribe } from "firebase/messaging";
import { fetchToken, messaging } from "@/firebase/firebase";
import { useRouter, usePathname } from "next/navigation";
import { sendFCMtoken } from "../services/notificationService";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

async function getNotificationPermissionAndToken() {
  if (!("Notification" in window)) {
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

  return null;
}

const useFcmToken = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState(null); 
  const [token, setToken] = useState(null); 
  const retryLoadToken = useRef(0); 
  const isLoading = useRef(false);
  
  const isHomePage = pathname === "/";

  const loadToken = async () => {
    if (isLoading.current) return;

    isLoading.current = true; 
    const token = await getNotificationPermissionAndToken(); 
    console.log("Token fetched:", token);
    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      isLoading.current = false;
      return;
    }

    if (!token) {
      if (retryLoadToken.current >= 3) {
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
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
        const title = payload.notification?.title || "New message";
        const body = payload.notification?.body || "This is a new message";
        const link = payload.fcmOptions?.link || payload.data?.link;

        queryClient.invalidateQueries(["sidebarInfo", "notifications"]);

        toast(title, {
          description: body,
          action: link ? {
            label: "View",
            onClick: () => router.push(link),
          } : undefined,
          duration: 5000,
          position: "top-right",
          className: "notification-toast",
          icon: "🔔",
        });
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
  }, [token, router, pathname, queryClient]);

  return { token, notificationPermissionStatus }; 
};

export default useFcmToken;
