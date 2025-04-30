"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChatPresentation } from "../presentation/ChatInterface";
import { useMessages } from "@/app/hooks/messaging/useMessages";
import { getOtherParticipantUsername, getParticipantDetails } from "@/app/utils/participantUtils";

export function ChatContainer({
  selectedConversation,
  currentUser,
  onBack,
  onToggleBlock,
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
  
  // References
  const scrollAreaRef = useRef(null);
  const lastTypedTextRef = useRef("");
  const typingTimerRef = useRef(null);
  
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
      
      // Reset typing state reference
      lastTypedTextRef.current = "";
      
      // Explicitly turn off typing indicator after sending a message
      if (selectedConversation?.id) {
        handleSetTypingIndicator(currentUser, selectedConversation.id, false);
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [
    message, 
    mediaFiles, 
    otherParticipantUsername, 
    sendMessage,
    selectedConversation?.id,
    currentUser,
    handleSetTypingIndicator
  ]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Optimized typing handler with better state tracking and extended timeouts
  const handleTypingWithIndicator = useCallback((e) => {
    // Update message text first
    handleTyping(e);
    
    // Only trigger typing indicator updates when necessary
    const currentText = e.target.value;
    const conversationId = selectedConversation?.id;
    
    if (!conversationId || !currentUser) return;
    
    // We need to track when to send a refresh of the typing indicator vs. a new one
    const isCurrentlyEmpty = currentText.length === 0;
    const wasPreviouslyEmpty = lastTypedTextRef.current.length === 0;
    
    // Determine whether to refresh the typing indicator:
    // 1. If it's a significant change in the content
    // 2. If it's a continuation of typing (using a timer check)
    // 3. If we're starting to type after being idle
    const isSignificantChange = Math.abs(currentText.length - lastTypedTextRef.current.length) > 2;
    const isStartingToType = !wasPreviouslyEmpty && isCurrentlyEmpty; // Clearing the text
    const isResumingType = wasPreviouslyEmpty && !isCurrentlyEmpty; // Starting to type
    
    // Update last typed text
    lastTypedTextRef.current = currentText;
    
    // Reset typing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    
    // Only send typing indicator updates in these cases:
    // 1. When starting to type (empty → non-empty)
    // 2. When clearing text (non-empty → empty)
    // 3. When making significant changes
    // 4. Periodically while typing (every few seconds)
    if (isSignificantChange || isStartingToType || isResumingType) {
      // Simple approach: always refresh the typing status when typing
      // This also extends the timeout period through the callback
      if (currentText.length > 0) {
        handleSetTypingIndicator(currentUser, conversationId, true);
      } else {
        // Turn off typing indicator when text is cleared
        handleSetTypingIndicator(currentUser, conversationId, false);
      }
    }
    
    // Set a timer to periodically refresh the typing status while typing
    if (currentText.length > 0) {
      // Set a passive refresh timer that triggers every 5 seconds while typing
      typingTimerRef.current = setTimeout(() => {
        typingTimerRef.current = null;
        
        // If text is still there, refresh the typing indicator
        if (lastTypedTextRef.current.length > 0) {
          // This will extend the timeout in the typing indicator
          handleSetTypingIndicator(currentUser, conversationId, true);
        } else {
          // If text was cleared, ensure typing indicator is off
          handleSetTypingIndicator(currentUser, conversationId, false);
        }
      }, 5000); // Every 5 seconds, refresh the typing status
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

  // Cleanup typing timer when unmounting or conversation changes
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [selectedConversation?.id]);

  return (
    <ChatPresentation
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
