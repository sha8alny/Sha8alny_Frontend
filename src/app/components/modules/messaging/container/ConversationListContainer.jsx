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
/**
 * @namespace messages
 * @module messages
 */
/**
 * Container component for managing and displaying a list of conversations.
 * Handles data processing, filtering, sorting, and user interactions with the conversation list.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Array} [props.conversations=[]] - Array of conversation objects to display
 * @param {Function} props.onSelectConversation - Callback function when a conversation is selected
 * @param {string|null} props.selectedConversationId - ID of the currently selected conversation
 * @param {Object} props.currentUser - Current user object with user details
 * @param {Function} props.onToggleRead - Callback function to toggle read status of a conversation
 * @param {Function} props.onToggleBlock - Callback function to toggle blocked status of a user
 * @param {Function} props.onDeleteConversation - Callback function to delete a conversation
 * @param {boolean} [props.isDeleting=false] - Flag indicating if a deletion operation is in progress
 * 
 * @returns {JSX.Element} The conversation list UI component
 */
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
export default ConversationListContainer;
