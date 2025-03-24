const apiURL = process.env.NEXT_PUBLIC_API_URL;


export const fetchUserProfile = async (username) => {
    const response = await fetch(`${apiURL}/profile/${username}`, {
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
  
