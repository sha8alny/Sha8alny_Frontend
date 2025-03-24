export const connectUser = async (username) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/connect/${username}`,
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to connect user");
  }
  return response.status;
};