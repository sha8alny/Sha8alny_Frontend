export const updateProfile = async (url, data, method) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/profile/${url}`,
    {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update user profile");
  }
  return response.status;
};
