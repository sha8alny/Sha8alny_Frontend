// ConversationListContainer.jsx
"use client";

import React, { useState, useEffect } from "react";
import { ConversationListPresentation } from "../presentation/ConversationList";
import { messagingService } from "@/app/services/messagingService";

export function ConversationListContainer({
    conversations,
    onSelectConversation,
    selectedConversationId,
    currentUser,
    onMarkAsRead,
    onToggleRead,
    onToggleBlock
}) {
    
    const [searchQuery, setSearchQuery] = useState("");
    const [processedConversations, setProcessedConversations] = useState([]);

    useEffect(() => {
        const processConversations = async () => {
            if (!conversations || !currentUser) return;
            
            const processed = await Promise.all(conversations.map(async (conversation) => {
                // Find the participant who is not the current user
                const otherParticipant = conversation.participants?.find(
                    (participant) => participant !== currentUser
                ) || "Unknown";
                
                // Check if the other participant is typing
                const isOtherParticipantTyping = conversation.typingStatus?.[otherParticipant] === true;
                
                // Get unread message count
                let unseenCount = 0;
                try {
                    unseenCount = await messagingService.getUnseenMessagesCount(otherParticipant);
                } catch (error) {
                    console.error(`Error getting unseen count for ${otherParticipant}:`, error);
                }
                
                return {
                    ...conversation,
                    otherParticipant,
                    isOtherParticipantTyping,
                    unseenCount
                };
            }));
            
            setProcessedConversations(processed);
        };

        processConversations();
    }, [conversations, currentUser]);

    const handleMarkAsRead = async (conversationId) => {
        await onMarkAsRead(conversationId);
    };

    const handleToggleRead = async () => {
        await onToggleRead();
    };

    const handleToggleBlock = async (conversationId, isBlocked) => {
        await onToggleBlock(conversationId, isBlocked);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter conversations based on search query
    const filteredConversations = processedConversations.filter(
        conversation => conversation.otherParticipant.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
