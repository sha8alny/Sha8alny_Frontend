import { fetchWithAuth } from "./userAuthentication";

export const messageRequestService = {
  /**
   * Get all message requests received by the user
   */
  getMessageRequests: async () => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/messageRequests/getMessageRequests`,
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

      return await response.json();
    } catch (error) {
      console.error("Error getting message requests:", error);
      throw new Error("Failed to retrieve message requests: " + error.message);
    }
  },

  /**
   * Get all message requests sent by the user
   */
  getSentRequests: async () => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/messageRequests/getSentRequests`,
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

      return await response.json();
    } catch (error) {
      console.error("Error getting sent message requests:", error);
      throw new Error("Failed to retrieve sent message requests: " + error.message);
    }
  },

  /**
   * Accept a message request
   * @param {string} requestId - ID of the message request to accept
   */
  acceptMessageRequest: async (requestId) => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/messageRequests/acceptMessageRequest`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
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
      console.error("Error accepting message request:", error);
      throw new Error("Failed to accept message request: " + error.message);
    }
  },

  /**
   * Reject a message request
   * @param {string} requestId - ID of the message request to reject
   */
  rejectMessageRequest: async (requestId) => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/messageRequests/rejectMessageRequest`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
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
      console.error("Error rejecting message request:", error);
      throw new Error("Failed to reject message request: " + error.message);
    }
  },

  /**
   * Delete a message request
   * @param {string} requestId - ID of the message request to delete
   */
  deleteMessageRequest: async (requestId) => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/messageRequests/deleteMessageRequest`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
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
      console.error("Error deleting message request:", error);
      throw new Error("Failed to delete message request: " + error.message);
    }
  }
};
