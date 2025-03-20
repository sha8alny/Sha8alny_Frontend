export const fetchUserProfile = async (username) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER}/profile/${username}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }    
    return response.json();
};