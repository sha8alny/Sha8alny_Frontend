import { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "@/app/utils/commonUtils";
import { messagingService } from "@/app/services/messagingService";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Add this import

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
  
  // Define mutations for conversation operations
  const toggleReadMutation = useMutation({
    mutationFn: ({ id, currentUser }) => 
      messagingService.toggleConversationReadStatusFirestore(id, currentUser),
    onError: (error, variables) => {
      console.error("Error toggling conversation read status:", error);
      
      // Revert to original state on error
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === variables.id && c.participantMetadata) {
            // Get the original read status (opposite of what we tried to set)
            const originalReadStatus = !c.participantMetadata[variables.currentUser]?.readFlag;
            return {
              ...c,
              participantMetadata: {
                ...c.participantMetadata,
                [variables.currentUser]: {
                  ...c.participantMetadata[variables.currentUser],
                  readFlag: originalReadStatus
                }
              }
            };
          }
          return c;
        })
      );
    },
    onSettled: (_, __, variables) => {
      setTimeout(() => readStatusOperations.current.delete(variables.id), 500);
    }
  });
  
  const toggleBlockMutation = useMutation({
    mutationFn: ({ username, id, isBlocked }) => 
      messagingService.toggleUserBlock(username, id, isBlocked),
    onError: (error, variables) => {
      console.error("Error toggling user block status:", error);
      
      // Revert on error
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === variables.id && c.participants && c.participants[variables.username]) {
            return {
              ...c,
              participants: {
                ...c.participants,
                [variables.username]: {
                  ...c.participants[variables.username],
                  isBlocked: !variables.isBlocked
                }
              }
            };
          }
          return c;
        })
      );
      
      // Update selected conversation too if needed
      if (selectedConversation?.id === variables.id) {
        setSelectedConversation(prev => {
          if (!prev || !prev.participants) return prev;
          
          return {
            ...prev,
            participants: {
              ...prev.participants,
              [variables.username]: {
                ...prev.participants[variables.username],
                isBlocked: !variables.isBlocked
              }
            }
          };
        });
      }
    }
  });
  
  const deleteConversationMutation = useMutation({
    mutationFn: async ({ id, otherUsername }) => {
      await messagingService.deleteConversation(otherUsername);
      return { id, otherUsername };
    },
    onError: (error, variables) => {
      console.error("Error deleting conversation:", error);
      
      // Restore conversation on error
      setConversations(prev => {
        const exists = prev.some(c => c.id === variables.id);
        if (!exists) {
          const originalConv = conversations.find(c => c.id === variables.id);
          if (originalConv) {
            return [...prev, originalConv];
          }
        }
        return prev;
      });
    },
    onSuccess: () => {
      // Could invalidate queries here if needed
      // queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
  
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
    
    // Execute mutation
    toggleReadMutation.mutate({ id, currentUser });
    
  }, [conversations, currentUser, toggleReadMutation]);

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
    
    // Execute mutation
    toggleBlockMutation.mutate({ username: usernameToToggle, id, isBlocked });
    
  }, [conversations, currentUser, selectedConversation, toggleBlockMutation]);

  // Handle conversation deletion
  const handleDeleteConversation = useCallback(async (id, otherUsername) => {
    if (!id || !otherUsername) return;
    
    // If the selected conversation is being deleted, clear it
    if (selectedConversation?.id === id) {
      setSelectedConversation(null);
    }
    
    // Remove from UI immediately (optimistic update)
    setConversations(prev => prev.filter(c => c.id !== id));
    
    // Execute mutation
    deleteConversationMutation.mutate({ id, otherUsername });
    
  }, [conversations, selectedConversation, deleteConversationMutation]);


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
            
            // Update selected conversation if needed - BUT ONLY FOR DATA UPDATES, NOT SELECTION
            if (selectedConversationIdRef.current) {
              const currentlySelectedId = selectedConversationIdRef.current;
              const updatedSelectedConversation = updatedConversations.find(
                (conv) => conv.id === currentlySelectedId
              );
              
              if (updatedSelectedConversation) {
                // Only update specific fields, not change selection entirely
                setSelectedConversation(prev => {
                  if (!prev) return prev; // Don't select if nothing was selected
                  
                  // Only update if there are actual changes to metadata or participants
                  if (JSON.stringify(prev?.participantMetadata) !== 
                      JSON.stringify(updatedSelectedConversation.participantMetadata) ||
                      JSON.stringify(prev?.participants) !== 
                      JSON.stringify(updatedSelectedConversation.participants)) {
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

  // Return state and handlers
  return {
    conversations,
    selectedConversation,
    selectConversation,
    handleSelectConversation,
    handleToggleRead,
    handleToggleBlock,
    handleDeleteConversation,
    setSelectedConversation,
    // Add mutation states for components to use
    isTogglingRead: toggleReadMutation.isPending,
    isTogglingBlock: toggleBlockMutation.isPending,
    isDeleting: deleteConversationMutation.isPending,
  };
}
