"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ConversationListPresentation } from "../presentation/ConversationList";
import { getOtherParticipantUsername } from "@/app/utils/participantUtils";

// Process a conversation to extract relevant data 
const processConversation = (conversation, currentUser) => {
    if (!conversation || !currentUser) return null;
    
    // Get other participant username using utility
    const otherUsername = getOtherParticipantUsername(conversation, currentUser);
    
    if (!otherUsername) return null;
    
    // Get metadata for participants
    const otherParticipantDetails = conversation.participants[otherUsername];
    const currentUserDetails = conversation.participants[currentUser];
    
    // Extract blocking statuses - both directions
    const isOtherParticipantBlocked = otherParticipantDetails?.isBlocked === true;
    const isCurrentUserBlocked = currentUserDetails?.isBlocked === true;
    
    const otherParticipantMetadata = conversation.participantMetadata?.[otherUsername];
    const currentUserMetadata = conversation.participantMetadata?.[currentUser];
    
    // Extract status data
    const isOtherParticipantTyping = otherParticipantMetadata?.typingStatus === true;
    const unseenCount = currentUserMetadata?.unreadCount || 0;
    const isRead = currentUserMetadata?.readFlag === true;
    
    return {
        ...conversation,
        otherParticipantDetails,
        otherUsername,
        isOtherParticipantTyping,
        isOtherParticipantBlocked,
        isCurrentUserBlocked,
        unseenCount,
        read: isRead
    };
};

export function ConversationListContainer({
    conversations = [],
    onSelectConversation,
    selectedConversationId,
    currentUser,
    onToggleRead,
    onToggleBlock,
    onDeleteConversation,
    isDeleting = false,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [processedConversations, setProcessedConversations] = useState([]);

    // Process conversations when they change
    useEffect(() => {
        if (!Array.isArray(conversations) || !currentUser) {
            setProcessedConversations([]);
            return;
        }
        
        const processed = conversations
            .map(conv => processConversation(conv, currentUser))
            .filter(Boolean)
            .sort((a, b) => {
                const dateA = typeof a.timestamp?.toDate === 'function' 
                    ? a.timestamp.toDate() 
                    : new Date(a.timestamp || 0);
                const dateB = typeof b.timestamp?.toDate === 'function' 
                    ? b.timestamp.toDate() 
                    : new Date(b.timestamp || 0);
                return dateB - dateA;
            });

        setProcessedConversations(processed);
    }, [conversations, currentUser]);

    // Handlers
    const handleToggleRead = useCallback(
        async (conversationId, readStatus) => 
            await onToggleRead(conversationId, readStatus),
        [onToggleRead]
    );

    const handleToggleBlock = useCallback(
        async (conversationId, usernameToToggle, isBlocked) => 
            await onToggleBlock(conversationId, usernameToToggle, isBlocked),
        [onToggleBlock]
    );

    const handleDeleteConversation = useCallback(
        async (conversationId, otherUsername) => 
            await onDeleteConversation(conversationId, otherUsername),
        [onDeleteConversation]
    );

    const handleSearchChange = useCallback(
        (e) => setSearchQuery(e.target.value),
        []
    );

    // Filter conversations based on search
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
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSelectConversation={onSelectConversation}
            onToggleRead={handleToggleRead}
            onToggleBlock={handleToggleBlock}
            onDeleteConversation={handleDeleteConversation}
            isDeleting={isDeleting}
        />
    );
}
