"use client";

import React, { useCallback } from "react";
import { MessageRequestsPresentation } from "../presentation/MessageRequests";
import { useMessageRequests } from "@/app/hooks/messaging/useMessageRequests";
import { useToast } from "@/app/context/ToastContext";

/**
 * @namespace messages
 * @module messages
 */
/**
 * Container component that handles the messaging requests functionality.
 * Manages requests state and provides handlers for user interactions.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.currentUser - The current logged in user object
 * @param {Function} props.onBack - Callback function to handle back navigation
 * @param {Function} props.onSelectConversation - Callback function to select a conversation
 * @param {Function} props.navigateToUser - Callback function to navigate to a user's profile
 * 
 * @returns {JSX.Element} Message requests UI with tabs for received and sent requests
 */
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
export default MessageRequestsContainer;
