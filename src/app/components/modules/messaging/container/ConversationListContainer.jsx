// ConversationListContainer.jsx
"use client";

import React, { useState } from "react";
import { ConversationListPresentation } from "../presentation/ConversationList";


export function ConversationListContainer({
    conversations,
    onSelectConversation,
    selectedConversationId,
    currentUser,
    onMarkAsRead,
    onMarkAsUnread,
    onToggleBlock
}) {
    
    const [searchQuery, setSearchQuery] = useState("");

    const filteredConversations = conversations.filter((conversation) => {
        // Find the participant who is not the current user
        const otherParticipant = conversation.participants?.find(
            participant => participant !== currentUser
        ) || '';
        
        return otherParticipant.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleMarkAsRead = async (conversationId) => {

        await onMarkAsRead(conversationId);
    };

    const handleMarkAsUnread = async (conversationId) => {

        await onMarkAsUnread(conversationId);
    };

    const handleToggleBlock = async (conversationId, isBlocked) => {
        
        await onToggleBlock(conversationId, isBlocked);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    return (
        <ConversationListPresentation
            filteredConversations={filteredConversations}
            selectedConversationId={selectedConversationId}
            currentUser={currentUser}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSelectConversation={onSelectConversation}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
            onToggleBlock={handleToggleBlock}
        />
    );
}
