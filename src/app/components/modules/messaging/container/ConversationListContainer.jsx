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
            if (!Array.isArray(conversations) || !currentUser) {
                setProcessedConversations([]); // Clear if input is invalid
                return;
            }
            
            const processed = await Promise.all(conversations.map(async (conversation) => {
                // Find the participant object who is not the current user
                const otherParticipantDetails = conversation.participants?.find(
                    (p) => p.username !== currentUser
                );
                
                // Find the current user's participant object to check block status
                const currentUserParticipant = conversation.participants?.find(
                    (p) => p.username === currentUser
                );

                // Determine if the *other* participant is blocked *by the current user*
                // This interpretation depends on how the backend sets the `isBlocked` flag.
                // Assuming `otherParticipantDetails.isBlocked` means "is this participant blocked by the current user"
                const isOtherParticipantBlocked = otherParticipantDetails?.isBlocked === true;

                // Check typing status using the other participant's username
                const isOtherParticipantTyping = otherParticipantDetails?.username 
                    ? conversation.typingStatus?.[otherParticipantDetails.username] === true 
                    : false;
                
                // Get unread message count using the other participant's username
                let unseenCount = 0;
                if (otherParticipantDetails?.username && !conversation.readStatus) { // Only count if unread
                    try {
                        // Assuming service method takes username
                        unseenCount = await messagingService.getUnseenMessagesCountFirestore(otherParticipantDetails.username); 
                    } catch (error) {
                        console.error(`Error getting unseen count for ${otherParticipantDetails.username}:`, error);
                    }
                }
                
                return {
                    ...conversation, // Spread original conversation data (conversationId, lastMessage, timestamp, readStatus etc.)
                    otherParticipantDetails: otherParticipantDetails || { username: "Unknown", name: "Unknown" }, // Provide fallback object
                    isOtherParticipantTyping,
                    isOtherParticipantBlocked, // Add the calculated block status
                    unseenCount
                };
            }));
            
            // Sort conversations, e.g., by timestamp descending
            processed.sort((a, b) => {
                const dateA = typeof a.timestamp?.toDate === 'function' ? a.timestamp.toDate() : new Date(a.timestamp || 0);
                const dateB = typeof b.timestamp?.toDate === 'function' ? b.timestamp.toDate() : new Date(b.timestamp || 0);
                return dateB - dateA;
            });

            setProcessedConversations(processed);
        };

        processConversations();
    }, [conversations, currentUser]); // Rerun when conversations or currentUser changes

    const handleMarkAsRead = async (conversationId) => {
        await onMarkAsRead(conversationId);
    };

    const handleToggleRead = async (conversationId, readStatus) => { // Parameter name can remain conversationId for clarity
        // Pass through to the parent container's handler, which expects id
        await onToggleRead(conversationId, readStatus); 
    };

    const handleToggleBlock = async (conversationId, usernameToToggle, isBlocked) => { // Parameter name can remain conversationId
         // Pass through to the parent container's handler, which expects id
        await onToggleBlock(conversationId, usernameToToggle, isBlocked);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter conversations based on search query (checking name and username)
    const filteredConversations = processedConversations.filter(
        conversation => {
            const nameMatch = conversation.otherParticipantDetails.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const usernameMatch = conversation.otherParticipantDetails.username.toLowerCase().includes(searchQuery.toLowerCase());
            return nameMatch || usernameMatch;
        }
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
