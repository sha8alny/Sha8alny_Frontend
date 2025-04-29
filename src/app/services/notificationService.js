const apiURL = process.env.NEXT_PUBLIC_API_URL;
import { fetchWithAuth } from "@/app/services/userAuthentication";


// import { db } from "@/firebase/firebase";



// export const getUnreadNotificationsCount = async (userId) => {
//   try {
//     const q = query(
//       collection(db, "notifications"),
//       where("userId", "==", userId),
//       where("isRead", "==", false)
//     );

//     const querySnapshot = await getDocs(q);
//     return querySnapshot.size;
//   } catch (error) {
//     console.error("Error getting unread notifications count:", error);
//     throw error;
//   }
// };

export const sendFCMtoken = async (token) => {
  const response = await fetchWithAuth(`${apiURL}/notifications/fcm-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fcmToken: token }),
  });
};

export const fetchNotifications = async (limit = 10, offset = 0) => {
  try {
    console.log("Fetching notifications");
    const response = await fetchWithAuth(
      `${apiURL}/notifications?limit=${limit}&offset=${offset}`
    );

    const data = await response.json();
    console.log("response data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetchWithAuth(
      `${apiURL}/notifications/${notificationId}`,
      {
        method: "PUT",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};
