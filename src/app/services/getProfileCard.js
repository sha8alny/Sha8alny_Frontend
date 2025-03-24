export const fetchProfileCard = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/profile-card`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch profile card");
  }
  return response.json();
};
