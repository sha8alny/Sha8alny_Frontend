export const fetchSuggestedUsers = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/suggested-users`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch suggested users");
  }
  return response.json();
}