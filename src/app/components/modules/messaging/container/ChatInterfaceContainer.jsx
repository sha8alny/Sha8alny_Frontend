"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChatPresentation } from "../presentation/ChatInterface";
import { useMessages } from "@/app/hooks/messaging/useMessages";
import { getOtherParticipantUsername, getParticipantDetails } from "@/app/utils/participantUtils";

export function ChatContainer({
  selectedConversation,
  messages: initialMessages,
  currentUser,
  onBack,
  onSendMessage,
  onToggleBlock,
  onSetTypingIndicator,
  onLoadMoreMessages,
}) {
  // Use the messages hook for message management
  const {
    messages,
    message,
    mediaFiles,
    fileInputRef,
    handleTyping,
    handleSendMessage: sendMessage,
    handleSetTypingIndicator,
    handleFileSelect,
    handleRemoveFile,
    handleLoadMoreMessages
  } = useMessages(selectedConversation, currentUser);
  
  // Synchronize with external messages if provided
  useEffect(() => {
    // If initialMessages is explicitly provided, use it
    if (Array.isArray(initialMessages) && initialMessages.length > 0) {
      // Keep any optimistic messages we added
      const optimisticMessages = messages.filter(
        m => !initialMessages.some(im => im.id === m.id)
      );
      if (optimisticMessages.length > 0) {
        // Merge with initial messages, preserving order
        const merged = [...initialMessages, ...optimisticMessages]
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        // Use a function to merge to avoid issues if messages and initialMessages are the same reference
        // setMessages(prev => prev !== merged ? merged : prev);
      }
    }
  }, [initialMessages]);
  
  // References
  const scrollAreaRef = useRef(null);
  
  // Extract other participant username from conversation data
  const otherParticipantUsername = useMemo(() => 
    getOtherParticipantUsername(selectedConversation, currentUser),
    [selectedConversation, currentUser]
  );
  
  // Get other participant details
  const otherParticipant = useMemo(() => 
    otherParticipantUsername ? 
      getParticipantDetails(selectedConversation, otherParticipantUsername) : 
      null,
    [selectedConversation, otherParticipantUsername]
  );
  
  // Extract blocking information
  const isOtherParticipantBlocked = useMemo(() => 
    otherParticipant?.isBlocked === true,
    [otherParticipant]
  );
  
  const isCurrentUserBlocked = useMemo(() => {
    if (!currentUser || !selectedConversation?.participants?.[currentUser]) return false;
    const currentUserDetails = selectedConversation.participants[currentUser];
    return currentUserDetails?.isBlocked === true;
  }, [currentUser, selectedConversation, otherParticipantUsername]);
  
  // Check if other participant is typing
  const isOtherParticipantTyping = useMemo(() => {
    if (!otherParticipantUsername || !selectedConversation?.participantMetadata) return false;
    return selectedConversation.participantMetadata[otherParticipantUsername]?.typingStatus === true;
  }, [
    selectedConversation?.participantMetadata,
    otherParticipantUsername
  ]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (!scrollAreaRef.current) return;
      
      const scrollableElement = 
        scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') || 
        scrollAreaRef.current;
      
      if (scrollableElement) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
      }
    };

    // Scroll immediately and after a delay to handle rendering
    scrollToBottom();
    const timeouts = [
      setTimeout(scrollToBottom, 100),
      setTimeout(scrollToBottom, 500)
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [messages.length, mediaFiles.length]);

  // Message handlers
  const handleSendMessage = useCallback(() => {
    if (!(message.trim() || mediaFiles.length > 0) || !otherParticipantUsername) return;
    
    try {
      sendMessage(otherParticipantUsername, message, mediaFiles);
      
      // Clear typing indicator
      handleSetTypingIndicator(currentUser, selectedConversation.id, false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [
    message, 
    mediaFiles, 
    otherParticipantUsername, 
    currentUser, 
    selectedConversation?.id, 
    sendMessage, 
    handleSetTypingIndicator
  ]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleTypingWithIndicator = useCallback((e) => {
    handleTyping(e);

    // Set typing indicator
    if (selectedConversation?.id) {
      handleSetTypingIndicator(currentUser, selectedConversation.id, true);
    }
  }, [currentUser, selectedConversation?.id, handleTyping, handleSetTypingIndicator]);

  // Blocking handlers
  const handleBlockUser = useCallback(() => {
    if (otherParticipantUsername && selectedConversation?.id) {
      onToggleBlock(selectedConversation.id, otherParticipantUsername, true);
    }
  }, [selectedConversation?.id, otherParticipantUsername, onToggleBlock]);

  const handleUnblockUser = useCallback(() => {
    if (otherParticipantUsername && selectedConversation?.id) {
      onToggleBlock(selectedConversation.id, otherParticipantUsername, false);
    }
  }, [selectedConversation?.id, otherParticipantUsername, onToggleBlock]);

  return (
    <ChatPresentation
      selectedConversation={selectedConversation}
      currentUser={currentUser}
      otherParticipant={otherParticipant}
      isOtherParticipantTyping={isOtherParticipantTyping}
      isOtherParticipantBlocked={isOtherParticipantBlocked}
      isCurrentUserBlocked={isCurrentUserBlocked}
      messages={messages}
      message={message}
      mediaFiles={mediaFiles}
      fileInputRef={fileInputRef}
      scrollAreaRef={scrollAreaRef}
      onBack={onBack}
      onSendMessage={handleSendMessage}
      onKeyDown={handleKeyDown}
      onFileSelect={handleFileSelect}
      onRemoveFile={handleRemoveFile}
      onTyping={handleTypingWithIndicator}
      onBlockUser={handleBlockUser}
      onUnblockUser={handleUnblockUser}
      onLoadMoreMessages={handleLoadMoreMessages || onLoadMoreMessages}
    />
  );
}
