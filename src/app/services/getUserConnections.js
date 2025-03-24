export const fetchUserConnections = async (username) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/profile/${username}/connections`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user connections");
  }
  return response.json();
};
