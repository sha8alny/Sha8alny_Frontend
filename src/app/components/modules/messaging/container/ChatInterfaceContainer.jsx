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
  const conversationId = selectedConversation.id;
  
  // Get other participant from the new structure
  const otherParticipantUsername = useMemo(() => {
    if (!selectedConversation?.participants || !currentUser) return null;
    const usernames = Object.keys(selectedConversation.participants);
    return usernames.find(username => username !== currentUser);
  }, [selectedConversation, currentUser]);
  
  const otherParticipant = useMemo(() => {
    if (!otherParticipantUsername || !selectedConversation?.participants) return null;
    return {
      ...selectedConversation.participants[otherParticipantUsername],
      username: otherParticipantUsername
    };
  }, [selectedConversation, otherParticipantUsername]);
  
  const isOtherParticipantTyping = useMemo(() => {
    if (!otherParticipantUsername || !selectedConversation?.participantMetadata) return false;
    return selectedConversation.participantMetadata[otherParticipantUsername]?.typingStatus === true;
  }, [
    selectedConversation, 
    otherParticipantUsername,
    // Add the specific property path to the dependency array
    selectedConversation?.participantMetadata?.[otherParticipantUsername]?.typingStatus
  ]);
  
  const receiverUsername = otherParticipant?.username;

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (!scrollAreaRef.current) return;
      
      const scrollableElement = 
        scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') || 
        scrollAreaRef.current;
      
      if (scrollableElement) {
        requestAnimationFrame(() => {
          scrollableElement.scrollTop = scrollableElement.scrollHeight;
        });
      }
    };

    scrollToBottom();
    const timeouts = [
      setTimeout(scrollToBottom, 100),
      setTimeout(scrollToBottom, 500)
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [messages.length, mediaFiles]);

  // Message handlers
  const handleSendMessage = useCallback(async () => {
    if (!(message.trim() || mediaFiles.length > 0) || !receiverUsername) return;
    
    try {
      await onSendMessage(receiverUsername, message, mediaFiles);
      setMessage("");
      setMediaFiles([]);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      onSetTypingIndicator(currentUser, conversationId, false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [message, mediaFiles, receiverUsername, currentUser, conversationId, onSendMessage, onSetTypingIndicator]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleTyping = useCallback((e) => {
    setMessage(e.target.value);

    if (!typingTimeoutRef.current) {
      onSetTypingIndicator(currentUser, conversationId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onSetTypingIndicator(currentUser, conversationId, false);
      typingTimeoutRef.current = null;
    }, 2000);
  }, [currentUser, conversationId, onSetTypingIndicator]);

  // File handling
  const handleFileSelect = useCallback((e) => {
    if (e.target.files) {
      setMediaFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle loading more messages
  const handleLoadMoreMessages = useCallback(() => {
    if (selectedConversation && selectedConversation.id) {
      onLoadMoreMessages(selectedConversation.id, messages.length > 0 ? messages[0].id : null);
    }
  }, [selectedConversation, messages, onLoadMoreMessages]);

  // Blocking handlers
  const handleBlockUser = useCallback(async () => {
    if (receiverUsername) {
      await onToggleBlock(conversationId, receiverUsername, true);
    }
  }, [conversationId, receiverUsername, onToggleBlock]);

  const handleUnblockUser = useCallback(async () => {
    if (receiverUsername) {
      await onToggleBlock(conversationId, receiverUsername, false);
    }
  }, [conversationId, receiverUsername, onToggleBlock]);

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
      onLoadMoreMessages={handleLoadMoreMessages}
    />
  );
}
