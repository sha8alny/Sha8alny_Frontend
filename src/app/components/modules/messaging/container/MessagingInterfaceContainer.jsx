"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MessagingPresentation } from "../presentation/MessagingInterface";
import { ConnectionsModal } from "../presentation/ConnectionsModal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useConversations } from "@/app/hooks/messaging/useConversations";
import { useMessages } from "@/app/hooks/messaging/useMessages";
import { useConnections } from "@/app/hooks/messaging/useConnections";
import { useMessageRequests } from "@/app/hooks/messaging/useMessageRequests";
import { getOtherParticipantUsername } from "@/app/utils/participantUtils";

export function MessagingContainer({ currentUser }) {
  // ---- INITIALIZATION ----
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get("username");
  
  // ---- REFS ----
  const navigationInitiatedRef = useRef(false);
  
  // ---- CUSTOM HOOKS ----
  // Conversations hook
  const {
    conversations: userConversations,
    selectedConversation,
    selectConversation,
    handleSelectConversation,
    handleToggleRead,
    handleMarkAsRead,
    handleToggleBlock,
    setSelectedConversation
  } = useConversations(currentUser);
  
  // Messages hook
  const {
    messages,
    handleSendMessage,
    handleSetTypingIndicator,
    handleLoadMoreMessages
  } = useMessages(selectedConversation, currentUser);
  
  // Connections hook
  const {
    showConnectionsModal,
    userConnections,
    loadingConnections,
    hasMoreConnections,
    loadingMoreConnections,
    handleOpenConnections,
    handleStartConversation: startConversation,
    setShowConnectionsModal,
    loadMoreConnections
  } = useConnections(currentUser, userConversations);
  
  // Message requests hook
  const {
    receivedRequests = [],
    loadingReceived
  } = useMessageRequests(currentUser) || {};
  
  // ---- UI STATE ----
  const [isHandlingUrlChange, setIsHandlingUrlChange] = useState(false);
  // Add the missing state declaration
  const [showMessageRequests, setShowMessageRequests] = useState(false);
  
  // Count pending requests - ensure receivedRequests is an array
  const pendingRequestCount = Array.isArray(receivedRequests) ? 
    receivedRequests.filter(req => req.status === "pending").length : 0;

  // ---- NAVIGATION FUNCTIONS ----
  const navigateToUser = useCallback((username) => {
    if (!username) {
      router.push(pathname);
    } else {
      router.push(`${pathname}?username=${encodeURIComponent(username)}`);
    }
    
    navigationInitiatedRef.current = true;
    setTimeout(() => {
      navigationInitiatedRef.current = false;
    }, 300);
  }, [pathname, router]);

  const handleBack = useCallback(() => {
    if (!selectedConversation) return;
    setSelectedConversation(null);
    navigateToUser(null);
  }, [selectedConversation, setSelectedConversation, navigateToUser]);

  // Handle starting a conversation with a connection
  const handleStartConversation = useCallback((connection) => {
    return startConversation(connection, selectConversation, navigateToUser);
  }, [startConversation, selectConversation, navigateToUser]);

  // Updated select conversation handler that also updates URL
  const handleConversationSelect = useCallback((conversationId) => {
    console.log('Conversation selected:', conversationId);
    const conversation = userConversations.find(c => c.id === conversationId);
    if (conversation) {
      // Close message requests if open
      setShowMessageRequests(false);
      
      // First select the conversation directly
      selectConversation(conversation);
      
      // Then update URL with the other participant's username
      const otherUsername = getOtherParticipantUsername(conversation, currentUser);
      console.log('Other username found:', otherUsername);
      if (otherUsername) {
        navigateToUser(otherUsername);
      }
    }
  }, [userConversations, selectConversation, currentUser, navigateToUser]);

  // Message requests handlers
  const handleViewMessageRequests = useCallback(() => {
    setShowMessageRequests(true);
    setSelectedConversation(null);
    navigateToUser(null);
  }, [setSelectedConversation, navigateToUser]);

  const handleCloseMessageRequests = useCallback(() => {
    setShowMessageRequests(false);
  }, []);

  // ---- UI SYNC EFFECTS ----
  // Handle URL changes
  useEffect(() => {
    if (!userConversations.length || !usernameParam || navigationInitiatedRef.current) return;
    
    setIsHandlingUrlChange(true);
    
    const matchingConversation = userConversations.find((c) => {
      return c.participants && Object.keys(c.participants).includes(usernameParam);
    });
    
    if (matchingConversation && 
        (!selectedConversation || selectedConversation.id !== matchingConversation.id)) {
      // Close message requests if open
      setShowMessageRequests(false);
      selectConversation(matchingConversation);
    }
    
    setIsHandlingUrlChange(false);
  }, [usernameParam, userConversations, selectedConversation, selectConversation]);

  // Update URL when selected conversation changes
  useEffect(() => {
    if (!selectedConversation || isHandlingUrlChange || navigationInitiatedRef.current) return;
    
    const otherParticipant = getOtherParticipantUsername(selectedConversation, currentUser?.username);
    if (otherParticipant && otherParticipant !== usernameParam) {
      navigateToUser(otherParticipant);
    }
  }, [selectedConversation, currentUser, usernameParam, navigateToUser, isHandlingUrlChange]);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');
        
        if (!username && selectedConversation) {
          setSelectedConversation(null);
        }
      }, 50);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedConversation, setSelectedConversation]);

  // ---- RENDER ----
  return (
    <>
      <MessagingPresentation
        userConversations={userConversations}
        selectedConversation={selectedConversation}
        currentUser={currentUser}
        messages={messages}
        onSelectConversation={handleConversationSelect}
        onMarkAsRead={handleMarkAsRead}
        onToggleRead={handleToggleRead}
        onToggleBlock={handleToggleBlock}
        onSendMessage={handleSendMessage}
        onSetTypingIndicator={handleSetTypingIndicator}
        onBack={handleBack}
        onOpenConnections={handleOpenConnections}
        onLoadMoreMessages={handleLoadMoreMessages}
        showMessageRequests={showMessageRequests}
        onViewMessageRequests={handleViewMessageRequests}
        onCloseMessageRequests={handleCloseMessageRequests}
        pendingRequestCount={pendingRequestCount}
        navigateToUser={navigateToUser}
      />
      
      {showConnectionsModal && (
        <ConnectionsModal
          loading={loadingConnections}
          connections={userConnections}
          onClose={() => setShowConnectionsModal(false)}
          onSelect={handleStartConversation}
          hasMore={hasMoreConnections}
          loadingMore={loadingMoreConnections}
          onLoadMore={loadMoreConnections}
        />
      )}
    </>
  );
}