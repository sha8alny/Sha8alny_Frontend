"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ConversationListPresentation } from "../presentation/ConversationList";

// Process a conversation to extract relevant data 
const processConversation = (conversation, currentUser) => {
    if (!conversation || !currentUser) return null;
    
    // Extract other participant info
    const participantUsernames = Object.keys(conversation.participants || {});
    const otherUsername = participantUsernames.find(username => username !== currentUser);
    
    if (!otherUsername) return null;
    
    // Get metadata for participants
    const otherParticipantDetails = conversation.participants[otherUsername];
    const isOtherParticipantBlocked = otherParticipantDetails?.isBlocked === true;
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
    const handleMarkAsRead = useCallback(
        async (conversationId) => await onMarkAsRead(conversationId),
        [onMarkAsRead]
    );

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
            onMarkAsRead={handleMarkAsRead}
            onToggleRead={handleToggleRead}
            onToggleBlock={handleToggleBlock}
        />
    );
}
