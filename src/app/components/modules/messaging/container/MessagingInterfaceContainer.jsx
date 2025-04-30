"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MessagingPresentation } from "../presentation/MessagingInterface";
import { ConnectionsModal } from "../presentation/ConnectionsModal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useConversations } from "@/app/hooks/messaging/useConversations";
import { useMessages } from "@/app/hooks/messaging/useMessages";
import { useConnections } from "@/app/hooks/messaging/useConnections";
import { useMessageRequests } from "@/app/hooks/messaging/useMessageRequests";
import { getOtherParticipantUsername } from "@/app/utils/participantUtils";

export function MessagingContainer({ currentUser }) {
  // ---- INITIALIZATION ----
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get("username");

  // ---- REFS ----
  const navigationInitiatedRef = useRef(false);
  // Create a ref to track active conversation for cleanup
  const activeConversationRef = useRef(null);

  // ---- CUSTOM HOOKS ----
  // Conversations hook
  const {
    conversations: userConversations,
    selectedConversation,
    selectConversation,
    handleSelectConversation,
    handleToggleRead,
    handleToggleBlock,
    handleDeleteConversation,
    isDeleting, // Get this from useConversations
    setSelectedConversation,
  } = useConversations(currentUser);

  // Messages hook - Need load more and typing indicator handler
  const {
    handleLoadMoreMessages,
    handleSetTypingIndicator, // Re-added as it's used in handleBack and cleanup effect
  } = useMessages(selectedConversation, currentUser);

  // Connections hook
  const {
    showConnectionsModal,
    userConnections,
    loadingConnections,
    hasMoreConnections,
    loadingMoreConnections,
    handleOpenConnections,
    handleStartConversation: startConversation,
    setShowConnectionsModal,
    loadMoreConnections,
  } = useConnections(currentUser, userConversations);

  // Message requests hook
  const { receivedRequests = [], loadingReceived } =
    useMessageRequests(currentUser) || {};

  // ---- UI STATE ----
  const [isHandlingUrlChange, setIsHandlingUrlChange] = useState(false);
  const [showMessageRequests, setShowMessageRequests] = useState(false);

  // Count pending requests - ensure receivedRequests is an array
  const pendingRequestCount = Array.isArray(receivedRequests)
    ? receivedRequests.filter((req) => req.status === "pending").length
    : 0;

  // ---- NAVIGATION FUNCTIONS ----
  const navigateToUser = useCallback(
    (username) => {
      if (!username) {
        router.push(pathname);
      } else {
        router.push(`${pathname}?username=${encodeURIComponent(username)}`);
      }

      navigationInitiatedRef.current = true;
      setTimeout(() => {
        navigationInitiatedRef.current = false;
      }, 300);
    },
    [pathname, router]
  );

  const handleBack = useCallback(() => {
    if (!selectedConversation) return;

    // Store conversation ID for potential cleanup
    const conversationId = selectedConversation.id;
    const otherUsername = getOtherParticipantUsername(
      selectedConversation,
      currentUser
    );

    // First, ensure typing indicator is cleared if active
    if (conversationId && currentUser) {
      // This will clear any typing indicators for the current user
      handleSetTypingIndicator &&
        handleSetTypingIndicator(currentUser, conversationId, false); // Ensure this handler exists
    }

    // Then set selected conversation to null, which will trigger cleanup in the hooks
    setSelectedConversation(null);

    // Update the URL to remove username parameter
    navigateToUser(null);

    // Save the fact we've cleared this conversation (helps with potential race conditions)
    activeConversationRef.current = null;
  }, [
    selectedConversation,
    setSelectedConversation,
    navigateToUser,
    currentUser,
    handleSetTypingIndicator,
  ]);

  // Handle starting a conversation with a connection
  const handleStartConversation = useCallback(
    (connection) => {
      return startConversation(connection, selectConversation, navigateToUser);
    },
    [startConversation, selectConversation, navigateToUser]
  );

  // Updated select conversation handler that also updates URL
  const handleConversationSelect = useCallback(
    (conversationId) => {
      const conversation = userConversations.find(
        (c) => c.id === conversationId
      );
      if (conversation) {
        // Close message requests if open
        setShowMessageRequests(false);

        // First select the conversation directly
        selectConversation(conversation);

        // Then update URL with the other participant's username
        const otherUsername = getOtherParticipantUsername(
          conversation,
          currentUser
        );
        if (otherUsername) {
          navigateToUser(otherUsername);
        }
      }
    },
    [userConversations, selectConversation, currentUser, navigateToUser]
  );

  // Message requests handlers
  const handleViewMessageRequests = useCallback(() => {
    setShowMessageRequests(true);
    setSelectedConversation(null);
    navigateToUser(null);
  }, [setSelectedConversation, navigateToUser]);

  const handleCloseMessageRequests = useCallback(() => {
    setShowMessageRequests(false);
  }, []);

  // ---- UI SYNC EFFECTS ----
  // Handle URL changes
  useEffect(() => {
    if (
      !userConversations.length ||
      !usernameParam ||
      navigationInitiatedRef.current
    )
      return;

    setIsHandlingUrlChange(true);

    const matchingConversation = userConversations.find((c) => {
      return (
        c.participants && Object.keys(c.participants).includes(usernameParam)
      );
    });

    if (
      matchingConversation &&
      (!selectedConversation ||
        selectedConversation.id !== matchingConversation.id)
    ) {
      // Close message requests if open
      setShowMessageRequests(false);
      selectConversation(matchingConversation);
    }

    setIsHandlingUrlChange(false);
  }, [
    usernameParam,
    userConversations,
    selectedConversation,
    selectConversation,
  ]);

  // Update URL when selected conversation changes
  useEffect(() => {
    if (
      !selectedConversation ||
      isHandlingUrlChange ||
      navigationInitiatedRef.current
    )
      return;

    const otherParticipant = getOtherParticipantUsername(
      selectedConversation,
      currentUser?.username
    );
    if (otherParticipant && otherParticipant !== usernameParam) {
      navigateToUser(otherParticipant);
    }
  }, [
    selectedConversation,
    currentUser,
    usernameParam,
    navigateToUser,
    isHandlingUrlChange,
  ]);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get("username");

        if (!username && selectedConversation) {
          setSelectedConversation(null);
        }
      }, 50);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedConversation, setSelectedConversation]);

  // Add effect to track active conversation
  useEffect(() => {
    if (selectedConversation?.id) {
      activeConversationRef.current = selectedConversation.id;
    }
  }, [selectedConversation]);

  // Add a dedicated effect for handling page refresh/close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only attempt to reset typing status if we have both requirements
      if (activeConversationRef.current && currentUser) {
        // Use the direct synchronous method instead of the async handler
        // This has a better chance of completing during hard refresh
        try {
          // Import directly to avoid circular dependencies
          const {
            messagingService,
          } = require("@/app/services/messagingService");
          // Call the synchronous method directly
          messagingService.resetTypingStatusSync(
            currentUser,
            activeConversationRef.current
          );
        } catch (e) {
          // Can't do much during page unload
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Final cleanup on component unmount
      if (activeConversationRef.current && currentUser) {
        // Clear any typing indicators on unmount
        handleSetTypingIndicator &&
          handleSetTypingIndicator(
            currentUser,
            activeConversationRef.current,
            false
          );
      }
    };
  }, [currentUser, handleSetTypingIndicator]); // Add dependency back

  // ---- RENDER ----
  return (
    <>
      <MessagingPresentation
        userConversations={userConversations}
        selectedConversation={selectedConversation}
        currentUser={currentUser}
        onSelectConversation={handleConversationSelect}
        onToggleRead={handleToggleRead}
        onToggleBlock={handleToggleBlock}
        onDeleteConversation={handleDeleteConversation}
        isDeleting={isDeleting} // Pass this to the presentation
        onBack={handleBack}
        onOpenConnections={handleOpenConnections}
        onLoadMoreMessages={handleLoadMoreMessages} // Keep this one for ChatContainer
        showMessageRequests={showMessageRequests}
        onViewMessageRequests={handleViewMessageRequests}
        onCloseMessageRequests={handleCloseMessageRequests}
        pendingRequestCount={pendingRequestCount}
        navigateToUser={navigateToUser}
        startConversation={handleStartConversation}
      />

      {showConnectionsModal && (
        <ConnectionsModal
          loading={loadingConnections}
          connections={userConnections}
          onClose={() => setShowConnectionsModal(false)}
          onSelect={handleStartConversation}
          hasMore={hasMoreConnections}
          loadingMore={loadingMoreConnections}
          onLoadMore={loadMoreConnections}
        />
      )}
    </>
  );
}
