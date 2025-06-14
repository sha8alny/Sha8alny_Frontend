import {
  collection,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  orderBy,
  limit,
  deleteDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";

import { fetchWithAuth } from "./userAuthentication";
import { db } from "@/firebase/firebase";

export const messagingService = {
  createConversation: async (receiverName) => {
    return await messagingService.sendMessage(receiverName, null, []);
  },

  deleteConversationFirestore: async (conversationId) => {
    try {
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }

      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);

      if (!conversationSnap.exists()) {
        throw new Error(`Conversation with ID ${conversationId} not found`);
      }

      // Truly delete the conversation from the database
      await deleteDoc(conversationRef);

      return { success: true };
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw new Error(`Failed to delete conversation: ${error.message}`);
    }
  },

  deleteConversation: async (receiverName) => {
    try {
      if (!receiverName) {
        throw new Error("Conversation ID is required");
      }

      // Call backend API to delete conversation
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/Conversation/delete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverName: receiverName, // Using the receiver name as specified in API
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
      console.error("Error deleting conversation:", error);
      throw new Error(`Failed to delete conversation: ${error.message}`);
    }
  },

  toggleConversationReadStatusFirestore: async (conversationId, username) => {
    try {
      if (!conversationId || !username) {
        throw new Error("Conversation ID and username are required");
      }

      // Get the conversation document reference
      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);

      if (!conversationSnap.exists()) {
        throw new Error(`Conversation with ID ${conversationId} not found`);
      }

      const conversationData = conversationSnap.data();

      // Check if the user is a participant in the conversation
      if (!conversationData.participantMetadata?.[username]) {
        throw new Error(
          `User ${username} is not a participant in this conversation`
        );
      }

      // Get the current read status to toggle it
      const currentReadStatus =
        conversationData.participantMetadata[username].readFlag || false;

      // Update the read status, last read time, and reset unread count
      if (currentReadStatus) {
        // If already read, set to unread
        await updateDoc(conversationRef, {
          [`participantMetadata.${username}.readFlag`]: false,
        });
      } else {
        await updateDoc(conversationRef, {
          [`participantMetadata.${username}.readFlag`]: !currentReadStatus,
          [`participantMetadata.${username}.lastReadAt`]: new Date(),
          [`participantMetadata.${username}.unreadCount`]: 0,
        });
        await messagingService.markMessagesAsRead(username, conversationId);
      }

      return {
        success: true,
        readStatus: !currentReadStatus,
      };
    } catch (error) {
      console.error("Error toggling conversation read status:", error);
      throw new Error(
        `Failed to toggle conversation read status: ${error.message}`
      );
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

        // Append each file individually with the same field name to create an array on server side
        mediaFiles.forEach((file, index) => {
          formData.append("files", file);
        });

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
          errorData.error || `HTTP error! Status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  markMessagesAsRead: async (currentUser, conversationId) => {
    try {
      if (!currentUser || !conversationId) {
        throw new Error("Current user and conversation ID are required");
      }

      const messagesRef = collection(
        db,
        "conversations",
        conversationId,
        "messages"
      );

      const q = query(messagesRef, where("read", "==", false));

      const querySnapshot = await getDocs(q);

      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        if (messageData.senderName !== currentUser) {
          batch.update(doc.ref, { read: true });
        }
      });

      await batch.commit();

      console.log(
        `Marked ${querySnapshot.size} messages as read for conversation: ${conversationId}`
      );

      return { success: true, updatedCount: querySnapshot.size };
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
  },

  // Firestore version of marking messages as read
  markMessagesAsReadFirestore: async (conversationId, username) => {
    try {
      if (!conversationId || !username) {
        throw new Error("Conversation ID and username are required");
      }
      console.log("Marking messages as read for:", username, conversationId);
      // Get the conversation document reference
      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);

      if (!conversationSnap.exists()) {
        throw new Error(`Conversation with ID ${conversationId} not found`);
      }

      const conversationData = conversationSnap.data();

      // Check if the user is a participant in the conversation
      if (!conversationData.participantMetadata?.[username]) {
        throw new Error(
          `User ${username} is not a participant in this conversation`
        );
      }

      // Update the read status
      await updateDoc(conversationRef, {
        [`participantMetadata.${username}.readFlag`]: true,
        [`participantMetadata.${username}.lastReadAt`]: new Date(),
        [`participantMetadata.${username}.unreadCount`]: 0,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw new Error(`Failed to mark messages as read: ${error.message}`);
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
          // Check if username is a key in the participants object
          if (data.participants && username in data.participants) {
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

  subscribeToConversationMessages: (
    conversationId,
    currentUser,
    callback,
    messageLimit = null
  ) => {
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    messageLimit = null; // Set to null to disable limit for now
    // Build the query with or without limit
    let queryConstraints = [orderBy("timestamp", "desc")]; // Changed to desc to get newest first
    if (messageLimit && typeof messageLimit === "number" && messageLimit > 0) {
      queryConstraints.push(limit(messageLimit));
    }
    console.log("Query constraints:", messageLimit);
    const q = query(messagesRef, ...queryConstraints);

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
              updateDoc(doc.ref, { read: true }).catch((err) =>
                console.error("Error marking message as read:", err)
              );
            }
          }
        });

        // Reverse the array to maintain chronological order
        messages.reverse();
        messagingService
          .markMessagesAsReadFirestore(conversationId, currentUser)
          .catch((err) =>
            console.error("Error marking messages as read in Firestore:", err)
          );
        console.log("Messages data:", messages);
        callback(messages);
      },
      (error) => {
        console.error("Error subscribing to conversation messages:", error);
      }
    );
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
      const currentTypingStatus =
        data.participantMetadata?.[username]?.typingStatus || false;

      // Only update if the status is different
      if (currentTypingStatus !== isTyping) {
        const updateData = {
          [`participantMetadata.${username}.typingStatus`]: isTyping,
        };

        // During page unload, try to use a more direct approach
        if (isTyping === false && document.visibilityState === "hidden") {
          // For page unload, try to update without waiting for response
          updateDoc(conversationRef, updateData).catch((err) => {
            // Can't handle error during unload
          });
        } else {
          // Normal flow
          await updateDoc(conversationRef, updateData);
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating typing status:", error);
      throw new Error(`Failed to update typing status: ${error.message}`);
    }
  },

  // Add a synchronous method for use during page unload
  resetTypingStatusSync: (username, conversationId) => {
    if (!conversationId || !username) return;

    try {
      const conversationRef = doc(db, "conversations", conversationId);
      const updateData = {
        [`participantMetadata.${username}.typingStatus`]: false,
      };

      // Use a synchronous approach without awaiting the response
      // This is a best-effort approach for page unloads
      updateDoc(conversationRef, updateData);
    } catch (error) {
      // Cannot handle errors during unload
    }
  },

  toggleUserBlock: async (username, conversationId, isBlocked) => {
    try {
      if (!username || !conversationId) {
        throw new Error("Username and conversation ID are required");
      }

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/Conversation/Block`;
      const requestBody = {
        receiverName: username,
      };

      const response = await fetchWithAuth(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      // Update Firestore to reflect the block status
      const conversationRef = doc(db, "conversations", conversationId);
      await updateDoc(conversationRef, {
        [`participants.${username}.isBlocked`]: isBlocked,
      });

      return await response.json();
    } catch (error) {
      console.error("Error toggling user block status:", error);
      throw new Error(`Failed to toggle user block status: ${error.message}`);
    }
  },
};
