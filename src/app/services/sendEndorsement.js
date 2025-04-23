export const sendEndorsement = async (username) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/profile/endorse-skill`,
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

export const removeEndorsement = async (username) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/profile/endorse-skill`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to remove endorsement");
  }
  return response.status;
}
