"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatPresentation } from "../presentation/ChatInterface";

export function ChatContainer({
  selectedConversation,
  messages,
  currentUser,
  onBack,
  onSendMessage,
  onToggleBlock,
  onSetTypingIndicator,
}) {
  const [message, setMessage] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const fileInputRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current;
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    };

    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [messages.length]);

  const handleSendMessage = useCallback(async () => {
    if (message.trim() || mediaFiles.length > 0) {
      try {
        // Get participant name - this should be the other participant in the selectedConversation
        const receiverName = selectedConversation.participants.find(
          (participant) => participant !== currentUser
        );

        // Pass the receiver name and message directly to the onSendMessage handler
        await onSendMessage(receiverName, message, mediaFiles);

        setMessage("");
        setMediaFiles([]);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        onSetTypingIndicator(currentUser, selectedConversation.id, false);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }, [message, mediaFiles, selectedConversation, currentUser, onSendMessage, onSetTypingIndicator]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleFileSelect = useCallback((e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...filesArray]);
    }
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleTyping = useCallback((e) => {
    setMessage(e.target.value);

    const conversationId = selectedConversation.id;

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
  }, [currentUser, selectedConversation.id, onSetTypingIndicator]);

  const handleBlockUser = useCallback(async () => {
    await onToggleBlock(selectedConversation.id, true);
  }, [selectedConversation.id, onToggleBlock]);

  const handleUnblockUser = useCallback(async () => {
    await onToggleBlock(selectedConversation.id, false);
  }, [selectedConversation.id, onToggleBlock]);

  return (
    <ChatPresentation
      selectedConversation={selectedConversation}
      currentUser={currentUser}
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
    />
  );
}