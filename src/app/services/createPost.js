export const createPost = async (data) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create post");
  }
  return response.json();
};
