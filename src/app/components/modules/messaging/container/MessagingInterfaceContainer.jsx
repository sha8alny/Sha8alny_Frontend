"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as FirestoreService from   "@/app/services/messagingService";
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

  const service = FirestoreService.messagingService;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getOtherParticipant = useCallback(
    (conversation) =>
      conversation?.participants.find((p) => p !== currentUser) || null,
    [currentUser]
  );

  // Conversations subscription
  useEffect(() => {
    if (isNavigatingBack) return;
    if (!currentUser) return;

    const unsubscribe = service.subscribeToConversations(currentUser, (updatedConversations) => {
      if (!Array.isArray(updatedConversations)) return;

      setUserConversations(updatedConversations);
      const username = searchParams.get("username");

      if (username && !selectedConversation) {
        const match = updatedConversations.find((c) => c.participants.includes(username));
        if (match) setSelectedConversation(match);
      }
    });

    return () => unsubscribe?.();
  }, [currentUser, service, searchParams, selectedConversation]);

  // Messages subscription
  useEffect(() => {
    if (!selectedConversation) return setMessages([]);

    const conv = userConversations.find((c) => c.id === selectedConversation.id);
    if (!conv) return;

    const other = getOtherParticipant(conv);
    if (!other) return;

    const currentUsername = searchParams.get("username");
    if (!isNavigatingBack && currentUsername !== other) {
      router.push(`${pathname}?username=${other}`, { scroll: false });
    } else {
      setIsNavigatingBack(false);
    }
    const unsubscribe = service.subscribeToConversationMessages(conv.id, (newMessages) => {
      if (Array.isArray(newMessages)) setMessages(newMessages);
    });

    return () => unsubscribe?.();
  }, [selectedConversation, userConversations, getOtherParticipant, service, pathname, router, isNavigatingBack, searchParams]);

  // Update selected conversation when it changes in userConversations
  useEffect(() => {
    if (!selectedConversation) return;
    
    const updatedConversation = userConversations.find(
      (conv) => conv.id === selectedConversation.id
    );
    
    if (updatedConversation && JSON.stringify(updatedConversation) !== JSON.stringify(selectedConversation)) {
      setSelectedConversation(updatedConversation);
    }
  }, [userConversations, selectedConversation]);

  const handleSelectConversation = useCallback(
    (id) => {
      const conv = userConversations.find((c) => c.id === id);
      if (conv) setSelectedConversation(conv);
    },
    [userConversations]
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

  const handleToggleRead = useCallback(async (id) => {
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
    // We don't need to update selectedConversation here as it will be updated
    // via the userConversations effect
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

  }, [service]);

  const handleSetTypingIndicator = useCallback((userName, convId, isTyping) => {
    service.updateTypingStatus(userName, convId, isTyping);
    
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
    router.push(pathname, { scroll: false });
  }, [selectedConversation, pathname, router]);

  return (
    <>

      <MessagingPresentation
        userConversations={userConversations}
        selectedConversation={selectedConversation}
        currentUser={currentUser}
        messages={messages}
        onSelectConversation={handleSelectConversation}
        onMarkAsRead={handleMarkAsRead}
        onToggleRead={handleToggleRead}
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