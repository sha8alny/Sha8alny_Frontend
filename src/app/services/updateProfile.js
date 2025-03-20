export const updateProfile = async (url, username) => {
    const response = await fetch(`${BACKEND_SERVER}${url}/${username}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }
    return response.json();
}