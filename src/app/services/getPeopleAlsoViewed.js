export const fetchPeopleAlsoViewed = async (username) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/profile/${username}/people-also-viewed`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch people also viewed");
  }
  return response.json();
};
