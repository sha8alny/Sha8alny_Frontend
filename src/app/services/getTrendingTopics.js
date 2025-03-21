export const fetchTrendingTopics = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/trending-topics`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch trending topics");
  }
  return response.json();
};
