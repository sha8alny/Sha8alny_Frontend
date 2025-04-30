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
  const showToast = useToast();
  
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
      
      // Show success message using the correct pattern
      showToast("Request Accepted. You can now start messaging this user", true);
      
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
      // Show error message
      showToast(error.message || "Failed to accept message request", false);
    }
  }, [handleAcceptRequest, showToast, currentUser, onSelectConversation, navigateToUser]);
  
  // Handle rejecting a request
  const handleReject = useCallback(async (requestId) => {
    try {
      await handleRejectRequest(requestId);
      showToast("The message request has been declined", true);
    } catch (error) {
      showToast(error.message || "Failed to reject message request", false);
    }
  }, [handleRejectRequest, showToast]);
  
  // Handle deleting a request
  const handleDelete = useCallback(async (requestId) => {
    try {
      await handleDeleteRequest(requestId);
      showToast("The message request has been removed", true);
    } catch (error) {
      showToast(error.message || "Failed to delete message request", false);
    }
  }, [handleDeleteRequest, showToast]);
  
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
      onViewProfile={navigateToUser}
      onBack={onBack}
      loadingReceived={loadingReceived}
      loadingSent={loadingSent}
      isProcessing={isAccepting || isRejecting || isDeleting}
    />
  );
}
