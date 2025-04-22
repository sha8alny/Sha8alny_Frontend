"use client"

import { useState, useEffect, useCallback } from "react"
import { useMediaQuery } from "@/app/hooks/useMediaQuery"
import { useService } from "@/app/context/ServiceContext"
import { MessagingPresentation } from "../presentation/MessagingInterface"
import { useQuery } from "@tanstack/react-query"

export function MessagingContainer({ currentUser }) {
    const [userConversations, setUserConversations] = useState([])
    const [selectedConversationId, setSelectedConversationId] = useState(null)
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [showConnectionsModal, setShowConnectionsModal] = useState(false)
    const [userConnections, setUserConnections] = useState([])
    const [loadingConnections, setLoadingConnections] = useState(false)
    const isMobile = useMediaQuery("(max-width: 768px)")
    const service = useService()

    // Fetch user conversations with TanStack Query
    const { 
        isLoading: loadingConversations,
        refetch: refetchConversations
    } = useQuery({
        queryKey: ['conversations', currentUser],
        queryFn: async () => {
            try {
                const data = await service.getUserConversations()
                console.log("Fetched conversations:", data)
                setUserConversations(data)
                return data || []
            } catch (error) {
                console.error("Error fetching conversations:", error)
                throw error
            }
        },
        refetchOnWindowFocus: true,
        refetchInterval: 10000,
        refetchIntervalInBackground: false,
    })

    // Memoized function to find other participant in conversation
    const getOtherParticipant = useCallback((conversation) => {
        if (!conversation?.participants) return null
        const otherParticipant = conversation.participants.find(
            participant => participant !== currentUser
        )
        console.log("Other participant:", otherParticipant)
        return otherParticipant
    }, [currentUser])

    // Handle conversation selection and message subscription
    useEffect(() => {
        if (!selectedConversationId) {
            setMessages([])
            setSelectedConversation(null)
            return
        }

        const selectedUserConversation = userConversations.find(
            conv => conv.id === selectedConversationId
        )

        if (!selectedUserConversation) return

        const otherParticipant = getOtherParticipant(selectedUserConversation)
        if (!otherParticipant) return

        const conversationDetails = {
            id: selectedUserConversation.id,
            participants: selectedUserConversation.participants,
            createdAt: selectedUserConversation.createdAt,
            updatedAt: selectedUserConversation.timestamp,
            participantId: otherParticipant,
            participantName: otherParticipant,
            participantAvatar: null,
            messages: [],
            unreadCount: selectedUserConversation.read ? 0 : 1,
            isTyping: false,
            isBlocked: false,
            readStatus: selectedUserConversation.read ? null : "Unread",
            lastMessage: selectedUserConversation.lastMessage
        }

        setSelectedConversation(conversationDetails)

        const unsubscribe = service.subscribeToConversationMessages(
            selectedConversationId, 
            (newMessages) => {
                if (Array.isArray(newMessages)) {
                    setMessages(newMessages)
                }
            }
        )

        handleMarkAsRead(selectedConversationId)

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe()
            }
        }
    }, [selectedConversationId, userConversations, getOtherParticipant, service])

    const handleSelectConversation = useCallback((conversationId) => {
        setSelectedConversationId(conversationId)
    }, [])

    const handleMarkAsRead = useCallback(async (conversationId) => {
        try {
            const selectedConv = userConversations.find(conv => conv.id === conversationId)
            if (!selectedConv) return

            const otherParticipant = getOtherParticipant(selectedConv)
            if (otherParticipant) {
                await service.markMessagesAsRead(otherParticipant)
                // Update the conversation read status in local state
                setUserConversations(prev => prev.map(conv => 
                    conv.id === conversationId ? {...conv, read: true} : conv
                ))
            }
        } catch (error) {
            console.error("Error marking messages as read:", error)
        }
    }, [userConversations, getOtherParticipant, service])

    const handleMarkAsUnread = useCallback(async (conversationId) => {
        try {
            const selectedConv = userConversations.find(conv => conv.id === conversationId)
            if (!selectedConv) return
            
            const otherParticipant = getOtherParticipant(selectedConv)
            if (otherParticipant) {
                await service.toggleConversationReadStatus(otherParticipant)
                // Update the conversation read status in local state
                setUserConversations(prev => prev.map(conv => 
                    conv.id === conversationId ? {...conv, read: false} : conv
                ))
            }
        } catch (error) {
            console.error("Error toggling conversation read status:", error)
        }
    }, [userConversations, getOtherParticipant, service])

    const handleToggleBlock = useCallback(async (conversationId, isBlocked) => {
        try {
            if (currentUser) {
                await service.toggleUserBlock(currentUser, conversationId, isBlocked)
                // Update the blocked status in local state
                setSelectedConversation(prev => prev ? {
                    ...prev,
                    isBlocked: !prev.isBlocked
                } : null)
            }
        } catch (error) {
            console.error("Error toggling user block status:", error)
        }
    }, [currentUser, service])

    const handleSendMessage = useCallback(async (receiverName, message, mediaFiles) => {
        try {
            const result = await service.sendMessage(receiverName, message, mediaFiles)
            
            if (result?.success && result?.message) {
                const newMessage = result.message
                
                setMessages(prev => [...prev, {
                    messageId: newMessage.messageId,
                    sender: newMessage.sender,
                    receiver: newMessage.receiver,
                    content: newMessage.content,
                    timestamp: newMessage.timestamp,
                    read: newMessage.read,
                    mediaUrl: newMessage.mediaUrls?.[0] || null
                }])
                
                // Update the last message in conversations list
                setUserConversations(prev => prev.map(conv => 
                    conv.participants.includes(receiverName) 
                        ? {...conv, lastMessage: {
                            content: newMessage.content,
                            timestamp: newMessage.timestamp
                        }} 
                        : conv
                ))
                
                // Update the selected conversation
                setSelectedConversation(prev => prev ? {
                    ...prev,
                    lastMessage: {
                        content: newMessage.content,
                        timestamp: newMessage.timestamp,
                        senderId: newMessage.sender
                    }
                } : null)
            }
        } catch (error) {
            console.error("Error sending message:", error)
        }
    }, [service])

    const handleSetTypingIndicator = useCallback((userId, conversationId, isTyping) => {
        try {
            if (userId && conversationId) {
                service.updateTypingStatus(userId, conversationId, isTyping)
                // Update typing status in selected conversation
                setSelectedConversation(prev => prev ? {
                    ...prev,
                    isTyping
                } : null)
            }
        } catch (error) {
            console.error("Error updating typing status:", error)
        }
    }, [service])

    const handleOpenConnections = useCallback(async () => {
        try {
            setShowConnectionsModal(true)
            setLoadingConnections(true)
            
            const connections = await service.getUserConnections()
            setUserConnections(Array.isArray(connections) ? connections : [])
        } catch (error) {
            console.error("Error fetching user connections:", error)
            setUserConnections([])
        } finally {
            setLoadingConnections(false)
        }
    }, [currentUser, service])

    const handleStartConversation = useCallback(async (connection) => {
        if (!connection?.username) return
        
        try {
            const existingConversation = userConversations.find(conv => 
                conv.participants.includes(connection.username)
            )
            
            if (existingConversation) {
                setSelectedConversationId(existingConversation.id)
            } else {
                const newConversation = await service.createConversation(connection.username)
                if (newConversation?.id) {
                    setUserConversations(prev => [...prev, newConversation])
                    setSelectedConversationId(newConversation.id)
                }
            }
            
            setShowConnectionsModal(false)
        } catch (error) {
            console.error("Error starting conversation:", error)
        }
    }, [userConversations, service])

    return (
        <>
            <MessagingPresentation
                isMobile={isMobile}
                userConversations={userConversations}
                selectedConversation={selectedConversation}
                selectedConversationId={selectedConversationId}
                currentUser={currentUser}
                messages={messages}
                onSelectConversation={handleSelectConversation}
                onMarkAsRead={handleMarkAsRead}
                onMarkAsUnread={handleMarkAsUnread}
                onToggleBlock={handleToggleBlock}
                onSendMessage={handleSendMessage}
                onSetTypingIndicator={handleSetTypingIndicator}
                onBack={() => setSelectedConversationId(null)}
                loadingConversations={loadingConversations}
                onOpenConnections={handleOpenConnections}
            />
            
            {showConnectionsModal && (
                <ConnectionsModal
                    loading={loadingConnections}
                    connections={userConnections}
                    onClose={() => setShowConnectionsModal(false)}
                    onSelect={handleStartConversation}
                />
            )}
        </>
    )
}

function ConnectionsModal({ loading, connections, onClose, onSelect }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Select a Connection</h2>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {loading ? (
                    <div className="text-center py-8">
                        <p>Loading connections...</p>
                    </div>
                ) : connections.length === 0 ? (
                    <div className="text-center py-8">
                        <p>No connections found</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {connections.map(connection => (
                            <ConnectionItem 
                                key={connection.id || connection.username}
                                connection={connection}
                                onClick={() => onSelect(connection)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function ConnectionItem({ connection, onClick }) {
    return (
        <div 
            onClick={onClick}
            className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md cursor-pointer"
        >
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                {connection.avatar || connection.profilePicture ? (
                    <img 
                        src={connection.avatar || connection.profilePicture} 
                        alt={connection.name || connection.username}
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white bg-primary">
                        {(connection.name || connection.username).charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <div>
                <p className="font-medium">{connection.name || connection.username}</p>
                <p className="text-sm text-gray-500">{connection.headline || 'Connection'}</p>
            </div>
        </div>
    )
}