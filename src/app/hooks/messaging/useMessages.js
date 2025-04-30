import { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "@/app/utils/commonUtils";
import { messagingService } from "@/app/services/messagingService";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/app/context/ToastContext";

/**
 * Custom hook for managing messages within a conversation
 */
export function useMessages(selectedConversation, currentUser) {
  const showToast = useToast();
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
  
  // Add refs to track typing state
  const isTypingRef = useRef(false);
  const debouncedUpdatePendingRef = useRef(false);
  
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
    
    // Clear typing status
    clearTypingStatus(currentUser, selectedConversation?.id);
    
    // Call the mutation
    sendMessageMutation.mutate({ 
      receiver: receiverName, 
      msg: messageText, 
      media 
    }, {
      onError: (error) => {
        showToast(`${error.message}`, false);
        // Remove optimistic messages on error
        setMessages(prevMessages => 
          prevMessages.filter(msg => !newMessages.some(newMsg => newMsg.id === msg.id))
        );
      }
    });
  }, [currentUser, sendMessageMutation, selectedConversation?.id]);

  // Clear typing status function for reuse
  const clearTypingStatus = useCallback((username, conversationId) => {
    if (!username || !conversationId) return;
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    // If there's a pending update, flag that it should be canceled
    debouncedUpdatePendingRef.current = false;
    
    // Only send the update if we previously set typing to true
    if (isTypingRef.current) {
      isTypingRef.current = false;
      messagingService.updateTypingStatus(username, conversationId, false)
        .catch(err => console.error("Error clearing typing status:", err));
    }
  }, []);

  // Safe debounce wrapper that allows for proper cleanup
  const createDebouncedTypingUpdate = useCallback((username, conversationId, isTyping) => {
    // Set flag to track this debounced call
    debouncedUpdatePendingRef.current = true;
    
    // Create the debounced function and immediately call it
    const debouncedFn = debounce(() => {
      // Only proceed if the update is still pending (not canceled)
      if (debouncedUpdatePendingRef.current) {
        messagingService.updateTypingStatus(username, conversationId, isTyping)
          .catch(err => console.error("Error updating typing status:", err));
        debouncedUpdatePendingRef.current = false;
      }
    }, 500);
    
    // Execute the debounced function
    debouncedFn();
  }, []);

  // Handle typing indicator with improved debouncing and state tracking
  const handleSetTypingIndicator = useCallback(
    (username, conversationId, isTyping) => {
      if (!username || !conversationId) return;
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      
      // Only update status if it changed or if we're refreshing a typing indicator
      // The second condition allows us to refresh the typing timeout without changing state
      if (isTyping !== isTypingRef.current || (isTyping && isTypingRef.current)) {
        // Update local state if it's actually changing
        if (isTyping !== isTypingRef.current) {
          isTypingRef.current = isTyping;
          
          // Create and execute a new debounced update
          createDebouncedTypingUpdate(username, conversationId, isTyping);
        }
        
        // Set timeout to automatically turn off typing indicator
        // This happens for both new typing indicators and refreshed ones
        if (isTyping) {
          typingTimeoutRef.current = setTimeout(() => {
            isTypingRef.current = false;
            messagingService.updateTypingStatus(username, conversationId, false)
              .catch(err => console.error("Error updating typing status:", err));
          }, 10000); // Increased to 10 seconds to prevent premature timeout
        }
      }
    },
    [createDebouncedTypingUpdate]
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
    
    // Clear typing indicator when conversation changes
    if (lastSubscriptionParams.current.conversationId !== conversationId && 
        lastSubscriptionParams.current.conversationId && currentUser) {
      clearTypingStatus(currentUser, lastSubscriptionParams.current.conversationId);
    }
    
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
  }, [selectedConversation?.id, currentUser, messageLimit, clearTypingStatus]);

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
      
      // Cancel any pending debounced updates
      debouncedUpdatePendingRef.current = false;
      
      // Make sure to cleanup typing indicator on unmount
      if (isTypingRef.current && currentUser && selectedConversation?.id) {
        messagingService.updateTypingStatus(currentUser, selectedConversation.id, false)
          .catch(err => console.error("Error clearing typing status on unmount:", err));
      }
    };
  }, [currentUser, selectedConversation?.id]);

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
