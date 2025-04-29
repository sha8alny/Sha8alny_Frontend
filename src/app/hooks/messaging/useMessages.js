import { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "@/app/utils/commonUtils";
import { messagingService } from "@/app/services/messagingService";
import { useMutation } from "@tanstack/react-query";

/**
 * Custom hook for managing messages within a conversation
 */
export function useMessages(selectedConversation, currentUser) {
  // State for messages
  const [messages, setMessages] = useState([]);
  const [messageLimit, setMessageLimit] = useState(20);
  const [message, setMessage] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  
  // References
  const messagesSubscriptionRef = useRef(null);
  const lastSubscriptionParams = useRef({ conversationId: null, currentUser: null });
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Define the mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: ({ receiver, msg, media }) => 
      messagingService.sendMessage(receiver, msg, media)
  });

  // Handle message text input
  const handleTyping = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  // Handle sending a message
  const handleSendMessage = useCallback((receiverName, messageText, media) => {
    if ((!messageText.trim() && (!media || media.length === 0)) || !currentUser) return;
    
    // Create optimistic messages
    const newMessages = media?.length
      ? media.map((file) => ({
        id: crypto.randomUUID(),
        senderName: currentUser,
        receiverName,
        timestamp: new Date().toISOString(),
        isDeleted: false,
        read: false,
        mediaUrl: URL.createObjectURL(file),
      }))
      : [{
        id: crypto.randomUUID(),
        senderName: currentUser,
        receiverName,
        timestamp: new Date().toISOString(),
        isDeleted: false,
        read: false,
        messageContent: messageText.trim(),
      }];

    // Optimistically add messages
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    
    // Clear inputs
    setMessage("");
    setMediaFiles([]);

    // Call the mutation
    sendMessageMutation.mutate({ 
      receiver: receiverName, 
      msg: messageText, 
      media 
    }, {
      onError: (error) => {
        console.error("Failed to send message:", error);
        // Remove optimistic messages on error
        setMessages(prevMessages => 
          prevMessages.filter(msg => !newMessages.some(newMsg => newMsg.id === msg.id))
        );
      }
    });
  }, [currentUser, sendMessageMutation]);

  // Handle typing indicator
  const handleSetTypingIndicator = useCallback(
    (username, conversationId, isTyping) => {
      if (!username || !conversationId) return;
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      
      // Set timeout for automatic reset after 2 seconds
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          messagingService.updateTypingStatus(username, conversationId, false)
            .catch(err => console.error("Error updating typing status:", err));
        }, 2000);
      }
      
      // Debounced update to reduce API calls
      const updateTypingDebounced = debounce(() => {
        messagingService.updateTypingStatus(username, conversationId, isTyping)
          .catch(err => console.error("Error updating typing status:", err));
      }, 300);
      
      updateTypingDebounced();
    },
    []
  );

  // File handling functions
  const handleFileSelect = useCallback((e) => {
    if (e.target.files?.length) {
      setMediaFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Load more messages
  const handleLoadMoreMessages = useCallback(() => {
    setMessageLimit(prev => prev + 10);
  }, []);

  // Subscribe to messages for the selected conversation
  useEffect(() => {
    const conversationId = selectedConversation?.id;
    
    if (!conversationId) {
      setMessages([]);
      if (messagesSubscriptionRef.current) {
        messagesSubscriptionRef.current();
        messagesSubscriptionRef.current = null;
      }
      return;
    }
    
    // Check if we already have a subscription with the same parameters
    if (messagesSubscriptionRef.current &&
        lastSubscriptionParams.current.conversationId === conversationId &&
        lastSubscriptionParams.current.currentUser === currentUser) {
      return;
    }
    
    // Clean up existing subscription
    if (messagesSubscriptionRef.current) {
      messagesSubscriptionRef.current();
      messagesSubscriptionRef.current = null;
    }
    
    // Update last subscription parameters
    lastSubscriptionParams.current = { conversationId, currentUser };
    
    // Subscribe to messages with limit
    messagesSubscriptionRef.current = messagingService.subscribeToConversationMessages(
      conversationId, 
      currentUser,
      (newMessages) => {
        if (Array.isArray(newMessages)) {
          setMessages(newMessages);
        }
      },
      messageLimit
    );
  }, [selectedConversation?.id, currentUser, messageLimit]);

  // Cleanup subscription when component unmounts
  useEffect(() => {
    return () => {
      if (messagesSubscriptionRef.current) {
        messagesSubscriptionRef.current();
        messagesSubscriptionRef.current = null;
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    messages,
    message,
    mediaFiles,
    fileInputRef,
    handleTyping,
    handleSendMessage,
    handleSetTypingIndicator,
    handleFileSelect,
    handleRemoveFile,
    handleLoadMoreMessages,
  };
}
