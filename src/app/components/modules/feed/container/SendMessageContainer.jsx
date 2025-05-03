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

export default function SendMessageContainer({ shareUrl }) {
  const [userToSend, setUserToSend] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const observerTarget = useRef(null);
  const toast = useToast();

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

  const allConnections = [...connections].map((connection) => ({
    ...connection,
    relation: changeRelation(connection?.connectionDegree),
  }));

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
