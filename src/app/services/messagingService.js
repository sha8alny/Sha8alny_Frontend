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
  // --- Connection Management ---
  getUserConnections: async (page = 1, pageSize = 10) => {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/connections/${page}/${pageSize}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user connections");
    }
    return response.json();
  },

  // --- Conversation Management ---
  getConversations: async () => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/Conversation/get`
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Handle cases where response might not be JSON
        if (response.status === 404) {
          throw new Error("Account not found.");
        }
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error getting conversations:", error);
      throw new Error("Failed to fetch conversations: " + error.message);
    }
  },

  createConversation: async (receiverName) => {
    messagingService.sendMessage(receiverName, null, []);
  },

  deleteConversation: async (conversationId) => {
    try {
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }

      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);

      if (!conversationSnap.exists()) {
        throw new Error(`Conversation with ID ${conversationId} not found`);
      }

      await updateDoc(conversationRef, {
        isDeleted: true,
        deletedAt: new Date(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw new Error(`Failed to delete conversation: ${error.message}`);
    }
  },

  toggleConversationReadStatus: async (receiverName) => {
    try {
      if (!receiverName) {
        throw new Error("Receiver name is required");
      }

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/Conversation/markAsRead`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            },
          body: JSON.stringify({
            receiverName: receiverName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error toggling conversation read status:", error);
      throw error;
    }
  },

  // --- Message Management ---
  sendMessage: async (receiverName, message, mediaFiles = []) => {
    try {
      if (!receiverName) {
        throw new Error("Receiver name is required");
      }

      if (mediaFiles.length > 5) {
        throw new Error("Maximum of 5 media files allowed");
      }

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/messaging/sendMessage`;
      let requestOptions;

      if (mediaFiles.length > 0) {
        // Use FormData for media files
        const formData = new FormData();
        formData.append("receiverName", receiverName);
        if (message) formData.append("message", message || "");

        formData.append("files", mediaFiles);

        requestOptions = {
          method: "POST",
          body: formData,
        };
      } else {
        // Use JSON for text-only messages
        requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverName: receiverName,
            message: message,
          }),
        };
      }

      const response = await fetchWithAuth(endpoint, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error("Error sending message: " + error.message);
    }
  },

  markMessagesAsRead: async (receiverName) => {
    try {
      if (!receiverName) {
        throw new Error("Receiver name is required");
      }

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/Conversation/markMessagesAsRead`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverName: receiverName, // Using camelCase as expected by the backend
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || `HTTP error! Status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw new Error("Error marking messages as read: " + error.message);
    }
  },

  // --- Real-time Subscriptions ---
  subscribeToConversations: (username, callback) => {
    const conversationsRef = collection(db, "conversations");
    const q = query(conversationsRef, where("isDeleted", "==", false));

    return onSnapshot(
      q,
      (querySnapshot) => {
        const conversations = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            data.participants.some(
              (participant) => participant.username === username
            )
          ) {
            conversations.push({ id: doc.id, ...data });
          }
        });

        console.log("Conversations data:", conversations);
        callback(conversations);
      },
      (error) => {
        console.error("Error subscribing to conversations:", error);
      }
    );
    },

    subscribeToConversationMessages: (conversationId, currentUser, callback) => {
        const messagesRef = collection(
            db,
            "conversations",
            conversationId,
            "messages"
        );
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        return onSnapshot(
            q,
            (querySnapshot) => {
                const messages = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (!data.isDeleted) {
                        messages.push({ id: doc.id, ...data });
                        
                        // Mark unread messages as read
                        if (data.senderName !== currentUser && data.read === false) {
                            updateDoc(doc.ref, { read: true })
                                .catch(err => console.error("Error marking message as read:", err));
                        }
                    }
                });

                console.log("Messages data:", messages);
                callback(messages);
            },
            (error) => {
                console.error("Error subscribing to conversation messages:", error);
            }
        );
    },

  // --- Unseen Message Counts ---
  getUnseenMessagesCount: async (receiverName) => {
    try {
      if (!receiverName) {
        throw new Error("Receiver name is required");
      }

      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/Conversation/getUnseenMessagesCount?receiverName=${encodeURIComponent(
          receiverName
        )}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const data = await response.json();
      return data.unseenMessagesCount;
    } catch (error) {
      console.error("Error getting unseen messages count:", error);
      throw new Error("Error getting unseen messages count: " + error.message);
    }
  },

  getUnseenMessagesCountFirestore: async (username) => {
    try {
      if (!username) {
        throw new Error("Username is required");
      }

      // Query all conversations where the user is a participant
      const conversationsRef = collection(db, "conversations");
      const q = query(
        conversationsRef,
        where("isDeleted", "==", false)
      );

      const querySnapshot = await getDocs(q);
      let totalUnseenCount = 0;

      // For each conversation, check if there are unseen messages
    for (const convDoc of querySnapshot.docs) {
      const conversationData = convDoc.data();
      
      // Only consider conversations where the user is a participant
      if (conversationData.participants.some(
        (participant) => participant.username === username
      )) {
        // If the conversation is marked as unread for this user
        if (
        conversationData.read === false &&
        conversationData.lastMessage?.sender !== username
        ) {
        // Get messages from this conversation
        const messagesRef = collection(
          db,
          "conversations",
          convDoc.id,
          "messages"
        );
        const messagesQuery = query(messagesRef, where("read", "==", false));

        const messagesSnapshot = await getDocs(messagesQuery);
        totalUnseenCount += messagesSnapshot.size;
        }
      }
    }

      return totalUnseenCount;
    } catch (error) {
      console.error("Error getting unseen messages count:", error);
      throw new Error("Error getting unseen messages count: " + error.message);
    }
  },

  getUnseenMessagesCountByConversationId: async (conversationId, username) => {
    try {
      if (!conversationId || !username) {
        throw new Error("Conversation ID and username are required");
      }

      // Get messages from this conversation that are unread
      const messagesRef = collection(
        db,
        "conversations",
        conversationId,
        "messages"
      );
      const messagesQuery = query(messagesRef, where("read", "==", false));

      const messagesSnapshot = await getDocs(messagesQuery);
      return messagesSnapshot.size;
    } catch (error) {
      console.error(
        "Error getting unseen messages count by conversation:",
        error
      );
      throw new Error("Error getting unseen messages count: " + error.message);
    }
  },

// --- Status Updates ---
updateTypingStatus: async (username, conversationId, isTyping) => {
    try {
        if (!conversationId || !username) {
            throw new Error("Conversation ID and username are required");
        }

        const conversationRef = doc(db, "conversations", conversationId);
        
        // Get current typing status
        const conversationSnap = await getDoc(conversationRef);
        if (!conversationSnap.exists()) {
            throw new Error(`Conversation with ID ${conversationId} not found`);
        }
        
        const data = conversationSnap.data();
        const currentTypingStatus = data.typingStatus?.[username] || false;
        
        // Only update if the status is different
        if (currentTypingStatus !== isTyping) {
            const updateData = { [`typingStatus.${username}`]: isTyping };
            await updateDoc(conversationRef, updateData);
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating typing status:", error);
        throw new Error(`Failed to update typing status: ${error.message}`);
    }
},

toggleUserBlock: async (username, conversationId, isBlocked) => {
    try {
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }

      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);

      if (!conversationSnap.exists()) {
        throw new Error(`Conversation with ID ${conversationId} not found`);
      }

      await updateDoc(conversationRef, {
        isDeleted: true,
        deletedAt: new Date(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw new Error(`Failed to delete conversation: ${error.message}`);
    }
  },
};