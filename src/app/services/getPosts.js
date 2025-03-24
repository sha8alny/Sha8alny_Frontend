export const fetchPosts = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/posts`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
};
