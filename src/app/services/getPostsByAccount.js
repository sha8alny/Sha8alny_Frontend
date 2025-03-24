export const fetchPostsByAccount = async (username) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/profile/${username}/posts`
  ); // TEMPORARY
  if (!response.ok) {
    throw new Error("Failed to fetch user posts");
  }
  return response.json();
};
