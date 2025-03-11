export const fetchUserProfile = async (username) => {
    const response = await fetch(`http://localhost:5000/profile/${username}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }    
    return response.json();
  };
  