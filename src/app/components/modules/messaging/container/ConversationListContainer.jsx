"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ConversationListPresentation } from "../presentation/ConversationList";
import { messagingService } from "@/app/services/messagingService";

// Helper function extracted outside component
const processConversation = async (conversation, currentUser) => {
    if (!conversation || !currentUser) return null;
    
    const otherParticipantDetails = conversation.participants?.find(
        (p) => p.username !== currentUser
    ) || { username: "Unknown", name: "Unknown" };
    
    const isOtherParticipantBlocked = otherParticipantDetails?.isBlocked === true;
    
    const isOtherParticipantTyping = otherParticipantDetails?.username 
        ? conversation.typingStatus?.[otherParticipantDetails.username] === true 
        : false;
    
    let unseenCount = 0;
    if (otherParticipantDetails?.username && !conversation.readStatus) {
        try {
            unseenCount = await messagingService.getUnseenMessagesCountFirestore(
                otherParticipantDetails.username
            ); 
        } catch (error) {
            console.error(`Error getting unseen count: ${error}`);
        }
    }
    
    return {
        ...conversation,
        otherParticipantDetails,
        isOtherParticipantTyping,
        isOtherParticipantBlocked,
        unseenCount
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
        const processData = async () => {
            if (!Array.isArray(conversations) || !currentUser) {
                setProcessedConversations([]);
                return;
            }
            
            const processed = await Promise.all(
                conversations.map(conv => processConversation(conv, currentUser))
            );
            
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
            const name = conversation.otherParticipantDetails.name?.toLowerCase() || "";
            const username = conversation.otherParticipantDetails.username.toLowerCase();
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
