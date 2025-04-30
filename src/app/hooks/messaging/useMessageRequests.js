import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageRequestService } from "@/app/services/messageRequestService";

/**
 * Custom hook for managing message requests
 */
export function useMessageRequests(currentUser) {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("received");
  
  // Fetch received message requests
  const { 
    data: receivedRequests = [], 
    isLoading: loadingReceived,
    isError: errorReceived,
    refetch: refetchReceived
  } = useQuery({
    queryKey: ["messageRequests", "received", currentUser],
    queryFn: messageRequestService.getMessageRequests,
    enabled: !!currentUser,
    // Add a select function to ensure we always get an array even if the backend returns null
    select: (data) => Array.isArray(data) ? data : []
  });
  
  // Fetch sent message requests
  const { 
    data: sentRequests = [], 
    isLoading: loadingSent,
    isError: errorSent,
    refetch: refetchSent
  } = useQuery({
    queryKey: ["messageRequests", "sent", currentUser],
    queryFn: messageRequestService.getSentRequests,
    enabled: !!currentUser && selectedTab === "sent",
    // Add a select function to ensure we always get an array even if the backend returns null
    select: (data) => Array.isArray(data) ? data : []
  });
  
  // Accept message request mutation
  const acceptMutation = useMutation({
    mutationFn: (requestId) => messageRequestService.acceptMessageRequest(requestId),
    onSuccess: (data) => {
      // Invalidate with the complete query key including the username
      queryClient.invalidateQueries({ 
        queryKey: ["messageRequests", "received", currentUser] 
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      
      // Explicitly refetch the queries
      refetchReceived();
      
      return data;
    }
  });
  
  // Reject message request mutation
  const rejectMutation = useMutation({
    mutationFn: (requestId) => messageRequestService.rejectMessageRequest(requestId),
    onSuccess: () => {
      // Invalidate with the complete query key including the username
      queryClient.invalidateQueries({ 
        queryKey: ["messageRequests", "received", currentUser] 
      });
      
      // Explicitly refetch
      refetchReceived();
    }
  });
  
  // Delete message request mutation
  const deleteMutation = useMutation({
    mutationFn: (requestId) => messageRequestService.deleteMessageRequest(requestId),
    onSuccess: () => {
      // Invalidate both received and sent message requests with complete query keys
      queryClient.invalidateQueries({ 
        queryKey: ["messageRequests", "received", currentUser] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["messageRequests", "sent", currentUser] 
      });
      
      // Refetch the appropriate queries based on selected tab
      if (selectedTab === "received") {
        refetchReceived();
      } else if (selectedTab === "sent") {
        refetchSent();
      }
    }
  });
  
  // Handle accepting a message request
  const handleAcceptRequest = useCallback(async (requestId) => {
    try {
      return await acceptMutation.mutateAsync(requestId);
    } catch (error) {
      console.error("Error accepting message request:", error);
      throw error;
    }
  }, [acceptMutation]);
  
  // Handle rejecting a message request
  const handleRejectRequest = useCallback(async (requestId) => {
    try {
      return await rejectMutation.mutateAsync(requestId);
    } catch (error) {
      console.error("Error rejecting message request:", error);
      throw error;
    }
  }, [rejectMutation]);
  
  // Handle deleting a message request
  const handleDeleteRequest = useCallback(async (requestId) => {
    try {
      return await deleteMutation.mutateAsync(requestId);
    } catch (error) {
      console.error("Error deleting message request:", error);
      throw error;
    }
  }, [deleteMutation]);
  
  // Refresh data when tab changes
  useEffect(() => {
    if (selectedTab === "received") {
      refetchReceived();
    } else if (selectedTab === "sent") {
      refetchSent();
    }
  }, [selectedTab, refetchReceived, refetchSent]);
  
  return {
    receivedRequests: Array.isArray(receivedRequests) ? receivedRequests : [],
    sentRequests: Array.isArray(sentRequests) ? sentRequests : [],
    selectedTab,
    setSelectedTab,
    loadingReceived,
    loadingSent,
    errorReceived,
    errorSent,
    handleAcceptRequest,
    handleRejectRequest,
    handleDeleteRequest,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
