"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChatPresentation } from "../presentation/ChatInterface";

export function ChatContainer({
  selectedConversation,
  messages,
  currentUser,
  onBack,
  onSendMessage,
  onToggleBlock,
  onSetTypingIndicator,
  onLoadMoreMessages,
}) {
  // State
  const [message, setMessage] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  
  // Refs
  const fileInputRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // Extract common data
  const conversationId = selectedConversation?.id;
  
  // Get other participant username from conversation data
  const otherParticipantUsername = useMemo(() => {
    if (!selectedConversation?.participants || !currentUser) return null;
    return Object.keys(selectedConversation.participants)
      .find(username => username !== currentUser);
  }, [selectedConversation, currentUser]);
  
  // Get other participant details
  const otherParticipant = useMemo(() => {
    if (!otherParticipantUsername || !selectedConversation?.participants) return null;
    return {
      ...selectedConversation.participants[otherParticipantUsername],
      username: otherParticipantUsername
    };
  }, [selectedConversation, otherParticipantUsername]);
  
  // Check if other participant is typing
  const isOtherParticipantTyping = useMemo(() => {
    if (!otherParticipantUsername || !selectedConversation?.participantMetadata) return false;
    return selectedConversation.participantMetadata[otherParticipantUsername]?.typingStatus === true;
  }, [
    selectedConversation?.participantMetadata,
    otherParticipantUsername,
    selectedConversation?.participantMetadata?.[otherParticipantUsername]?.typingStatus
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
      onSendMessage(otherParticipantUsername, message, mediaFiles);
      setMessage("");
      setMediaFiles([]);
      
      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      onSetTypingIndicator(currentUser, conversationId, false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [
    message, 
    mediaFiles, 
    otherParticipantUsername, 
    currentUser, 
    conversationId, 
    onSendMessage, 
    onSetTypingIndicator
  ]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleTyping = useCallback((e) => {
    setMessage(e.target.value);

    // Set typing indicator
    if (!typingTimeoutRef.current) {
      onSetTypingIndicator(currentUser, conversationId, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      onSetTypingIndicator(currentUser, conversationId, false);
      typingTimeoutRef.current = null;
    }, 2000);
  }, [currentUser, conversationId, onSetTypingIndicator]);


  // File handling
  const handleFileSelect = useCallback((e) => {
    if (e.target.files?.length) {
      setMediaFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Blocking handlers
  const handleBlockUser = useCallback(() => {
    if (otherParticipantUsername) {
      onToggleBlock(conversationId, otherParticipantUsername, true);
    }
  }, [conversationId, otherParticipantUsername, onToggleBlock]);

  const handleUnblockUser = useCallback(() => {
    if (otherParticipantUsername) {
      onToggleBlock(conversationId, otherParticipantUsername, false);
    }
  }, [conversationId, otherParticipantUsername, onToggleBlock]);

  return (
    <ChatPresentation
      selectedConversation={selectedConversation}
      currentUser={currentUser}
      otherParticipant={otherParticipant}
      isOtherParticipantTyping={isOtherParticipantTyping}
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
      onTyping={handleTyping}
      onBlockUser={handleBlockUser}
      onUnblockUser={handleUnblockUser}
      onLoadMoreMessages={onLoadMoreMessages}
    />
  );
}
