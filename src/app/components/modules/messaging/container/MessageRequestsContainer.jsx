"use client";

import React, { useCallback } from "react";
import { MessageRequestsPresentation } from "../presentation/MessageRequests";
import { useMessageRequests } from "@/app/hooks/messaging/useMessageRequests";
import { useToast } from "@/app/context/ToastContext";


export function MessageRequestsContainer({
  currentUser,
  onBack,
  onSelectConversation,
  navigateToUser,
}) {
  const { toast } = useToast();
  
  // Use the message requests hook
  const {
    receivedRequests,
    sentRequests,
    selectedTab,
    setSelectedTab,
    loadingReceived,
    loadingSent,
    handleAcceptRequest,
    handleRejectRequest,
    handleDeleteRequest,
    isAccepting,
    isRejecting,
    isDeleting,
  } = useMessageRequests(currentUser);
  
  // Handle tab change
  const handleTabChange = useCallback((value) => {
    setSelectedTab(value);
  }, [setSelectedTab]);
  
  // Handle accepting a request
  const handleAccept = useCallback(async (requestId) => {
    try {
      // Accept the request
      const result = await handleAcceptRequest(requestId);
      
      // Show success message
      toast({
        title: "Request Accepted",
        description: "You can now start messaging this user",
        variant: "default",
      });
      
      // Navigate to the new conversation if created
      if (result?.id && result?.participants) {
        // Find the other participant username
        const otherUsername = Object.keys(result.participants)
          .find(username => username !== currentUser?.username);
        
        if (otherUsername) {
          // Select the conversation and navigate to it
          onSelectConversation(result);
          navigateToUser(otherUsername);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept message request",
        variant: "destructive",
      });
    }
  }, [handleAcceptRequest, toast, currentUser, onSelectConversation, navigateToUser]);
  
  // Handle rejecting a request
  const handleReject = useCallback(async (requestId) => {
    try {
      await handleRejectRequest(requestId);
      toast({
        title: "Request Rejected",
        description: "The message request has been declined",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject message request",
        variant: "destructive",
      });
    }
  }, [handleRejectRequest, toast]);
  
  // Handle deleting a request
  const handleDelete = useCallback(async (requestId) => {
    try {
      await handleDeleteRequest(requestId);
      toast({
        title: "Request Removed",
        description: "The message request has been removed",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete message request",
        variant: "destructive",
      });
    }
  }, [handleDeleteRequest, toast]);
  
  // Handle viewing a profile or conversation
  const handleViewProfile = useCallback((participant) => {
    if (participant?.username) {
      navigateToUser(participant.username);
    }
  }, [navigateToUser]);
  
  return (
    <MessageRequestsPresentation
      receivedRequests={receivedRequests}
      sentRequests={sentRequests}
      selectedTab={selectedTab}
      onTabChange={handleTabChange}
      onAcceptRequest={handleAccept}
      onRejectRequest={handleReject}
      onDeleteRequest={handleDelete}
      onViewProfile={handleViewProfile}
      onBack={onBack}
      loadingReceived={loadingReceived}
      loadingSent={loadingSent}
      isProcessing={isAccepting || isRejecting || isDeleting}
    />
  );
}
