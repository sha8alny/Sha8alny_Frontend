"use client";

import  { useState, useRef, useEffect } from "react";
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

  const handleSendMessage = async () => {
    if (message.trim() || mediaFiles.length > 0) {
      try {
        // Get participant name - this should be the other participant in the selectedConversation
        const receiverName = selectedConversation.participantName;

        // Pass the receiver name and message directly to the onSendMessage handler
        await onSendMessage(receiverName, message, mediaFiles);

        setMessage("");
        setMediaFiles([]);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        onSetTypingIndicator(currentUser.id, selectedConversation.id, false);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!typingTimeoutRef.current) {
      onSetTypingIndicator(currentUser.id, selectedConversation.id, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onSetTypingIndicator(currentUser.id, selectedConversation.id, false);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleBlockUser = async () => {
    await onToggleBlock(selectedConversation.id, true);
  };

  const handleUnblockUser = async () => {
    await onToggleBlock(selectedConversation.id, false);
  };

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
