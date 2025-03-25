export const likePost = async (postId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/post/${postId}/like`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      response: JSON.stringify({ postId }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to like post");
  }
  return response.status;
};
