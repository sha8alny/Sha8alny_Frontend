"use client";

import { useState, useEffect, useCallback } from "react";

import { useService } from "@/app/context/ServiceContext";
import { MessagingPresentation } from "../presentation/MessagingInterface";
import { ConnectionsModal } from "../presentation/ConnectionsModal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function MessagingContainer({ currentUser }) {
  const [userConversations, setUserConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [userConnections, setUserConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const service = useService();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memoized function to find other participant in conversation
  const getOtherParticipant = useCallback(
    (conversation) => {
      if (!conversation?.participants) return null;
      const otherParticipant = conversation.participants.find(
        (participant) => participant !== currentUser
      );
      return otherParticipant;
    },
    [currentUser]
  );

  // Set up real-time subscription to conversations
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = service.subscribeToConversations(
      currentUser,
      (updatedConversations) => {
        if (Array.isArray(updatedConversations)) {
          console.log("Subscription update received:", updatedConversations);
          setUserConversations(updatedConversations);

          // Check URL for username parameter when conversations load
          const username = searchParams.get("username");
          if (username && !selectedConversationId) {
            const matchingConversation = updatedConversations.find((conv) =>
              conv.participants.includes(username)
            );
            if (matchingConversation) {
              setSelectedConversationId(matchingConversation.id);
            }
          }
        }
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [currentUser, service, searchParams, selectedConversationId]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      setSelectedConversation(null);
      return;
    }

    const selectedUserConversation = userConversations.find(
      (conv) => conv.id === selectedConversationId
    );

    if (!selectedUserConversation) return;

    const otherParticipant = getOtherParticipant(selectedUserConversation);
    if (!otherParticipant) return;

    // Only update URL when not navigating back
    if (!isNavigatingBack) {
      // Update URL with the username when conversation is selected
      const url = `${pathname}?username=${otherParticipant}`;
      router.push(url, { scroll: false });
    }

    // Reset the navigating back state
    if (isNavigatingBack) {
      setIsNavigatingBack(false);
    }

    const conversationDetails = {
      id: selectedUserConversation.id,
      participants: selectedUserConversation.participants,
      createdAt: selectedUserConversation.createdAt,
      updatedAt: selectedUserConversation.timestamp,
      participantId: otherParticipant,
      participantName: otherParticipant,
      participantAvatar: null,
      unreadCount: selectedUserConversation.read ? 0 : 1,
      isTyping: true,
      isBlocked: false,
      readStatus: selectedUserConversation.read ? null : "unread",
      lastMessage: selectedUserConversation.lastMessage,
    };

    setSelectedConversation(conversationDetails);

    // Set up real-time listener for new messages
    const unsubscribe = service.subscribeToConversationMessages(
      selectedConversationId,
      (newMessages) => {
        if (Array.isArray(newMessages)) {
          setMessages(newMessages);
          console.log("New messages received:", newMessages);
        }
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [
    selectedConversationId,
    userConversations,
    getOtherParticipant,
    service,
    pathname,
    router,
    isNavigatingBack,
  ]);

  const handleSelectConversation = useCallback((conversationId) => {
    setSelectedConversationId(conversationId);
  }, []);

  const handleMarkAsRead = useCallback(
    async (conversationId) => {
      try {
        const selectedConv = userConversations.find(
          (conv) => conv.id === conversationId
        );
        if (!selectedConv) return;

        const otherParticipant = getOtherParticipant(selectedConv);
        if (otherParticipant) {
          await service.markMessagesAsRead(otherParticipant);
          // Update the conversation read status in local state
          setUserConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversationId ? { ...conv, read: true } : conv
            )
          );
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    },
    [userConversations, getOtherParticipant, service]
  );

  const handleMarkAsUnread = useCallback(
    async (conversationId) => {
      try {
        const selectedConv = userConversations.find(
          (conv) => conv.id === conversationId
        );
        if (!selectedConv) return;

        const otherParticipant = getOtherParticipant(selectedConv);
        if (otherParticipant) {
          await service.toggleConversationReadStatus(otherParticipant);
          // Update the conversation read status in local state
          setUserConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversationId ? { ...conv, read: false } : conv
            )
          );
        }
      } catch (error) {
        console.error("Error toggling conversation read status:", error);
      }
    },
    [userConversations, getOtherParticipant, service]
  );

  const handleToggleBlock = useCallback(
    async (conversationId, isBlocked) => {
      try {
        if (currentUser) {
          await service.toggleUserBlock(currentUser, conversationId, isBlocked);
          // Update the blocked status in local state
          setSelectedConversation((prev) =>
            prev
              ? {
                  ...prev,
                  isBlocked: !prev.isBlocked,
                }
              : null
          );
        }
      } catch (error) {
        console.error("Error toggling user block status:", error);
      }
    },
    [currentUser, service]
  );

  const handleSendMessage = useCallback(
    async (receiverName, message, mediaFiles) => {
      try {
        const result = await service.sendMessage(
          receiverName,
          message,
          mediaFiles
        );

        if (result?.success && result?.message) {
          const newMessage = result.message;

          setMessages((prev) => [
            ...prev,
            {
              messageId: newMessage.messageId,
              sender: newMessage.sender,
              receiver: newMessage.receiver,
              content: newMessage.content,
              timestamp: newMessage.timestamp,
              read: newMessage.read,
              mediaUrl: newMessage.mediaUrls?.[0] || null,
            },
          ]);

          // Update the last message in conversations list
          setUserConversations((prev) =>
            prev.map((conv) =>
              conv.participants.includes(receiverName)
                ? {
                    ...conv,
                    lastMessage: {
                      content: newMessage.content,
                      timestamp: newMessage.timestamp,
                    },
                  }
                : conv
            )
          );

          // Update the selected conversation
          setSelectedConversation((prev) =>
            prev
              ? {
                  ...prev,
                  lastMessage: {
                    content: newMessage.content,
                    timestamp: newMessage.timestamp,
                    senderId: newMessage.sender,
                  },
                }
              : null
          );
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [service]
  );

  const handleSetTypingIndicator = useCallback(
    (userId, conversationId, isTyping) => {
      try {
        if (userId && conversationId) {
          service.updateTypingStatus(userId, conversationId, isTyping);
          // Update typing status in selected conversation
          setSelectedConversation((prev) =>
            prev
              ? {
                  ...prev,
                  isTyping,
                }
              : null
          );
        }
      } catch (error) {
        console.error("Error updating typing status:", error);
      }
    },
    [service]
  );

  const handleOpenConnections = useCallback(async () => {
    try {
      setShowConnectionsModal(true);
      setLoadingConnections(true);

      const connections = await service.getUserConnections();
      setUserConnections(Array.isArray(connections) ? connections : []);
    } catch (error) {
      console.error("Error fetching user connections:", error);
      setUserConnections([]);
    } finally {
      setLoadingConnections(false);
    }
  }, [service]);

  const handleStartConversation = useCallback(
    async (connection) => {
      if (!connection?.username) return;

      try {
        const existingConversation = userConversations.find((conv) =>
          conv.participants.includes(connection.username)
        );

        if (existingConversation) {
          setSelectedConversationId(existingConversation.id);
        } else {
          const newConversation = await service.createConversation(
            connection.username,
            currentUser
          );
          if (newConversation?.id) {
            setUserConversations((prev) => [
              ...prev,
              {
                id: newConversation.id,
                participants: [currentUser, connection.username],
                lastMessage: { text: "", timestamp: new Date() },
                read: true,
                createdAt: new Date(),
                timestamp: new Date(),
              },
            ]);
            setSelectedConversationId(newConversation.id);
          }
        }

        setShowConnectionsModal(false);
      } catch (error) {
        console.error("Error starting conversation:", error);
      }
    },
    [userConversations, currentUser, service]
  );

  const handleBack = useCallback(() => {
    if (selectedConversationId !== null) {
      // Set navigating back state to prevent URL updates in the conversation selection effect
      setIsNavigatingBack(true);

      // Clear the conversation state
      setSelectedConversationId(null);

      // Force a URL update using window.history for immediate effect
      // This is more reliable than using the Next.js router for this specific case
      window.history.pushState({}, "", pathname);
    }
  }, [pathname, selectedConversationId]);

  return (
    <>
      <MessagingPresentation
        userConversations={userConversations}
        selectedConversation={selectedConversation}
        selectedConversationId={selectedConversationId}
        currentUser={currentUser}
        messages={messages}
        onSelectConversation={handleSelectConversation}
        onMarkAsRead={handleMarkAsRead}
        onMarkAsUnread={handleMarkAsUnread}
        onToggleBlock={handleToggleBlock}
        onSendMessage={handleSendMessage}
        onSetTypingIndicator={handleSetTypingIndicator}
        onBack={handleBack}
        onOpenConnections={handleOpenConnections}
      />

      {showConnectionsModal && (
        <ConnectionsModal
          loading={loadingConnections}
          connections={userConnections}
          onClose={() => setShowConnectionsModal(false)}
          onSelect={handleStartConversation}
        />
      )}
    </>
  );
}
