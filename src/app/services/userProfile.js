import { fetchWithAuth } from "./userAuthentication";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token") || "mock-token";
  // if (!token) throw new Error("No token found");
  return token;
};

export const fetchUserProfile = async (username) => {
    const response = await fetchWithAuth(`${apiURL}/profile/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const status = response.status;
      let errorMsg;
      
      switch (status) {
        case 404:
          errorMsg = "User profile not found";
          break;
        case 403:
          errorMsg = "You don't have permission to view this profile";
          break;
        case 401:
          errorMsg = "Authentication required to access this profile";
          break;
        case 500:
          errorMsg = "Server error occurred";
          break;
        default:
          errorMsg = "Failed to fetch user profile";
      }
      
      // Create an error object with both message and status properties
      const error = new Error(errorMsg);
      error.response = { status: status };
      throw error;
    }    
    return response.json();
};

export const fetchUsername = async () => {
  return "mock-username"; // Replace with actual logic to fetch username
  // const response = await fetch(`${apiURL}/profile/username`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${getToken()}`,
  //   },
  // });

  // if (!response.ok) throw new Error("Failed to fetch user username");
  // return response.json();
}
