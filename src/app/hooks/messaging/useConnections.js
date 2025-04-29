import { useState, useCallback, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { messagingService } from "@/app/services/messagingService";
import { fetchUserConnections } from "@/app/services/userProfile";

/**
 * Custom hook for managing user connections for messaging
 */
export function useConnections(currentUser, conversations) {
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);

  // Use infinite query for paginated connections
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["connections", currentUser?.username],
    queryFn: ({ pageParam = 1 }) =>
      fetchUserConnections(
        pageParam,
        10,
        currentUser?.username !== undefined ? currentUser.username : null
      ),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.length || lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: false, // Don't fetch on mount, only when modal opens
  });

  // Flatten all pages into a single array for easier consumption
  const userConnections = useMemo(() => {
    if (!data) return [];
    return data.pages.flat();
  }, [data]);

  // Open connections modal and load connections
  const handleOpenConnections = useCallback(async () => {
    setShowConnectionsModal(true);
    refetch();
  }, [refetch]);

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
    loadingConnections: isLoading,
    hasMoreConnections: hasNextPage,
    loadingMoreConnections: isFetchingNextPage,
    errorLoadingConnections: isError,
    handleOpenConnections,
    handleStartConversation,
    setShowConnectionsModal,
    loadMoreConnections: fetchNextPage,
  };
}
