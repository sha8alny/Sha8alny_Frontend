export const fetchPosts = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
};
