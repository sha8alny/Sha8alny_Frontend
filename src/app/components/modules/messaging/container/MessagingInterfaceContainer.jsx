"use client";

import { useState, useEffect, useCallback } from "react";
import { useService } from "@/app/context/ServiceContext";
import { MessagingPresentation } from "../presentation/MessagingInterface";
import { ConnectionsModal } from "../presentation/ConnectionsModal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function MessagingContainer({ currentUser }) {
  const [userConversations, setUserConversations] = useState([]);
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

  const getOtherParticipant = useCallback(
    (conversation) =>
      conversation?.participants.find((p) => p !== currentUser) || null,
    [currentUser]
  );

  const buildConversationDetails = useCallback((conv) => {
    const other = getOtherParticipant(conv);
    return other
      ? {
          id: conv.id,
          participants: conv.participants,
          createdAt: conv.createdAt,
          updatedAt: conv.timestamp,
          participantId: other,
          participantName: other,
          participantAvatar: null,
          unreadCount: conv.read ? 0 : 1,
          isTyping: true,
          isBlocked: false,
          readStatus: conv.read ? null : "unread",
          lastMessage: conv.lastMessage,
        }
      : null;
  }, [getOtherParticipant]);

// Conversations subscription
useEffect(() => {
  if (!currentUser) return;

  const unsubscribe = service.subscribeToConversations(currentUser, (updatedConversations) => {
    if (!Array.isArray(updatedConversations)) return;

    setUserConversations(updatedConversations);

    const username = searchParams.get("username");
    if (username && !selectedConversation) {
      const match = updatedConversations.find((c) => c.participants.includes(username));
      if (match) setSelectedConversation(buildConversationDetails(match));
    }
  });

  return () => unsubscribe?.();
}, [currentUser, service, selectedConversation]);

  // Messages subscription
useEffect(() => {
  if (!selectedConversation) {
    setMessages([]);
    return;
  }

  const conv = userConversations.find((c) => c.id === selectedConversation.id);
  if (!conv) return;

  const other = getOtherParticipant(conv);
  if (!other) return;

  // Avoid repeated router.push if username already matches
  const currentUsername = searchParams.get("username");
  const shouldPush = !isNavigatingBack && currentUsername !== other;

  if (shouldPush) {
    router.push(`${pathname}?username=${other}`, { scroll: false });
  }

  // Reset navigation guard
  if (isNavigatingBack) {
    setIsNavigatingBack(false);
  }

  const unsubscribe = service.subscribeToConversationMessages(conv.id, (newMessages) => {
    if (Array.isArray(newMessages)) {
      setMessages(newMessages);
    }
  });

  return () => unsubscribe?.();
}, [
  selectedConversation?.id, // only track id, not full object to avoid re-triggering
  userConversations,
  isNavigatingBack,
  pathname,
  router,
]);


  const handleSelectConversation = useCallback(
    (id) => {
      const conv = userConversations.find((c) => c.id === id);
      if (conv) setSelectedConversation(buildConversationDetails(conv));
    },
    [userConversations, buildConversationDetails]
  );

  const handleMarkAsRead = useCallback(async (id) => {
    const conv = userConversations.find((c) => c.id === id);
    const other = getOtherParticipant(conv);
    if (!other) return;

    await service.markMessagesAsRead(other);
    setUserConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, read: true } : c))
    );
  }, [userConversations, getOtherParticipant, service]);

  const handleMarkAsUnread = useCallback(async (id) => {
    const conv = userConversations.find((c) => c.id === id);
    const other = getOtherParticipant(conv);
    if (!other) return;

    await service.toggleConversationReadStatus(other);
    setUserConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, read: false } : c))
    );
  }, [userConversations, getOtherParticipant, service]);

  const handleToggleBlock = useCallback(async (id, isBlocked) => {
    if (!currentUser) return;

    await service.toggleUserBlock(currentUser, id, isBlocked);
    setSelectedConversation((prev) => prev ? { ...prev, isBlocked: !prev.isBlocked } : null);
  }, [currentUser, service]);

  const handleSendMessage = useCallback(async (receiverName, message, mediaFiles) => {
    const result = await service.sendMessage(receiverName, message, mediaFiles);
    if (!(result?.success && result.message)) return;

    const newMsg = result.message;

    setMessages((prev) => [...prev, {
      messageId: newMsg.messageId,
      sender: newMsg.sender,
      receiver: newMsg.receiver,
      content: newMsg.content,
      timestamp: newMsg.timestamp,
      read: newMsg.read,
      mediaUrl: newMsg.mediaUrls?.[0] || null,
    }]);

    setUserConversations((prev) =>
      prev.map((conv) =>
        conv.participants.includes(receiverName)
          ? { ...conv, lastMessage: { content: newMsg.content, timestamp: newMsg.timestamp } }
          : conv
      )
    );

    setSelectedConversation((prev) =>
      prev ? {
        ...prev,
        lastMessage: {
          content: newMsg.content,
          timestamp: newMsg.timestamp,
          senderId: newMsg.sender,
        },
      } : null
    );
  }, [service]);

  const handleSetTypingIndicator = useCallback((userId, convId, isTyping) => {
    service.updateTypingStatus(userId, convId, isTyping);
    setSelectedConversation((prev) => prev ? { ...prev, isTyping } : null);
  }, [service]);

  const handleOpenConnections = useCallback(async () => {
    setShowConnectionsModal(true);
    setLoadingConnections(true);

    try {
      const connections = await service.getUserConnections();
      setUserConnections(Array.isArray(connections) ? connections : []);
    } catch (err) {
      console.error("Error fetching user connections:", err);
      setUserConnections([]);
    } finally {
      setLoadingConnections(false);
    }
  }, [service]);

  const handleStartConversation = useCallback(async (connection) => {
    if (!connection?.username) return;

    const existing = userConversations.find((c) => c.participants.includes(connection.username));
    if (existing) {
      handleSelectConversation(existing.id);
    } else {
      const newConv = await service.createConversation(connection.username, currentUser);
      if (newConv?.id) {
        const conv = {
          id: newConv.id,
          participants: [currentUser, connection.username],
          lastMessage: { text: "", timestamp: new Date() },
          read: true,
          createdAt: new Date(),
          timestamp: new Date(),
        };
        setUserConversations((prev) => [...prev, conv]);
        handleSelectConversation(newConv.id);
      }
    }

    setShowConnectionsModal(false);
  }, [userConversations, currentUser, service, handleSelectConversation]);

  const handleBack = useCallback(() => {
    if (!selectedConversation) return;
    setIsNavigatingBack(true);
    setSelectedConversation(null);
    window.history.pushState({}, "", pathname);
  }, [selectedConversation, pathname]);

  return (
    <>
      <MessagingPresentation
        userConversations={userConversations}
        selectedConversation={selectedConversation}
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
