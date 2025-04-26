"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import * as FirestoreService from "@/app/services/messagingService";
import { MessagingPresentation } from "../presentation/MessagingInterface";
import { ConnectionsModal } from "../presentation/ConnectionsModal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export function MessagingContainer({ currentUser }) {
  // ---- INITIALIZATION ----
  // Memoize service to prevent recreation
  const service = useMemo(() => FirestoreService.messagingService, []);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const usernameParam = useMemo(() => searchParams.get("username"), [searchParams]);

  // ---- REFS ----
  const selectedConversationIdRef = useRef(null);
  const readStatusOperations = useRef(new Map());
  const navigationInitiatedRef = useRef(false);
  const conversationsSubscriptionRef = useRef(null);
  const messagesSubscriptionRef = useRef(null);
  const lastSubscriptionParams = useRef({ conversationId: null, currentUser: null });

  // ---- STATE MANAGEMENT ----
  // Conversations
  const [userConversations, setUserConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  // Messages
  const [messages, setMessages] = useState([]);
  // Message pagination
  const [messageLimit, setMessageLimit] = useState(20);
  // Connections
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [userConnections, setUserConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);
  // UI State
  const [isHandlingUrlChange, setIsHandlingUrlChange] = useState(false);

  // Add debounce utility at the top of your component
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Optimize read status by tracking pending operations
  const [pendingReadOperations, setPendingReadOperations] = useState({});

  // ---- UTILITIES ----
  // Updated to work with new conversation schema
  const getOtherParticipantUsername = useCallback(
    (conversation) => {
      if (!conversation?.participants || !currentUser) return null;
      
      // Get all participant usernames (keys of the participants object)
      const usernames = Object.keys(conversation.participants);
      
      // Find the username that isn't the current user
      return usernames.find(username => username !== currentUser) || null;
    },
    [currentUser]
  );
  
  // Get participant display name from username
  const getParticipantDisplayName = useCallback(
    (conversation, username) => {
      if (!conversation?.participants || !username) return null;
      return conversation.participants[username]?.name || username;
    },
    []
  );
  
  // Get participant profile picture from username
  const getParticipantProfilePicture = useCallback(
    (conversation, username) => {
      if (!conversation?.participants || !username) return null;
      return conversation.participants[username]?.profilePicture || null;
    },
    []
  );
  
  // Check if participant is blocked
  const isParticipantBlocked = useCallback(
    (conversation, username) => {
      if (!conversation?.participants || !username) return false;
      return conversation.participants[username]?.isBlocked || false;
    },
    []
  );

  // ---- NAVIGATION FUNCTIONS ----
  const navigateToUser = useCallback((username) => {
    if (!username) {
      router.push(pathname);
    } else {
      router.push(`${pathname}?username=${encodeURIComponent(username)}`);
    }
    
    navigationInitiatedRef.current = true;
    setTimeout(() => {
      navigationInitiatedRef.current = false;
    }, 300);
  }, [pathname, router]);

  const handleBack = useCallback(() => {
    if (!selectedConversation) return;
    setSelectedConversation(null);
    navigateToUser(null);
  }, [selectedConversation, navigateToUser]);

  // ---- CONVERSATION HANDLERS ----
  const selectConversation = useCallback((conversation) => {
    setSelectedConversation(conversation);
    
    if (conversation && !navigationInitiatedRef.current) {
      const otherUsername = getOtherParticipantUsername(conversation);
      if (otherUsername) {
        navigateToUser(otherUsername);
      }
    }

    // Optimize: Only mark as read if not already read and not being handled
    if (conversation && 
        currentUser && 
        conversation.participantMetadata && 
        !conversation.participantMetadata[currentUser]?.readFlag && 
        !readStatusOperations.current.has(conversation.id)) {
      
      const otherUsername = getOtherParticipantUsername(conversation);
      if (otherUsername) {
        // Track this operation to prevent UI flicker
        readStatusOperations.current.set(conversation.id, true);
        
        // Optimistically update UI immediately
        setUserConversations(prev => 
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
        
        // Batch read operations to reduce Firebase calls
        setPendingReadOperations(prev => ({
          ...prev,
          [otherUsername]: true
        }));
      }
    }
  }, [getOtherParticipantUsername, navigateToUser, currentUser]);

  // Update handleSelectConversation for the new schema
  const handleSelectConversation = useCallback((id) => {
    const conv = userConversations.find((c) => c.id === id);
    if (conv) {
      // This will invoke selectConversation with proper read status handling
      selectConversation(conv);
    }
  }, [userConversations, selectConversation]);

  // Update for new schema
  const handleMarkAsRead = useCallback((id) => {
    const conv = userConversations.find((c) => c.id === id);
    if (!conv || !currentUser) return;
    
    const otherUsername = getOtherParticipantUsername(conv);
    if (!otherUsername) return;

    // Optimistically update the UI
    setUserConversations((prev) =>
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

    service.markMessagesAsRead(otherUsername)
      .catch(err => console.error("Error marking messages as read:", err));
  }, [userConversations, service, getOtherParticipantUsername, currentUser]);
  
  // Update toggle read function for new schema
  const handleToggleRead = useCallback((id, readStatus) => { 
    const conv = userConversations.find((c) => c.id === id);
    if (!conv || !currentUser) return;
    
    const otherUsername = getOtherParticipantUsername(conv);
    if (!otherUsername) return;
    
    // Get current read status from participantMetadata
    const currentReadStatus = conv.participantMetadata?.[currentUser]?.readFlag || false;
    
    // Track this operation in progress
    readStatusOperations.current.set(id, !currentReadStatus);
    
    // Optimistically update UI immediately
    setUserConversations((prev) =>
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
    
    // Make API call and handle response appropriately
    service.toggleConversationReadStatusFirestore(id, currentUser)
      .then(() => {
        console.log(`Successfully toggled read status to ${!currentReadStatus} for conversation ${id}`);
        // Operation succeeded - keep the UI as is and clean up tracking
        setTimeout(() => {
          readStatusOperations.current.delete(id);
        }, 500);
      })
      .catch(err => {
        console.error("Error toggling conversation read status:", err);
        
        // Revert to original state on error
        setUserConversations((prev) =>
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
        
        // Clean up tracking immediately on error
        readStatusOperations.current.delete(id);
      });
  }, [service, userConversations, getOtherParticipantUsername, currentUser]);

  // Update block function for new schema
  const handleToggleBlock = useCallback((id, usernameToToggle) => {
    if (!currentUser || !usernameToToggle) return;
    
    const conv = userConversations.find((c) => c.id === id);
    if (!conv || !conv.participants) return;
    
    // Get current block status
    const isCurrentlyBlocked = conv.participants[usernameToToggle]?.isBlocked || false;
    
    // Optimistically update UI
    setUserConversations((prev) =>
      prev.map((c) => {
        if (c.id === id && c.participants && c.participants[usernameToToggle]) {
          return {
            ...c,
            participants: {
              ...c.participants,
              [usernameToToggle]: {
                ...c.participants[usernameToToggle],
                isBlocked: !isCurrentlyBlocked
              }
            }
          };
        }
        return c;
      })
    );
    
    service.toggleUserBlock(usernameToToggle, id)
      .catch(err => {
        console.error("Error toggling user block status:", err);
        
        // Revert on error
        setUserConversations((prev) =>
          prev.map((c) => {
            if (c.id === id && c.participants && c.participants[usernameToToggle]) {
              return {
                ...c,
                participants: {
                  ...c.participants,
                  [usernameToToggle]: {
                    ...c.participants[usernameToToggle],
                    isBlocked: isCurrentlyBlocked
                  }
                }
              };
            }
            return c;
          })
        );
      });
  }, [currentUser, service, userConversations]);

  // Define the mutation at the component level
  const sendMessageMutation = useMutation({
    mutationFn: ({ receiver, msg, media }) => 
      service.sendMessage(receiver, msg, media)
  });

  // ---- MESSAGE HANDLERS ----
  const handleSendMessage = useCallback((receiverName, message, mediaFiles) => {
    if (!message.trim() && (!mediaFiles || mediaFiles.length === 0)) return;
    
    // Create new messages based on mediaFiles length
    const newMessages = mediaFiles?.length
      ? mediaFiles.map((file) => ({
        id: crypto.randomUUID(),
        senderName: currentUser,
        receiverName,
        timestamp: new Date().toISOString(),
        isDeleted: false,
        read: false,
        mediaUrl: URL.createObjectURL(file),
      }))
      : [
        {
        id: crypto.randomUUID(),
        senderName: currentUser,
        receiverName,
        timestamp: new Date().toISOString(),
        isDeleted: false,
        read: false,
        messageContent: message.trim(),
        },
      ];

    // Optimistically add new messages to the state
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);


    // Call the mutation
    sendMessageMutation.mutate({ 
      receiver: receiverName, 
      msg: message, 
      media: mediaFiles 
    }, {
      onError: (error) => {
        console.error("Failed to send message:", error);
        // Remove the optimistically added messages on error
        setMessages(prevMessages => 
          prevMessages.filter(msg => !newMessages.some(newMsg => newMsg.id === msg.id))
        );
      }
    });
  }, [currentUser, sendMessageMutation]);

  // Update typing indicator for new schema
  const handleSetTypingIndicator = useCallback(
    debounce((receiverUsername, convId, isTyping) => {
      if (!currentUser || !convId) return;
      
      // Optimistically update UI
      setUserConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId && c.participantMetadata) {
            return {
              ...c,
              participantMetadata: {
                ...c.participantMetadata,
                [currentUser]: {
                  ...c.participantMetadata[currentUser],
                  typingStatus: isTyping
                }
              }
            };
          }
          return c;
        })
      );
      
      service.updateTypingStatus(currentUser, convId, isTyping);
    }, 300),
    [service, currentUser]
  );

  // ---- CONNECTION HANDLERS ----
  const handleOpenConnections = useCallback(async () => {
    setShowConnectionsModal(true);
    setLoadingConnections(true);
    try {
      const connections = await service.getUserConnections(); 
      setUserConnections(Array.isArray(connections) ? connections : []);
    } catch (err) {
      console.error("Error fetching user connections:", err);
      setUserConnections([]);
    } finally {
      setLoadingConnections(false);
    }
  }, [service]);

  const handleStartConversation = useCallback(async (connection) => {
    if (!connection?.username || !currentUser) return;
    
    try {
      setShowConnectionsModal(false);
      navigationInitiatedRef.current = true;
      
      const existing = userConversations.find((c) => 
        c.participants && Object.keys(c.participants).includes(connection.username)
      );

      if (existing) {
        setSelectedConversation(existing);
        setTimeout(() => {
          const username = getOtherParticipantUsername(existing);
          if (username) navigateToUser(username);
        }, 50);
      } else {
        const newConvData = await service.createConversation(connection.username, currentUser); 
        if (newConvData?.id) {
          setSelectedConversation(newConvData);
          setTimeout(() => {
            navigateToUser(connection.username);
          }, 50);
        }
      }
    } catch (error) {
      console.error("Error in conversation handling:", error);
    } finally {
      setTimeout(() => {
        navigationInitiatedRef.current = false;
      }, 500);
    }
  }, [userConversations, currentUser, service, getOtherParticipantUsername, navigateToUser]);

  // ---- DATA LOADING EFFECTS ----
  // Load conversations with debounce to prevent rapid subscription changes
  const subscribeToConversations = useCallback(
    debounce(() => {
      if (!currentUser) return;
      
      // Clean up any existing subscription first
      if (conversationsSubscriptionRef.current) {
        conversationsSubscriptionRef.current();
        conversationsSubscriptionRef.current = null;
      }
      
      conversationsSubscriptionRef.current = service.subscribeToConversations(
        currentUser, 
        (updatedConversations) => {
          if (Array.isArray(updatedConversations)) {
            setUserConversations(updatedConversations);
          }
        }
      );
    }, 300),
    [currentUser, service]
  );
  
  useEffect(() => {
    subscribeToConversations();
    
    return () => {
      if (conversationsSubscriptionRef.current) {
        conversationsSubscriptionRef.current();
        conversationsSubscriptionRef.current = null;
      }
    };
  }, [subscribeToConversations]);

  // Process batched read operations
  useEffect(() => {
    if (Object.keys(pendingReadOperations).length === 0) return;
    
    const usernames = Object.keys(pendingReadOperations);
    
    // Process in batches with a small delay
    const processReadOperations = async () => {
      try {
        // Process up to 5 operations at once
        for (let i = 0; i < usernames.length; i += 5) {
          const batch = usernames.slice(i, i + 5);
          await Promise.all(
            batch.map(username => 
              service.markMessagesAsRead(username)
                .catch(err => console.error(`Error marking messages as read for ${username}:`, err))
            )
          );
          // Small delay between batches
          if (i + 5 < usernames.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      } finally {
        setPendingReadOperations({});
        // Clear read operations tracking after all batches complete
        setTimeout(() => {
          usernames.forEach(username => {
            const convId = userConversations.find(c => 
              c.participants && Object.keys(c.participants).includes(username)
            )?.id;
            if (convId) readStatusOperations.current.delete(convId);
          });
        }, 500);
      }
    };
    
    processReadOperations();
  }, [pendingReadOperations, service, userConversations]);

  // Optimize message subscription with proper limits and prevent excessive re-subscriptions
  const subscribeToMessages = useCallback(
    debounce(() => {
      const conversationId = selectedConversation?.id;
      
      if (!conversationId) {
        setMessages([]);
        if (messagesSubscriptionRef.current) {
          messagesSubscriptionRef.current();
          messagesSubscriptionRef.current = null;
        }
        return;
      }
      
      // Check if we already have a subscription for this conversation
      if (messagesSubscriptionRef.current &&
          lastSubscriptionParams.current.conversationId === conversationId &&
          lastSubscriptionParams.current.currentUser === currentUser) {
        return; // Skip resubscription if parameters haven't changed
      }
      
      // Clean up existing subscription
      if (messagesSubscriptionRef.current) {
        messagesSubscriptionRef.current();
        messagesSubscriptionRef.current = null;
      }
      
      selectedConversationIdRef.current = conversationId;
      lastSubscriptionParams.current = { conversationId, currentUser };
      
      // Now subscribe with limit parameter
      messagesSubscriptionRef.current = service.subscribeToConversationMessages(
        conversationId, 
        currentUser,
        (newMessages) => {
          if (Array.isArray(newMessages)) {
            setMessages(newMessages);
          }
        },
        messageLimit // Pass limit parameter to your service
      );
    }, 300),
    [selectedConversation?.id, currentUser, service, messageLimit]
  );
  
  useEffect(() => {
    subscribeToMessages();
    
    return () => {
      if (messagesSubscriptionRef.current) {
        messagesSubscriptionRef.current();
        messagesSubscriptionRef.current = null;
      }
    };
  }, [subscribeToMessages]);

  // Load more messages when user scrolls up
  const handleLoadMoreMessages = useCallback(() => {
    setMessageLimit(prev => prev + 5);
  }, []);

  // ---- UI SYNC EFFECTS ----
  // Handle URL changes - update for new schema
  useEffect(() => {
    if (!userConversations.length || !usernameParam || navigationInitiatedRef.current) return;
    
    setIsHandlingUrlChange(true);
    
    const matchingConversation = userConversations.find((c) => {
      // Check if usernameParam is a key in participants object
      return c.participants && Object.keys(c.participants).includes(usernameParam);
    });
    
    if (matchingConversation && 
        (!selectedConversation || selectedConversation.id !== matchingConversation.id)) {
      selectConversation(matchingConversation);
    }
    
    setIsHandlingUrlChange(false);
  }, [usernameParam, userConversations, currentUser, selectedConversation, selectConversation]);

  // Handle read status operations - updated for new schema
  useEffect(() => {
    if (readStatusOperations.current.size === 0) return;
    
    const filteredConversations = userConversations.map(conv => {
      if (readStatusOperations.current.has(conv.id) && currentUser && conv.participantMetadata) {
        return {
          ...conv,
          participantMetadata: {
            ...conv.participantMetadata,
            [currentUser]: {
              ...conv.participantMetadata[currentUser],
              readFlag: readStatusOperations.current.get(conv.id),
              ...(readStatusOperations.current.get(conv.id) ? { unreadCount: 0 } : {})
            }
          }
        };
      }
      return conv;
    });
    
    if (JSON.stringify(filteredConversations) !== JSON.stringify(userConversations)) {
      setUserConversations(filteredConversations);
    }
  }, [userConversations, currentUser]);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');
        
        if (!username && selectedConversation) {
          setSelectedConversation(null);
        }
      }, 50);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedConversation]);

  // ---- RENDER ----
  return (
    <>
      <MessagingPresentation
        userConversations={userConversations}
        selectedConversation={selectedConversation}
        currentUser={currentUser}
        messages={messages}
        onSelectConversation={handleSelectConversation}
        onMarkAsRead={handleMarkAsRead}
        onToggleRead={handleToggleRead}
        onToggleBlock={handleToggleBlock}
        onSendMessage={handleSendMessage}
        onSetTypingIndicator={handleSetTypingIndicator}
        onBack={handleBack}
        onOpenConnections={handleOpenConnections}
        onLoadMoreMessages={handleLoadMoreMessages}
      />

      {showConnectionsModal && (
        <ConnectionsModal
          loading={loadingConnections}
          connections={userConnections}
          onClose={() => setShowConnectionsModal(false)}
          onSelect={handleStartConversation}
        />
      )}
    </>
  );
}