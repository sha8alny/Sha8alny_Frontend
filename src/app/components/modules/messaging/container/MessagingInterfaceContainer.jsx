"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import * as FirestoreService from   "@/app/services/messagingService";
import { MessagingPresentation } from "../presentation/MessagingInterface";
import { ConnectionsModal } from "../presentation/ConnectionsModal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function MessagingContainer({ currentUser }) {
  const [userConversations, setUserConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [userConnections, setUserConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);

  const service = FirestoreService.messagingService;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getOtherParticipantUsername = useCallback(
    (conversation) =>
      // Find the participant object whose username is not the current user's
      conversation?.participants.find((p) => p.username !== currentUser)?.username || null,
    [currentUser]
  );

  // Add a stable reference for the current conversation ID
  const selectedConversationIdRef = useRef(null);
  
  // Add memoized username param getter
  const usernameParam = useMemo(() => searchParams.get("username"), [searchParams]);
  
  // Split the effect for URL updates and subscriptions to avoid cycles
  
  // Effect for URL syncing - runs only when necessary
  useEffect(() => {
    if (!selectedConversation?.id) return;
    
    const otherUsername = getOtherParticipantUsername(selectedConversation);
    if (!otherUsername) return;
    
    // Update URL only when needed
    if (usernameParam !== otherUsername) {
      router.push(`${pathname}?username=${otherUsername}`, { scroll: false });
    } 
  }, [selectedConversation, getOtherParticipantUsername, pathname, router, usernameParam]);
  
  // Messages subscription with reduced dependencies
  useEffect(() => {
    if (!selectedConversation?.id) {
      setMessages([]);
      return;
    }

    // Store current ID in ref for cleanup
    selectedConversationIdRef.current = selectedConversation.id;
    
    // Subscribe using id
    const unsubscribe = service.subscribeToConversationMessages(selectedConversation.id, (newMessages) => {
      if (Array.isArray(newMessages)) {
        setMessages(newMessages);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [selectedConversation?.id, service]); // Minimal dependencies

  // Add a blocking flag for preventing conversation selection from URL when going back
  const preventSelectionRef = useRef(false);

  // Modify the conversations subscription effect to handle URL-based selection
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = service.subscribeToConversations(currentUser, (updatedConversations) => {
      if (!Array.isArray(updatedConversations)) return;

      setUserConversations(updatedConversations);

      // If URL has username and selection is not blocked, find matching conversation
      if (usernameParam && !preventSelectionRef.current) {
        const matchingConversation = updatedConversations.find((c) => 
          c.participants.some(p => p.username === usernameParam && p.username !== currentUser)
        );
        
        if (matchingConversation && 
           (!selectedConversation || selectedConversation.id !== matchingConversation.id)) {
          setSelectedConversation(matchingConversation);
        }
      }
    });

    return () => unsubscribe?.();
  }, [currentUser, service, usernameParam, selectedConversation]);

  // Update selected conversation when it changes in userConversations
  useEffect(() => {
    if (!selectedConversation?.id) return; // Use id
    
    const updatedConversation = userConversations.find(
      (conv) => conv.id === selectedConversation.id
    );
    
    // Simple check if the object reference or content changed
    if (updatedConversation && updatedConversation !== selectedConversation && JSON.stringify(updatedConversation) !== JSON.stringify(selectedConversation)) {
      setSelectedConversation(updatedConversation);
    }
  }, [userConversations, selectedConversation]);

  const handleSelectConversation = useCallback(
    (id) => {
      const conv = userConversations.find((c) => c.id === id);
      if (conv) {
        const otherUsername = getOtherParticipantUsername(conv);
        
        // Update selection first
        setSelectedConversation(conv);
        
        // Optimistically update UI
        setUserConversations(prev => prev.map(c => 
          c.id === id ? {...c, read: true} : c
        ));
        
        // Trigger read status updates if needed
        if (!conv.read) {
          handleToggleRead(id, true);
        }
        
        // Mark messages as read
        if (otherUsername) {
          service.markMessagesAsRead(otherUsername)
            .catch(err => console.error("Error marking messages as read:", err));
        }
      }
    },
    [userConversations, getOtherParticipantUsername, service]
  );

  const handleMarkAsRead = useCallback((id) => {
    const conv = userConversations.find((c) => c.id === id);
    const other = getOtherParticipantUsername(conv); // Get other participant's username
    if (!other) return;

    // Optimistically update UI first
    setUserConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, read: true } : c))
    );

    // Then make the API call without awaiting
    service.markMessagesAsRead(other)
      .catch(err => {
        console.error("Error marking messages as read:", err);
        // Consider reverting the UI update on error if needed
      });
  }, [userConversations, service, getOtherParticipantUsername]);
  
  // Add a ref to track in-progress read status operations
  const readStatusOperations = useRef(new Map());

  const handleToggleRead = useCallback((id, readStatus) => { 
    const conv = userConversations.find((c) => c.id === id);
    const other = getOtherParticipantUsername(conv);
    if (!other) return;
    
    // Add this operation to our tracking map
    readStatusOperations.current.set(id, readStatus);
    
    // Optimistically update UI first
    setUserConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, read: readStatus } : c)) 
    );
    
    // Then make the API call without awaiting
    service.toggleConversationReadStatus(other)
      .then(() => {
        // On success, keep the optimistic update
        // But wait a bit before removing from operations map to prevent race conditions
        setTimeout(() => {
          readStatusOperations.current.delete(id);
        }, 500);
      })
      .catch(err => {
        console.error("Error toggling conversation read status:", err);
        // On error, revert the optimistic update
        setUserConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, read: !readStatus } : c))
        );
        readStatusOperations.current.delete(id);
      });
  }, [service, userConversations, getOtherParticipantUsername]);

  // Add an effect to filter out subscription updates for in-progress operations
  useEffect(() => {
    if (readStatusOperations.current.size === 0) return;
    
    // Filter incoming conversation updates to preserve our optimistic updates
    const filteredConversations = userConversations.map(conv => {
      if (readStatusOperations.current.has(conv.id)) {
        // Keep our optimistically updated read status
        return { 
          ...conv, 
          read: readStatusOperations.current.get(conv.id) 
        };
      }
      return conv;
    });
    
    // Only update if there's a difference
    if (JSON.stringify(filteredConversations) !== JSON.stringify(userConversations)) {
      setUserConversations(filteredConversations);
    }
  }, [userConversations]);

  const handleToggleBlock = useCallback((id, usernameToToggle, isBlocked) => { // id is conversation id
    if (!currentUser || !usernameToToggle) return;
    
    // Optimistically update UI if needed
    // (Add UI state updates here for blocking if applicable)
    
    // Make the API call without awaiting
    service.toggleUserBlock(usernameToToggle, id)
      .catch(err => {
        console.error("Error toggling user block status:", err);
        // Consider reverting any UI updates on error
      }); 
  }, [currentUser, service]);

  const handleSendMessage = useCallback((receiverName, message, mediaFiles) => {
    if (!message.trim() && (!mediaFiles || mediaFiles.length === 0)) return;
    
    const newMessage = {
      id: crypto.randomUUID(), // Generate a proper UUID instead of using message as ID
      read: false,
      receiverName,
      timestamp: new Date().toISOString(),
      senderName: currentUser,
      isDeleted: false,
      messageContent: [
        ...(message.trim() ? [{ type: 'text', content: message.trim() }] : []),
        ...(mediaFiles?.length ? mediaFiles.map(file => ({ type: 'media', content: file })) : [])
      ],
    };
    
    // Optimistically update UI
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Make the API call without awaiting
    service.sendMessage(receiverName, message, mediaFiles)
      .catch(error => {
        console.error("Failed to send message:", error);
        // Optionally remove the failed message from the UI
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.id !== newMessage.id)
        );
        // Could also show an error toast/notification here
      });
  }, [currentUser, service]);

  const handleSetTypingIndicator = useCallback((userName, convId, isTyping) => { // convId is conversation id
    service.updateTypingStatus(userName, convId, isTyping); // Use convId (which is the id)
  }, [service]);

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

    // First disable all URL-based selections
    preventSelectionRef.current = true;
    
    try {
      // Check if conversation exists
      const existing = userConversations.find((c) => 
          c.participants.some(p => p.username === connection.username)
      );

      if (existing) {
        // Directly update state without using handleSelectConversation to avoid side effects
        setSelectedConversation(existing);
      } else {
        // Create new conversation
        const newConvData = await service.createConversation(connection.username, currentUser); 
        if (newConvData?.id) {
          setSelectedConversation(newConvData);
        }
      }
    } catch (error) {
      console.error("Error in conversation handling:", error);
    } finally {
      // Close modal first
      setShowConnectionsModal(false);
      
      // Keep prevention longer to ensure all updates settle
      setTimeout(() => {
        preventSelectionRef.current = false;
      }, 500);
    }
  }, [userConversations, currentUser, service]);

  // Simplified back button handling
  const handleBack = useCallback(() => {
    if (!selectedConversation) return;
    
    // Block all URL-based selection
    preventSelectionRef.current = true;
    
    // Clear selection and URL in one operation
    setSelectedConversation(null);
    router.replace(pathname, { scroll: false });
    
    // Keep prevention active for longer to ensure all updates settle
    setTimeout(() => {
      preventSelectionRef.current = false;
    }, 500);
  }, [selectedConversation, pathname, router]);

  // Single consolidated effect for URL/conversation synchronization
  useEffect(() => {
    // Skip all synchronization if prevention is active
    if (preventSelectionRef.current) return;
    
    const syncTimeout = setTimeout(() => {
      // Case 1: URL has username but conversation doesn't match
      if (usernameParam) {
        const currentOtherUsername = getOtherParticipantUsername(selectedConversation);
        
        if (usernameParam !== currentOtherUsername) {
          // Find conversation matching URL
          const matchingConversation = userConversations.find(c => 
            c.participants.some(p => p.username === usernameParam && p.username !== currentUser)
          );
          
          if (matchingConversation) {
            // Block further synchronization during this update
            preventSelectionRef.current = true;
            setSelectedConversation(matchingConversation);
            
            // Reset after selection update completes
            setTimeout(() => preventSelectionRef.current = false, 500);
          }
        }
      } 
      // Case 2: URL has no username but conversation is selected
      else if (!usernameParam && selectedConversation) {
        // Don't trigger URL update if we just cleared the selection
        // This prevents oscillation when going back
      }
      // Case 3: URL has username but no matching conversation found
      // Just leave as is, don't clear selection
    }, 50); // Small delay for batching
    
    return () => clearTimeout(syncTimeout);
  }, [usernameParam, selectedConversation, userConversations, currentUser, getOtherParticipantUsername]);

  // Effect specifically for updating URL when selection changes (ONE WAY only)
  useEffect(() => {
    // Only run if we have a selected conversation and prevention is not active
    if (selectedConversation && !preventSelectionRef.current) {
      const otherUsername = getOtherParticipantUsername(selectedConversation);
      
      if (otherUsername && usernameParam !== otherUsername) {
        // Block further synchronization during URL update
        preventSelectionRef.current = true;
        
        // Update URL to match selection
        router.replace(`${pathname}?username=${otherUsername}`, { scroll: false });
        
        // Reset after URL update completes
        setTimeout(() => preventSelectionRef.current = false, 500);
      }
    }
  }, [selectedConversation, getOtherParticipantUsername, usernameParam, pathname, router]);

  // Simple popstate handler that just blocks synchronization during navigation
  useEffect(() => {
    const handlePopState = () => {
      preventSelectionRef.current = true;
      setTimeout(() => preventSelectionRef.current = false, 300);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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