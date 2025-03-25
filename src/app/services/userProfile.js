const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token") || "mock-token";
  // if (!token) throw new Error("No token found");
  return token;
};

export const fetchUserProfile = async (username) => {
    const response = await fetch(`${API_URL}/profile/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }    
    return response.json();
  };
  

export const fetchUsername = async () => {
  const response = await fetch(`${API_URL}/username`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch user username");
  return response.json();
}