"use client";

import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadNotifications,
  markNotificationAsRead,
} from "@/app/services/notificationService";
import NotificationPresentation from "../presentation/NotificationPresentation";

export default function NotificationContainer() {
  const [activeTab, setActiveTab] = useState("all");
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["notifications", activeTab],
    queryFn: async ({ pageParam = 10 }) => {
      if (activeTab === "all") {
        return await fetchNotifications(pageParam, 0);
      } else {
        return await fetchUnreadNotifications(pageParam, 0);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.notifications || lastPage.notifications.length < 10) {
        return undefined;
      }

      const currentTotal = allPages.reduce(
        (total, page) => total + page.notifications.length,
        0
      );

      return currentTotal + 10;
    },
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => markNotificationAsRead(notificationId),
    onMutate: async (notificationId) => {
      setIsMarkingAsRead(true);

      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({ queryKey: ["sidebarInfo"] });

      const previousData = queryClient.getQueryData([
        "notifications",
        activeTab,
      ]);

      queryClient.setQueryData(["notifications", activeTab], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            notifications: page.notifications.map((notification) =>
              notification._id === notificationId
                ? { ...notification, isRead: true }
                : notification
            ),
          })),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["sidebarInfo", "notifications"] });
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["notifications", activeTab],
          context.previousData
        );
      }
      console.error("Error marking notification as read:", err);
    },
    onSettled: () => {
      setIsMarkingAsRead(false);
    },
  });

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleLoadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  const handleMarkAsRead = async (notificationId) => {
    markAsReadMutation.mutate(notificationId);
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case "Like":
      case "Love":
      case "Funny":
      case "Support":
      case "Insightful":
      case "Comment":
        return `/u/${notification?.toUserId?.username}/post/${
          notification.data?.postId || ""
        }`;
      case "Message":
        return `/messages/?${notification.data?.fromUsername || ""}`;
      case "ConnectionRequest":
        return `/network`;
      default:
        return "#";
    }
  };

  const allNotifications =
    data?.pages[data.pages.length - 1]?.notifications || [];

  const displayedNotifications =
    activeTab === "all"
      ? allNotifications
      : allNotifications.filter((note) => !note.isRead);

  return (
    <NotificationPresentation
      notifications={displayedNotifications}
      loading={isLoading}
      loadingMore={isFetchingNextPage}
      error={
        isError
          ? error?.message ||
            "Failed to load notifications. Please try again later."
          : null
      }
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onMarkAsRead={handleMarkAsRead}
      getNotificationLink={getNotificationLink}
      hasMore={!!hasNextPage}
      onLoadMore={handleLoadMore}
      isMarkingAsRead={isMarkingAsRead}
    />
  );
}
