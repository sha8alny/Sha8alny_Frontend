import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    onSnapshot,
    orderBy,
    addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { fetchWithAuth } from "./userAuthentication";


export const messagingService = {
    getUserConnections: async ( page = 1, pageSize = 10) => {
        const response = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/connections/${page}/${pageSize}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user connections");
          }
          return response.json();
        },
    // // Get all conversations for a user
    // getUserConversations: async () => {
    //     try {
    //         const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/Conversation/get`, {
    //             method: 'GET',
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         console.log("User conversations data:", data);
    //         return data
    //     } catch (error) {
    //         console.error("Error fetching user conversations:", error);
    //         return [];
    //     }
    // },

    // Listen to conversations in real-time
    subscribeToConversations: (username, callback) => {
        const conversationsRef = collection(db, "conversations");
        const q = query(conversationsRef);
        
        return onSnapshot(q, (querySnapshot) => {
            const conversations = [];
            querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.participants.includes(username) && !data.isDeleted) {
                conversations.push({ id: doc.id, ...data });
            }
            });
            callback(conversations);
        }, (error) => {
            console.error("Error subscribing to conversations:", error);
        });
    },
    
    // // Get messages for a conversation
    // getConversationMessages: async (receiverName) => {
    //     try {
    //         if (!receiverName) {
    //             throw new Error("Receiver name is required");
    //         }

    //         const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/Conversation/Messages`, {
    //             method: 'GET',
    //             headers: {
    //                 'receiverName': receiverName
    //             }
    //         });

    //         if (!response.ok) {
    //             const error = await response.json();
    //             throw new Error(error.message || `HTTP error! Status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         return data
    //     } catch (error) {
    //         console.error("Error fetching conversation messages:", error);
    //         throw error;
    //     }
    // },

    // Listen to messages for a conversation in real-time
    subscribeToConversationMessages: (conversationId, callback) => {
        const messagesRef = collection(db, "conversations", conversationId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        return onSnapshot(q, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!data.isDeleted) {
                    messages.push({ id: doc.id, ...data });
                }
            });
            callback(messages);
        }, (error) => {
            console.error("Error subscribing to conversation messages:", error);
        });
    },

    // Get all messages for a conversation
    getMessages: async (conversationId) => {
        try {
            const messagesRef = collection(db, "conversations", conversationId, "messages");
            const querySnapshot = await getDocs(messagesRef);
            let messages = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!data.isDeleted) {
                    messages.push({ id: doc.id, ...data });
                }
            });

            return messages;
        } catch (error) {
            console.error("Error getting messages:", error);
            throw new Error("Error getting messages: " + error.message);
        }
    },

    // Send a message
    sendMessage: async (receiverName, message, mediaFiles = []) => {
        try {
            if (!receiverName) {
            throw new Error("Receiver name is required");
            }

            if (!message && mediaFiles.length === 0) {
            throw new Error("Message content or media is required");
            }

            const endpoint = mediaFiles.length > 0 
            ? `${process.env.NEXT_PUBLIC_API_URL}/messaging/sendMediaMessage`
            : `${process.env.NEXT_PUBLIC_API_URL}/messaging/sendMessage`;

            let requestOptions;
            
            if (mediaFiles.length > 0) {
            // Use FormData for media files
            const formData = new FormData();
            formData.append('recieverName', receiverName);
            formData.append('message', message || "");
            
            mediaFiles.forEach((file, index) => {
                formData.append('media', file);
            });
            
            requestOptions = {
                method: 'POST',
                body: formData
            };
            } else {
            // Use JSON for text-only messages
            requestOptions = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recieverName: receiverName,
                message: message
                })
            };
            }

            const response = await fetchWithAuth(endpoint, requestOptions);

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error("Error sending message: " + error.message);
        }
    },
    createConversation: async (receiverName, currentUser) => {
    try {
        if (!receiverName || !currentUser) {
            throw new Error("Both receiver name and current user are required");
        }
        
        const participants = [currentUser, receiverName];
        const lastMessage = { text: "", timestamp: new Date() };
        
        const conversationRef = collection(db, "conversations");
        return await addDoc(conversationRef, {
            participants,
            lastMessage,
            isDeleted: false,
            read: false,
            createdAt: new Date(),
            timestamp: new Date(),
        });
    } catch (error) {
        throw new Error("Error creating conversation: " + error.message);
    }
    },
    // Mark messages as read
    markMessagesAsRead: async (receiverName) => {
        try {
            if (!receiverName) {
                throw new Error("Receiver name is required");
            }

            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/Conversation/markMessagesAsRead`, {
                method: 'PATCH',
                body: JSON.stringify({
                    receiverName: receiverName
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error("Error marking messages as read: " + error.message);
        }
    },

    // Toggle read status of a conversation
    toggleConversationReadStatus: async (receiverName) => {
        try {
            if (!receiverName) {
                throw new Error("Receiver name is required");
            }

            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/Conversation/markAsRead`, {
                method: 'PATCH',
                body: JSON.stringify({
                    receiverName: receiverName
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error toggling conversation read status:", error);
            throw error;
        }
    },

    // Set typing indicator
    updateTypingStatus: async (username, conversationId, isTyping) => {
        try {
            if (!conversationId || !username) {
                throw new Error("Conversation ID and username are required");
            }
            
            const conversationRef = doc(db, "conversations", conversationId);
            const conversationSnap = await getDoc(conversationRef);
            
            if (!conversationSnap.exists()) {
                throw new Error(`Conversation with ID ${conversationId} not found`);
            }
            
            await updateDoc(conversationRef, {
                typingStatus: {
                    [username]: isTyping,
                    timestamp: new Date()
                }
            });
            
            return { success: true };
        } catch (error) {
            console.error("Error updating typing status:", error);
            throw new Error(`Failed to update typing status: ${error.message}`);
        }
    },

    // Block/unblock user
    toggleUserBlock: async (username, conversationId, isBlocked) => {
        return;
    },

};