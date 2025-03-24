export const connectUser = async (username) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/connect/${username}`,
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to connect user");
  }
  return response.status;
};