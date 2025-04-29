import { useState, useCallback } from "react";
import { messagingService } from "@/app/services/messagingService";

/**
 * Custom hook for managing user connections for messaging
 */
export function useConnections(currentUser, conversations) {
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [userConnections, setUserConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);

  // Open connections modal and load connections
  const handleOpenConnections = useCallback(async () => {
    setShowConnectionsModal(true);
    setLoadingConnections(true);
    
    try {
      const connections = await messagingService.getUserConnections(); 
      setUserConnections(Array.isArray(connections) ? connections : []);
    } catch (err) {
      console.error("Error fetching user connections:", err);
      setUserConnections([]);
    } finally {
      setLoadingConnections(false);
    }
  }, []);

  // Create or select an existing conversation with a connection
  const handleStartConversation = useCallback(async (connection, selectConversation, navigateToUser) => {
    if (!connection?.username || !currentUser) return null;
    
    try {
      setShowConnectionsModal(false);
      
      // Check if conversation already exists
      const existing = conversations.find((c) => 
        c.participants && Object.keys(c.participants).includes(connection.username)
      );

      if (existing) {
        selectConversation(existing);
        navigateToUser(connection.username);
        return existing;
      } else {
        // Create a new conversation
        const newConvData = await messagingService.createConversation(connection.username, currentUser); 
        if (newConvData?.id) {
          selectConversation(newConvData);
          navigateToUser(connection.username);
          return newConvData;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error in conversation handling:", error);
      return null;
    }
  }, [currentUser, conversations]);

  return {
    showConnectionsModal,
    userConnections,
    loadingConnections,
    handleOpenConnections,
    handleStartConversation,
    setShowConnectionsModal,
  };
}
