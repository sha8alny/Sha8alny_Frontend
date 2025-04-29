import { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "@/app/utils/commonUtils";
import { messagingService } from "@/app/services/messagingService";

/**
 * Custom hook for managing conversations
 * Handles conversation subscriptions, selections, and status updates
 */
export function useConversations(currentUser) {
  // State for conversations
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // References to manage subscriptions and operations
  const conversationsSubscriptionRef = useRef(null);
  const readStatusOperations = useRef(new Map());
  const selectedConversationIdRef = useRef(null);
  
  // Track pending read operations for batch processing
  const [pendingReadOperations, setPendingReadOperations] = useState({});
  
  // Selects a conversation and handles navigation and read status
  const selectConversation = useCallback((conversation) => {
    setSelectedConversation(conversation);
    selectedConversationIdRef.current = conversation?.id || null;
    
    // Handle read status if needed
    if (conversation && 
        currentUser && 
        conversation.participantMetadata && 
        !conversation.participantMetadata[currentUser]?.readFlag && 
        !readStatusOperations.current.has(conversation.id)) {
      
      // Find the other username
      const otherUsername = Object.keys(conversation.participants || {})
        .find(username => username !== currentUser);
      
      if (otherUsername) {
        // Track this operation to prevent UI flicker
        readStatusOperations.current.set(conversation.id, true);
        
        // Optimistically update UI immediately
        setConversations(prev => 
          prev.map(c => {
            if (c.id === conversation.id && c.participantMetadata && currentUser) {
              return {
                ...c,
                participantMetadata: {
                  ...c.participantMetadata,
                  [currentUser]: {
                    ...c.participantMetadata[currentUser],
                    readFlag: true,
                    unreadCount: 0
                  }
                }
              };
            }
            return c;
          })
        );
        
        // Queue for batch processing
        setPendingReadOperations(prev => ({
          ...prev,
          [otherUsername]: true
        }));
      }
    }
  }, [currentUser]);

  // Handle conversation selection by ID
  const handleSelectConversation = useCallback((id) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      selectConversation(conv);
      return conv;
    }
    return null;
  }, [conversations, selectConversation]);

  // Toggle read status for a conversation
  const handleToggleRead = useCallback((id, readStatus) => { 
    const conv = conversations.find((c) => c.id === id);
    if (!conv || !currentUser) return;
    
    const otherUsername = Object.keys(conv.participants || {})
      .find(username => username !== currentUser);
    
    if (!otherUsername) return;
    
    // Get current read status
    const currentReadStatus = conv.participantMetadata?.[currentUser]?.readFlag || false;
    
    // Track this operation
    readStatusOperations.current.set(id, !currentReadStatus);
    
    // Optimistically update UI
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id && c.participantMetadata) {
          return {
            ...c,
            participantMetadata: {
              ...c.participantMetadata,
              [currentUser]: {
                ...c.participantMetadata[currentUser],
                readFlag: !currentReadStatus,
                lastReadAt: new Date().toISOString(),
                ...((!currentReadStatus) ? { unreadCount: 0 } : {})
              }
            }
          };
        }
        return c;
      })
    );
    
    // Make API call
    messagingService.toggleConversationReadStatusFirestore(id, currentUser)
      .then(() => {
        setTimeout(() => readStatusOperations.current.delete(id), 500);
      })
      .catch(err => {
        console.error("Error toggling conversation read status:", err);
        
        // Revert to original state on error
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === id && c.participantMetadata) {
              return {
                ...c,
                participantMetadata: {
                  ...c.participantMetadata,
                  [currentUser]: {
                    ...c.participantMetadata[currentUser],
                    readFlag: currentReadStatus
                  }
                }
              };
            }
            return c;
          })
        );
        
        readStatusOperations.current.delete(id);
      });
  }, [conversations, currentUser]);

  // Mark a conversation as read
  const handleMarkAsRead = useCallback((id) => {
    const conv = conversations.find((c) => c.id === id);
    if (!conv || !currentUser) return;
    
    const otherUsername = Object.keys(conv.participants || {})
      .find(username => username !== currentUser);
    
    if (!otherUsername) return;

    // Optimistically update UI
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id && c.participantMetadata) {
          return {
            ...c,
            participantMetadata: {
              ...c.participantMetadata,
              [currentUser]: {
                ...c.participantMetadata[currentUser],
                readFlag: true,
                unreadCount: 0,
                lastReadAt: new Date().toISOString()
              }
            }
          };
        }
        return c;
      })
    );

    messagingService.markMessagesAsRead(otherUsername)
      .catch(err => console.error("Error marking messages as read:", err));
  }, [conversations, currentUser]);

  // Toggle block status for a user
  const handleToggleBlock = useCallback((id, usernameToToggle, isBlocked) => {
    if (!currentUser || !usernameToToggle) return;
    
    const conv = conversations.find((c) => c.id === id);
    if (!conv || !conv.participants) return;
    
    // Optimistically update UI
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id && c.participants && c.participants[usernameToToggle]) {
          return {
            ...c,
            participants: {
              ...c.participants,
              [usernameToToggle]: {
                ...c.participants[usernameToToggle],
                isBlocked
              }
            }
          };
        }
        return c;
      })
    );
    
    // If selected conversation is being updated, update it too
    if (selectedConversation?.id === id) {
      setSelectedConversation(prev => {
        if (!prev || !prev.participants) return prev;
        
        return {
          ...prev,
          participants: {
            ...prev.participants,
            [usernameToToggle]: {
              ...prev.participants[usernameToToggle],
              isBlocked
            }
          }
        };
      });
    }
    
    messagingService.toggleUserBlock(usernameToToggle, id, isBlocked)
      .catch(err => {
        console.error("Error toggling user block status:", err);
        
        // Revert on error
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === id && c.participants && c.participants[usernameToToggle]) {
              return {
                ...c,
                participants: {
                  ...c.participants,
                  [usernameToToggle]: {
                    ...c.participants[usernameToToggle],
                    isBlocked: !isBlocked
                  }
                }
              };
            }
            return c;
          })
        );
        
        // Update selected conversation too if needed
        if (selectedConversation?.id === id) {
          setSelectedConversation(prev => {
            if (!prev || !prev.participants) return prev;
            
            return {
              ...prev,
              participants: {
                ...prev.participants,
                [usernameToToggle]: {
                  ...prev.participants[usernameToToggle],
                  isBlocked: !isBlocked
                }
              }
            };
          });
        }
      });
  }, [conversations, currentUser, selectedConversation]);

  // Process batched read operations
  useEffect(() => {
    if (Object.keys(pendingReadOperations).length === 0) return;
    
    const usernames = Object.keys(pendingReadOperations);
    
    const processReadOperations = async () => {
      try {
        // Process in batches
        for (let i = 0; i < usernames.length; i += 5) {
          const batch = usernames.slice(i, i + 5);
          await Promise.all(
            batch.map(username => 
              messagingService.markMessagesAsRead(username)
                .catch(err => console.error(`Error marking messages as read for ${username}:`, err))
            )
          );
          
          if (i + 5 < usernames.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      } finally {
        setPendingReadOperations({});
        // Clear tracking
        setTimeout(() => {
          usernames.forEach(username => {
            const convId = conversations.find(c => 
              c.participants && Object.keys(c.participants).includes(username)
            )?.id;
            if (convId) readStatusOperations.current.delete(convId);
          });
        }, 500);
      }
    };
    
    processReadOperations();
  }, [pendingReadOperations, conversations]);

  // Subscribe to conversations
  useEffect(() => {
    if (!currentUser) return;
    
    // Define debounced subscription
    const subscribeWithDebounce = debounce(() => {
      // Clean up existing subscription
      if (conversationsSubscriptionRef.current) {
        conversationsSubscriptionRef.current();
        conversationsSubscriptionRef.current = null;
      }
      
      // Subscribe to conversations
      conversationsSubscriptionRef.current = messagingService.subscribeToConversations(
        currentUser, 
        (updatedConversations) => {
          if (Array.isArray(updatedConversations)) {
            setConversations(updatedConversations);
            
            // Update selected conversation if needed
            if (selectedConversationIdRef.current) {
              const currentlySelectedId = selectedConversationIdRef.current;
              const updatedSelectedConversation = updatedConversations.find(
                (conv) => conv.id === currentlySelectedId
              );
              
              if (updatedSelectedConversation) {
                setSelectedConversation(prev => {
                  if (JSON.stringify(prev?.participantMetadata) !== 
                      JSON.stringify(updatedSelectedConversation.participantMetadata)) {
                    return updatedSelectedConversation;
                  }
                  return prev;
                });
              } else {
                // Conversation no longer exists
                selectedConversationIdRef.current = null;
                setSelectedConversation(null);
              }
            }
          }
        }
      );
    }, 300);
    
    // Call the debounced subscription function
    subscribeWithDebounce();
    
    // Cleanup on unmount
    return () => {
      if (conversationsSubscriptionRef.current) {
        conversationsSubscriptionRef.current();
        conversationsSubscriptionRef.current = null;
      }
    };
  }, [currentUser]);

  return {
    conversations,
    selectedConversation,
    selectConversation,
    handleSelectConversation,
    handleToggleRead,
    handleMarkAsRead,
    handleToggleBlock,
    setSelectedConversation,
  };
}
