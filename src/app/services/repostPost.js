export const repostPost = async (postId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/post/${postId}/repost`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to repost post");
  }
  return response.json();
};
