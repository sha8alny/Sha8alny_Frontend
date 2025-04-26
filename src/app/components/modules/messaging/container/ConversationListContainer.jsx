"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ConversationListPresentation } from "../presentation/ConversationList";
import { messagingService } from "@/app/services/messagingService";

// Helper function extracted outside component
const processConversation = (conversation, currentUser) => {
    if (!conversation || !currentUser) return null;
    
    // Get other participant username from the keys of participants object
    const participantUsernames = Object.keys(conversation.participants || {});
    const otherUsername = participantUsernames.find(
        (username) => username !== currentUser
    );
    
    if (!otherUsername) return null;
    
    // Get details of the other participant
    const otherParticipantDetails = conversation.participants[otherUsername];
    const isOtherParticipantBlocked = otherParticipantDetails?.isBlocked === true;
    
    // Get metadata for both participants
    const otherParticipantMetadata = conversation.participantMetadata?.[otherUsername];
    const currentUserMetadata = conversation.participantMetadata?.[currentUser];
    
    // Get typing status from metadata
    const isOtherParticipantTyping = otherParticipantMetadata?.typingStatus === true;
    
    // Get unread count from current user's metadata
    const unseenCount = currentUserMetadata?.unreadCount || 0;
    
    // Check if the conversation is read by current user
    const isRead = currentUserMetadata?.readFlag === true;
    
    return {
        ...conversation,
        otherParticipantDetails,
        otherUsername,
        isOtherParticipantTyping,
        isOtherParticipantBlocked,
        unseenCount,
        read: isRead
    };
};

export function ConversationListContainer({
    conversations = [],
    onSelectConversation,
    selectedConversationId,
    currentUser,
    onMarkAsRead,
    onToggleRead,
    onToggleBlock
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [processedConversations, setProcessedConversations] = useState([]);

    // Process conversations with useEffect
    useEffect(() => {
        const processData = () => {
            if (!Array.isArray(conversations) || !currentUser) {
                setProcessedConversations([]);
                return;
            }
            
            const processed = conversations
                .map(conv => processConversation(conv, currentUser))
                .filter(Boolean); // Remove null values
            
            // Sort by timestamp descending
            processed.sort((a, b) => {
                const dateA = typeof a.timestamp?.toDate === 'function' 
                    ? a.timestamp.toDate() 
                    : new Date(a.timestamp || 0);
                const dateB = typeof b.timestamp?.toDate === 'function' 
                    ? b.timestamp.toDate() 
                    : new Date(b.timestamp || 0);
                return dateB - dateA;
            });

            setProcessedConversations(processed);
        };

        processData();
    }, [conversations, currentUser]);

    // Memoize handlers to prevent unnecessary rerenders
    const handleMarkAsRead = useCallback(
        async (conversationId) => await onMarkAsRead(conversationId),
        [onMarkAsRead]
    );

    const handleToggleRead = useCallback(
        async (conversationId, readStatus) => await onToggleRead(conversationId, readStatus),
        [onToggleRead]
    );

    const handleToggleBlock = useCallback(
        async (conversationId, usernameToToggle, isBlocked) => 
            await onToggleBlock(conversationId, usernameToToggle, isBlocked),
        [onToggleBlock]
    );

    const handleSearchChange = useCallback(
        (e) => setSearchQuery(e.target.value),
        []
    );

    // Memoize filtered conversations
    const filteredConversations = useMemo(() => {
        return processedConversations.filter(conversation => {
            const query = searchQuery.toLowerCase();
            const name = conversation.otherParticipantDetails?.name?.toLowerCase() || "";
            const username = conversation.otherUsername?.toLowerCase() || "";
            return name.includes(query) || username.includes(query);
        });
    }, [processedConversations, searchQuery]);

    return (
        <ConversationListPresentation
            filteredConversations={filteredConversations}
            selectedConversationId={selectedConversationId}
            currentUser={currentUser}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSelectConversation={onSelectConversation}
            onMarkAsRead={handleMarkAsRead}
            onToggleRead={handleToggleRead}
            onToggleBlock={handleToggleBlock}
        />
    );
}
