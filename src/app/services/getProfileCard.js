export const fetchProfileCard = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/profile-card`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch profile card");
  }
  return response.json();
};
