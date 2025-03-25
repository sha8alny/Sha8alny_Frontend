export const fetchTrendingTopics = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trending-topics`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch trending topics");
  }
  return response.json();
};
