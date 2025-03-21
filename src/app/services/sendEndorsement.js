export const sendEndorsement = async (username) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/profile/endorse-skill`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to send endorsement");
  }
  return response.status;
};
