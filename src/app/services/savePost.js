export const savePost = async (data) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/post`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to save post");
  }
  return response.json();
};
