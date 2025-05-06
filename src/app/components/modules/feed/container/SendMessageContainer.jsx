"use client";
import DialogMod from "@/app/components/ui/DialogMod";
import { messagingService } from "@/app/services/messagingService";
import SendMessagePresentation from "../presentation/SendMessagePresentation";
import { useState } from "react";
import { useRef } from "react";
import { fetchUserConnections } from "@/app/services/userProfile";
import { useEffect } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Send } from "@mui/icons-material";
import { useToast } from "@/app/context/ToastContext";

/**
 * SendMessageContainer - Dialog component for sharing content via direct messages
 * 
 * This component allows users to select a connection and send a shared link/URL 
 * as a direct message. Features include:
 * - Modal dialog with Send button trigger
 * - Connection list with infinite scrolling pagination
 * - User selection interface
 * - Message sending functionality with success/error feedback
 * - Proper connection relationship display
 * 
 * The component uses React Query for data fetching and mutations, with
 * Intersection Observer for the infinite scrolling behavior.
 * 
 * @param {Object} props - Component props
 * @param {string} props.shareUrl - URL to be shared in the message
 * @returns {JSX.Element} Send message dialog component
 */
export default function SendMessageContainer({ shareUrl }) {
  const [userToSend, setUserToSend] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const observerTarget = useRef(null);
  const toast = useToast();

  /**
   * Infinite query for fetching paginated user connections
   * Loads 10 connections per page with automatic pagination
   */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["connections"],
    queryFn: ({ pageParam = 1 }) => fetchUserConnections(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.length || lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  /**
   * Sets up intersection observer for infinite scrolling
   * Includes a short delay to ensure dialog is rendered before observing
   */
  useEffect(() => {
    if (!messageModalOpen) return;

    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            console.log("Intersection detected, loading more...");
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        }
      );

      const currentTarget = observerTarget.current;
      if (currentTarget) observer.observe(currentTarget);

      return () => {
        if (currentTarget) observer.unobserve(currentTarget);
        clearTimeout(timer);
      };
    }, 300); // Small delay to ensure dialog is rendered

    return () => clearTimeout(timer);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, messageModalOpen]);

  const connections = data?.pages.flatMap((page) => page) || [];

  /**
   * Mutation for sending a message containing the share URL
   * Provides toast notifications for success/error states
   */
  const handleSendMessageMutation = useMutation({
    mutationFn: (params) => {
      const { receiverName, shareUrl } = params;
      return messagingService.sendMessage(receiverName, shareUrl);
    },
    onSuccess: () => {
      toast("Message sent successfully.");
      setMessageModalOpen(false);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast("Error sending message.", false);
      setMessageModalOpen(false);
    },
  });

  /**
   * Formats connection degree numbers to display text
   * @param {number} relation - Connection degree (0-3)
   * @returns {string} Formatted connection label (1st, 2nd, 3rd, 3rd+)
   */
  const changeRelation = (relation) => {
    switch (relation) {
      case 0:
        return "3rd+";
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
    }
  };

  /**
   * Process connections data to include formatted relation text
   */
  const allConnections = [...connections].map((connection) => ({
    ...connection,
    relation: changeRelation(connection?.connectionDegree),
  }));

  /**
   * Handles sending a message to the selected connection
   * @param {string} receiverName - Username of the message recipient
   */
  const handleSendMessage = async (receiverName) => {
    handleSendMessageMutation.mutate({
      receiverName,
      shareUrl,
    });
  };

  return (
    <DialogMod
      open={messageModalOpen}
      variant="ghost"
      size="sm"
      testId="send-button"
      onOpenChange={setMessageModalOpen}
      buttonClass="flex gap-2 items-center cursor-pointer text-primary rounded-md hover:bg-primary/10"
      buttonData={
        <>
          <Send sx={{ fontSize: "1.3rem" }} className="-rotate-45" />
          <span className="text-primary/90 font-semibold">Send</span>
        </>
      }
      AlertContent={
        <SendMessagePresentation
          connections={allConnections}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          isError={isError}
          observerTarget={observerTarget}
          userToSend={userToSend}
          setUserToSend={setUserToSend}
          sendMessage={handleSendMessage}
          isSendingMessage={handleSendMessageMutation.isPending}
        />
      }
    />
  );
}
