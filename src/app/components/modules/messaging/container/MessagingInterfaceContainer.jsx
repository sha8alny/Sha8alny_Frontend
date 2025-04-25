"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import * as FirestoreService from "@/app/services/messagingService";
import { MessagingPresentation } from "../presentation/MessagingInterface";
import { ConnectionsModal } from "../presentation/ConnectionsModal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function MessagingContainer({ currentUser }) {
  // ---- STATE MANAGEMENT ----
  const [userConversations, setUserConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [userConnections, setUserConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);

  // ---- REFS ----
  const selectedConversationIdRef = useRef(null);
  const preventSelectionRef = useRef(false);
  const readStatusOperations = useRef(new Map());

  // ---- SERVICES & HOOKS ----
  const service = FirestoreService.messagingService;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ---- MEMOIZED VALUES ----
  const usernameParam = useMemo(() => searchParams.get("username"), [searchParams]);
  
  const getOtherParticipantUsername = useCallback(
    (conversation) => 
      conversation?.participants.find((p) => p.username !== currentUser)?.username || null,
    [currentUser]
  );

  // ---- EFFECTS ----
  // 1. Conversations subscription and URL-based selection
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = service.subscribeToConversations(currentUser, (updatedConversations) => {
      if (!Array.isArray(updatedConversations)) return;

      setUserConversations(updatedConversations);

      if (usernameParam && !preventSelectionRef.current) {
        const matchingConversation = updatedConversations.find((c) => 
          c.participants.some(p => p.username === usernameParam && p.username !== currentUser)
        );
        
        if (matchingConversation && 
           (!selectedConversation || selectedConversation.id !== matchingConversation.id)) {
          setSelectedConversation(matchingConversation);
        }
      }
    });

    return () => unsubscribe?.();
  }, [currentUser, service, usernameParam, selectedConversation]);

  // 2. Messages subscription
  useEffect(() => {
    if (!selectedConversation?.id) {
      setMessages([]);
      return;
    }

    selectedConversationIdRef.current = selectedConversation.id;
    
    const unsubscribe = service.subscribeToConversationMessages(selectedConversation.id, currentUser,(newMessages) => {
      if (Array.isArray(newMessages)) {
        setMessages(newMessages);
      }
    });

    return () => unsubscribe?.();
  }, [selectedConversation?.id, service]);

  // 3. Update conversation URL when selection changes
  useEffect(() => {
    if (selectedConversation && !preventSelectionRef.current) {
      const otherUsername = getOtherParticipantUsername(selectedConversation);
      
      if (otherUsername && usernameParam !== otherUsername) {
        preventSelectionRef.current = true;
        router.replace(`${pathname}?username=${otherUsername}`, { scroll: false });
        setTimeout(() => preventSelectionRef.current = false, 500);
      }
    }
  }, [selectedConversation, getOtherParticipantUsername, usernameParam, pathname, router]);

  // 4. Keep selected conversation updated when userConversations changes
  useEffect(() => {
    if (!selectedConversation?.id) return;
    
    const updatedConversation = userConversations.find(
      (conv) => conv.id === selectedConversation.id
    );
    
    if (updatedConversation && updatedConversation !== selectedConversation && 
        JSON.stringify(updatedConversation) !== JSON.stringify(selectedConversation)) {
      setSelectedConversation(updatedConversation);
    }
  }, [userConversations, selectedConversation]);

  // 5. Handle in-progress read status operations
  useEffect(() => {
    if (readStatusOperations.current.size === 0) return;
    
    const filteredConversations = userConversations.map(conv => {
      if (readStatusOperations.current.has(conv.id)) {
        return { 
          ...conv, 
          read: readStatusOperations.current.get(conv.id) 
        };
      }
      return conv;
    });
    
    if (JSON.stringify(filteredConversations) !== JSON.stringify(userConversations)) {
      setUserConversations(filteredConversations);
    }
  }, [userConversations]);

  // 6. Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      preventSelectionRef.current = true;
      setTimeout(() => preventSelectionRef.current = false, 300);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ---- EVENT HANDLERS ----
  const handleSelectConversation = useCallback(
    (id) => {
      const conv = userConversations.find((c) => c.id === id);
      if (conv) {
        const otherUsername = getOtherParticipantUsername(conv);
        
        setSelectedConversation(conv);
        
        setUserConversations(prev => prev.map(c => 
          c.id === id ? {...c, read: true} : c
        ));
        
        if (!conv.read) {
          handleToggleRead(id, true);
        }
        
        if (otherUsername) {
          service.markMessagesAsRead(otherUsername)
            .catch(err => console.error("Error marking messages as read:", err));
        }
      }
    },
    [userConversations, getOtherParticipantUsername, service]
  );

  const handleMarkAsRead = useCallback((id) => {
    const conv = userConversations.find((c) => c.id === id);
    const other = getOtherParticipantUsername(conv);
    if (!other) return;

    setUserConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, read: true } : c))
    );

    service.markMessagesAsRead(other)
      .catch(err => console.error("Error marking messages as read:", err));
  }, [userConversations, service, getOtherParticipantUsername]);
  
  const handleToggleRead = useCallback((id, readStatus) => { 
    const conv = userConversations.find((c) => c.id === id);
    const other = getOtherParticipantUsername(conv);
    if (!other) return;
    
    readStatusOperations.current.set(id, readStatus);
    
    setUserConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, read: readStatus } : c)) 
    );
    
    service.toggleConversationReadStatus(other)
      .then(() => {
        setTimeout(() => {
          readStatusOperations.current.delete(id);
        }, 500);
      })
      .catch(err => {
        console.error("Error toggling conversation read status:", err);
        setUserConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, read: !readStatus } : c))
        );
        readStatusOperations.current.delete(id);
      });
  }, [service, userConversations, getOtherParticipantUsername]);

  const handleToggleBlock = useCallback((id, usernameToToggle) => {
    if (!currentUser || !usernameToToggle) return;
    
    service.toggleUserBlock(usernameToToggle, id)
      .catch(err => console.error("Error toggling user block status:", err));
  }, [currentUser, service]);

  const handleSendMessage = useCallback((receiverName, message, mediaFiles) => {
    if (!message.trim() && (!mediaFiles || mediaFiles.length === 0)) return;
    
    const newMessage = {
      id: crypto.randomUUID(),
      read: false,
      receiverName,
      timestamp: new Date().toISOString(),
      senderName: currentUser,
      isDeleted: false,
      messageContent: [
        ...(message.trim() ? [{ type: 'text', content: message.trim() }] : []),
        ...(mediaFiles?.length ? mediaFiles.map(file => ({ type: 'media', content: file })) : [])
      ],
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    service.sendMessage(receiverName, message, mediaFiles)
      .catch(error => {
        console.error("Failed to send message:", error);
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.id !== newMessage.id)
        );
      });
  }, [currentUser, service]);

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
    if (!connection?.username || !currentUser) return;

    preventSelectionRef.current = true;
    
    try {
      const existing = userConversations.find((c) => 
          c.participants.some(p => p.username === connection.username)
      );

      if (existing) {
        setSelectedConversation(existing);
      } else {
        const newConvData = await service.createConversation(connection.username, currentUser); 
        if (newConvData?.id) {
          setSelectedConversation(newConvData);
        }
      }
    } catch (error) {
      console.error("Error in conversation handling:", error);
    } finally {
      setShowConnectionsModal(false);
      setTimeout(() => {
        preventSelectionRef.current = false;
      }, 500);
    }
  }, [userConversations, currentUser, service]);

  const handleBack = useCallback(() => {
    if (!selectedConversation) return;
    
    preventSelectionRef.current = true;
    
    setSelectedConversation(null);
    router.replace(pathname, { scroll: false });
    
    setTimeout(() => {
      preventSelectionRef.current = false;
    }, 500);
  }, [selectedConversation, pathname, router]);

  // ---- RENDER ----
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